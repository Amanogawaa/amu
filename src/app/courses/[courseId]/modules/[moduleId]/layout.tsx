'use client';

import { ModuleSidebar } from '@/components/module/ModuleSidebar';
import { useGetCourse } from '@/features/course/application/useGetCourses';
import { useGetModules } from '@/features/modules/application/useGetModules';
import { useParams } from 'next/navigation';
import React, { useState } from 'react';

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const params = useParams();
  const courseId = params.courseId as string;
  const moduleId = params.moduleId as string;

  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [selectedLessonName, setSelectedLessonName] = useState<string>('');

  const { data: modules, isLoading, isError } = useGetModules(courseId);
  const { data: course } = useGetCourse(courseId);
  const currentModule = modules?.find((m) => m.id === moduleId);

  const handleSelectLesson = (lessonId: string, lessonName: string) => {
    setSelectedLessonId(lessonId);
    setSelectedLessonName(lessonName);
  };

  return (
    <>
      {/* Sidebar */}
      <ModuleSidebar
        moduleId={moduleId}
        onSelectLesson={handleSelectLesson}
        selectedLessonId={selectedLessonId}
      />

      {children}
    </>
  );
}
