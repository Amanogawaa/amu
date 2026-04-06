import { queryKeys } from '@/lib/queryKeys';
import { getChapter } from '@/server/features/chapters';
import { useQuery } from '@tanstack/react-query';

export function useGetChapter(chapterId: string) {
  return useQuery({
    queryKey: queryKeys.chapters.detail(chapterId),
    queryFn: async () => getChapter(chapterId),
    enabled: !!chapterId,
  });
}
