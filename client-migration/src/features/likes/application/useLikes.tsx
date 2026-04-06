'use client';

import { queryKeys } from '@/lib/queryKeys';
import { showErrorToast } from '@/lib/errorHandling';
import {
  toggleLike,
  getLikeStatus,
  getLikesForCourse,
  getMyLikes,
} from '@/server/features/likes';
import type { Like } from '@/server/features/likes/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export function useToggleLike(courseId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return await toggleLike(courseId);
    },

    onSuccess: (data) => {
      toast.success(data.data.liked ? 'Course liked!' : 'Like removed');
      queryClient.invalidateQueries({
        queryKey: queryKeys.likes.status(courseId),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.likes.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.likes.my() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.courses.detail(courseId),
      });
    },

    onError: (error) => {
      showErrorToast(error, 'Failed to update like. Please try again.');
    },
  });
}

export function useLikeStatus(courseId: string) {
  return useQuery({
    queryKey: queryKeys.likes.status(courseId),
    queryFn: async () => {
      const response = await getLikeStatus(courseId);
      return response.data;
    },
    enabled: !!courseId,
  });
}

export function useLikesForCourse(courseId: string, limit = 50, offset = 0) {
  return useQuery({
    queryKey: queryKeys.likes.course(courseId, limit, offset),
    queryFn: async () => {
      const response = await getLikesForCourse(courseId, limit, offset);
      return response.data;
    },
    enabled: !!courseId,
  });
}

export function useMyLikes() {
  return useQuery<Like[]>({
    queryKey: queryKeys.likes.my(),
    queryFn: async () => {
      const response = await getMyLikes();
      return response.data;
    },
  });
}
