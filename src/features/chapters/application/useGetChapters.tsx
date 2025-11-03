import { getChapters } from '@/server/features/chapters';
import { useQuery } from '@tanstack/react-query';

export function useGetChapters(moduleId: string) {
  return useQuery({
    queryKey: ['chapters', moduleId],
    queryFn: async () => getChapters(moduleId),
  });
}
