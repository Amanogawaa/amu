'use client';

import { Button } from '@/components/ui/button';
import {
  usePublishCourse,
  useUnpublishCourse,
  useValidateCourse,
} from '@/features/create/application/usePublishCourse';
import { CheckCircle2, XCircle, Loader2, AlertCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';

interface PublishCourseButtonProps {
  courseId: string;
  isPublished: boolean;
  onPublishChange?: (published: boolean) => void;
}

export function PublishCourseButton({
  courseId,
  isPublished,
  onPublishChange,
}: PublishCourseButtonProps) {
  const [showValidationDialog, setShowValidationDialog] = useState(false);

  const { data: validation, isLoading: isValidating } =
    useValidateCourse(courseId);
  const publishMutation = usePublishCourse();
  const unpublishMutation = useUnpublishCourse();

  const isLoading = publishMutation.isPending || unpublishMutation.isPending;

  const handlePublish = async () => {
    if (!validation?.data.isComplete) {
      setShowValidationDialog(true);
      return;
    }

    try {
      await publishMutation.mutateAsync(courseId);
      onPublishChange?.(true);
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleUnpublish = async () => {
    try {
      await unpublishMutation.mutateAsync(courseId);
      onPublishChange?.(false);
    } catch (error) {
      // Error handled by mutation
    }
  };

  const validationData = validation?.data;

  return (
    <div className="flex items-center gap-2">
      {isPublished ? (
        <Button
          onClick={handleUnpublish}
          disabled={isLoading}
          variant="outline"
          size="sm"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Unpublishing...
            </>
          ) : (
            <>
              <XCircle className="mr-2 h-4 w-4" />
              Unpublish
            </>
          )}
        </Button>
      ) : (
        <>
          <Dialog
            open={showValidationDialog}
            onOpenChange={setShowValidationDialog}
          >
            <Button
              onClick={handlePublish}
              disabled={isLoading || isValidating}
              size="sm"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Publishing...
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Publish Course
                </>
              )}
            </Button>

            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-amber-500" />
                  Course Incomplete
                </DialogTitle>
                <DialogDescription>
                  Your course is missing required components. Please complete
                  all sections before publishing.
                </DialogDescription>
              </DialogHeader>

              {validationData && (
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold">
                      Missing Components:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {validationData.missingComponents.map((component) => (
                        <Badge key={component} variant="destructive">
                          {component}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-lg border p-4 space-y-2">
                    <h4 className="text-sm font-semibold">Course Status:</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center justify-between">
                        <span>Modules:</span>
                        <span
                          className={
                            validationData.details.hasModules
                              ? 'text-green-600'
                              : 'text-red-600'
                          }
                        >
                          {validationData.details.modulesCount} module(s)
                          {validationData.details.hasModules ? ' ✓' : ' ✗'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Chapters:</span>
                        <span
                          className={
                            validationData.details.hasChapters
                              ? 'text-green-600'
                              : 'text-red-600'
                          }
                        >
                          {validationData.details.chaptersCount} chapter(s)
                          {validationData.details.hasChapters ? ' ✓' : ' ✗'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Lessons:</span>
                        <span
                          className={
                            validationData.details.hasLessons
                              ? 'text-green-600'
                              : 'text-red-600'
                          }
                        >
                          {validationData.details.lessonsCount} lesson(s)
                          {validationData.details.hasLessons ? ' ✓' : ' ✗'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground">
                    Complete all required sections to publish your course and
                    make it available to learners.
                  </p>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </>
      )}

      {isPublished && (
        <Badge variant="secondary" className="bg-green-100 text-green-700">
          Published
        </Badge>
      )}
    </div>
  );
}
