'use client';

import { Button } from '@/components/ui/button';
import { useMarkLessonProgress } from '@/features/progress/application/useProgress';
import { CheckCircle2, Circle } from 'lucide-react';
import { useState, useEffect } from 'react';

interface MarkCompleteButtonProps {
  courseId: string;
  lessonId: string;
  initialCompleted?: boolean;
  totalLessons?: number;
  onProgressUpdate?: (completed: boolean) => void;
  disabled?: boolean;
  disabledReason?: string;
}

export function MarkCompleteButton({
  courseId,
  lessonId,
  initialCompleted = false,
  totalLessons,
  onProgressUpdate,
  disabled = false,
  disabledReason,
}: MarkCompleteButtonProps) {
  const [isCompleted, setIsCompleted] = useState(initialCompleted);
  const markProgress = useMarkLessonProgress();

  useEffect(() => {
    setIsCompleted(initialCompleted);
  }, [initialCompleted]);

  const handleToggle = () => {
    const newCompletedState = !isCompleted;

    setIsCompleted(newCompletedState);

    markProgress.mutate(
      {
        courseId,
        lessonId,
        completed: newCompletedState,
        totalLessons,
      },
      {
        onSuccess: () => {
          onProgressUpdate?.(newCompletedState);
        },
        onError: () => {
          setIsCompleted(!newCompletedState);
        },
      }
    );
  };

  return (
    <div className="flex flex-col gap-2">
      <Button
        onClick={handleToggle}
        disabled={markProgress.isPending || disabled}
        variant={isCompleted ? 'default' : 'outline'}
        className="gap-2 w-fit"
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

    </div>
  );
}
