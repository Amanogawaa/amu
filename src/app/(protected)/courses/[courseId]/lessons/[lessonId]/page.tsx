"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import React from "react";
import { LessonContent } from "@/features/lessons/presentation/LessonContent";
import { useGetCourse } from "@/features/course/application/useGetCourses";

const LessonPage = () => {
  const params = useParams();
  const courseId = params.courseId as string;
  const lessonId = params.lessonId as string;

  const { data: course } = useGetCourse(courseId);

  return (
    <>
      <div className="p-6">
        <nav className="flex items-center text-sm text-muted-foreground mb-8 uppercase tracking-wider">
          <Link
            href="/courses"
            className="hover:text-foreground transition-colors font-medium"
          >
            Courses
          </Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <Link
            href={`/courses/${courseId}`}
            className="hover:text-foreground transition-colors font-medium truncate"
          >
            {course?.name || "Course"}
          </Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span className="font-medium text-foreground">Lesson</span>
        </nav>

        <LessonContent lessonId={lessonId} />
      </div>
    </>
  );
};

export default LessonPage;
