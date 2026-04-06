"use client";

import { useAuth } from "@/features/auth/application/AuthContext";
import { useEnrollmentStatus } from "@/features/enrollment/application/useEnrollment";
import { useGetCourse } from "./useGetCourses";

interface CourseContextResult {
  isOwner: boolean;
  isEnrolled: boolean;
  isDrafted: boolean;
  isPublished: boolean;
  canManage: boolean;
  canEnroll: boolean;
  canView: boolean;
  isLoading: boolean;
  isError: boolean;
}

/**
 * Hook to access course context and permissions
 * Determines user's relationship to a course (owner, enrolled, public, etc.)
 */
export function useCourseContext(courseId: string): CourseContextResult {
  const { user } = useAuth();
  const {
    data: course,
    isLoading: courseLoading,
    isError: courseError,
  } = useGetCourse(courseId);
  const { data: enrollmentStatus, isLoading: enrollmentLoading } =
    useEnrollmentStatus(courseId, !!courseId);

  const isOwner = user?.uid === course?.uid;
  const isEnrolled = enrollmentStatus?.isEnrolled || false;
  const isDrafted = course?.draft === true;
  const isPublished = course?.publish === true;

  // Owner can always manage
  const canManage = isOwner;

  // Can enroll if: not owner, not already enrolled, course is published (not drafted)
  const canEnroll = !isOwner && !isEnrolled && isPublished && !isDrafted;

  // Can view if: owner, enrolled, or course is published
  const canView = isOwner || isEnrolled || (isPublished && !isDrafted);

  return {
    isOwner,
    isEnrolled,
    isDrafted,
    isPublished,
    canManage,
    canEnroll,
    canView,
    isLoading: courseLoading || enrollmentLoading,
    isError: courseError,
  };
}
