import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import { getCapstoneLikeStatus } from '@/server/features/capstone';
import type { CapstoneLikeToggleResponse } from '@/server/features/capstone/types';

interface UseGetCapstoneLikeStatusOptions {
  enabled?: boolean;
}

export function useGetCapstoneLikeStatus(
  submissionId: string,
  options?: UseGetCapstoneLikeStatusOptions
) {
  return useQuery<CapstoneLikeToggleResponse>({
    queryKey: queryKeys.capstone.likeStatus(submissionId),
    queryFn: () => getCapstoneLikeStatus(submissionId),
    enabled: options?.enabled !== false && !!submissionId,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}
