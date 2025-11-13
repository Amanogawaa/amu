'use client';

import { queryKeys } from '@/lib/queryKeys';
import { showErrorToast } from '@/lib/errorHandling';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  publishCourse,
  unpublishCourse,
  validateCourse,
} from '@/server/features/course';
import { toast } from 'sonner';

export function useValidateCourse(courseId: string) {
  return useQuery({
    queryKey: queryKeys.courses.validation(courseId),
    queryFn: () => validateCourse(courseId),
    enabled: !!courseId,
    staleTime: 30000,
    gcTime: 5 * 60 * 1000,
  });
}

export function usePublishCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (courseId: string) => publishCourse(courseId),
    onSuccess: (data, courseId) => {
      toast.success('Course published successfully!');
      queryClient.invalidateQueries({
        queryKey: queryKeys.courses.detail(courseId),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.courses.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.courses.validation(courseId),
      });
    },
    onError: (error: any) => {
      showErrorToast(error, 'Failed to publish course');
    },
  });
}

export function useUnpublishCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (courseId: string) => unpublishCourse(courseId),
    onSuccess: (data, courseId) => {
      toast.success('Course unpublished successfully!');
      queryClient.invalidateQueries({
        queryKey: queryKeys.courses.detail(courseId),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.courses.all });
    },
    onError: (error: any) => {
      showErrorToast(error, 'Failed to unpublish course');
    },
  });
}
