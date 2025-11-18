import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import { getCapstoneSubmissionById } from '@/server/features/capstone';
import type { CapstoneSubmissionResponse } from '@/server/features/capstone/types';

interface UseGetCapstoneSubmissionOptions {
  enabled?: boolean;
}

export function useGetCapstoneSubmission(
  id: string,
  options?: UseGetCapstoneSubmissionOptions
) {
  return useQuery<CapstoneSubmissionResponse>({
    queryKey: queryKeys.capstone.submissions.detail(id),
    queryFn: () => getCapstoneSubmissionById(id),
    enabled: options?.enabled !== false && !!id,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}
