'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { archiveCourse, unarchiveCourse } from '@/server/features/course';
import { toast } from 'sonner';

export function useArchiveCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (courseId: string) => archiveCourse(courseId),
    onSuccess: (data, courseId) => {
      toast.success('Course archived successfully!');
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
        'Failed to archive course';
      toast.error(errorMessage);
    },
  });
}

export function useUnarchiveCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (courseId: string) => unarchiveCourse(courseId),
    onSuccess: (data, courseId) => {
      toast.success('Course unarchived successfully!');
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
        'Failed to unarchive course';
      toast.error(errorMessage);
    },
  });
}
