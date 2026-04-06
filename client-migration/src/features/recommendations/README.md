# Recommendation System - Client Implementation

## Overview

The client-side recommendation system is a complete implementation for displaying personalized course recommendations to users. It includes:

- **API Client Functions** for connecting to server endpoints
- **React Query Hooks** for data fetching and caching
- **Reusable Components** for displaying recommendations
- **Type Safety** with full TypeScript support

## File Structure

```
src/
├── server/features/recommendation/         # API client
│   ├── types/
│   │   ├── request.ts                     # Request type definitions
│   │   ├── response.ts                    # Response type definitions
│   │   └── index.ts                       # Types export
│   └── index.ts                           # API client functions
├── lib/
│   └── queryKeys.ts                       # React Query keys (updated)
└── features/recommendations/              # Client feature
    ├── application/
    │   ├── useRecommendations.tsx         # React Query hooks
    │   └── index.ts                       # Hooks export
    ├── presentation/
    │   ├── cards/
    │   │   └── RecommendationCard.tsx     # Single recommendation card
    │   ├── RecommendationList.tsx         # List of recommendations
    │   └── index.ts                       # Components export
    └── index.ts                           # Feature export
```

## API Functions

### `getLearningContinuityRecommendations(params)`

Get course recommendations after completing a course.

```typescript
import { getLearningContinuityRecommendations } from "@/server/features/recommendation";

const response = await getLearningContinuityRecommendations({
  courseId: "course-123",
  limit: 10,
});

console.log(response.data.recommendations);
```

**Parameters:**

- `courseId` (string, required): ID of the completed course
- `limit` (number, optional): Max recommendations to return (default: 10)

**Returns:** `RecommendationResponse` with recommendations and metadata

---

### `getLikedBasedRecommendations(params)`

Get course recommendations based on courses the user has liked.

```typescript
import { getLikedBasedRecommendations } from "@/server/features/recommendation";

const response = await getLikedBasedRecommendations({
  limit: 10,
});

console.log(response.data.recommendations);
```

**Parameters:**

- `limit` (number, optional): Max recommendations to return (default: 10)

**Returns:** `RecommendationResponse` with recommendations and metadata

---

### `refreshRecommendations(payload)`

Refresh the recommendation cache for the user.

```typescript
import { refreshRecommendations } from "@/server/features/recommendation";

await refreshRecommendations({
  type: "learning-continuity",
  courseId: "course-123",
});
```

**Parameters:**

- `type` (string, required): 'learning-continuity' | 'liked-based' | 'general'
- `courseId` (string, optional): Course ID for learning continuity type

---

## React Query Hooks

### `useLearningContinuityRecommendations(courseId, limit?, enabled?)`

Hook to fetch learning continuity recommendations.

```typescript
'use client';

import { useLearningContinuityRecommendations } from '@/features/recommendations';

export function MyComponent({ courseId }) {
  const { data: recommendations, isLoading, error } = useLearningContinuityRecommendations(
    courseId,
    10,  // limit
    true // enabled
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading recommendations</div>;

  return (
    <div>
      {recommendations?.map((rec) => (
        <div key={rec.courseId}>{rec.course.name}</div>
      ))}
    </div>
  );
}
```

---

### `useLikedBasedRecommendations(limit?, enabled?)`

Hook to fetch recommendations based on liked courses.

```typescript
'use client';

import { useLikedBasedRecommendations } from '@/features/recommendations';

export function MyComponent() {
  const { data: recommendations } = useLikedBasedRecommendations(10, true);

  return (
    <div>
      {recommendations?.map((rec) => (
        <div key={rec.courseId}>{rec.course.name}</div>
      ))}
    </div>
  );
}
```

---

### `useRefreshRecommendations()`

Hook to refresh recommendation cache with mutation.

```typescript
'use client';

import { useRefreshRecommendations } from '@/features/recommendations';

export function MyComponent({ courseId }) {
  const { mutate, isPending } = useRefreshRecommendations();

  const handleRefresh = () => {
    mutate({
      type: 'learning-continuity',
      courseId: courseId,
    });
  };

  return <button onClick={handleRefresh}>Refresh Recommendations</button>;
}
```

---

## Components

### `RecommendationCard`

Displays a single recommendation with score, metadata, and action buttons.

```typescript
'use client';

import { RecommendationCard } from '@/features/recommendations';
import { useLikedBasedRecommendations } from '@/features/recommendations';

export function Example() {
  const { data: recommendations } = useLikedBasedRecommendations();

  return (
    <div className="grid grid-cols-3 gap-4">
      {recommendations?.map((rec) => (
        <RecommendationCard
          key={rec.courseId}
          recommendation={rec}
          context="learn"
        />
      ))}
    </div>
  );
}
```

**Props:**

- `recommendation` (RecommendationWithCourse, required): Recommendation object
- `context` ('learn' | 'dashboard', optional): Context for button navigation (default: 'learn')

**Features:**

- Displays thumbnail image
- Shows match score with visual indicator
- Displays course metadata (level, category, etc.)
- Shows recommendation reason
- Displays similarity metrics
- Like button integration
- View course button with navigation

---

### `RecommendationList`

Displays a grid of recommendations with loading and error states.

```typescript
'use client';

import { RecommendationList } from '@/features/recommendations';

export function Dashboard({ courseId }) {
  return (
    <>
      <h2>Continue Your Learning Journey</h2>
      <RecommendationList
        type="learning-continuity"
        courseId={courseId}
        limit={10}
        context="dashboard"
      />

      <h2>Based on Your Likes</h2>
      <RecommendationList
        type="liked-based"
        limit={10}
        context="learn"
      />
    </>
  );
}
```

