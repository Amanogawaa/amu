# Progress Feature Integration Examples

## Example 1: Lesson Page with Complete Button

```tsx
// app/courses/[courseId]/lessons/[lessonId]/page.tsx
'use client';

import { MarkCompleteButton } from '@/features/progress/presentation';
import { useProgressForCourse } from '@/features/progress/application/useProgress';

export default function LessonPage({
  params,
}: {
  params: { courseId: string; lessonId: string };
}) {
  const { data: progress } = useProgressForCourse(params.courseId);
  const isCompleted = progress?.lessonsCompleted.includes(params.lessonId);

  return (
    <div className="container mx-auto p-6">
      <h1>Lesson Content</h1>

      {/* Lesson content here */}

      <div className="mt-6 flex justify-end">
        <MarkCompleteButton
          courseId={params.courseId}
          lessonId={params.lessonId}
          initialCompleted={isCompleted}
          onProgressUpdate={(completed) => {
            console.log('Progress updated:', completed);
          }}
        />
      </div>
    </div>
  );
}
```

## Example 2: Course Detail Page with Progress

```tsx
// app/courses/[courseId]/page.tsx
'use client';

import { useProgressForCourse } from '@/features/progress/application/useProgress';
import {
  ProgressBar,
  CourseStatusBadge,
} from '@/features/progress/presentation';
import { getCourseById } from '@/server/features/course';
import { useQuery } from '@tanstack/react-query';

export default function CourseDetailPage({
  params,
}: {
  params: { courseId: string };
}) {
  const { data: course } = useQuery({
    queryKey: ['course', params.courseId],
    queryFn: () => getCourseById(params.courseId),
  });

  const { data: progress } = useProgressForCourse(params.courseId);

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">{course?.name}</h1>
        {progress && (
          <CourseStatusBadge percentComplete={progress.percentComplete} />
        )}
      </div>

      {progress && (
        <div className="mb-8">
          <ProgressBar percent={progress.percentComplete} showLabel size="lg" />
          <p className="text-sm text-muted-foreground mt-2">
            {progress.lessonsCompleted.length} of {progress.totalLessons}{' '}
            lessons completed
          </p>
        </div>
      )}

      {/* Course content and lessons list */}
    </div>
  );
}
```

## Example 3: Course Card with Progress

```tsx
// components/CourseCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProgressBar } from '@/features/progress/presentation';
import type { Course } from '@/server/features/course/types';
import type { UserProgress } from '@/server/features/progress/types';
import Link from 'next/link';

interface CourseCardWithProgressProps {
  course: Course;
  progress?: UserProgress | null;
}

export function CourseCardWithProgress({
  course,
  progress,
}: CourseCardWithProgressProps) {
  return (
    <Link href={`/courses/${course.id}`}>
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle>{course.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {course.description}
          </p>

          {progress && (
            <ProgressBar
              percent={progress.percentComplete}
              size="sm"
              showLabel={false}
            />
          )}

          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>{course.level}</span>
            <span>{course.duration}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
```

## Example 4: Courses List with Progress

```tsx
// app/courses/page.tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { listCourses } from '@/server/features/course';
import { useAllProgress } from '@/features/progress/application/useProgress';
import { CourseCardWithProgress } from '@/components/CourseCard';

export default function CoursesPage() {
  const { data: coursesResponse } = useQuery({
    queryKey: ['courses'],
    queryFn: () => listCourses(1),
  });

  const { data: allProgress } = useAllProgress();

  // Create a map for quick progress lookup
  const progressMap = new Map(allProgress?.map((p) => [p.courseId, p]) || []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">My Courses</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {coursesResponse?.results.map((course) => (
          <CourseCardWithProgress
            key={course.id}
            course={course}
            progress={progressMap.get(course.id)}
          />
        ))}
      </div>
    </div>
  );
}
```

## Example 5: Admin Dashboard - Course Analytics

