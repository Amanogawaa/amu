'use client';

import { queryKeys } from '@/lib/queryKeys';
import { showErrorToast } from '@/lib/errorHandling';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { archiveCourse, unarchiveCourse } from '@/server/features/course';
import { toast } from 'sonner';

export function useArchiveCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (courseId: string) => archiveCourse(courseId),
    onSuccess: (data, courseId) => {
      toast.success('Course archived successfully!');
      queryClient.invalidateQueries({
        queryKey: queryKeys.courses.detail(courseId),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.courses.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.courses.validation(courseId),
      });
    },
    onError: (error: any) => {
      showErrorToast(error, 'Failed to archive course');
    },
  });
}

export function useUnarchiveCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (courseId: string) => unarchiveCourse(courseId),
    onSuccess: (data, courseId) => {
      toast.success('Course unarchived successfully!');
      queryClient.invalidateQueries({
        queryKey: queryKeys.courses.detail(courseId),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.courses.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.courses.validation(courseId),
      });
    },
    onError: (error: any) => {
      showErrorToast(error, 'Failed to unarchive course');
    },
  });
}
