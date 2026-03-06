"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, FolderTree, Loader2, Sparkles } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useManualLessonGeneration } from "@/features/create/application/useManualGeneration";
import type { Chapter } from "@/server/features/chapters/types";
import type { Lesson } from "@/server/features/lessons/types";
import type { Course } from "@/server/features/course/types";

interface ManualGenerationPanelProps {
  course: Course;
  chapters: Chapter[];
  lessons: Lesson[];
  missingComponents?: string[];
}

export function ManualGenerationPanel({
  course,
  chapters,
  lessons,
  missingComponents,
}: ManualGenerationPanelProps) {
  const [activeChapterId, setActiveChapterId] = useState<string | null>(null);

  const generateLessons = useManualLessonGeneration(course.id);

  const lessonsByChapter = useMemo(() => {
    const map: Record<string, Lesson[]> = {};
    lessons.forEach((lesson) => {
      if (!map[lesson.chapterId]) {
        map[lesson.chapterId] = [];
      }
      map[lesson.chapterId].push(lesson);
    });
    return map;
  }, [lessons]);

  const chaptersNeedingHelp = useMemo(() => {
    return chapters
      .map((chapter) => {
        const generated = lessonsByChapter[chapter.id]?.length ?? 0;
        const target = Math.max(1, chapter.estimatedLessonCount ?? 0);

        return {
          chapter,
          generated,
          target,
        };
      })
      .filter(({ generated, target }) => generated < target)
      .sort((a, b) => a.chapter.chapterOrder - b.chapter.chapterOrder);
  }, [chapters, lessonsByChapter]);

  const hasPendingLessonGeneration =
    generateLessons.isPending && !!activeChapterId;

  const handleGenerateLessons = (chapter: Chapter) => {
    setActiveChapterId(chapter.id);

    generateLessons.mutate(
      {
        chapterId: chapter.id,
        chapterName: chapter.chapterName,
        chapterDescription: chapter.chapterDescription,
        chapterOrder: chapter.chapterOrder,
        learningObjectives: chapter.learningObjectives ?? [],
        keyTopics: chapter.keyTopics ?? [],
        estimatedDuration: chapter.estimatedDuration,
        estimatedLessonCount: Math.max(1, chapter.estimatedLessonCount ?? 0),
        courseName: course.name,
        level: course.level,
        language: course.language,
      },
      {
        onSettled: () => setActiveChapterId(null),
      },
    );
  };

  const nothingMissing = chaptersNeedingHelp.length === 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Manual Generation Controls
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Generate lessons for chapters that are missing content.
            </p>
          </div>
          {!nothingMissing && (
            <Badge variant="secondary" className="text-xs">
              Missing data detected
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {missingComponents && missingComponents.length > 0 && (
          <Alert className="bg-amber-50 dark:bg-amber-950">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle className="text-sm font-semibold">
              Missing components
            </AlertTitle>
            <AlertDescription className="text-sm">
              {missingComponents.join(", ")} still need to be generated before
              you can publish this course.
            </AlertDescription>
          </Alert>
        )}

        {nothingMissing && (
          <div className="flex flex-col items-center justify-center py-6 text-center space-y-2 text-muted-foreground">
            <FolderTree className="h-6 w-6" />
            <p className="text-sm">
              All chapters currently have their lessons. You can still
              regenerate specific pieces if needed from the course editor.
            </p>
          </div>
        )}

        {chaptersNeedingHelp.length > 0 && (
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <FolderTree className="h-4 w-4 text-primary" />
              <p className="font-semibold text-sm">Chapters needing lessons</p>
            </div>

            <div className="space-y-3">
              {chaptersNeedingHelp.map(({ chapter, generated, target }) => (
                <div
                  key={chapter.id}
                  className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-medium">{chapter.chapterName}</p>
                    <p className="text-sm text-muted-foreground">
                      {generated}/{target} lessons generated
                    </p>
                  </div>

                  <Button
                    variant="outline"
                    onClick={() => handleGenerateLessons(chapter)}
                    disabled={
                      hasPendingLessonGeneration &&
                      activeChapterId !== chapter.id
                    }
                  >
                    {hasPendingLessonGeneration &&
                    activeChapterId === chapter.id ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Generate Lessons
                      </>
                    )}
                  </Button>
                </div>
              ))}
            </div>
          </section>
        )}
      </CardContent>
    </Card>
  );
}
