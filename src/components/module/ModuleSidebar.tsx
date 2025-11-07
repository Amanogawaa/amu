'use client';

import { useState } from 'react';
import { useGetChapters } from '@/features/chapters/application/useGetChapters';
import { useGetLessons } from '@/features/lessons/application/useGetLessons';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ChevronDown,
  ChevronRight,
  FileText,
  PlayCircle,
  CheckCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModuleSidebarProps {
  moduleId: string;
  onSelectLesson: (lessonId: string, lessonName: string) => void;
  selectedLessonId: string | null;
}

interface ChapterItemProps {
  chapterId: string;
  chapterName: string;
  chapterOrder: number;
  onSelectLesson: (lessonId: string, lessonName: string) => void;
  selectedLessonId: string | null;
}

interface LessonItemProps {
  lessonId: string;
  lessonName: string;
  order: number;
  isSelected: boolean;
  onClick: () => void;
}

const LessonItem = ({
  lessonId,
  lessonName,
  order,
  isSelected,
  onClick,
}: LessonItemProps) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        'flex items-center gap-2 py-2 px-4 ml-8 rounded-md text-sm transition-colors cursor-pointer',
        isSelected
          ? 'bg-primary text-primary-foreground'
          : 'hover:bg-muted text-muted-foreground hover:text-foreground'
      )}
    >
      <PlayCircle className="h-4 w-4 flex-shrink-0" />
      <span className="truncate flex-1">
        {order}. {lessonName}
      </span>
    </div>
  );
};

const ChapterItem = ({
  chapterId,
  chapterName,
  chapterOrder,
  onSelectLesson,
  selectedLessonId,
}: ChapterItemProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { data: lessons, isLoading } = useGetLessons(chapterId);

  return (
    <div className="mb-2">
      <Button
        variant="ghost"
        size="sm"
        className="w-full justify-start gap-2 text-sm font-normal"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? (
          <ChevronDown className="h-4 w-4 flex-shrink-0" />
        ) : (
          <ChevronRight className="h-4 w-4 flex-shrink-0" />
        )}
        <FileText className="h-4 w-4 flex-shrink-0" />
        <span className="truncate">
          {chapterOrder}. {chapterName}
        </span>
      </Button>

      {isExpanded && (
        <div className="mt-1 space-y-1">
          {isLoading ? (
            <div className="space-y-2 ml-8">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          ) : lessons && lessons.length > 0 ? (
            lessons.map((lesson) => (
              <LessonItem
                key={lesson.id}
                lessonId={lesson.id}
                lessonName={lesson.lessonName}
                order={lesson.lessonOrder}
                isSelected={selectedLessonId === lesson.id}
                onClick={() => onSelectLesson(lesson.id, lesson.lessonName)}
              />
            ))
          ) : (
            <p className="text-xs text-muted-foreground ml-8 py-2">
              No lessons available
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export const ModuleSidebar = ({
  moduleId,
  onSelectLesson,
  selectedLessonId,
}: ModuleSidebarProps) => {
  const { data: chapters, isLoading } = useGetChapters(moduleId);

  if (isLoading) {
    return (
      <div className="w-80 border-r bg-muted/20 p-4 space-y-2">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  if (!chapters || chapters.length === 0) {
    return (
      <div className="w-80 border-r bg-muted/20 p-4">
        <p className="text-sm text-muted-foreground">No chapters available</p>
      </div>
    );
  }

  const sortedChapters = [...chapters].sort(
    (a, b) => a.chapterOrder - b.chapterOrder
  );

  return (
    <div className="w-80 border-r bg-muted/20 overflow-y-auto">
      <div className="p-4 space-y-2">
        <h2 className="font-semibold text-lg mb-4">Module Content</h2>
        {sortedChapters.map((chapter) => (
          <ChapterItem
            key={chapter.id}
            chapterId={chapter.id}
            chapterName={chapter.chapterName}
            chapterOrder={chapter.chapterOrder}
            onSelectLesson={onSelectLesson}
            selectedLessonId={selectedLessonId}
          />
        ))}
      </div>
    </div>
  );
};
