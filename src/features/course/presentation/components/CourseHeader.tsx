"use client";

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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/features/auth/application/AuthContext";
import {
  usePublishCourse,
  useUnpublishCourse,
} from "@/features/create/application/usePublishCourse";
import {
  useEnrollCourse,
  useEnrollmentStatus,
  useUnenrollCourse,
} from "@/features/enrollment/application/useEnrollment";
import { LikeButton } from "@/features/likes/presentation/LikeButton";
import {
  ArchiveIcon,
  BookOpenIcon,
  CheckCircle2Icon,
  ClockIcon,
  LanguagesIcon,
  LogOutIcon,
  MoreHorizontalIcon,
  SendIcon,
  Trash2Icon,
  UserCheckIcon,
  UserPlusIcon,
} from "lucide-react";
import { useState } from "react";
import useDeleteCourse from "../../application/useDeleteCourse";
import {
  useDraftCourse,
  useUndraftCourse,
} from "@/features/create/application/useDraftCourse";
import { Card, CardContent } from "@/components/ui/card";

interface CourseHeaderProps {
  courseId: string;
  name: string;
  subtitle?: string;
  category: string;
  level: string;
  ownerId: string;
  isPublished?: boolean;
  isDrafted?: boolean;
  duration?: string;
  noOfChapters?: number;
  language?: string;
}

