'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpenIcon, LockIcon, PlayCircleIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CheckCircle2Icon } from 'lucide-react';
import { useGetChapters } from '../../application/useGetChapters';
import { useMemo } from 'react';
import Link from 'next/link';

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
  moduleId: string;
}

export const ChapterList = ({ chapters, moduleId }: ChapterListProps) => {
  const { data } = useGetChapters(moduleId);
  const hasRealChapters = chapters && chapters.length > 0;

  const initialValues = useMemo(() => {
    if (!data) return undefined;

    return {};
  }, [chapters]);

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2 text-xl">
            <BookOpenIcon className="h-5 w-5 text-primary" />
            Course Content
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {data?.length} {data?.length === 1 ? 'chapter' : 'chapters'}
          </p>
        </div>
        <Button variant="outline">Generate Chapters</Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data?.map((chapter, index) => (
            <div key={chapter.id}>
              <div className="flex items-start gap-4 p-4 rounded-lg transition-colors bg-muted/30 hover:bg-muted/50 cursor-pointer">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-background border">
                  <PlayCircleIcon className="h-5 w-5 text-primary" />
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
                      {chapter.estimatedDuration}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="mt-2 h-8 text-xs"
                    asChild
                  >
                    <Link href={`/chapters/${chapter.id}`}>View Chapter</Link>
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
