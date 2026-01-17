"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  ChevronDownIcon,
  PlayCircleIcon,
  Video,
  FileText,
  CheckCircle2Icon,
  BookOpenIcon,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
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
}: {
  chapter: any;
  courseId: string;
  progress: any;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: lessons } = useGetLessons(chapter.id);
  const router = useRouter();

  // Calculate chapter progress
  const chapterProgress = useMemo(() => {
    if (!lessons || lessons.length === 0) return 0;
    if (!progress?.lessonsCompleted) return 0;

    const completedLessons = lessons.filter((lesson) =>
      progress.lessonsCompleted.includes(lesson.id)
    ).length;

    return Math.round((completedLessons / lessons.length) * 100);
  }, [lessons, progress]);

  const getLessonIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="h-4 w-4 text-primary" />;
      case "article":
        return <FileText className="h-4 w-4 text-primary" />;
      case "quiz":
        return <CheckCircle2Icon className="h-4 w-4 text-primary" />;
      default:
        return <BookOpenIcon className="h-4 w-4 text-primary" />;
    }
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="w-full">
        <div className="flex items-start gap-4 p-4 rounded-lg transition-colors bg-muted/30 hover:bg-muted/50">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-background border">
            <PlayCircleIcon className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0 text-left">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-1">
                  {chapter.chapterName}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {chapter.chapterDescription}
                </p>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                {lessons && lessons.length > 0 && (
                  <div className="flex items-center gap-2 min-w-[200px]">
                    <Progress value={chapterProgress} className="h-2 w-32" />
                    <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
                      {chapterProgress}%
                    </span>
                  </div>
                )}
                <ChevronDownIcon
                  className={`h-5 w-5 text-muted-foreground transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </div>
            </div>
          </div>
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="px-4 pb-4 pt-2">
          {lessons && lessons.length > 0 ? (
            <div className="space-y-2 pl-14">
              {lessons.map((lesson) => (
                <div
                  key={lesson.id}
                  onClick={() => {
                    router.push(`/courses/${courseId}/lessons/${lesson.id}`);
                  }}
                  className="flex items-center gap-3 p-3 rounded-md bg-background/50 hover:bg-background border transition-colors hover:cursor-pointer"
                >
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md bg-muted relative">
                    {getLessonIcon(lesson.type)}
                    {progress?.lessonsCompleted?.includes(lesson.id) && (
                      <div className="absolute -top-1 -right-1 h-4 w-4 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle2Icon className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-medium text-foreground">
                        {lesson.lessonName}
                      </h4>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary capitalize">
                        {lesson.type}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                      {lesson.lessonDescription}
                    </p>
                  </div>
                  {/* <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {lesson.duration}
                    </span>
                  </div> */}
                </div>
              ))}
            </div>
          ) : (
            <div className="pl-14 py-4 text-sm text-muted-foreground">
              No lessons available yet
            </div>
          )}
        </div>
      </CollapsibleContent>
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
    <Card>
      <CardContent className="pt-6">
        {!chapters || chapters.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No chapters available yet
          </div>
        ) : (
          <div className="space-y-3">
            {sortedChapters?.map((chapter, index) => (
              <div key={chapter.id}>
                <ChapterItem
                  chapter={chapter}
                  courseId={courseId}
                  progress={progress}
                />
                {index < chapters.length - 1 && <Separator className="my-3" />}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
