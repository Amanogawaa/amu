"use client";

import { useGetCourse } from "@/features/course/application/useGetCourses";
import { LessonAssistant } from "@/features/lesson-assistant/presentation/LessonAssistant";
import { LessonContent } from "@/features/lessons/presentation/LessonContent";
import { LessonPageHeader } from "@/features/lessons/presentation/LessonPageHeader";
import { useParams } from "next/navigation";

const LessonPage = () => {
  const params = useParams();
  const courseId = params.courseId as string;
  const lessonId = params.lessonId as string;

  const { data: course } = useGetCourse(courseId);

  return (
    <>
      <div className="min-h-screen flex flex-col">
        <LessonPageHeader
          courseId={courseId}
          courseName={course?.name}
          lessonId={lessonId}
        />

        <div className="flex-1 w-full px-4 pb-8 pt-6 md:px-8 lg:px-10">
          <LessonContent lessonId={lessonId} />
        </div>

        {/* <LessonAssistant
          lessonId={lessonId}
          courseId={courseId}
          lessonTitle={course?.name}
        /> */}
      </div>
    </>
  );
};

export default LessonPage;
