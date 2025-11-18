import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import { getCapstoneGuidelineByCourseId } from '@/server/features/capstone';
import type { CapstoneGuidelineResponse } from '@/server/features/capstone/types';

interface UseGetCapstoneGuidelineOptions {
  enabled?: boolean;
}

export function useGetCapstoneGuideline(
  courseId: string,
  options?: UseGetCapstoneGuidelineOptions
) {
  return useQuery<CapstoneGuidelineResponse>({
    queryKey: queryKeys.capstone.guidelineByCourse(courseId),
    queryFn: () => getCapstoneGuidelineByCourseId(courseId),
    enabled: options?.enabled !== false && !!courseId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
