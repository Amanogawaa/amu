#!/bin/bash

# Frontend Optimization Helper Script
# This script helps automate parts of the optimization process

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print colored output
print_info() {
    echo -e "${BLUE}ℹ ${1}${NC}"
}

print_success() {
    echo -e "${GREEN}✓ ${1}${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ ${1}${NC}"
}

print_error() {
    echo -e "${RED}✗ ${1}${NC}"
}

print_header() {
    echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}  ${1}${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"
}

# Function to check prerequisites
check_prerequisites() {
    print_header "Checking Prerequisites"
    
    # Check if bun is installed
    if ! command -v bun &> /dev/null; then
        print_error "Bun is not installed. Please install it first."
        exit 1
    fi
    print_success "Bun is installed"
    
    # Check if we're in the right directory
    if [ ! -f "package.json" ]; then
        print_error "package.json not found. Please run this script from the project root."
        exit 1
    fi
    print_success "In correct directory"
    
    # Check if node_modules exists
    if [ ! -d "node_modules" ]; then
        print_warning "node_modules not found. Running bun install..."
        bun install
    fi
    print_success "Dependencies installed"
}

# Function to run baseline measurements
run_baseline() {
    print_header "Running Baseline Measurements"
    
    print_info "Counting 'use client' directives..."
    CLIENT_COUNT=$(grep -r "'use client'" src/ 2>/dev/null | wc -l || echo "0")
    print_success "Found $CLIENT_COUNT 'use client' directives"
    
    print_info "Counting console.log statements..."
    CONSOLE_COUNT=$(grep -r "console\." src/ 2>/dev/null | wc -l || echo "0")
    print_warning "Found $CONSOLE_COUNT console statements"
    
    print_info "Checking for TypeScript errors..."
    if bun run build &> /dev/null; then
        print_success "Build successful - no TypeScript errors"
    else
        print_warning "Build has errors - check TypeScript issues"
    fi
    
    # Save baseline to file
    cat > optimization-baseline.txt <<EOF
Frontend Optimization Baseline
Generated: $(date)

Component Analysis:
- 'use client' directives: $CLIENT_COUNT
- Console statements: $CONSOLE_COUNT

Bundle Size:
- Run 'du -sh .next/static/chunks/*' after build

Next Steps:
1. Run Lighthouse audit: lighthouse http://localhost:3000 --view
2. Document current scores
3. Begin Phase 1 optimizations
EOF
    
    print_success "Baseline saved to optimization-baseline.txt"
}

# Function to install optimization dependencies
install_deps() {
    print_header "Installing Optimization Dependencies"
    
    print_info "Installing dev dependencies..."
    bun add -D @tanstack/react-query-devtools @next/bundle-analyzer cross-env
    
    print_info "Installing production dependencies..."
    bun add react-intersection-observer
    
    print_success "All dependencies installed"
}

# Function to create utility files
create_utilities() {
    print_header "Creating Utility Files"
    
    # Create lib directory if it doesn't exist
    mkdir -p src/lib
    
    # Create logger.ts if it doesn't exist
    if [ ! -f "src/lib/logger.ts" ]; then
        print_info "Creating src/lib/logger.ts..."
        cat > src/lib/logger.ts <<'EOF'
type LogLevel = 'log' | 'warn' | 'error' | 'info' | 'debug';

const isDevelopment = process.env.NODE_ENV === 'development';

class Logger {
  private enabled: boolean;

  constructor() {
    this.enabled = isDevelopment;
  }

  private shouldLog(): boolean {
    return this.enabled;
  }

  log(...args: any[]): void {
    if (this.shouldLog()) console.log(...args);
  }

  warn(...args: any[]): void {
    if (this.shouldLog()) console.warn(...args);
  }

  error(...args: any[]): void {
    // Always log errors, even in production
    console.error(...args);
  }

  info(...args: any[]): void {
    if (this.shouldLog()) console.info(...args);
  }

  debug(...args: any[]): void {
    if (this.shouldLog()) console.debug(...args);
  }
}

export const logger = new Logger();
EOF
        print_success "Created logger.ts"
    else
        print_warning "logger.ts already exists, skipping"
    fi
    
    # Create errorHandling.ts if it doesn't exist
    if [ ! -f "src/lib/errorHandling.ts" ]; then
        print_info "Creating src/lib/errorHandling.ts..."
        cat > src/lib/errorHandling.ts <<'EOF'
import { AxiosError } from 'axios';
import { toast } from 'sonner';
import { logger } from './logger';

export interface APIError {
  message: string;
  code?: string;
  statusCode?: number;
  details?: any;
}

export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number,
    public details?: any
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function handleAPIError(error: unknown): AppError {
  if (error instanceof AxiosError) {
    const statusCode = error.response?.status;
    const message = error.response?.data?.message || error.message;
    const code = error.response?.data?.code || error.code;

    logger.error('API Error:', {
      statusCode,
      message,
      code,
      url: error.config?.url,
    });

    return new AppError(message, code, statusCode, error.response?.data);
  }

  if (error instanceof Error) {
    logger.error('Error:', error.message);
    return new AppError(error.message);
  }

  logger.error('Unknown error:', error);
  return new AppError('An unexpected error occurred');
}

export function showErrorToast(error: unknown, fallbackMessage?: string) {
  const appError = handleAPIError(error);
  toast.error(fallbackMessage || appError.message);
}

export function getErrorMessage(error: unknown): string {
  return handleAPIError(error).message;
}
EOF
        print_success "Created errorHandling.ts"
    else
        print_warning "errorHandling.ts already exists, skipping"
    fi
}

