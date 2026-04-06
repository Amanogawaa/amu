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
  useEnrollCourse,
  useEnrollmentStatus,
  useUnenrollCourse,
} from "@/features/enrollment/application/useEnrollment";
import { LikeButton } from "@/features/likes/presentation/LikeButton";
import {
  ArchiveIcon,
  BookOpenIcon,
  CheckCircle2Icon,
  LogOutIcon,
  MoreHorizontalIcon,
  SendIcon,
  Trash2Icon,
  UserCheckIcon,
  UserPlusIcon,
} from "lucide-react";
import { useState } from "react";

interface CourseHeaderProps {
  courseId: string;
  name: string;
  subtitle?: string;
  category: string;
  level: string;
  ownerId: string;
  isPublished?: boolean;
  isDrafted?: boolean;
}

export const MyLearningCourseHeader = ({
  courseId,
  name,
  subtitle,
  category,
  level,
  ownerId,
  isPublished = false,
  isDrafted = false,
}: CourseHeaderProps) => {
  const { user } = useAuth();
  const isOwner = user?.uid === ownerId;

  const { data: enrollmentStatus, isLoading: isLoadingEnrollment } =
    useEnrollmentStatus(courseId, !isOwner && !!user);
  const { mutate: enroll, isPending: isEnrolling } = useEnrollCourse();
  const { mutate: unenroll, isPending: isUnenrolling } = useUnenrollCourse();
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
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-8">
        <div className="space-y-4 flex-1">
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
              <BookOpenIcon className="h-8 w-8 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <Badge variant="outline" className="text-xs">
                  {category}
                </Badge>
                <Badge
                  variant="outline"
                  className={`text-xs capitalize ${getLevelColor(level)}`}
                >
                  {level}
                </Badge>
                {isEnrolled && (
                  <Badge
                    variant="outline"
                    className="text-xs bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20"
                  >
                    <CheckCircle2Icon className="h-3 w-3 mr-1" />
                    Enrolled
                  </Badge>
                )}
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
                {name}
              </h1>
              {subtitle && (
                <p className="text-muted-foreground text-base mt-2">
                  {subtitle}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2">
              {!isOwner && <LikeButton courseId={courseId} showCount={true} />}

              <DropdownMenu>
                {!isOwner && (
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      aria-label="More Options"
                    >
                      <MoreHorizontalIcon />
                    </Button>
                  </DropdownMenuTrigger>
                )}

                <DropdownMenuContent align="end" className="w-52">
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
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

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
    </>
  );
};
