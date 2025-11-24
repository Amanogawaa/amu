'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BookOpenIcon,
  LockIcon,
  PlayCircleIcon,
  FileText,
  Video,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CheckCircle2Icon } from 'lucide-react';
import Link from 'next/link';
import { useGetLessons } from '../../application/useGetLesson';

interface LessonListProps {
  chapterId: string;
}

export const LessonList = ({ chapterId }: LessonListProps) => {
  const { data, isLoading } = useGetLessons(chapterId);

  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="h-5 w-5 text-primary" />;
      case 'article':
        return <FileText className="h-5 w-5 text-primary" />;
      case 'quiz':
        return <CheckCircle2Icon className="h-5 w-5 text-primary" />;
      default:
        return <BookOpenIcon className="h-5 w-5 text-primary" />;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <BookOpenIcon className="h-5 w-5 text-primary" />
            Loading lessons...
          </CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2 text-xl">
            <BookOpenIcon className="h-5 w-5 text-primary" />
            Lessons
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {data?.length} {data?.length === 1 ? 'lesson' : 'lessons'}
          </p>
        </div>
        <Button variant="outline">Generate Lessons</Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data?.map((lesson, index) => (
            <div key={lesson.id}>
              <div className="flex items-start gap-4 p-4 rounded-lg transition-colors bg-muted/30 hover:bg-muted/50 cursor-pointer">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-background border">
                  {getLessonIcon(lesson.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-foreground">
                          {lesson.lessonName}
                        </h3>
                        <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                          {lesson.type}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {lesson.lessonDescription}
                      </p>
                    </div>
                    <div className="text-xs text-muted-foreground whitespace-nowrap">
                      {lesson.duration}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="mt-2 h-8 text-xs"
                    asChild
                  >
                    <Link href={`/lessons/${lesson.id}`}>Start Lesson</Link>
                  </Button>
                </div>
              </div>
              {index < data.length - 1 && <Separator className="my-3" />}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
