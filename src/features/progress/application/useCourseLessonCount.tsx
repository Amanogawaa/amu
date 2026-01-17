"use client";

import { useQuery } from "@tanstack/react-query";
import { getChapters } from "@/server/features/chapters";
import { getLessons } from "@/server/features/lessons";
import { logger } from "@/lib/loggers";

export function useCourseLessonCount(courseId: string) {
  return useQuery({
    queryKey: ["course-lesson-count", courseId],
    queryFn: async () => {
      if (!courseId) {
        return 0;
      }

      try {
        const chapters = await getChapters(courseId);

        if (!chapters || chapters.length === 0) {
          return 0;
        }

        const lessonPromises = chapters.map((chapter) =>
          getLessons(chapter.id)
        );
        const lessonsArrays = await Promise.all(lessonPromises);
        const allLessons = lessonsArrays.flat();

        return allLessons.length;
      } catch (error) {
        logger.error("Error counting course lessons:", error);
        return 0;
      }
    },
    enabled: !!courseId,
    staleTime: 5 * 60 * 1000,
  });
}
