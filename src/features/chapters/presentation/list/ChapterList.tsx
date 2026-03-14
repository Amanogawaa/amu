"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  ChevronDownIcon,
  Video,
  FileText,
  CheckCircle2Icon,
  BookOpenIcon,
  PlayCircle,
} from "lucide-react";
import { useMemo } from "react";
import { useGetChapters } from "../../application/useGetChapters";
import { useGetLessons } from "@/features/lessons/application/useGetLesson";
import { useResourceEvents } from "@/hooks/use-socket-events";
import { useProgressForCourse } from "@/features/progress/application/useProgress";
import { Progress } from "@/components/ui/progress";
import { useRouter } from "next/navigation";

interface ChapterListProps {
  courseId: string;
}

const ChapterItem = ({
  chapter,
  courseId,
  progress,
  chapterIndex,
}: {
  chapter: any;
  courseId: string;
  progress: any;
  chapterIndex: number;
}) => {
  const { data: lessons } = useGetLessons(chapter.id);
  const router = useRouter();

  const chapterProgress = useMemo(() => {
    if (!lessons || lessons.length === 0) return 0;
    if (!progress?.lessonsCompleted) return 0;

    const completedLessons = lessons.filter((lesson) =>
      progress.lessonsCompleted.includes(lesson.id),
    ).length;

    return Math.round((completedLessons / lessons.length) * 100);
  }, [lessons, progress]);

  // const getLessonIcon = (type: string) => {
  //   switch (type) {
  //     case "video":
  //       return <Video className="h-4 w-4 text-primary" />;
  //     case "article":
  //       return <FileText className="h-4 w-4 text-primary" />;
  //     case "quiz":
  //       return <CheckCircle2Icon className="h-4 w-4 text-primary" />;
  //     default:
  //       return <BookOpenIcon className="h-4 w-4 text-primary" />;
  //   }
  // };

  return (
    <Collapsible defaultOpen>
      <div className="rounded-md border bg-white">
        <CollapsibleTrigger className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-muted/10 transition-colors">
          <div className="flex-1 min-w-0">
            <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
              Chapter {chapterIndex + 1}
            </p>
            <p className="font-semibold text-foreground">
              {chapter.chapterName}
            </p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0 ml-4">
            {lessons && lessons.length > 0 && (
              <div className="flex items-center gap-2">
                <Progress value={chapterProgress} className="h-2 w-24" />
                <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
                  {chapterProgress}%
                </span>
              </div>
            )}
            <ChevronDownIcon className="h-4 w-4 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent className="px-2 pb-2">
          {lessons && lessons.length > 0 ? (
            <div className="space-y-1">
              {lessons.map((lesson, lessonIndex) => {
                const isCompleted = progress?.lessonsCompleted?.includes(
                  lesson.id,
                );

                return (
                  <button
                    key={lesson.id}
                    onClick={() => {
                      router.push(`/courses/${courseId}/lessons/${lesson.id}`);
                    }}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-muted"
                  >
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border bg-background text-xs font-medium text-muted-foreground">
                      {lesson.lessonOrder || lessonIndex + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">
                        {lesson.lessonName}
                      </p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {lesson.type}
                      </p>
                    </div>
                    {isCompleted && (
                      <PlayCircle className="h-4 w-4 shrink-0 text-green-500" />
                    )}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="px-3 py-2 text-sm text-muted-foreground">
              No lessons available yet
            </div>
          )}
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
};

export const ChapterList = ({ courseId }: ChapterListProps) => {
  const { data: chapters } = useGetChapters(courseId);
  const { data: progress } = useProgressForCourse(courseId);

  useResourceEvents({
    resourceType: "chapter",
    queryKey: ["chapters", courseId],
  });

  const sortedChapters = useMemo(() => {
    if (!chapters) return [];
    return [...chapters].sort((a, b) => a.chapterOrder - b.chapterOrder);
  }, [chapters]);

  return (
    <>
      {!chapters || chapters.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No chapters available yet
        </div>
      ) : (
        <div className="space-y-3">
          {sortedChapters?.map((chapter, index) => (
            <ChapterItem
              key={chapter.id}
              chapter={chapter}
              courseId={courseId}
              progress={progress}
              chapterIndex={index}
            />
          ))}
        </div>
      )}
    </>
  );
};
