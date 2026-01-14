"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BookOpenIcon, PlayCircleIcon } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { useGetChapters } from "../../application/useGetChapters";
import ChapterForm from "../form/ChapterForm";
import { useResourceEvents } from "@/hooks/use-socket-events";

interface ChapterListProps {
  courseId: string;
}

export const ChapterList = ({ courseId }: ChapterListProps) => {
  const { data: chapters } = useGetChapters(courseId);

  useResourceEvents({
    resourceType: "chapter",
    queryKey: ["chapters", courseId],
  });

  const sortedChapters = useMemo(() => {
    if (!chapters) return [];
    return [...chapters].sort((a, b) => a.chapterOrder - b.chapterOrder);
  }, [chapters]);

  return (
    <Card>
      <CardContent>
        {!chapters || chapters.length === 0 ? (
          // <ChapterForm courseId={courseId} />
          <div>hllo world</div>
        ) : (
          <div className="space-y-3">
            {sortedChapters?.map((chapter, index) => (
              <div key={chapter.id}>
                <div className="flex items-start gap-4 p-4 rounded-lg transition-colors bg-muted/30 hover:bg-muted/50 cursor-pointer">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-background border">
                    <PlayCircleIcon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-1">
                          {chapter.chapterName}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {chapter.chapterDescription}
                        </p>
                      </div>
                      <div className="text-xs text-muted-foreground whitespace-nowrap">
                        {chapter.estimatedDuration}
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <Button>hello world</Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="mt-2 h-8 text-xs"
                        asChild
                      >
                        <Link href={`/chapters/${chapter.id}`}>
                          View Chapter
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
                {index < chapters.length - 1 && <Separator className="my-3" />}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
