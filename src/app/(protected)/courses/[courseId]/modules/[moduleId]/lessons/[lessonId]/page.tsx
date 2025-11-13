'use client';

import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { LessonContent } from '@/features/lessons/presentation/LessonContent';
import { useGetCourse } from '@/features/course/application/useGetCourses';
import { useGetModules } from '@/features/modules/application/useGetModules';

const LessonPage = () => {
  const params = useParams();
  const courseId = params.courseId as string;
  const moduleId = params.moduleId as string;
  const lessonId = params.lessonId as string;

  const { data: course } = useGetCourse(courseId);
  const { data: modules } = useGetModules(courseId);
  const currentModule = modules?.find((m) => m.id === moduleId);

  return (
    <>
      <div className="p-6 pb-0 md:hidden">
        <SidebarTrigger />
      </div>

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
            {course?.name || 'Course'}
          </Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <Link
            href={`/courses/${courseId}/modules/${moduleId}`}
            className="hover:text-foreground transition-colors font-medium truncate"
          >
            {currentModule?.moduleName || 'Module'}
          </Link>
        </nav>

        <LessonContent lessonId={lessonId} />
      </div>
    </>
  );
};

export default LessonPage;