```tsx
// app/admin/courses/[courseId]/stats/page.tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { getCourseStatistics } from '@/server/features/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, TrendingUp, Award } from 'lucide-react';

export default function CourseStatsPage({
  params,
}: {
  params: { courseId: string };
}) {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['courseStats', params.courseId],
    queryFn: () => getCourseStatistics(params.courseId),
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Course Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              Total Enrolled
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {stats?.data.totalEnrolled || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Avg Completion
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {stats?.data.averageCompletion || 0}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Award className="h-4 w-4" />
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {stats?.data.completedCount || 0}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
```

## Example 6: Progress Reset Confirmation

```tsx
// components/ProgressResetDialog.tsx
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useDeleteProgress } from '@/features/progress/application/useProgress';

interface ProgressResetDialogProps {
  courseId: string;
  courseName: string;
}

export function ProgressResetDialog({
  courseId,
  courseName,
}: ProgressResetDialogProps) {
  const deleteProgress = useDeleteProgress();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm">
          Reset Progress
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Reset Progress?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete your progress for "{courseName}". All
            completed lessons will be unmarked. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => deleteProgress.mutate(courseId)}
            className="bg-destructive hover:bg-destructive/90"
          >
            Reset Progress
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
```

## Example 7: Batch Mark Lessons Complete

```tsx
// Custom hook for bulk operations
import { useMarkLessonProgress } from '@/features/progress/application/useProgress';
import { useState } from 'react';

export function useBatchMarkProgress(courseId: string) {
  const markProgress = useMarkLessonProgress();
  const [isProcessing, setIsProcessing] = useState(false);

  const markMultipleLessons = async (
    lessonIds: string[],
    completed: boolean
  ) => {
    setIsProcessing(true);

    try {
      for (const lessonId of lessonIds) {
        await markProgress.mutateAsync({
          courseId,
          lessonId,
          completed,
        });
      }
    } catch (error) {
      console.error('Batch progress update failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return { markMultipleLessons, isProcessing };
}

// Usage in component
function ModulePage({
  courseId,
  lessonIds,
}: {
  courseId: string;
  lessonIds: string[];
}) {
  const { markMultipleLessons, isProcessing } = useBatchMarkProgress(courseId);

  return (
    <Button
      onClick={() => markMultipleLessons(lessonIds, true)}
      disabled={isProcessing}
    >
      Mark All Complete
    </Button>
  );
}
```

## Best Practices

### 1. Always Check Authentication

```tsx
const { user } = useAuth();
if (!user) {
  return <LoginPrompt />;
}
```

### 2. Handle Loading States

```tsx
const { data, isLoading, error } = useProgressForCourse(courseId);

if (isLoading) return <Skeleton />;
if (error) return <ErrorMessage />;
if (!data) return <EmptyState />;
```

### 3. Optimistic Updates

The `useMarkLessonProgress` hook already handles cache invalidation. For custom optimistic UI:

```tsx
const queryClient = useQueryClient();
const markProgress = useMarkLessonProgress();

const handleComplete = () => {
  // Optimistic update
  queryClient.setQueryData(['progress', courseId], (old: UserProgress) => ({
    ...old,
    lessonsCompleted: [...old.lessonsCompleted, lessonId],
    percentComplete: calculatePercent(
      old.lessonsCompleted.length + 1,
      old.totalLessons
    ),
  }));

  markProgress.mutate({ courseId, lessonId, completed: true });
};
```

### 4. Error Boundaries

Wrap progress components in error boundaries:

```tsx
<ErrorBoundary fallback={<ErrorFallback />}>
  <ProgressCard progress={progress} />
</ErrorBoundary>
```

### 5. Accessibility

The ProgressBar component includes proper ARIA attributes. Ensure buttons have descriptive labels:

```tsx
<Button aria-label={`Mark lesson ${lessonName} as complete`}>
  Mark Complete
</Button>
```
