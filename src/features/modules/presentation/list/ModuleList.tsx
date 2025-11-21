'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGetModules } from '@/features/modules/application/useGetModules';
import { useCourseRoom, useResourceEvents } from '@/hooks/use-socket-events';
import { BookOpenIcon, PlayCircleIcon, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import ModuleForm from '../form/ModuleForm';
import { useEnrollmentStatus } from '@/features/enrollment/application/useEnrollment';
import { cn } from '@/lib/utils';
import { useAuth } from '@/features/auth/application/AuthContext';
import { useGetCourse } from '@/features/course/application/useGetCourses';

interface ModuleListProps {
  courseId: string;
}

export const ModuleList = ({ courseId }: ModuleListProps) => {
  const { data } = useGetModules(courseId);
  const { data: enrollmentStatus } = useEnrollmentStatus(courseId);
  const { data: course } = useGetCourse(courseId);
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

  const isOwner = user?.uid === course?.uid;
  const isEnrolled = enrollmentStatus?.isEnrolled || false;
  const hasAccess = isOwner || isEnrolled;

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2 text-xl">
            <BookOpenIcon className="h-5 w-5 text-primary" />
            Course Materials
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {data?.length} {data?.length === 1 ? 'Module' : 'Modules'}
          </p>
        </div>
      </CardHeader>

      <CardContent>
        {!data || data.length === 0 ? (
          <ModuleForm courseId={courseId} />
        ) : (
          <div className="space-y-3">
            {sortedModules?.map((module) => (
              <div key={module.id}>
                <div
                  className={cn(
                    'flex items-start gap-4 p-4 rounded-lg transition-colors',
                    hasAccess
                      ? 'bg-muted/30 hover:bg-muted/50 cursor-pointer'
                      : 'bg-muted/20 border border-dashed'
                  )}
                >
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-background border">
                    {hasAccess ? (
                      <PlayCircleIcon className="h-5 w-5 text-primary" />
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
                          {!hasAccess && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-muted border text-muted-foreground">
                              Locked
                            </span>
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
                    {hasAccess ? (
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
                        View Module
                      </Button>
                    ) : (
                      <p className="mt-2 text-xs text-muted-foreground italic">
                        Enroll to access this module
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
