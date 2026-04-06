'use client';

import { queryKeys } from '@/lib/queryKeys';
import { showErrorToast } from '@/lib/errorHandling';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  moveCourseToDraft,
  restoreCourseFromDraft,
} from '@/server/features/course';
import { toast } from 'sonner';

export function useDraftCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (courseId: string) => moveCourseToDraft(courseId),
    onSuccess: (data, courseId) => {
      toast.success('Course saved as draft successfully!');
      queryClient.invalidateQueries({
        queryKey: queryKeys.courses.detail(courseId),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.courses.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.courses.validation(courseId),
      });
    },
    onError: (error: any) => {
      showErrorToast(error, 'Failed to move course to draft');
    },
  });
}

export function useUndraftCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (courseId: string) => restoreCourseFromDraft(courseId),
    onSuccess: (data, courseId) => {
      toast.success('Course restored from draft!');
      queryClient.invalidateQueries({
        queryKey: queryKeys.courses.detail(courseId),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.courses.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.courses.validation(courseId),
      });
    },
    onError: (error: any) => {
      showErrorToast(error, 'Failed to restore course from draft');
    },
  });
}
