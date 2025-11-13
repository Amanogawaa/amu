import { queryKeys } from '@/lib/queryKeys';
import { getModule, getModules } from '@/server/features/modules';
import { useQuery } from '@tanstack/react-query';

export function useGetModules(courseId: string) {
  return useQuery({
    queryKey: queryKeys.modules.list(courseId),
    queryFn: async () => {
      return getModules(courseId);
    },
    enabled: !!courseId,
    staleTime: 0,
  });
}

export function useGetModule(moduleId: string) {
  return useQuery({
    queryKey: queryKeys.modules.detail(moduleId),
    queryFn: async () => {
      return getModule(moduleId);
    },
    enabled: !!moduleId,
    staleTime: 0,
  });
}
