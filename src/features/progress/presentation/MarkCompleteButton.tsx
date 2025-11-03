'use client';

import { Button } from '@/components/ui/button';
import { useMarkLessonProgress } from '@/features/progress/application/useProgress';
import { CheckCircle2, Circle } from 'lucide-react';
import { useState, useEffect } from 'react';

interface MarkCompleteButtonProps {
  courseId: string;
  lessonId: string;
  initialCompleted?: boolean;
  onProgressUpdate?: (completed: boolean) => void;
}

export function MarkCompleteButton({
  courseId,
  lessonId,
  initialCompleted = false,
  onProgressUpdate,
}: MarkCompleteButtonProps) {
  const [isCompleted, setIsCompleted] = useState(initialCompleted);
  const markProgress = useMarkLessonProgress();

  useEffect(() => {
    setIsCompleted(initialCompleted);
  }, [initialCompleted]);

  const handleToggle = () => {
    const newCompletedState = !isCompleted;

    // Optimistic update
    setIsCompleted(newCompletedState);

    markProgress.mutate(
      {
        courseId,
        lessonId,
        completed: newCompletedState,
      },
      {
        onSuccess: () => {
          onProgressUpdate?.(newCompletedState);
        },
        onError: () => {
          // Revert on error
          setIsCompleted(!newCompletedState);
        },
      }
    );
  };

  return (
    <Button
      onClick={handleToggle}
      disabled={markProgress.isPending}
      variant={isCompleted ? 'default' : 'outline'}
      className="gap-2"
    >
      {isCompleted ? (
        <>
          <CheckCircle2 className="h-4 w-4" />
          Completed
        </>
      ) : (
        <>
          <Circle className="h-4 w-4" />
          Mark as Complete
        </>
      )}
    </Button>
  );
}