# Function to analyze bundle
analyze_bundle() {
    print_header "Analyzing Bundle"
    
    print_info "Building production bundle..."
    bun run build
    
    print_info "Bundle size by directory:"
    du -sh .next/static/chunks/* 2>/dev/null || print_warning "Could not analyze chunks"
    
    print_success "Build complete"
}

# Function to find console.logs
find_console_logs() {
    print_header "Finding Console Statements"
    
    print_info "Searching for console.* in src/..."
    grep -rn "console\." src/ --color=always 2>/dev/null | head -n 20
    
    TOTAL=$(grep -r "console\." src/ 2>/dev/null | wc -l || echo "0")
    print_warning "Found $TOTAL console statements total"
    print_info "Replace these with logger utility"
}

# Function to find 'use client' directives
find_client_components() {
    print_header "Finding Client Components"
    
    print_info "Components with 'use client':"
    grep -rn "'use client'" src/ --color=always 2>/dev/null
    
    TOTAL=$(grep -r "'use client'" src/ 2>/dev/null | wc -l || echo "0")
    print_info "Found $TOTAL client components"
    print_info "Review each to see if it can be a server component"
}

# Function to run TypeScript check
check_typescript() {
    print_header "Checking TypeScript"
    
    print_info "Running type check..."
    if bun run build; then
        print_success "No TypeScript errors"
    else
        print_error "TypeScript errors found - fix before proceeding"
    fi
}

# Function to show help
show_help() {
    cat <<EOF

Frontend Optimization Helper Script
====================================

Usage: ./optimize.sh [command]

Commands:
  check       - Check prerequisites
  baseline    - Run baseline measurements
  install     - Install optimization dependencies
  utilities   - Create utility files (logger, error handler)
  bundle      - Analyze bundle size
  console     - Find console.log statements
  client      - Find 'use client' components
  typescript  - Check for TypeScript errors
  all         - Run all checks and setup
  help        - Show this help message

Examples:
  ./optimize.sh baseline    # Run baseline measurements
  ./optimize.sh all         # Run full setup and analysis
  ./optimize.sh console     # Find all console.logs

EOF
}

# Main script logic
case "${1:-help}" in
    check)
        check_prerequisites
        ;;
    baseline)
        check_prerequisites
        run_baseline
        ;;
    install)
        check_prerequisites
        install_deps
        ;;
    utilities)
        check_prerequisites
        create_utilities
        ;;
    bundle)
        check_prerequisites
        analyze_bundle
        ;;
    console)
        check_prerequisites
        find_console_logs
        ;;
    client)
        check_prerequisites
        find_client_components
        ;;
    typescript)
        check_prerequisites
        check_typescript
        ;;
    all)
        check_prerequisites
        run_baseline
        install_deps
        create_utilities
        find_console_logs
        find_client_components
        print_success "\n✅ Setup complete! Next steps:"
        print_info "1. Review optimization-baseline.txt"
        print_info "2. Read OPTIMIZATION_QUICK_START.md"
        print_info "3. Start with Phase 1 optimizations"
        ;;
    help|*)
        show_help
        ;;
esac
