import { getLessons } from '@/server/features/lessons';
import { useQuery } from '@tanstack/react-query';

export function useGetLessons(chapterId: string) {
  return useQuery({
    queryKey: ['lessons', chapterId],
    queryFn: async () => getLessons(chapterId),
    enabled: !!chapterId,
  });
}
