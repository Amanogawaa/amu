"use client";

import { useParams } from "next/navigation";
import React, { useEffect } from "react";
import { LessonContent } from "@/features/lessons/presentation/LessonContent";
import { useGetCourse } from "@/features/course/application/useGetCourses";
import { LessonPageHeader } from "@/features/lessons/presentation/LessonPageHeader";
import { LessonAssistant } from "@/features/lesson-assistant/presentation";
import { useCreateChat } from "@/features/lesson-assistant/application/createChat";

const LessonPage = () => {
  const params = useParams();
  const courseId = params.courseId as string;
  const lessonId = params.lessonId as string;
  const createChat = useCreateChat();

  const { data: course } = useGetCourse(courseId);

  useEffect(() => {
    console.log(`Lesson ID changed to: ${lessonId}`);
    createChat.mutate(lessonId);
  }, [lessonId]);

  return (
    <div className="min-h-screen flex flex-col">
      <LessonPageHeader
        courseId={courseId}
        courseName={course?.name}
        lessonId={lessonId}
      />

      <div className="flex-1 w-full px-4 pb-8 pt-6 md:px-8 lg:px-10">
        <LessonContent lessonId={lessonId} />
      </div>
{/* 
      <LessonAssistant
        lessonId={lessonId}
        courseId={courseId}
        lessonTitle={course?.name}
      /> */}
    </div>
  );
};

export default LessonPage;
