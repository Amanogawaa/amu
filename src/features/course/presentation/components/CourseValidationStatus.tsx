'use client';

import { useValidateCourse } from '@/features/course/application/usePublishCourse';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface CourseValidationStatusProps {
  courseId: string;
}

export function CourseValidationStatus({
  courseId,
}: CourseValidationStatusProps) {
  const { data: validation, isLoading } = useValidateCourse(courseId);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Course Completion Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!validation) return null;

  const { data: validationData } = validation;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center justify-between">
          <span>Course Completion Status</span>
          {validationData.isComplete ? (
            <Badge className="bg-green-100 text-green-700">
              <CheckCircle2 className="mr-1 h-3 w-3" />
              Ready to Publish
            </Badge>
          ) : (
            <Badge variant="secondary" className="bg-amber-100 text-amber-700">
              Incomplete
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <div className="flex items-center justify-between py-2 border-b">
            <span className="text-sm font-medium">Modules</span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {validationData.details.modulesCount}
              </span>
              {validationData.details.hasModules ? (
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              ) : (
                <XCircle className="h-4 w-4 text-red-600" />
              )}
            </div>
          </div>

          <div className="flex items-center justify-between py-2 border-b">
            <span className="text-sm font-medium">Chapters</span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {validationData.details.chaptersCount}
              </span>
              {validationData.details.hasChapters ? (
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              ) : (
                <XCircle className="h-4 w-4 text-red-600" />
              )}
            </div>
          </div>

          <div className="flex items-center justify-between py-2">
            <span className="text-sm font-medium">Lessons</span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {validationData.details.lessonsCount}
              </span>
              {validationData.details.hasLessons ? (
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              ) : (
                <XCircle className="h-4 w-4 text-red-600" />
              )}
            </div>
          </div>
        </div>

        {!validationData.isComplete && (
          <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950 rounded-lg">
            <p className="text-sm text-amber-800 dark:text-amber-200">
              Please add {validationData.missingComponents.join(', ')} to
              publish this course.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
