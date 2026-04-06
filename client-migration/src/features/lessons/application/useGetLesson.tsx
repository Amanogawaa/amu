'use client';

import { queryKeys } from '@/lib/queryKeys';
import { getLesson, getLessons } from '@/server/features/lessons';
import { useQuery } from '@tanstack/react-query';

export function useGetLesson(lessonId: string) {
  return useQuery({
    queryKey: queryKeys.lessons.detail(lessonId),
    queryFn: async () => getLesson(lessonId),
    enabled: !!lessonId,
  });
}

export function useGetLessons(chapterId: string) {
  return useQuery({
    queryKey: queryKeys.lessons.list(chapterId),
    queryFn: async () => getLessons(chapterId),
    enabled: !!chapterId,
  });
}
