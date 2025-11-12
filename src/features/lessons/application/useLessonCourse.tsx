'use client';

import { getChapter } from '@/server/features/chapters';
import { getModule } from '@/server/features/modules';
import { useQuery } from '@tanstack/react-query';
import { useGetLesson } from './useGetLesson';

export function useLessonCourse(lessonId: string) {
  const { data: lesson } = useGetLesson(lessonId);

  return useQuery({
    queryKey: ['lesson-course', lessonId],
    queryFn: async () => {
      if (!lesson?.chapterId) {
        throw new Error('Lesson has no chapterId');
      }

      const chapter = await getChapter(lesson.chapterId);

      if (!chapter?.moduleId) {
        throw new Error('Chapter has no moduleId');
      }

      const module = await getModule(chapter.moduleId);
      if (!module?.courseId) {
        throw new Error('Module has no courseId');
      }

      return {
        courseId: module.courseId,
        courseName: module.courseName,
        moduleId: chapter.moduleId,
        moduleName: chapter.moduleName,
        chapterId: lesson.chapterId,
        chapterName: chapter.chapterName,
      };
    },
    enabled: !!lesson?.chapterId,
  });
}
