'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  publishCourse,
  unpublishCourse,
  validateCourse,
} from '@/server/features/course';
import { toast } from 'sonner';

export function useValidateCourse(courseId: string) {
  return useQuery({
    queryKey: ['course-validation', courseId],
    queryFn: () => validateCourse(courseId),
    enabled: !!courseId,
    staleTime: 30000, // 30 seconds
    gcTime: 5 * 60 * 1000,
  });
}

export function usePublishCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (courseId: string) => publishCourse(courseId),
    onSuccess: (data, courseId) => {
      toast.success('Course published successfully!');
      queryClient.invalidateQueries({ queryKey: ['course', courseId] });
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      queryClient.invalidateQueries({
        queryKey: ['course-validation', courseId],
      });
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Failed to publish course';
      toast.error(errorMessage);
    },
  });
}

export function useUnpublishCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (courseId: string) => unpublishCourse(courseId),
    onSuccess: (data, courseId) => {
      toast.success('Course unpublished successfully!');
      queryClient.invalidateQueries({ queryKey: ['course', courseId] });
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Failed to unpublish course';
      toast.error(errorMessage);
    },
  });
}
