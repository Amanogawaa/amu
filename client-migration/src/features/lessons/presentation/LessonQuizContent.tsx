"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import dynamic from "next/dynamic";
import type { QuizPlayerProps } from "@/features/quiz/presentation/QuizPlayer";

const QuizPlayer = dynamic<QuizPlayerProps>(
  () =>
    import("@/features/quiz/presentation/QuizPlayer").then((mod) => ({
      default: mod.QuizPlayer,
    })),
  {
    loading: () => (
      <Card>
        <CardContent className="pt-6">
          <Skeleton className="h-8 w-full mb-4" />
          <Skeleton className="h-32 w-full mb-4" />
          <Skeleton className="h-10 w-32" />
        </CardContent>
      </Card>
    ),
    ssr: false,
  }
);

interface LessonQuizContentProps {
  quiz: any;
  quizLoading: boolean;
  lessonId: string;
  onQuizPassed: () => void;
}

export const LessonQuizContent = ({
  quiz,
  quizLoading,
  lessonId,
  onQuizPassed,
}: LessonQuizContentProps) => {
  if (quizLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <Skeleton className="h-8 w-full mb-4" />
          <Skeleton className="h-32 w-full mb-4" />
          <Skeleton className="h-10 w-32" />
        </CardContent>
      </Card>
    );
  }

  if (!quiz) {
    return (
      <Card className="border-yellow-500/20 bg-yellow-500/5">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 text-yellow-600 dark:text-yellow-400">
            <AlertCircle className="h-5 w-5" />
            <div>
              <p className="font-semibold">Quiz Not Available</p>
              <p className="text-sm text-muted-foreground">
                The quiz for this lesson hasn't been generated yet.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <QuizPlayer quiz={quiz} lessonId={lessonId} onQuizPassed={onQuizPassed} />
  );
};
