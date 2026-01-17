# AMU Learning Platform - AI Agent Instructions

## Architecture Overview

This is a **Next.js 15 + TypeScript** learning platform with a **separate backend API** (proxied via Next.js rewrites). The client uses **Firebase Auth** for authentication and **Socket.io** for real-time features.

### Key Architectural Decisions

- **Feature-based organization**: Each feature in `src/features/` follows **3-layer architecture**:
  - `domain/` - Types and schemas (Zod validation)
  - `application/` - Custom hooks (React Query mutations/queries)
  - `presentation/` - React components
- **Server communication**: Use `src/server/features/` API client functions (never call axios directly)
- **Auth token management**: Handled automatically by `ServerConnection` singleton (see `src/server/ServerConnection/index.ts`)
- **API proxying**: `/api/*` and `/uploads/*` routes proxy to backend via `next.config.ts` rewrites

## Critical Patterns

### React Query Usage

All data fetching uses React Query with **centralized query keys** in `src/lib/queryKeys.ts`:

```typescript
// ✅ Correct - Use queryKeys factory
export const useUserProfile = () => {
  return useQuery({
    queryKey: queryKeys.user.profile(),
    queryFn: async () => await getProfile(),
  });
};

// ✅ Mutations always invalidate related queries
export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (updates) => await updateProfile(updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.user.profile() });
    },
  });
};
```

**Never hardcode query keys** - always extend `queryKeys.ts` for new features.

### API Client Pattern

All API calls go through `src/server/helpers/apiRequest.ts`:

```typescript
// 1. Create API function in src/server/features/{feature}/index.ts
export async function getProfile(): Promise<UserProfile> {
  return apiRequest<null, UserProfile>("/user/profile", "get");
}

// 2. Create application hook in src/features/{feature}/application/
export const useUserProfile = () => {
  return useQuery({
    queryKey: queryKeys.user.profile(),
    queryFn: () => getProfile(), // Use the API function
  });
};
```

**Never** use axios directly in components - always create typed API functions.

### Authentication Flow

- Firebase manages auth state via `AuthContext` (`src/features/auth/application/AuthContext.tsx`)
- **Middleware** (`src/middleware.ts`) protects routes - checks `auth-token` cookie
- Token refresh happens automatically in `ServerConnection` interceptor (55min threshold)
- Socket.io connections require valid Firebase token

### Feature Development Checklist

When adding a new feature:

1. Create folder: `src/features/{feature}/` with `domain/`, `application/`, `presentation/`
2. Define types in `domain/types.ts` (use Zod schemas for validation if needed)
3. Add query keys to `src/lib/queryKeys.ts`
4. Create API functions in `src/server/features/{feature}/index.ts`
5. Create React Query hooks in `application/use{Feature}.ts`
6. Build UI components in `presentation/`

## Development Workflows

### Running the Application

```bash
npm run dev          # Start with Turbopack (default port 3000)
npm run build        # Production build
npm run lint         # Biome linter (not ESLint)
npm run format       # Biome formatter
```

**Backend dependency**: Frontend expects API at `http://localhost:8080` in development.

### Linting & Formatting

Uses **Biome** (not ESLint/Prettier) - see `biome.json`:

- Configured for Next.js and React
- Run `npm run lint` before committing
- Automatic import organization on save

### Route Groups

- `app/(auth)/` - Public auth pages (signin/signup)
- `app/(protected)/` - Requires authentication (handled by middleware)
- Public routes in middleware: `/about`, `/features`, `/privacy`, `/terms`, `/glossary`

## Common Gotchas

### Socket.io Integration

Socket provider wraps protected routes (`src/provider/SocketProvider/index.tsx`):

- Auto-reconnects with Firebase token
- Only initializes for authenticated users
- Use `useSocket()` hook to access socket instance

### Rate Limiting

Client-side rate limiting for course generation (`src/utils/rateLimiter.ts`):

- Stores state in localStorage
- Default: 3 attempts per hour with 5min cooldown
- Use `useRateLimiter` hook for UI integration

### Error Handling

Centralized error handling in `src/lib/errorHandling.ts`:

- `handleAPIError()` normalizes Axios/Firebase errors
- `showErrorToast()` displays user-friendly messages via Sonner
- Always use these utilities in mutation `onError` callbacks

### Theme System

Uses `next-themes` with system preference detection:

- `ThemeProvider` wraps app layout
- Use `useTheme()` hook for theme control
- Tailwind configured for dark mode (`class` strategy)

## Key Files Reference

- **Auth**: `src/features/auth/application/AuthContext.tsx` - Firebase auth state
- **API Client**: `src/server/ServerConnection/index.ts` - Axios singleton with token refresh
- **Query Keys**: `src/lib/queryKeys.ts` - Centralized React Query keys
- **Middleware**: `src/middleware.ts` - Route protection logic
- **Providers**: `src/app/layout.tsx` - Global context providers order matters
- **Config**: `next.config.ts` - API proxy rewrites, CSP headers

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **State**: React Query (TanStack Query v5), Context API
- **Auth**: Firebase Auth (email/password, Google, GitHub)
- **Realtime**: Socket.io Client
- **Styling**: Tailwind v4, Radix UI, Framer Motion
- **Forms**: React Hook Form + Zod
- **Linting**: Biome (replaces ESLint/Prettier)
- **Deployment**: Vercel (see `VERCEL_DEPLOYMENT.md`)
