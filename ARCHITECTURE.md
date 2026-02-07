# CourseCraft Architecture

## Architecture Pattern: Clean Architecture (3-Layer Pattern)

CourseCraft follows **Clean Architecture** principles with a **feature-based organization** approach. This architecture ensures separation of concerns, maintainability, and scalability as the platform grows.

---

## Overview

The codebase is organized by **features** rather than technical layers. Each feature follows a consistent **3-layer structure**:

```
src/features/{feature}/
├── domain/        # Types, interfaces, and validation schemas
├── application/   # Business logic and React Query hooks
└── presentation/  # React UI components
```

---

## The Three Layers

### 1. **Domain Layer** (`domain/`)

**Purpose**: Define the core business entities and rules.

**Contains**:
- TypeScript types and interfaces
- Zod validation schemas
- Domain-specific constants
- Pure business logic (no external dependencies)

**Example**:
```typescript
// src/features/course/domain/CourseSchema.ts
import { z } from 'zod';

export const CourseSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  description: z.string(),
  // ... other fields
});

export type Course = z.infer<typeof CourseSchema>;
```

**Benefits**:
- Clear data contracts
- Runtime validation with Zod
- Type safety across the application
- No coupling to UI or API implementation

---

### 2. **Application Layer** (`application/`)

**Purpose**: Orchestrate business logic and manage application state.

**Contains**:
- Custom React hooks using React Query
- API integration logic
- State management (mutations, queries)
- Error handling

**Example**:
```typescript
// src/features/course/application/useGetCourses.tsx
import { useQuery } from '@tanstack/react-query';
import { getCourses } from '@/server/features/course';
import { queryKeys } from '@/lib/queryKeys';

export const useGetCourses = (filters?: CourseFilters) => {
  return useQuery({
    queryKey: queryKeys.courses.list(filters),
    queryFn: () => getCourses(filters),
  });
};
```

**Benefits**:
- Centralized data fetching logic
- Reusable across multiple components
- Automatic caching via React Query
- Easy to test in isolation

---

### 3. **Presentation Layer** (`presentation/`)

**Purpose**: Render UI and handle user interactions.

**Contains**:
- React components
- UI-specific logic
- Event handlers
- Component composition

**Example**:
```typescript
// src/features/course/presentation/CourseList.tsx
import { useGetCourses } from '../application/useGetCourses';

export const CourseList = () => {
  const { data: courses, isLoading } = useGetCourses();
  
  if (isLoading) return <LoadingSpinner />;
  
  return (
    <div>
      {courses?.map(course => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  );
};
```

**Benefits**:
- Components focus solely on rendering
- Easy to refactor UI without touching business logic
- Improved component reusability

---

## Feature-Based Organization

Instead of organizing by technical layers (all components in one folder, all hooks in another), CourseCraft groups code by **feature**:

```
src/features/
├── auth/              # Authentication feature
│   ├── domain/
│   ├── application/
│   └── presentation/
├── course/            # Course management
│   ├── domain/
│   ├── application/
│   └── presentation/
├── lesson/            # Lesson management
│   ├── domain/
│   ├── application/
│   └── presentation/
└── user/              # User profiles
    ├── domain/
    ├── application/
    └── presentation/
```

**Why this approach?**
- **Co-location**: Everything related to a feature lives together
- **Discoverability**: Easy to find all code for a specific feature
- **Team scalability**: Multiple developers can work on different features without conflicts
- **Feature isolation**: Changes to one feature are less likely to affect others

---

## Server Communication Architecture

### API Client Pattern

All API calls go through centralized server functions in `src/server/features/`:

```
src/server/
├── ServerConnection/      # Axios singleton with token refresh
├── helpers/
│   └── apiRequest.ts      # Type-safe API request wrapper
└── features/
    ├── course/index.ts    # Course API functions
    ├── lesson/index.ts    # Lesson API functions
    └── user/index.ts      # User API functions
```

