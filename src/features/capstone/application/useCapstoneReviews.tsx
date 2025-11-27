import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import { getCapstoneReviews } from '@/server/features/capstone';
import type {
  CapstoneReviewsListResponse,
  CapstoneReviewFilters,
} from '@/server/features/capstone/types';

interface UseCapstoneReviewsOptions {
  enabled?: boolean;
}

export function useCapstoneReviews(
  filters?: CapstoneReviewFilters,
  options?: UseCapstoneReviewsOptions
) {
  // Ensure query is enabled only if capstoneSubmissionId is provided
  const isEnabled =
    options?.enabled !== false &&
    (filters?.capstoneSubmissionId !== undefined &&
      filters?.capstoneSubmissionId !== '');

  return useQuery<CapstoneReviewsListResponse>({
    queryKey: queryKeys.capstone.reviews.list(filters),
    queryFn: () => getCapstoneReviews(filters),
    enabled: isEnabled,
    staleTime: 2 * 60 * 1000,
  });
}
