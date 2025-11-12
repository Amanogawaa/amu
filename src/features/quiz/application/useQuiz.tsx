'use client';

import { logger } from '@/lib/loggers';
import {
  getQuizForLesson,
  submitQuiz,
  getUserAttempts,
  getAttemptById,
} from '@/server/features/quiz';
import { SubmitQuizRequest } from '@/server/features/quiz/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export function useQuizForLesson(lessonId: string) {
  return useQuery({
    queryKey: ['quiz', lessonId],
    queryFn: async () => {
      const response = await getQuizForLesson(lessonId);
      return response.data;
    },
    enabled: !!lessonId,
  });
}

export function useSubmitQuiz(quizId: string, lessonId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: SubmitQuizRequest) => {
      return await submitQuiz(quizId, payload);
    },

    onSuccess: (data) => {
      const passed = data.data.passed;
      const score = data.data.score;

      if (passed) {
        toast.success(`Quiz passed! You scored ${score}%`);
      } else {
        toast.error(`Quiz failed. You scored ${score}%. Try again!`);
      }

      queryClient.invalidateQueries({ queryKey: ['quiz', lessonId] });
      queryClient.invalidateQueries({ queryKey: ['attempts', quizId] });
      queryClient.invalidateQueries({ queryKey: ['progress'] });
    },

    onError: (error) => {
      toast.error('Failed to submit quiz. Please try again.');
      logger.error('Error submitting quiz:', error);
    },
  });
}

export function useUserAttempts(quizId: string) {
  return useQuery({
    queryKey: ['attempts', quizId],
    queryFn: async () => {
      const response = await getUserAttempts(quizId);
      return response.data;
    },
    enabled: !!quizId,
  });
}

export function useAttempt(attemptId: string) {
  return useQuery({
    queryKey: ['attempt', attemptId],
    queryFn: async () => {
      const response = await getAttemptById(attemptId);
      return response.data;
    },
    enabled: !!attemptId,
  });
}
