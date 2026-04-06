"use client";

import { useAuth } from "@/features/auth/application/AuthContext";
import { useEnrollmentStatus } from "@/features/enrollment/application/useEnrollment";
import { useProgressForCourse } from "@/features/progress/application/useProgress";
import { useMemo } from "react";

interface ChapterLockResult {
  isEnrolled: boolean;
  isCreator: boolean;
  canAccessChapters: boolean;
  lockReason: string | null;
  completedLessons: number;
  totalLessons: number;
  completionPercentage: number;
  allLessonsCompleted: boolean;
}

interface UseChapterLockOptions {
  courseId: string;
  courseOwnerId?: string;
}

/**
 * Hook to determine chapter lock status for a course
 * Chapters are accessible if user is enrolled or is the course creator
 * Chapters are locked if user is not enrolled and not the creator
 */
export function useChapterLock({
  courseId,
  courseOwnerId,
}: UseChapterLockOptions): ChapterLockResult {
  const { user } = useAuth();
  const { data: enrollmentStatus } = useEnrollmentStatus(courseId, !!courseId);
  const { data: progress } = useProgressForCourse(courseId);

  const isEnrolled = enrollmentStatus?.isEnrolled || false;
  const isCreator = user?.uid === courseOwnerId;

  // User can access chapters if they are enrolled or are the course creator
  const canAccessChapters = isEnrolled || isCreator;

  // Determine lock reason
  const lockReason = useMemo(() => {
    if (canAccessChapters) return null;
    return "Please enroll in the course to access the lessons.";
  }, [canAccessChapters]);

  // Calculate completion stats
  const completedLessons = progress?.lessonsCompleted?.length || 0;
  const totalLessons = progress?.totalLessons || 0;
  const completionPercentage =
    totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
  const allLessonsCompleted =
    totalLessons > 0 && completedLessons === totalLessons;

  return {
    isEnrolled,
    isCreator,
    canAccessChapters,
    lockReason,
    completedLessons,
    totalLessons,
    completionPercentage,
    allLessonsCompleted,
  };
}
