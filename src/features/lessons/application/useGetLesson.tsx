import { getLesson, getLessons } from '@/server/features/lessons';
import { useQuery } from '@tanstack/react-query';

export function useGetLesson(lessonId: string) {
  return useQuery({
    queryKey: ['lesson', lessonId],
    queryFn: async () => getLesson(lessonId),
    enabled: !!lessonId,
  });
}

export function useGetLessons(chapterId: string) {
  return useQuery({
    queryKey: ['lessons', chapterId],
    queryFn: async () => getLessons(chapterId),
    enabled: !!chapterId,
  });
}
