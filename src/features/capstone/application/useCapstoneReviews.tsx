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
  return useQuery<CapstoneReviewsListResponse>({
    queryKey: queryKeys.capstone.reviews.list(filters),
    queryFn: () => getCapstoneReviews(filters),
    enabled: options?.enabled !== false,
    staleTime: 2 * 60 * 1000,
  });
}
