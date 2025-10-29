'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpenIcon, LockIcon, PlayCircleIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface Chapter {
  id: string;
  title: string;
  description: string;
  duration: string;
  order: number;
  isCompleted?: boolean;
  isLocked?: boolean;
}

interface ChapterListProps {
  chapters?: Chapter[];
  courseId: string;
}

export const ChapterList = ({ chapters, courseId }: ChapterListProps) => {
  // Placeholder chapters if none are provided
  const placeholderChapters: Chapter[] = [
    {
      id: '1',
      title: 'Introduction to the Course',
      description:
        'Get started with the basics and overview of what you will learn',
      duration: '15 min',
      order: 1,
      isCompleted: false,
      isLocked: false,
    },
    {
      id: '2',
      title: 'Chapter 1: Fundamentals',
      description: 'Learn the core concepts and fundamental principles',
      duration: '30 min',
      order: 2,
      isCompleted: false,
      isLocked: true,
    },
    {
      id: '3',
      title: 'Chapter 2: Advanced Topics',
      description: 'Dive deeper into advanced concepts and techniques',
      duration: '45 min',
      order: 3,
      isCompleted: false,
      isLocked: true,
    },
  ];

  const displayChapters = chapters || placeholderChapters;
  const hasRealChapters = chapters && chapters.length > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <BookOpenIcon className="h-5 w-5 text-primary" />
          Course Content
          {!hasRealChapters && (
            <span className="text-sm font-normal text-muted-foreground ml-2">
              (Preview)
            </span>
          )}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {displayChapters.length}{' '}
          {displayChapters.length === 1 ? 'chapter' : 'chapters'}
        </p>
      </CardHeader>
      <CardContent>
        {!hasRealChapters && (
          <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <p className="text-sm text-yellow-700 dark:text-yellow-400">
              Chapters are being generated. The content below is a preview of
              the course structure.
            </p>
          </div>
        )}
        <div className="space-y-3">
          {displayChapters.map((chapter, index) => (
            <div key={chapter.id}>
              <div
                className={`flex items-start gap-4 p-4 rounded-lg transition-colors ${
                  chapter.isLocked
                    ? 'bg-muted/50 opacity-60'
                    : 'bg-muted/30 hover:bg-muted/50 cursor-pointer'
                }`}
              >
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-background border">
                  {chapter.isCompleted ? (
                    <CheckCircle2Icon className="h-5 w-5 text-green-500" />
                  ) : chapter.isLocked ? (
                    <LockIcon className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <PlayCircleIcon className="h-5 w-5 text-primary" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-1">
                        {chapter.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {chapter.description}
                      </p>
                    </div>
                    <div className="text-xs text-muted-foreground whitespace-nowrap">
                      {chapter.duration}
                    </div>
                  </div>
                  {!chapter.isLocked && !hasRealChapters && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="mt-2 h-8 text-xs"
                      disabled
                    >
                      Start Chapter
                    </Button>
                  )}
                </div>
              </div>
              {index < displayChapters.length - 1 && (
                <Separator className="my-3" />
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Import CheckCircle2Icon at the top if not already imported
import { CheckCircle2Icon } from 'lucide-react';