**Flow**:
1. UI Component calls application hook
2. Hook calls server function (e.g., `getCourses()`)
3. Server function uses `apiRequest` helper
4. `apiRequest` uses `ServerConnection` singleton (handles auth tokens)
5. Response flows back through the layers

**Example**:
```typescript
// 1. Server function in src/server/features/course/index.ts
export async function getCourses(filters?: CourseFilters): Promise<Course[]> {
  return apiRequest<CourseFilters, Course[]>('/courses', 'get', filters);
}

// 2. Application hook in src/features/course/application/
export const useGetCourses = (filters?: CourseFilters) => {
  return useQuery({
    queryKey: queryKeys.courses.list(filters),
    queryFn: () => getCourses(filters), // Calls server function
  });
};

// 3. Presentation component
export const CourseList = () => {
  const { data } = useGetCourses(); // Uses application hook
  // ... render UI
};
```

---

## Benefits of This Architecture

### 1. **Separation of Concerns**
- UI components don't know about API endpoints
- Business logic is isolated from rendering
- Domain rules are independent of framework code

### 2. **Testability**
- **Domain layer**: Pure functions, easy to unit test
- **Application layer**: Mock API calls, test hook behavior
- **Presentation layer**: Mock hooks, test component rendering

### 3. **Maintainability**
- Clear boundaries between layers
- Easy to locate and modify features
- Consistent structure across all features

### 4. **Scalability**
- New features follow the same pattern
- Multiple teams can work independently
- Easy to split features into microservices later if needed

### 5. **Type Safety**
- Zod schemas validate data at runtime
- TypeScript ensures compile-time safety
- API functions are fully typed

### 6. **Code Reusability**
- Application hooks can be shared across components
- Domain types are reused everywhere
- Server functions centralize API logic

### 7. **Framework Independence**
- Domain layer has zero React dependencies
- Easy to migrate UI framework if needed
- Business logic survives refactors

### 8. **Developer Experience**
- Predictable structure reduces onboarding time
- IDE autocomplete works better with clear types
- Less cognitive load when navigating codebase

---

## Key Architectural Decisions

### React Query for State Management
- Centralized query keys in `src/lib/queryKeys.ts`
- Automatic caching, refetching, and background updates
- Mutations always invalidate related queries

### Firebase Auth Integration
- Authentication state managed via `AuthContext`
- Token refresh handled by `ServerConnection` singleton
- Middleware protects routes based on auth status

### API Proxying via Next.js
- `/api/*` and `/uploads/*` routes proxy to backend
- Configured in `next.config.ts` rewrites
- Enables seamless deployment across services

### Socket.io for Real-time Features
- `SocketProvider` wraps authenticated routes
- Auto-reconnection with Firebase token
- Used for live updates and notifications

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                       Presentation Layer                     │
│                    (React Components)                        │
│  CourseList, LessonEditor, UserProfile, etc.                │
└────────────────────┬────────────────────────────────────────┘
                     │ Uses hooks
                     ↓
┌─────────────────────────────────────────────────────────────┐
│                      Application Layer                       │
│                   (React Query Hooks)                        │
│  useGetCourses, useCreateLesson, useUpdateProfile, etc.     │
└────────────────────┬────────────────────────────────────────┘
                     │ Calls server functions
                     ↓
┌─────────────────────────────────────────────────────────────┐
│                    Server Functions                          │
│              (src/server/features/)                          │
│  getCourses(), createLesson(), updateProfile(), etc.        │
└────────────────────┬────────────────────────────────────────┘
                     │ Uses apiRequest
                     ↓
┌─────────────────────────────────────────────────────────────┐
│                   ServerConnection                           │
│              (Axios Singleton + Token Refresh)               │
└────────────────────┬────────────────────────────────────────┘
                     │ HTTP requests
                     ↓
┌─────────────────────────────────────────────────────────────┐
│                      Backend API                             │
│               (Node.js on Render)                            │
└─────────────────────────────────────────────────────────────┘

                ┌──────────────────┐
                │  Domain Layer    │
                │  (Types, Schemas)│
                │  Used by all     │
                └──────────────────┘
