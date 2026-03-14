"use client";

import { useGetChapters } from "@/features/chapters/application/useGetChapters";
import { queryKeys } from "@/lib/queryKeys";
import { getLessons } from "@/server/features/lessons";
import { Lesson } from "@/server/features/lessons/types";
import { useQueries } from "@tanstack/react-query";
import { useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";

interface ChapterWithLessons {
  id: string;
  chapterOrder: number;
  chapterName: string;
  lessons: Lesson[];
}

export function useLessonNavigation(courseId: string, lessonId: string) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: chapters, isLoading: chaptersLoading } = useGetChapters(courseId);

  const sortedChapters = useMemo(() => {
    if (!chapters) return [];
    return [...chapters].sort((a, b) => a.chapterOrder - b.chapterOrder);
  }, [chapters]);

  const lessonsQueries = useQueries({
    queries: sortedChapters.map((chapter) => ({
      queryKey: queryKeys.lessons.list(chapter.id),
      queryFn: async () => getLessons(chapter.id),
      enabled: !!chapter.id,
    })),
  });

  const chaptersWithLessons = useMemo<ChapterWithLessons[]>(() => {
    if (sortedChapters.length === 0) return [];

    return sortedChapters.map((chapter, index) => {
      const lessons = [...(lessonsQueries[index]?.data || [])].sort(
        (a, b) => a.lessonOrder - b.lessonOrder
      );

      return {
        id: chapter.id,
        chapterOrder: chapter.chapterOrder,
        chapterName: chapter.chapterName,
        lessons,
      };
    });
  }, [sortedChapters, lessonsQueries]);

  const flattenedLessons = useMemo(() => {
    return chaptersWithLessons.flatMap((chapter) => chapter.lessons);
  }, [chaptersWithLessons]);

  const currentLessonIndex = useMemo(() => {
    return flattenedLessons.findIndex((lesson) => lesson.id === lessonId);
  }, [flattenedLessons, lessonId]);

  const hasPrevLesson = currentLessonIndex > 0;
  const hasNextLesson =
    currentLessonIndex >= 0 && currentLessonIndex < flattenedLessons.length - 1;

  const prevLesson = hasPrevLesson
    ? flattenedLessons[currentLessonIndex - 1]
    : undefined;
  const nextLesson = hasNextLesson
    ? flattenedLessons[currentLessonIndex + 1]
    : undefined;

  const isMyLearningRoute = pathname?.startsWith("/my-learning/");

  const getLessonPath = (targetLessonId: string) => {
    if (isMyLearningRoute) {
      return `/my-learning/${courseId}/${targetLessonId}`;
    }
    return `/courses/${courseId}/lessons/${targetLessonId}`;
  };

  const navigateToLesson = (targetLessonId: string) => {
    router.push(getLessonPath(targetLessonId));
  };

  const navigatePrev = () => {
    if (!prevLesson) return;
    navigateToLesson(prevLesson.id);
  };

  const navigateNext = () => {
    if (!nextLesson) return;
    navigateToLesson(nextLesson.id);
  };

  const isLoading =
    chaptersLoading || lessonsQueries.some((query) => query.isLoading);

  return {
    chaptersWithLessons,
    flattenedLessons,
    currentLessonIndex,
    currentLessonOrder:
      currentLessonIndex >= 0 ? currentLessonIndex + 1 : undefined,
    totalLessons: flattenedLessons.length,
    hasPrevLesson,
    hasNextLesson,
    prevLesson,
    nextLesson,
    navigateToLesson,
    navigatePrev,
    navigateNext,
    getLessonPath,
    isMyLearningRoute,
    isLoading,
  };
}
