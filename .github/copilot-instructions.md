# Amu Frontend - AI Coding Agent Instructions

## Project Overview

Next.js 15 (App Router) frontend for an AI-powered learning platform. Uses React 19, TanStack Query for data fetching, Firebase client SDK for auth, and shadcn/ui components. Backend API proxied through Next.js rewrites.

## Architecture Pattern: Feature-Based Organization

**Critical:** Features follow Domain-Driven Design with layered structure:

```
features/
  feature-name/
    ├── application/     # React hooks (useFeature.tsx) - data fetching & mutations
    ├── domain/          # Business logic & schemas (FeatureSchema.ts)
    └── presentation/    # UI components organized by purpose
        ├── form/        # Forms (e.g., CreateCourseForm.tsx)
        ├── card/        # Cards (e.g., CourseCard.tsx)
        ├── list/        # Lists (e.g., LessonList.tsx)
        └── index.ts     # Barrel exports
```

**Example:** `src/features/course/` has `application/useGetCourses.tsx` (data), `domain/CourseSchema.ts` (validation), `presentation/card/CourseCard.tsx` (UI).

## Data Fetching with TanStack Query

**Centralized API calls:** `src/server/features/*/index.ts` contains typed API functions:

```typescript
// src/server/features/course/index.ts
export async function listCourses(
  page: number,
  filters?: CourseFilters
): Promise<ListCoursesResponse> {
  return apiRequest<null, ListCoursesResponse>(`/courses?page=${page}`, 'get');
}
```

**Hook pattern:** Use TanStack Query in `application/` hooks:

```typescript
// src/features/course/application/useGetCourses.tsx
export function useListCourses(options?: { page?: number; enabled?: boolean }) {
  return useQuery({
    queryKey: ['courses', page],
    queryFn: () => listCourses(page),
    staleTime: 0,
    gcTime: 10 * 60 * 1000,
    refetchInterval: 10000,
  });
}
```

**Key settings:**

- `staleTime: 0` - Data considered fresh for 0ms (always refetch on mount)
- `gcTime: 10 * 60 * 1000` - Cache kept for 10 minutes
- `refetchInterval: 10000` - Auto-refetch every 10 seconds (real-time feel)

## Authentication Flow

**Context:** `src/features/auth/application/AuthContext.tsx` provides Firebase auth:

```typescript
const { user, loading, signIn, signOut, signInWithGoogle } = useAuth();
```

**Token management:** `ServerConnection` singleton automatically:

1. Waits for Firebase auth state (`onAuthStateChanged`)
2. Injects `Authorization: Bearer <token>` header into all API requests
3. Falls back to `auth-token` cookie if Firebase user unavailable
4. Removes cookie on 401 responses

**Protected routes:** Wrap page components in auth checks or use `AuthContext` in layout.

## API Communication

**Proxy setup:** `next.config.ts` rewrites `/api/*` → `http://localhost:8080/api/*` (dev mode).

**Request helper:** `src/server/helpers/apiRequest.ts` wraps axios with type safety:

```typescript
export default async function apiRequest<TPayload, TResponse>(
  url: string,
  method: 'get' | 'post' | 'put' | 'patch' | 'delete',
  payload?: TPayload
): Promise<TResponse>;
```

**Usage:** Always call from `src/server/features/*`, never directly from components.

## Component Library: shadcn/ui

**Location:** `src/components/ui/` - Pre-styled Radix UI primitives with Tailwind.

**Pattern:** All UI components use `cn()` utility from `@/lib/utils` for className merging:

```typescript
import { cn } from '@/lib/utils';

<div className={cn('base-classes', conditionalClass && 'extra-class')} />;
```

**New components:** Generate via `npx shadcn@latest add <component-name>` (see `components.json`).

## App Router Structure

**Routing:** `src/app/` uses Next.js 15 App Router conventions:

- `page.tsx` - Route component (always `'use client'` in this project)
- `layout.tsx` - Persistent wrapper (adds Navbar/Footer)
- `loading.tsx` - Suspense fallback
- Dynamic routes: `[courseId]/page.tsx`

**Layouts:** Most authenticated routes (`/courses`, `/explore`, `/create`, `/account`) use nested layouts that add `<Navbar />` above content. Landing page (`/page.tsx`) includes full landing sections (Hero, Features, CTA).

