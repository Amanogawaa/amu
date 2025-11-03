import { getChapter } from '@/server/features/chapters';
import { useQuery } from '@tanstack/react-query';

export function useGetChapter(chapterId: string) {
  return useQuery({
    queryKey: ['chapter', chapterId],
    queryFn: async () => getChapter(chapterId),
    enabled: !!chapterId,
  });
}
