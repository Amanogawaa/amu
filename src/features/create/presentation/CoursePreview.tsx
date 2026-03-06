"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BookOpen,
  Clock,
  GraduationCap,
  Globe,
  ChevronDown,
  ChevronRight,
  PlayCircle,
  FileText,
  CheckCircle2,
} from "lucide-react";
import { Course } from "@/server/features/course/types";
import { Chapter } from "@/server/features/chapters/types";
import { Lesson } from "@/server/features/lessons/types";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface CoursePreviewProps {
  course: Course;
  chapters: Chapter[];
  lessons: Lesson[];
}

interface ChapterWithLessons extends Chapter {
  lessons: Lesson[];
}

export function CoursePreview({
  course,
  chapters,
  lessons,
}: CoursePreviewProps) {
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(
    new Set(),
  );

  const chaptersWithLessons: ChapterWithLessons[] = chapters
    .map((chapter) => ({
      ...chapter,
      lessons: lessons
        .filter((lesson) => lesson.chapterId === chapter.id)
        .sort((a, b) => a.lessonOrder - b.lessonOrder),
    }))
    .sort((a, b) => a.chapterOrder - b.chapterOrder);

  const toggleChapter = (chapterId: string) => {
    const newExpanded = new Set(expandedChapters);
    if (newExpanded.has(chapterId)) {
      newExpanded.delete(chapterId);
    } else {
      newExpanded.add(chapterId);
    }
    setExpandedChapters(newExpanded);
  };

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "beginner":
        return "bg-green-500/10 text-green-700 dark:text-green-400";
      case "intermediate":
        return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400";
      case "advanced":
        return "bg-red-500/10 text-red-700 dark:text-red-400";
      default:
        return "bg-gray-500/10 text-gray-700 dark:text-gray-400";
    }
  };

  const getLessonIcon = (type: string) => {
    switch (type) {
      case "video":
        return <PlayCircle className="h-4 w-4" />;
      case "article":
        return <FileText className="h-4 w-4" />;
      case "quiz":
        return <CheckCircle2 className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };

  const totalLessons = lessons.length;
  const totalChapters = chapters.length;

  return (
    <div className="space-y-6">
      {/* Course Header */}
      <Card className="border-2">
        <CardHeader className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="space-y-2 flex-1">
              <CardTitle className="text-2xl md:text-3xl font-bold">
                {course.name}
              </CardTitle>
              {course.subtitle && (
                <p className="text-muted-foreground text-sm md:text-base">
                  {course.subtitle}
                </p>
              )}
            </div>
            <Badge className={cn("self-start", getLevelColor(course.level))}>
              {course.level}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground leading-relaxed">
            {course.description}
          </p>

          {/* Course Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
              <Clock className="h-5 w-5 text-primary" />
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Duration</span>
                <span className="text-sm font-semibold">{course.duration}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
              <GraduationCap className="h-5 w-5 text-primary" />
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Chapters</span>
                <span className="text-sm font-semibold">{totalChapters}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
              <Globe className="h-5 w-5 text-primary" />
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Lessons</span>
                <span className="text-sm font-semibold">{totalLessons}</span>
              </div>
            </div>
          </div>

          {/* Learning Outcomes */}
          {course.learning_outcomes && course.learning_outcomes.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Learning Outcomes</h3>
              <ul className="grid gap-2">
                {course.learning_outcomes.map((outcome, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <CheckCircle2 className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                    <span>{outcome}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Prerequisites */}
          {course.prerequisites && (
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Prerequisites</h3>
              <p className="text-sm text-muted-foreground">
                {course.prerequisites}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Course Content */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Course Content</CardTitle>
          <p className="text-sm text-muted-foreground">
            {totalChapters} chapters • {totalLessons} lessons
          </p>
        </CardHeader>
        <CardContent className="space-y-2">
          {chaptersWithLessons.map((chapter, chapterIndex) => (
            <div key={chapter.id} className="border rounded-lg overflow-hidden">
              {/* Chapter Header */}
              <button
                onClick={() => toggleChapter(chapter.id)}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1 text-left">
                  {expandedChapters.has(chapter.id) ? (
                    <ChevronDown className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm md:text-base">
                      Chapter {chapterIndex + 1}: {chapter.chapterName}
                    </h3>
                    <p className="text-xs md:text-sm text-muted-foreground line-clamp-1">
                      {chapter.lessons.length} lessons •{" "}
                      {chapter.estimatedDuration}
                    </p>
                  </div>
                </div>
              </button>

              {/* Chapter Content */}
              {expandedChapters.has(chapter.id) && (
                <div className="px-4 pb-3 space-y-3">
                  <p className="text-sm text-muted-foreground">
                    {chapter.chapterDescription}
                  </p>

                  {/* Learning Objectives */}
                  {chapter.learningObjectives &&
                    chapter.learningObjectives.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold">
                          Learning Objectives
                        </h4>
                        <ul className="space-y-1">
                          {chapter.learningObjectives.map((objective, idx) => (
                            <li
                              key={idx}
                              className="flex items-start gap-2 text-xs text-muted-foreground"
                            >
                              <CheckCircle2 className="h-3 w-3 mt-0.5 text-primary flex-shrink-0" />
                              <span>{objective}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                  {/* Lessons */}
                  <div className="space-y-1 mt-3">
                    <h4 className="text-sm font-semibold mb-2">Lessons</h4>
                    {chapter.lessons.map((lesson, lessonIndex) => (
                      <div
                        key={lesson.id}
                        className="flex items-start gap-2 py-2 text-sm border-l-2 border-muted pl-3 hover:border-primary transition-colors"
                      >
                        {getLessonIcon(lesson.type)}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm">
                            {lessonIndex + 1}. {lesson.lessonName}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge
                              variant="outline"
                              className="text-xs capitalize"
                            >
                              {lesson.type}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {lesson.duration}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

export function CoursePreviewSkeleton() {
  return (
    <div className="space-y-6">
      <Card className="border-2">
        <CardHeader className="space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent className="space-y-6">
          <Skeleton className="h-20 w-full" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
