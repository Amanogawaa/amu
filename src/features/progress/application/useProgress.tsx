'use client';

import { queryKeys } from '@/lib/queryKeys';
import { showErrorToast } from '@/lib/errorHandling';
import {
  markLessonProgress,
  getProgressForCourse,
  getAllProgress,
  getProgressSummary,
  deleteProgress,
} from '@/server/features/progress';
import type {
  ProgressUpdatePayload,
  UserProgress,
  ProgressSummary,
} from '@/server/features/progress/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export function useMarkLessonProgress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: ProgressUpdatePayload) => {
      return await markLessonProgress(payload);
    },

    onSuccess: (data, variables) => {
      toast.success(
        variables.completed ? 'Lesson marked complete!' : 'Progress updated'
      );
      queryClient.invalidateQueries({ queryKey: queryKeys.progress.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.progress.course(variables.courseId),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.progress.summary() });
    },

    onError: (error) => {
      showErrorToast(error, 'Failed to update progress. Please try again.');
    },
  });
}

export function useProgressForCourse(courseId: string) {
  return useQuery<UserProgress | null>({
    queryKey: queryKeys.progress.course(courseId),
    queryFn: async () => {
      try {
        const response = await getProgressForCourse(courseId);
        return response.data;
      } catch (error: any) {
        if (error.message?.includes('404') || error.response?.status === 404) {
          return null;
        }
        throw error;
      }
    },
    enabled: !!courseId,
  });
}

export function useAllProgress() {
  return useQuery<UserProgress[]>({
    queryKey: queryKeys.progress.all,
    queryFn: async () => {
      const response = await getAllProgress();
      return response.data;
    },
  });
}

export function useProgressSummary() {
  return useQuery<ProgressSummary>({
    queryKey: queryKeys.progress.summary(),
    queryFn: async () => {
      const response = await getProgressSummary();
      return response.data;
    },
  });
}

export function useDeleteProgress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (courseId: string) => {
      return await deleteProgress(courseId);
    },

    onSuccess: (_, courseId) => {
      toast.success('Progress reset successfully');
      queryClient.invalidateQueries({ queryKey: queryKeys.progress.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.progress.course(courseId),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.progress.summary() });
    },

    onError: (error) => {
      showErrorToast(error, 'Failed to reset progress. Please try again.');
    },
  });
}
