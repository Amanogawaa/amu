import { getModules } from '@/server/features/modules';
import { useQuery } from '@tanstack/react-query';

export function useGetModules(courseId: string) {
  return useQuery({
    queryKey: ['modules', courseId],
    queryFn: async () => {
      return getModules(courseId);
    },
    enabled: !!courseId,
    staleTime: 0,
    refetchInterval: 1000,
    refetchIntervalInBackground: false,
  });
}
