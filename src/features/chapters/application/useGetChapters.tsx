import { queryKeys } from '@/lib/queryKeys';
import { getChapters } from '@/server/features/chapters';
import { useQuery } from '@tanstack/react-query';

export function useGetChapters(moduleId: string) {
  return useQuery({
    queryKey: queryKeys.chapters.list(moduleId),
    queryFn: async () => getChapters(moduleId),
  });
}
