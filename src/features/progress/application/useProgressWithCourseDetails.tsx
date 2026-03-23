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

      // Deduplicate course IDs to avoid fetching the same course multiple times
      const uniqueCourseIds = [...new Set(progress.map((p) => p.courseId))];

      try {
        // Fetch all unique courses in parallel, capped at 5 concurrent requests
        const courseMap = new Map();
        const batchSize = 5;
        
        for (let i = 0; i < uniqueCourseIds.length; i += batchSize) {
          const batch = uniqueCourseIds.slice(i, i + batchSize);
          const coursePromises = batch.map(id => getCourseById(id));
          const courses = await Promise.all(coursePromises);
          courses.forEach((course, index) => {
            courseMap.set(batch[index], course);
          });
        }

        // Map progress with cached course data
        return progress.map((p) => {
          const course = courseMap.get(p.courseId);
          if (!course) {
            return {
              ...p,
              courseName: `Course ${p.courseId.substring(0, 8)}`,
              courseDescription: '',
              courseSubtitle: '',
              courseCategory: '',
              courseLevel: '',
            };
          }
          return {
            ...p,
            courseName: course.name,
            courseDescription: course.description,
            courseSubtitle: course.subtitle,
            courseCategory: course.category,
            courseLevel: course.level,
          };
        });
      } catch (error) {
        logger.error('Error fetching courses:', error);
        // Return progress with fallback course names
        return progress.map((p) => ({
          ...p,
          courseName: `Course ${p.courseId.substring(0, 8)}`,
          courseDescription: '',
          courseSubtitle: '',
          courseCategory: '',
          courseLevel: '',
        }));
      }
    },
    enabled: !!progress && progress.length > 0,
    staleTime: 5 * 60 * 1000,
  });
}
