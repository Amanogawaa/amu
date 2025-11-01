import { getChapters } from '@/server/features/chapters';
import { useQuery } from '@tanstack/react-query';

export function useGetChapters(courseId: string) {
  return useQuery({
    queryKey: ['chapters', courseId],
    queryFn: async () => getChapters(courseId),
  });
}
