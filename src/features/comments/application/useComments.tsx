'use client';

import { logger } from '@/lib/loggers';
import {
  createComment,
  getCommentsForCourse,
  getCommentById,
  updateComment,
  deleteComment,
  getMyComments,
  getReplies,
} from '@/server/features/comments';
import type {
  CreateCommentPayload,
  UpdateCommentPayload,
  Comment,
} from '@/server/features/comments/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export function useCreateComment(courseId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateCommentPayload) => {
      return await createComment(payload);
    },

    onSuccess: () => {
      toast.success('Comment posted successfully!');
      queryClient.invalidateQueries({ queryKey: ['comments', courseId] });
      queryClient.invalidateQueries({ queryKey: ['myComments'] });
      queryClient.invalidateQueries({ queryKey: ['course', courseId] });
    },

    onError: (error) => {
      toast.error('Failed to post comment. Please try again.');
      logger.error('Error creating comment:', error);
    },
  });
}

export function useCommentsForCourse(
  courseId: string,
  limit = 20,
  offset = 0,
  parentId?: string | null
) {
  return useQuery({
    queryKey: ['comments', courseId, limit, offset, parentId],
    queryFn: async () => {
      const response = await getCommentsForCourse(
        courseId,
        limit,
        offset,
        parentId
      );
      return response.data;
    },
    enabled: !!courseId,
  });
}

export function useComment(commentId: string) {
  return useQuery<Comment>({
    queryKey: ['comment', commentId],
    queryFn: async () => {
      const response = await getCommentById(commentId);
      return response.data;
    },
    enabled: !!commentId,
  });
}

export function useUpdateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      commentId,
      payload,
    }: {
      commentId: string;
      payload: UpdateCommentPayload;
    }) => {
      return await updateComment(commentId, payload);
    },

    onSuccess: (data) => {
      toast.success('Comment updated successfully!');
      queryClient.invalidateQueries({
        queryKey: ['comment', data.data.id],
      });
      queryClient.invalidateQueries({
        queryKey: ['comments', data.data.courseId],
      });
    },

    onError: (error) => {
      toast.error('Failed to update comment. Please try again.');
      logger.error('Error updating comment:', error);
    },
  });
}

export function useDeleteComment(courseId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (commentId: string) => {
      return await deleteComment(commentId);
    },

    onSuccess: () => {
      toast.success('Comment deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['comments', courseId] });
      queryClient.invalidateQueries({ queryKey: ['myComments'] });
      queryClient.invalidateQueries({ queryKey: ['course', courseId] });
    },

    onError: (error) => {
      toast.error('Failed to delete comment. Please try again.');
      logger.error('Error deleting comment:', error);
    },
  });
}

export function useMyComments() {
  return useQuery<Comment[]>({
    queryKey: ['myComments'],
    queryFn: async () => {
      const response = await getMyComments();
      return response.data;
    },
  });
}

export function useReplies(parentId: string) {
  return useQuery<Comment[]>({
    queryKey: ['replies', parentId],
    queryFn: async () => {
      const response = await getReplies(parentId);
      return response.data;
    },
    enabled: !!parentId,
  });
}