**Props:**

- `type` ('learning-continuity' | 'liked-based', required): Recommendation type
- `courseId` (string, optional): Required for learning-continuity type
- `limit` (number, optional): Max recommendations (default: 10)
- `context` ('learn' | 'dashboard', optional): Affects button behavior (default: 'learn')
- `className` (string, optional): Additional CSS classes for wrapper

**Features:**

- Loading skeletons
- Error state handling
- Empty state with helpful messaging
- Responsive grid layout (1-2-3 columns on mobile/tablet/desktop)
- Integrates with hooks for data fetching

---

## Types

### `Recommendation`

```typescript
type Recommendation = {
  courseId: string;
  score: number; // 0-1 relevance score
  reason: string; // Human-readable explanation
  metadata: {
    isSequentialNext?: boolean; // Is next in sequence?
    topicSimilarity?: number; // 0-1 topic match
    tagOverlap?: number;
    difficultyProgression?: boolean; // Adequate difficulty?
    enrollmentCount?: number;
  };
};
```

### `RecommendationWithCourse`

```typescript
type RecommendationWithCourse = Recommendation & {
  course: {
    name: string;
    topic: string;
    level: string; // 'beginner' | 'intermediate' | 'advanced'
    description: string;
    category: string;
    thumbnailUrl?: string;
    authorId: string;
    enrollmentCount?: number;
    likesCount?: number;
  };
};
```

### `RecommendationResponse`

```typescript
type RecommendationResponse = {
  data: {
    recommendations: RecommendationWithCourse[];
    type: "learning-continuity" | "liked-based" | "general";
    generatedAt: string; // ISO timestamp
    fromCache: boolean; // Was result cached?
  };
  message: string;
};
```

---

## Integration Examples

### Example 1: Display Recommendations After Course Completion

```typescript
'use client';

import { useParams } from 'next/navigation';
import { RecommendationList } from '@/features/recommendations';

export default function CourseCompletionPage() {
  const { courseId } = useParams<{ courseId: string }>();

  return (
    <div className="space-y-8">
      <section>
        <h1>Course Completed! 🎉</h1>
        <p>Here are recommended courses for your next learning step:</p>
      </section>

      <RecommendationList
        type="learning-continuity"
        courseId={courseId}
        limit={12}
        context="dashboard"
      />
    </div>
  );
}
```

---

### Example 2: Display Multiple Recommendation Types in Dashboard

```typescript
'use client';

import { RecommendationList } from '@/features/recommendations';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Dashboard() {
  return (
    <Tabs defaultValue="liked-based" className="w-full">
      <TabsList>
        <TabsTrigger value="liked-based">Based on Your Likes</TabsTrigger>
        <TabsTrigger value="trending">Trending Courses</TabsTrigger>
      </TabsList>

      <TabsContent value="liked-based">
        <RecommendationList
          type="liked-based"
          limit={15}
          context="dashboard"
        />
      </TabsContent>

      <TabsContent value="trending">
        <RecommendationList
          type="liked-based"
          limit={15}
          context="learn"
        />
      </TabsContent>
    </Tabs>
  );
}
```

---

### Example 3: Custom Recommendation Display with Manual Hook Usage

```typescript
'use client';

import { useLikedBasedRecommendations, useRefreshRecommendations } from '@/features/recommendations';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export function CustomRecommendationDisplay() {
  const { data: recommendations, isLoading, refetch } = useLikedBasedRecommendations(10);
  const { mutate: refresh } = useRefreshRecommendations();

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2>Personalized for You</h2>
        <Button
          variant="outline"
          onClick={() => refresh({ type: 'liked-based' })}
        >
          Refresh Recommendations
        </Button>
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid grid-cols-4 gap-4">
          {recommendations?.map((rec) => (
            <Card key={rec.courseId} className="p-4">
              <h3 className="font-semibold">{rec.course.name}</h3>
              <p className="text-sm text-gray-600">{rec.reason}</p>
              <p className="text-lg font-bold mt-2">
                {(rec.score * 100).toFixed(0)}% match
              </p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
```

---

## Caching

The recommendation system uses React Query for intelligent caching:

- **Learning Continuity Recommendations**: Cached for 10 minutes per course
- **Liked-Based Recommendations**: Cached for 10 minutes per limit setting
- Manual cache invalidation available via `useRefreshRecommendations` hook

---

## Error Handling

All API functions and hooks include built-in error handling:

```typescript
const { data, isLoading, error } = useLikedBasedRecommendations();

if (error) {
  console.error("Failed to load recommendations:", error);
  // Error toast shown automatically
}
```

---

## Best Practices

1. **Use the RecommendationList component** for most use cases - it handles loading, errors, and empty states
2. **For custom layouts**, combine individual hooks and the RecommendationCard component
3. **Refresh cache** after user actions that affect recommendations (new likes, course completion)
4. **Wrap components with Suspense** for better UX when needed
5. **Use the `enabled` parameter** to conditionally fetch data (e.g., wait for courseId to be available)

---

## Performance Considerations

- Recommendations are cached for 10 minutes to reduce API calls
- Use pagination or limit parameter to control result size
- Consider lazy loading for large recommendation lists
- Thumbnails are loaded via Next.js Image component (recommended for production)
