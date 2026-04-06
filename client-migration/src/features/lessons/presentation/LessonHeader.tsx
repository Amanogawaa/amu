"use client";

import { BookOpen, FileText, Video } from "lucide-react";
import { MarkCompleteButton } from "@/features/progress/presentation/MarkCompleteButton";
import { Lesson } from "@/server/features/lessons/types";

interface LessonHeaderProps {
  lesson: Lesson;
  lessonId: string;
  courseId?: string;
  totalLessons?: number;
  isCompleted: boolean;
  hasAccess: boolean;
  canMarkComplete: boolean;
  disabledReason?: string;
}

const getLessonIcon = (type: string) => {
  switch (type) {
    case "video":
      return <Video className="h-6 w-6" />;
    case "article":
      return <FileText className="h-6 w-6" />;
    default:
      return <BookOpen className="h-6 w-6" />;
  }
};

export const LessonHeader = ({
  lesson,
  lessonId,
  courseId,
  totalLessons,
  isCompleted,
  hasAccess,
  canMarkComplete,
  disabledReason,
}: LessonHeaderProps) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-primary">
        {getLessonIcon(lesson.type)}
        <span className="text-sm font-medium uppercase tracking-wider">
          Lesson {lesson.lessonOrder} • {lesson.type}
        </span>
      </div>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{lesson.lessonName}</h1>
          <p className="text-muted-foreground text-lg mt-2">
            {lesson.lessonDescription}
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
            <span>Duration: {lesson.duration}</span>
          </div>
        </div>
        {courseId && hasAccess && (
          <div className="flex-shrink-0">
            <MarkCompleteButton
              courseId={courseId}
              lessonId={lessonId}
              totalLessons={totalLessons}
              initialCompleted={isCompleted}
              disabled={!canMarkComplete}
              disabledReason={disabledReason}
            />
          </div>
        )}
      </div>
    </div>
  );
};
