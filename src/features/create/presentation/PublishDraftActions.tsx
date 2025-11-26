"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Course,
  CourseValidationResponse,
} from "@/server/features/course/types";
import {
  Archive,
  ArchiveRestore,
  CheckCircle2,
  Loader2,
  Upload,
} from "lucide-react";
import { useState } from "react";

interface PublishArchiveActionsProps {
  course: Course;
  validation?: CourseValidationResponse;
  isValidating: boolean;
  onPublish: () => void;
  onDraft: () => void;
  onUndraft: () => void;
  isPublishing: boolean;
  isDrafting: boolean;
  isUndrafting: boolean;
}

export function PublishDraftActions({
  course,
  validation,
  isValidating,
  onPublish,
  onDraft,
  onUndraft,
  isPublishing,
  isDrafting,
  isUndrafting,
}: PublishArchiveActionsProps) {
  const [showPublishDialog, setShowPublishDialog] = useState(false);
  const [showDraftDialog, setShowDraftDialog] = useState(false);
  const [showUndraftDialog, setShowUndraftDialog] = useState(false);

  const canPublish = validation?.isComplete && !course.draft;
  const isPublished = course.publish;
  const isDrafted = course.draft;

  const handlePublishClick = () => {
    if (canPublish) {
      setShowPublishDialog(true);
    }
  };

  const handleDraftClick = () => {
    setShowDraftDialog(true);
  };

  const handleUndraftClick = () => {
    setShowUndraftDialog(true);
  };

  const handleConfirmPublish = () => {
    onPublish();
    setShowPublishDialog(false);
  };

  const handleConfirmDraft = () => {
    onDraft();
    setShowDraftDialog(false);
  };

  const handleConfirmUndraft = () => {
    onUndraft();
    setShowUndraftDialog(false);
  };

  return (
    <div className="space-y-4">
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
                {!isPublished && !isDrafted && (
                  <Badge
                    variant="outline"
                    className="text-yellow-700 dark:text-yellow-400"
                  >
                    Draft
                  </Badge>
                )}
                {isDrafted && (
                  <Badge className="bg-gray-500/10 text-gray-700 dark:text-gray-400">
                    <Archive className="h-3 w-3 mr-1" />
                    Draft (Hidden)
                  </Badge>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              {isDrafted ? (
                <Button
                  onClick={handleUndraftClick}
                  disabled={isUndrafting}
                  variant="default"
                  className="w-full sm:w-auto"
                >
                  {isUndrafting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Restoring...
                    </>
                  ) : (
                    <>
                      <ArchiveRestore className="h-4 w-4 mr-2" />
                      Restore from Draft
                    </>
                  )}
                </Button>
              ) : (
                <>
                  <Button
                    onClick={handlePublishClick}
                    disabled={!canPublish || isPublishing || isPublished}
                    variant={isPublished ? "outline" : "default"}
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
                    onClick={handleDraftClick}
                    disabled={isDrafting}
                    variant="outline"
                    className="w-full sm:w-auto"
                  >
                    {isDrafting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Saving to Draft...
                      </>
                    ) : (
                      <>
                        <Archive className="h-4 w-4 mr-2" />
                        Move to Draft
                      </>
                    )}
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {isDrafted && (
        <Alert>
          <Archive className="h-4 w-4" />
          <AlertTitle>Draft Only</AlertTitle>
          <AlertDescription>
            This course is hidden from learners and only visible to you. Restore
            it from draft to continue editing or publish it.
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

      {/* Draft Confirmation Dialog */}
      <AlertDialog open={showDraftDialog} onOpenChange={setShowDraftDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Move to Draft</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to move "{course.name}" back to draft? Draft
              courses stay private to you until you publish them again.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDraft}>
              Save as Draft
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Undraft Confirmation Dialog */}
      <AlertDialog open={showUndraftDialog} onOpenChange={setShowUndraftDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Restore from Draft</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to restore "{course.name}" from draft? It
              will return to editable draft status so you can publish it again.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmUndraft}>
              Restore Draft
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
