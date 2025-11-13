'use client';

import { useQuery } from '@tanstack/react-query';
import { getCourseById } from '@/server/features/course';
import type { UserProgress } from '@/server/features/progress/types';
import { logger } from '@/lib/loggers';

export function useProgressWithCourseDetails(
  progress: UserProgress[] | undefined
) {
  return useQuery({
    queryKey: [
      'progress-with-courses',
      progress?.map((p) => p.courseId).join(','),
    ],
    queryFn: async () => {
      if (!progress || progress.length === 0) {
        return [];
      }

      const coursePromises = progress.map(async (p) => {
        try {
          const course = await getCourseById(p.courseId);
          return {
            ...p,
            courseName: course.name,
            courseDescription: course.description,
            courseSubtitle: course.subtitle,
            courseCategory: course.category,
            courseLevel: course.level,
          };
        } catch (error) {
          logger.error(`Error fetching course ${p.courseId}:`, error);
          return {
            ...p,
            courseName: `Course ${p.courseId.substring(0, 8)}`,
            courseDescription: '',
            courseSubtitle: '',
            courseCategory: '',
            courseLevel: '',
          };
        }
      });

      return Promise.all(coursePromises);
    },
    enabled: !!progress && progress.length > 0,
    staleTime: 5 * 60 * 1000,
  });
}
