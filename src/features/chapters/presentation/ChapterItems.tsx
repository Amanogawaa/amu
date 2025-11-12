'use client';

import {
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from '@/components/ui/sidebar';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetLessons } from '@/features/lessons/application/useGetLesson';
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from '@radix-ui/react-collapsible';
import {
  PlayCircle,
  FileText,
  HelpCircle,
  BookOpen,
  ChevronRight,
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

interface ChapterItemProps {
  chapter: {
    id: string;
    chapterName: string;
    chapterOrder: number;
    chapterDescription: string;
  };
}

const ChapterItem = ({ chapter }: ChapterItemProps) => {
  const router = useRouter();
  const params = useParams();
  const courseId = params.courseId as string;
  const moduleId = params.moduleId as string;
  const selectedLessonId = params.lessonId as string | undefined;

  const { data: lessons, isLoading: lessonsLoading } = useGetLessons(
    chapter.id
  );

  const handleLessonClick = (lessonId: string) => {
    const url = `/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}`;
    router.push(url);
  };

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
                        onClick={() => handleLessonClick(lesson.id)}
                        className="w-full cursor-pointer truncate px-3"
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
};

export default ChapterItem;
