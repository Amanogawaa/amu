'use client';

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
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['likeStatus', courseId] });
      queryClient.invalidateQueries({ queryKey: ['likes', courseId] });
      queryClient.invalidateQueries({ queryKey: ['myLikes'] });
      queryClient.invalidateQueries({ queryKey: ['course', courseId] });
    },

    onError: (error) => {
      toast.error('Failed to update like. Please try again.');
      console.error('Error toggling like:', error);
    },
  });
}

export function useLikeStatus(courseId: string) {
  return useQuery({
    queryKey: ['likeStatus', courseId],
    queryFn: async () => {
      const response = await getLikeStatus(courseId);
      return response.data;
    },
    enabled: !!courseId,
  });
}

export function useLikesForCourse(courseId: string, limit = 50, offset = 0) {
  return useQuery({
    queryKey: ['likes', courseId, limit, offset],
    queryFn: async () => {
      const response = await getLikesForCourse(courseId, limit, offset);
      return response.data;
    },
    enabled: !!courseId,
  });
}

export function useMyLikes() {
  return useQuery<Like[]>({
    queryKey: ['myLikes'],
    queryFn: async () => {
      const response = await getMyLikes();
      return response.data;
    },
  });
}
