"use client";

import { useAuth } from "@/features/auth/application/AuthContext";
import { useEnrollmentStatus } from "@/features/enrollment/application/useEnrollment";
import { useProgressForCourse } from "@/features/progress/application/useProgress";
import { useMemo } from "react";

interface CapstoneAccessResult {
  canAccess: boolean;
  isLocked: boolean;
  lockMessage: string | null;
  isEnrolled: boolean;
  isCreator: boolean;
  completedLessons: number;
  totalLessons: number;
  completionPercentage: number;
  lessonProgress: string; // "0/10", "5/10", etc.
}

interface UseCapstoneAccessOptions {
  courseId: string;
  courseOwnerId?: string;
}

/**
 * Hook to determine capstone project access
 * Capstone is unlocked when:
 * 1. User is the course creator (always accessible), OR
 * 2. User is enrolled AND all lessons are completed
 */
export function useCapstoneAccess({
  courseId,
  courseOwnerId,
}: UseCapstoneAccessOptions): CapstoneAccessResult {
  const { user } = useAuth();
  const { data: enrollmentStatus } = useEnrollmentStatus(courseId, !!courseId);
  const { data: progress } = useProgressForCourse(courseId);

  const isEnrolled = enrollmentStatus?.isEnrolled || false;
  const isCreator = user?.uid === courseOwnerId;
  const completedLessons = progress?.lessonsCompleted?.length || 0;
  const totalLessons = progress?.totalLessons || 0;

  // Calculate derived values
  const completionPercentage = useMemo(() => {
    return totalLessons > 0
      ? Math.round((completedLessons / totalLessons) * 100)
      : 0;
  }, [completedLessons, totalLessons]);

  const allLessonsCompleted =
    totalLessons > 0 && completedLessons === totalLessons;

  // Determine access: creators always have access, enrolled users need all lessons completed
  const canAccess = useMemo(() => {
    if (isCreator) return true;
    if (!isEnrolled) return false;
    if (totalLessons === 0) return false;
    return allLessonsCompleted;
  }, [isCreator, isEnrolled, totalLessons, allLessonsCompleted]);

  const isLocked = !canAccess;

  // Generate lock message
  const lockMessage = useMemo(() => {
    if (canAccess) return null;

    if (!isEnrolled) {
      return "Enroll in this course to unlock the capstone project.";
    }

    if (totalLessons === 0) {
      return "No lessons found in this course.";
    }

    return `Complete all ${totalLessons} lesson${totalLessons !== 1 ? "s" : ""} to unlock this capstone project. Progress: ${completedLessons}/${totalLessons}`;
  }, [canAccess, isEnrolled, totalLessons, completedLessons]);

  const lessonProgress = `${completedLessons}/${totalLessons}`;

  return {
    canAccess,
    isLocked,
    lockMessage,
    isEnrolled,
    isCreator,
    completedLessons,
    totalLessons,
    completionPercentage,
    lessonProgress,
  };
}
