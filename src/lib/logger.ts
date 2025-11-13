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