export const CourseHeader = ({
  courseId,
  name,
  subtitle,
  category,
  level,
  ownerId,
  isPublished = false,
  isDrafted = false,
  duration,
  noOfChapters,
  language,
}: CourseHeaderProps) => {
  const { user } = useAuth();
  const isOwner = user?.uid === ownerId;

  const { data: enrollmentStatus, isLoading: isLoadingEnrollment } =
    useEnrollmentStatus(courseId, !isOwner && !!user);
  const { mutate: enroll, isPending: isEnrolling } = useEnrollCourse();
  const { mutate: unenroll, isPending: isUnenrolling } = useUnenrollCourse();

  const { mutate: publish, isPending: isPublishing } = usePublishCourse();
  const { mutate: unpublish, isPending: isUnpublishing } = useUnpublishCourse();
  const { mutate: draft, isPending: isArchiving } = useDraftCourse();
  const { mutate: undraft, isPending: isUnarchiving } = useUndraftCourse();
  const { mutate: deleteCourse, isPending: isDeleting } = useDeleteCourse();

  const [showUnenrollDialog, setShowUnenrollDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const isEnrolled = enrollmentStatus?.isEnrolled || false;

  const handleEnroll = () => {
    enroll(courseId);
  };

  const handleUnenroll = () => {
    unenroll(courseId);
    setShowUnenrollDialog(false);
  };

  const handlePublish = () => {
    publish(courseId);
  };

  const handleUnpublish = () => {
    unpublish(courseId);
  };

  const handleArchive = () => {
    draft(courseId);
  };

  const handleUnarchive = () => {
    undraft(courseId);
  };

  const handleDelete = () => {
    deleteCourse(courseId);
    setShowDeleteDialog(false);
  };

  const getLevelColor = (level: string) => {
    if (!level) return;

    switch (level.toLowerCase()) {
      case "beginner":
        return "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20";
      case "intermediate":
        return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20";
      case "advanced":
        return "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20";
      default:
        return "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20";
    }
  };

  return (
    <>
      <Card className="rounded-xl overflow-hidden mb-8">
        <CardContent className="px-8  space-y-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-background/15 dark:bg-slate-700 text-background dark:text-slate-100 border-background/20 dark:border-slate-600 hover:bg-background/20 dark:hover:bg-slate-600">
                {category}
              </Badge>
              <Badge
                className={`capitalize bg-background/15 dark:bg-slate-700 text-background dark:text-slate-100 border-background/20 dark:border-slate-600`}
              >
                {level}
              </Badge>
              {isEnrolled && (
                <Badge className="bg-emerald-400/20 dark:bg-emerald-500/30 text-emerald-700 dark:text-emerald-300 border-emerald-400/20 dark:border-emerald-500/50">
                  <CheckCircle2Icon className="h-3 w-3 mr-1" />
                  Enrolled
                </Badge>
              )}
            </div>

            {/* Actions in top right */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {!isOwner && <LikeButton courseId={courseId} showCount={true} />}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="More Options"
                    className="text-background dark:text-slate-100 hover:bg-background/10 dark:hover:bg-slate-700"
                  >
                    <MoreHorizontalIcon />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                  {isOwner ? (
                    <>
                      <DropdownMenuGroup>
                        {!isPublished ? (
                          <DropdownMenuItem
                            onClick={handlePublish}
                            disabled={isPublishing}
                          >
                            <SendIcon className="h-4 w-4 mr-2" />
                            {isPublishing ? "Publishing..." : "Publish Course"}
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                            onClick={handleUnpublish}
                            disabled={isUnpublishing}
                          >
                            <SendIcon className="h-4 w-4 mr-2" />
                            {isUnpublishing
                              ? "Unpublishing..."
                              : "Unpublish Course"}
                          </DropdownMenuItem>
                        )}

                        {!isDrafted ? (
                          <DropdownMenuItem
                            onClick={handleArchive}
                            disabled={isArchiving}
                          >
                            <ArchiveIcon className="h-4 w-4 mr-2" />
                            {isArchiving ? "Drafting..." : "Draft Course"}
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                            onClick={handleUnarchive}
                            disabled={isUnarchiving}
                          >
                            <ArchiveIcon className="h-4 w-4 mr-2" />
                            {isUnarchiving
                              ? "Unarchiving..."
                              : "Unarchive Course"}
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuGroup>

                      <DropdownMenuSeparator />

                      <DropdownMenuGroup>
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => setShowDeleteDialog(true)}
                          disabled={isDeleting}
                        >
                          <Trash2Icon className="h-4 w-4 mr-2" />
                          {isDeleting ? "Deleting..." : "Delete Course"}
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </>
                  ) : (
                    <>
                      <DropdownMenuGroup>
                        {isLoadingEnrollment ? (
                          <DropdownMenuItem disabled>
                            <UserCheckIcon className="h-4 w-4 mr-2" />
                            Loading...
                          </DropdownMenuItem>
                        ) : isEnrolled ? (
                          <DropdownMenuItem
                            onClick={() => setShowUnenrollDialog(true)}
                            disabled={isUnenrolling}
                          >
                            <LogOutIcon className="h-4 w-4 mr-2" />
                            {isUnenrolling
                              ? "Unenrolling..."
                              : "Unenroll from Course"}
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                            onClick={handleEnroll}
                            disabled={isEnrolling}
                          >
                            <UserPlusIcon className="h-4 w-4 mr-2" />
                            {isEnrolling ? "Enrolling..." : "Enroll in Course"}
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuGroup>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Title & subtitle */}
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
              {name}
            </h1>
            {subtitle && (
              <p className="text-base max-w-2xl leading-relaxed">{subtitle}</p>
            )}
          </div>

          {/* Stats row */}
          {(duration || noOfChapters !== undefined || language) && (
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm ">
              {duration && (
                <span className="flex items-center gap-1.5">
                  <ClockIcon className="h-4 w-4" />
                  {duration}
                </span>
              )}
              {noOfChapters !== undefined && (
                <span className="flex items-center gap-1.5">
                  <BookOpenIcon className="h-4 w-4" />
                  {noOfChapters} {noOfChapters === 1 ? "Chapter" : "Chapters"}
                </span>
              )}
              {language && (
                <span className="flex items-center gap-1.5">
                  <LanguagesIcon className="h-4 w-4" />
                  {language}
                </span>
              )}
            </div>
          )}

          {/* Enroll button */}
          {!isOwner && !isLoadingEnrollment && !isEnrolled && (
            <div className="pt-2">
              <Button
                onClick={handleEnroll}
                disabled={isEnrolling}
                size="lg"
                className="bg-background text-foreground hover:bg-background/90 font-semibold"
              >
                <UserPlusIcon className="h-4 w-4 mr-2" />
                {isEnrolling ? "Enrolling..." : "Enroll Now — Free"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog
        open={showUnenrollDialog}
        onOpenChange={setShowUnenrollDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unenroll from Course?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to unenroll from this course? Your progress
              will be saved, and you can re-enroll at any time.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleUnenroll}>
              Unenroll
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Course?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              course and all its content, including modules, chapters, and
              lessons.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete Course"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