```

---

## Best Practices

### When Adding a New Feature:

1. **Create the folder structure**:
   ```bash
   mkdir -p src/features/my-feature/{domain,application,presentation}
   ```

2. **Define domain types** in `domain/types.ts`:
   ```typescript
   export interface MyFeature {
     id: string;
     // ... fields
   }
   ```

3. **Add Zod schemas** in `domain/MyFeatureSchema.ts` if validation needed

4. **Create server functions** in `src/server/features/my-feature/index.ts`:
   ```typescript
   export async function getMyFeature(id: string): Promise<MyFeature> {
     return apiRequest<null, MyFeature>(`/my-feature/${id}`, 'get');
   }
   ```

5. **Add query keys** to `src/lib/queryKeys.ts`:
   ```typescript
   myFeature: {
     all: ['myFeature'] as const,
     detail: (id: string) => [...queryKeys.myFeature.all, id] as const,
   }
   ```

6. **Create application hooks** in `application/useGetMyFeature.ts`:
   ```typescript
   export const useGetMyFeature = (id: string) => {
     return useQuery({
       queryKey: queryKeys.myFeature.detail(id),
       queryFn: () => getMyFeature(id),
     });
   };
   ```

7. **Build UI components** in `presentation/`:
   ```typescript
   export const MyFeatureComponent = ({ id }: Props) => {
     const { data, isLoading } = useGetMyFeature(id);
     // ... render
   };
   ```

---

## Common Patterns

### Error Handling
```typescript
import { handleAPIError, showErrorToast } from '@/lib/errorHandling';

export const useCreateCourse = () => {
  return useMutation({
    mutationFn: createCourse,
    onError: (error) => {
      const apiError = handleAPIError(error);
      showErrorToast(apiError);
    },
  });
};
```

### Mutation with Cache Invalidation
```typescript
export const useUpdateCourse = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateCourse,
    onSuccess: (data) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.courses.detail(data.id) 
      });
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.courses.list() 
      });
    },
  });
};
```

### Optimistic Updates
```typescript
export const useLikeCourse = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: likeCourse,
    onMutate: async (courseId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ 
        queryKey: queryKeys.courses.detail(courseId) 
      });
      
      // Snapshot previous value
      const previous = queryClient.getQueryData(
        queryKeys.courses.detail(courseId)
      );
      
      // Optimistically update
      queryClient.setQueryData(
        queryKeys.courses.detail(courseId),
        (old) => ({ ...old, likes: old.likes + 1 })
      );
      
      return { previous };
    },
    onError: (err, courseId, context) => {
      // Rollback on error
      queryClient.setQueryData(
        queryKeys.courses.detail(courseId),
        context?.previous
      );
    },
  });
};
```

---

## Migration Guide

If you're coming from a different architecture:

### From MVC Pattern
- **Models** → Domain layer
- **Controllers** → Application layer (hooks)
- **Views** → Presentation layer

### From Redux Pattern
- **Actions/Reducers** → React Query mutations/queries in application layer
- **Selectors** → Query key factories
- **Connected Components** → Components using application hooks

### From Monolithic Components
1. Extract data fetching into application hooks
2. Extract types/validation into domain layer
3. Keep only rendering logic in components

---

## Resources

- **Clean Architecture**: [Robert C. Martin's book](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- **React Query**: [TanStack Query Documentation](https://tanstack.com/query/latest)
- **Feature-Sliced Design**: [Alternative feature-based architecture](https://feature-sliced.design/)
- **Zod**: [Runtime validation](https://zod.dev/)

---

## Summary

CourseCraft's architecture prioritizes:
- ✅ **Clarity**: Easy to understand where code lives
- ✅ **Maintainability**: Changes are isolated and predictable
- ✅ **Testability**: Each layer can be tested independently
- ✅ **Scalability**: Structure supports team growth and feature expansion
- ✅ **Type Safety**: Full TypeScript + Zod validation
- ✅ **Developer Experience**: Consistent patterns reduce cognitive load

This architecture is the foundation that enables rapid feature development while maintaining code quality and long-term maintainability.
