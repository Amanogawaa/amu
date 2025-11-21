'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useGetModules } from '@/features/modules/application/useGetModules';
import { useCourseRoom, useResourceEvents } from '@/hooks/use-socket-events';
import {
  BookOpenIcon,
  PlayCircleIcon,
  Lock,
  Trophy,
  CheckCircle2,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import ModuleForm from '../form/ModuleForm';
import { useEnrollmentStatus } from '@/features/enrollment/application/useEnrollment';
import { cn } from '@/lib/utils';
import { useAuth } from '@/features/auth/application/AuthContext';
import { useGetCourse } from '@/features/course/application/useGetCourses';
import { useProgressForCourse } from '@/features/progress/application/useProgress';
import { useQuery } from '@tanstack/react-query';
import { getChapters } from '@/server/features/chapters';
import { getLessons } from '@/server/features/lessons';
import { useMemo } from 'react';

interface ModuleListProps {
  courseId: string;
}

export const ModuleList = ({ courseId }: ModuleListProps) => {
  const { data } = useGetModules(courseId);
  const { data: enrollmentStatus } = useEnrollmentStatus(courseId);
  const { data: course } = useGetCourse(courseId);
  const { data: progress } = useProgressForCourse(courseId);
  const { user } = useAuth();
  const router = useRouter();

  useCourseRoom(courseId);

  useResourceEvents({
    resourceType: 'module',
    queryKey: ['modules', courseId],
  });

  const sortedModules = data
    ?.map((module) => module)
    .sort((a, b) => {
      return a.moduleOrder - b.moduleOrder;
    });

  const { data: moduleLessonsMap } = useQuery({
    queryKey: ['module-lessons-map', courseId, data],
    queryFn: async () => {
      if (!data || data.length === 0) return {};

      const map: Record<string, string[]> = {};

      for (const module of data) {
        try {
          const chapters = await getChapters(module.id);
          const lessonIds: string[] = [];

          for (const chapter of chapters) {
            const lessons = await getLessons(chapter.id);
            lessonIds.push(...lessons.map((lesson) => lesson.id));
          }

          map[module.id] = lessonIds;
        } catch (error) {
          map[module.id] = [];
        }
      }

      return map;
    },
    enabled: !!data && data.length > 0,
  });

  const isOwner = user?.uid === course?.uid;
  const isEnrolled = enrollmentStatus?.isEnrolled || false;
  const hasAccess = isOwner || isEnrolled;

  const completedLessons = progress?.lessonsCompleted || [];

  const isModuleComplete = (moduleId: string): boolean => {
    if (!moduleLessonsMap || !moduleLessonsMap[moduleId]) return false;
    const moduleLessonIds = moduleLessonsMap[moduleId];
    if (moduleLessonIds.length === 0) return false;
    return moduleLessonIds.every((lessonId) =>
      completedLessons.includes(lessonId)
    );
  };

  // Check if a module is unlocked (previous module must be complete)
  const isModuleUnlocked = (moduleIndex: number): boolean => {
    // Owner always has access
    if (isOwner) return true;

    // First module is always unlocked for enrolled users
    if (moduleIndex === 0) return isEnrolled;

    // For other modules, check if previous module is complete
    if (!sortedModules || !isEnrolled) return false;

    const previousModule = sortedModules[moduleIndex - 1];
    return isModuleComplete(previousModule.id);
  };

  const hasCompletedAllModules = progress?.percentComplete === 100;
  const canAccessCapstone = isOwner || hasCompletedAllModules;

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2 text-xl">
            <BookOpenIcon className="h-5 w-5 text-primary" />
            Course Materials
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {data?.length} {data?.length === 1 ? 'Module' : 'Modules'} +
            Capstone Project
          </p>
        </div>
      </CardHeader>

      <CardContent>
        {!data || data.length === 0 ? (
          <ModuleForm courseId={courseId} />
        ) : (
          <div className="space-y-3">
            {sortedModules?.map((module, index) => {
              const moduleComplete = isModuleComplete(module.id);
              const moduleUnlocked = isModuleUnlocked(index);
              const canAccessModule = hasAccess && moduleUnlocked;

              return (
                <div key={module.id}>
                  <div
                    className={cn(
                      'flex items-start gap-4 p-4 rounded-lg transition-colors',
                      canAccessModule
                        ? 'bg-muted/30 hover:bg-muted/50 cursor-pointer'
                        : 'bg-muted/20 border border-dashed'
                    )}
                  >
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-background border">
                      {canAccessModule ? (
                        moduleComplete ? (
                          <CheckCircle2 className="h-5 w-5 text-green-600 " />
                        ) : (
                          <PlayCircleIcon className="h-5 w-5 text-primary" />
                        )
                      ) : (
                        <Lock className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-foreground">
                              {module.moduleName}
                            </h3>
                            {!canAccessModule && (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-muted border text-muted-foreground">
                                Locked
                              </span>
                            )}
                            {canAccessModule && moduleComplete && (
                              <Badge
                                variant="default"
                                className="text-xs bg-green-600"
                              >
                                Completed
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {module.moduleDescription}
                          </p>
                        </div>
                        <div className="text-xs text-muted-foreground whitespace-nowrap">
                          {module.estimatedDuration}
                        </div>
                      </div>
                      {canAccessModule ? (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="mt-2 h-8 text-xs"
                          onClick={() =>
                            router.push(
                              `/courses/${courseId}/modules/${module.id}`
                            )
                          }
                        >
                          {moduleComplete ? 'Review Module' : 'View Module'}
                        </Button>
                      ) : (
                        <p className="mt-2 text-xs text-muted-foreground italic">
                          {!hasAccess
                            ? 'Enroll to access this module'
                            : index === 0
                            ? 'Enroll to start learning'
                            : 'Complete the previous module to unlock'}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Capstone Project - Final Item */}
            <div>
              <div
                className={cn(
                  'flex items-start gap-4 p-4 rounded-lg transition-colors border-2',
                  canAccessCapstone
                    ? 'bg-gradient-to-r from-primary/5 to-primary/10 hover:from-primary/10 hover:to-primary/15 border-primary/30 cursor-pointer'
                    : 'bg-muted/10 border-dashed border-muted-foreground/30'
                )}
              >
                <div
                  className={cn(
                    'flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border',
                    canAccessCapstone
                      ? 'bg-primary/10 border-primary/50'
                      : 'bg-muted border-muted-foreground/30'
                  )}
                >
                  {canAccessCapstone ? (
                    <Trophy className="h-5 w-5 text-primary" />
                  ) : (
                    <Lock className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="font-semibold text-foreground">
                          Capstone Project
                        </h3>
                        <Badge
                          variant={canAccessCapstone ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {canAccessCapstone ? 'Available' : 'Locked'}
                        </Badge>
                        {!canAccessCapstone && !isOwner && (
                          <Badge variant="outline" className="text-xs">
                            Complete all modules to unlock
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {canAccessCapstone
                          ? 'Demonstrate your mastery with a comprehensive capstone project'
                          : 'Complete all course modules to unlock the final capstone project'}
                      </p>
                    </div>
                  </div>
                  {canAccessCapstone ? (
                    <Button
                      size="sm"
                      variant="default"
                      className="mt-2 h-8 text-xs"
                      onClick={() =>
                        router.push(`/courses/${courseId}/capstone`)
                      }
                    >
                      <Trophy className="h-3 w-3 mr-1" />
                      View Capstone Project
                    </Button>
                  ) : (
                    <div className="mt-2 flex items-center gap-2">
                      <p className="text-xs text-muted-foreground italic">
                        {isOwner
                          ? 'You can access this as the course owner'
                          : `Progress: ${
                              progress?.percentComplete || 0
                            }% - Keep learning to unlock!`}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
