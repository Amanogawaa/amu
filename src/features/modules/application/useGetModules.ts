import { getModule, getModules } from '@/server/features/modules';
import { useQuery } from '@tanstack/react-query';

export function useGetModules(courseId: string) {
  return useQuery({
    queryKey: ['modules', courseId],
    queryFn: async () => {
      return getModules(courseId);
    },
    enabled: !!courseId,
    staleTime: 0,
  });
}

export function useGetModule(moduleId: string) {
  return useQuery({
    queryKey: ['module', moduleId],
    queryFn: async () => {
      return getModule(moduleId);
    },
    enabled: !!moduleId,
    staleTime: 0,
  });
}
