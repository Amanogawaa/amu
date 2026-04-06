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

        // Limit concurrent requests to avoid overwhelming the API
        const batchSize = 3;
        let totalLessons = 0;

        for (let i = 0; i < chapters.length; i += batchSize) {
          const batch = chapters.slice(i, i + batchSize);
          const lessonPromises = batch.map((chapter) =>
            getLessons(chapter.id).catch(() => [])
          );
          const lessonsArrays = await Promise.all(lessonPromises);
          totalLessons += lessonsArrays.flat().length;
        }

        return totalLessons;
      } catch (error) {
        logger.error("Error counting course lessons:", error);
        return 0;
      }
    },
    enabled: !!courseId,
    staleTime: 10 * 60 * 1000, // Increased from 5 to 10 minutes - lesson counts don't change frequently
    gcTime: 15 * 60 * 1000, // Add gcTime to prevent garbage collection too soon
  });
}
