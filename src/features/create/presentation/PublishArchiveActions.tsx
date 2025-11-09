'use client';

import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Card, CardContent } from '@/components/ui/card';
import {
  Upload,
  Archive,
  ArchiveRestore,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import { useState } from 'react';
import { Course } from '@/server/features/course/types';
import { CourseValidationResponse } from '@/server/features/course/types';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface PublishArchiveActionsProps {
  course: Course;
  validation?: CourseValidationResponse;
  isValidating: boolean;
  onPublish: () => void;
  onArchive: () => void;
  onUnarchive: () => void;
  isPublishing: boolean;
  isArchiving: boolean;
  isUnarchiving: boolean;
}

export function PublishArchiveActions({
  course,
  validation,
  isValidating,
  onPublish,
  onArchive,
  onUnarchive,
  isPublishing,
  isArchiving,
  isUnarchiving,
}: PublishArchiveActionsProps) {
  const [showPublishDialog, setShowPublishDialog] = useState(false);
  const [showArchiveDialog, setShowArchiveDialog] = useState(false);
  const [showUnarchiveDialog, setShowUnarchiveDialog] = useState(false);

  const canPublish = validation?.isComplete && !course.archive;
  const isPublished = course.publish;
  const isArchived = course.archive;

  const handlePublishClick = () => {
    if (canPublish) {
      setShowPublishDialog(true);
    }
  };

  const handleArchiveClick = () => {
    setShowArchiveDialog(true);
  };

  const handleUnarchiveClick = () => {
    setShowUnarchiveDialog(true);
  };

  const handleConfirmPublish = () => {
    onPublish();
    setShowPublishDialog(false);
  };

  const handleConfirmArchive = () => {
    onArchive();
    setShowArchiveDialog(false);
  };

  const handleConfirmUnarchive = () => {
    onUnarchive();
    setShowUnarchiveDialog(false);
  };

  return (
    <div className="space-y-4">
      {/* Status Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-2 flex-1">
              <h3 className="font-semibold text-lg">Course Status</h3>
              <div className="flex flex-wrap items-center gap-2">
                {isPublished && (
                  <Badge className="bg-green-500/10 text-green-700 dark:text-green-400">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Published
                  </Badge>
                )}
                {!isPublished && !isArchived && (
                  <Badge
                    variant="outline"
                    className="text-yellow-700 dark:text-yellow-400"
                  >
                    Draft
                  </Badge>
                )}
                {isArchived && (
                  <Badge className="bg-gray-500/10 text-gray-700 dark:text-gray-400">
                    <Archive className="h-3 w-3 mr-1" />
                    Archived
                  </Badge>
                )}
              </div>

              {/* Validation Status */}
              {!isValidating && validation && !isArchived && (
                <div className="mt-3">
                  {validation.isComplete ? (
                    <div className="flex items-start gap-2 text-sm text-green-600 dark:text-green-400">
                      <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span>Course is complete and ready to publish</span>
                    </div>
                  ) : (
                    <div className="flex items-start gap-2 text-sm text-amber-600 dark:text-amber-400">
                      <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Course incomplete</p>
                        <p className="text-xs mt-1">
                          Missing: {validation.missingComponents.join(', ')}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              {isArchived ? (
                <Button
                  onClick={handleUnarchiveClick}
                  disabled={isUnarchiving}
                  variant="default"
                  className="w-full sm:w-auto"
                >
                  {isUnarchiving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Unarchiving...
                    </>
                  ) : (
                    <>
                      <ArchiveRestore className="h-4 w-4 mr-2" />
                      Unarchive Course
                    </>
                  )}
                </Button>
              ) : (
                <>
                  <Button
                    onClick={handlePublishClick}
                    disabled={!canPublish || isPublishing || isPublished}
                    variant={isPublished ? 'outline' : 'default'}
                    className="w-full sm:w-auto"
                  >
                    {isPublishing ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Publishing...
                      </>
                    ) : isPublished ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Published
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Publish Course
                      </>
                    )}
                  </Button>

                  <Button
                    onClick={handleArchiveClick}
                    disabled={isArchiving}
                    variant="outline"
                    className="w-full sm:w-auto"
                  >
                    {isArchiving ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Archiving...
                      </>
                    ) : (
                      <>
                        <Archive className="h-4 w-4 mr-2" />
                        Archive
                      </>
                    )}
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Info Alert */}
      {!isArchived && validation && !validation.isComplete && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Complete Your Course</AlertTitle>
          <AlertDescription>
            To publish this course, you need to generate all modules, chapters,
            and lessons. Use the full generation feature to complete your course
            content.
          </AlertDescription>
        </Alert>
      )}

      {isArchived && (
        <Alert>
          <Archive className="h-4 w-4" />
          <AlertTitle>Archived Course</AlertTitle>
          <AlertDescription>
            This course is archived and only visible to you. Unarchive it to
            make changes or publish it.
          </AlertDescription>
        </Alert>
      )}

      {/* Publish Confirmation Dialog */}
      <AlertDialog open={showPublishDialog} onOpenChange={setShowPublishDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Publish Course</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to publish "{course.name}"? Once published,
              this course will be visible to all users on the platform.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmPublish}>
              Publish Course
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Archive Confirmation Dialog */}
      <AlertDialog open={showArchiveDialog} onOpenChange={setShowArchiveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Archive Course</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to archive "{course.name}"? Archived courses
              are only visible to you and cannot be published. You can unarchive
              it later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmArchive}>
              Archive Course
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Unarchive Confirmation Dialog */}
      <AlertDialog
        open={showUnarchiveDialog}
        onOpenChange={setShowUnarchiveDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unarchive Course</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to unarchive "{course.name}"? This will
              restore the course to draft status, allowing you to edit and
              publish it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmUnarchive}>
              Unarchive Course
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