**Example structure:**

```
app/
  layout.tsx              # Root: AuthProvider, ReactQueryProvider, fonts
  page.tsx                # Landing page with marketing sections
  courses/
    layout.tsx            # Adds Navbar
    page.tsx              # Course listing
    [courseId]/
      page.tsx            # Course detail (dynamic param)
```

## Styling & Design System

**Tailwind:** Configured with CSS variables for theming in `globals.css`.

**Fonts:** Poppins (body) and Montserrat (headings) loaded via `next/font/google` in root layout:

```typescript
className={`${poppins.variable} ${montserrat.variable} font-sans`}
```

**Typography:** Use `font-sans` (Poppins) for body, `font-montserrat` for headings.

**Linting:** Biome configured (`biome.json`) - run `bun run lint` or `bun run format`.

## State Management

**Server state:** TanStack Query (no Redux/Zustand needed).

**Client state:** React Context for auth (`AuthContext`), local state with `useState` for UI.

**Forms:** React Hook Form + Zod validation:

```typescript
// src/features/course/domain/CourseSchema.ts
export const courseFormSchema = z.object({
  topic: z.string().min(1, 'Topic is required'),
  level: z.enum(['beginner', 'intermediate', 'advanced']),
});

// In component
const form = useForm<CourseFormValues>({
  resolver: zodResolver(courseFormSchema),
});
```

## Key Features Integration

**Progress tracking:** Use `src/features/progress/presentation/` components:

```typescript
import {
  ProgressBar,
  CourseStatusBadge,
  MarkCompleteButton,
} from '@/features/progress/presentation';

// In lesson page
<MarkCompleteButton
  courseId={id}
  lessonId={lessonId}
  initialCompleted={false}
/>;
```

**Comments:** `useCommentsForCourse(courseId)` hook + `CommentList` component.

**Likes:** `useToggleLike(courseId)` mutation + `useLikeStatus(courseId)` query.

## Development Workflow

**Start dev server:**

```bash
bun run dev  # Uses Turbopack, runs on http://localhost:3000
```

**Key scripts:**

- `bun run build` - Production build
- `bun run start` - Production server
- `bun run lint` - Biome check
- `bun run format` - Auto-format with Biome

**Environment variables:** Add Firebase client config to `.env.local`:

```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
# ... (see src/utils/firebase.ts)
```

## Common Patterns

**Page component structure:**

```typescript
'use client'; // Always client components in this project

import { useGetCourse } from '@/features/course/application/useGetCourses';

export default function CoursePage({
  params,
}: {
  params: { courseId: string };
}) {
  const { data: course, isLoading, error } = useGetCourse(params.courseId);

  if (isLoading) return <GeneralLoadingPage />;
  if (error) return <GeneralErrorPage />;
  if (!course) return <GeneralEmptyPage />;

  return <div>...</div>;
}
```

**Infinite scroll pattern:**

```typescript
const { data, fetchNextPage, hasNextPage } = useInfiniteListCourses(filters);

// Flatten pages
const courses = data?.pages.flatMap((page) => page.results) ?? [];
```

**Mutations with optimistic updates:**

```typescript
const mutation = useCreateComment(courseId);

await mutation.mutateAsync(payload, {
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['comments', courseId] });
  },
});
```

## Adding New Features

1. Create folder: `src/features/new-feature/`
2. Add API functions: `src/server/features/new-feature/index.ts` + `types.ts`
3. Create hooks: `application/useGetFeature.tsx`, `useCreateFeature.tsx`
4. Define schemas: `domain/FeatureSchema.ts` (Zod)
5. Build UI: `presentation/form/`, `presentation/card/`, etc.
6. Add route: `src/app/feature/page.tsx`
7. Update navbar: `src/components/navigation/Navbar.tsx` or `NavbarUser.tsx`

## Testing Backend Integration

**Backend must be running:** Ensure `amu-api` is on `http://localhost:8080` before starting dev server.

**Common 404 issues:** Check backend route registration in `amu-api/src/routes.ts` - routes mount at `/api/*` not `/api/feature/feature`.

**Swagger docs:** View backend API at `http://localhost:8080/api/docs` to verify endpoints.
