'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  enrollInCourse,
  unenrollFromCourse,
  getEnrollmentStatus,
  getUserEnrollments,
  getEnrollmentCount,
} from '@/server/features/enrollment';
import type { EnrollmentFilters } from '@/server/features/enrollment/types';
import { toast } from 'sonner';
import { queryKeys } from '@/lib/queryKeys';

export function useEnrollCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (courseId: string) => enrollInCourse(courseId),
    onSuccess: (data, courseId) => {
      toast.success('Successfully enrolled in course!');

      queryClient.invalidateQueries({
        queryKey: queryKeys.enrollments.status(courseId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.enrollments.all,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.enrollments.count(courseId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.courses.detail(courseId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.progress.course(courseId),
      });
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Failed to enroll in course';
      toast.error(errorMessage);
    },
  });
}

export function useUnenrollCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (courseId: string) => unenrollFromCourse(courseId),
    onSuccess: (data, courseId) => {
      toast.success('Successfully unenrolled from course');

      queryClient.invalidateQueries({
        queryKey: queryKeys.enrollments.status(courseId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.enrollments.all,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.enrollments.count(courseId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.courses.detail(courseId),
      });
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Failed to unenroll from course';
      toast.error(errorMessage);
    },
  });
}

export function useEnrollmentStatus(courseId: string, enabled: boolean = true) {
  return useQuery({
    queryKey: queryKeys.enrollments.status(courseId),
    queryFn: () => getEnrollmentStatus(courseId),
    enabled: enabled && !!courseId,
    staleTime: 30000,
    gcTime: 5 * 60 * 1000,
  });
}

export function useUserEnrollments(filters?: EnrollmentFilters, enabled: boolean = true) {
  return useQuery({
    queryKey: queryKeys.enrollments.list(filters),
    queryFn: () => getUserEnrollments(filters),
    enabled,
    staleTime: 60000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useEnrollmentCount(courseId: string, enabled: boolean = true) {
  return useQuery({
    queryKey: queryKeys.enrollments.count(courseId),
    queryFn: () => getEnrollmentCount(courseId),
    enabled: enabled && !!courseId,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}
