'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarRail,
} from '@/components/ui/sidebar';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetChapters } from '@/features/chapters/application/useGetChapters';
import ChapterItem from '@/features/chapters/presentation/ChapterItems';
import { useGetCourse } from '@/features/course/application/useGetCourses';
import { useProgressForCourse } from '@/features/progress/application/useProgress';
import { useParams } from 'next/navigation';
import * as React from 'react';
import { useGetModules } from '../application/useGetModules';

interface ModuleChapterSidebarProps
  extends React.ComponentProps<typeof Sidebar> {}

export function ModuleChapterSidebar({ ...props }: ModuleChapterSidebarProps) {
  const params = useParams();
  const courseId = params.courseId as string;
  const moduleId = params.moduleId as string;

  const { data: course } = useGetCourse(courseId);
  const { data: modules } = useGetModules(courseId);
  const { data: chapters, isLoading: chaptersLoading } =
    useGetChapters(moduleId);
  const { data: progress } = useProgressForCourse(courseId);

  const currentModule = modules?.find((m) => m.id === moduleId);
  const completedLessons = progress?.lessonsCompleted || [];

  return (
    <Sidebar {...props}>
      <SidebarHeader className="border-b p-4">
        <div className="space-y-1">
          <div className="text-xs text-muted-foreground uppercase tracking-wider">
            {course?.name || 'Course'}
          </div>
          <h2 className="font-semibold text-sm line-clamp-2">
            {currentModule?.moduleName || 'Module'}
          </h2>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Chapters & Lessons</SidebarGroupLabel>

          {chaptersLoading ? (
            <div className="space-y-2 p-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : chapters && chapters.length > 0 ? (
            <SidebarMenu>
              {chapters
                .sort((a, b) => a.chapterOrder - b.chapterOrder)
                .map((chapter) => (
                  <ChapterItem
                    key={chapter.id}
                    chapter={chapter}
                    completedLessons={completedLessons}
                  />
                ))}
            </SidebarMenu>
          ) : (
            <div className="p-4 text-sm text-muted-foreground text-center">
              No chapters available yet
            </div>
          )}
        </SidebarGroup>
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}
