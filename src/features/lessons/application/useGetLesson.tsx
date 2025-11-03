import { getLesson } from '@/server/features/lessons';
import { useQuery } from '@tanstack/react-query';

export function useGetLesson(lessonId: string) {
  return useQuery({
    queryKey: ['lesson', lessonId],
    queryFn: async () => getLesson(lessonId),
    enabled: !!lessonId,
  });
}
