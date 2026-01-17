"use client";

import { getChapter } from "@/server/features/chapters";
import { useQuery } from "@tanstack/react-query";
import { useGetLesson } from "./useGetLesson";
import { getCourseById } from "@/server/features/course";

export function useLessonCourse(lessonId: string) {
  const { data: lesson } = useGetLesson(lessonId);

  return useQuery({
    queryKey: ["lesson-course", lessonId],  
    queryFn: async () => {
      if (!lesson?.chapterId) {
        throw new Error("Lesson has no chapterId");
      }

      const chapter = await getChapter(lesson.chapterId);

      if (!chapter?.courseId) {
        throw new Error("Chapter has no courseId");
      }

      const course = await getCourseById(chapter.courseId);
      if (!course?.id) {
        throw new Error("Course has no courseId");
      }

      return {
        courseId: course.id,
        courseName: course.name,
        chapterId: lesson.chapterId,
        chapterName: chapter.chapterName,
      };
    },
    enabled: !!lesson?.chapterId,
  });
}
