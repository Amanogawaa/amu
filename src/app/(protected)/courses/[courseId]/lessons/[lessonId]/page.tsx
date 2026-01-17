"use client";

import { useParams } from "next/navigation";
import React from "react";
import { LessonContent } from "@/features/lessons/presentation/LessonContent";
import { useGetCourse } from "@/features/course/application/useGetCourses";
import { LessonPageHeader } from "@/features/lessons/presentation/LessonPageHeader";
import { LessonAssistant } from "@/features/lesson-assistant/presentation";

const LessonPage = () => {
  const params = useParams();
  const courseId = params.courseId as string;
  const lessonId = params.lessonId as string;

  const { data: course } = useGetCourse(courseId);

  return (
    <div className="min-h-screen flex flex-col">
      <LessonPageHeader
        courseId={courseId}
        courseName={course?.name}
        lessonId={lessonId}
      />

      <div className="flex-1 flex justify-center p-6">
        <LessonContent lessonId={lessonId} />
      </div>

      <LessonAssistant
        lessonId={lessonId}
        courseId={courseId}
        lessonTitle={course?.name}
      />
    </div>
  );
};

export default LessonPage;
