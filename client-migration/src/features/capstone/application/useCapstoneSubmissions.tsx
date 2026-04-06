import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import { getCapstoneSubmissions } from '@/server/features/capstone';
import type {
  CapstoneSubmissionsListResponse,
  CapstoneSubmissionFilters,
} from '@/server/features/capstone/types';

interface UseCapstoneSubmissionsOptions {
  enabled?: boolean;
}

export function useCapstoneSubmissions(
  filters?: CapstoneSubmissionFilters,
  options?: UseCapstoneSubmissionsOptions
) {
  return useQuery<CapstoneSubmissionsListResponse>({
    queryKey: queryKeys.capstone.submissions.list(filters),
    queryFn: () => getCapstoneSubmissions(filters),
    enabled: options?.enabled !== false,
    staleTime: 2 * 60 * 1000,
  });
}
