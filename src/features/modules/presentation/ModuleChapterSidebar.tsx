'use client';

import * as React from 'react';
import {
  BookOpen,
  FileText,
  PlayCircle,
  HelpCircle,
  ChevronRight,
} from 'lucide-react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from '@/components/ui/sidebar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { useGetChapters } from '@/features/chapters/application/useGetChapters';
import { useGetLessons } from '@/features/lessons/application/useGetLesson';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetModules } from '../application/useGetModules';
import { useGetCourse } from '@/features/course/application/useGetCourses';

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

  const currentModule = modules?.find((m) => m.id === moduleId);

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
                  <ChapterItem key={chapter.id} chapter={chapter} />
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

interface ChapterItemProps {
  chapter: {
    id: string;
    chapterName: string;
    chapterOrder: number;
    chapterDescription: string;
  };
}

function ChapterItem({ chapter }: ChapterItemProps) {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const courseId = params.courseId as string;
  const moduleId = params.moduleId as string;

  // Get current selected lesson from URL
  const selectedLessonId = searchParams.get('lessonId');

  const { data: lessons, isLoading: lessonsLoading } = useGetLessons(
    chapter.id
  );

  const handleLessonClick = (lessonId: string, lessonName: string) => {
    const url = `/courses/${courseId}/modules/${moduleId}?lessonId=${lessonId}&lessonName=${encodeURIComponent(
      lessonName
    )}`;
    router.push(url);
  };

  // Get lesson type icon
  const getLessonIcon = (type: 'video' | 'article' | 'quiz') => {
    switch (type) {
      case 'video':
        return PlayCircle;
      case 'article':
        return FileText;
      case 'quiz':
        return HelpCircle;
      default:
        return FileText;
    }
  };

  return (
    <Collapsible defaultOpen className="group/collapsible">
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton tooltip={chapter.chapterName} className="w-full">
            <BookOpen className="h-4 w-4" />
            <span className="flex-1 text-left truncate">
              <span className="text-xs text-muted-foreground">
                Ch. {chapter.chapterOrder}
              </span>
              {' - '}
              {chapter.chapterName}
            </span>
            <ChevronRight className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>

        <CollapsibleContent>
          {lessonsLoading ? (
            <div className="ml-6 space-y-1 p-2">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          ) : lessons && lessons.length > 0 ? (
            <SidebarMenuSub>
              {lessons
                .sort((a, b) => a.lessonOrder - b.lessonOrder)
                .map((lesson) => {
                  const Icon = getLessonIcon(lesson.type);
                  const isActive = selectedLessonId === lesson.id;
                  return (
                    <SidebarMenuSubItem key={lesson.id}>
                      <SidebarMenuSubButton
                        onClick={() =>
                          handleLessonClick(lesson.id, lesson.lessonName)
                        }
                        className="w-full cursor-pointer"
                        isActive={isActive}
                      >
                        <Icon className="h-3 w-3" />
                        <span className="flex-1 text-left">
                          <span className="text-xs text-muted-foreground">
                            {lesson.lessonOrder}.
                          </span>{' '}
                          {lesson.lessonName}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {lesson.duration}
                        </span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  );
                })}
            </SidebarMenuSub>
          ) : (
            <div className="ml-6 p-2 text-xs text-muted-foreground">
              No lessons yet
            </div>
          )}
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}
