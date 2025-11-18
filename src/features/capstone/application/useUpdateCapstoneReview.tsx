import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { queryKeys } from '@/lib/queryKeys';
import { updateCapstoneReview } from '@/server/features/capstone';
import type {
  UpdateCapstoneReviewPayload,
  CapstoneReviewResponse,
} from '@/server/features/capstone/types';

interface UpdateCapstoneReviewVariables {
  id: string;
  payload: UpdateCapstoneReviewPayload;
}

export function useUpdateCapstoneReview() {
  const queryClient = useQueryClient();

  return useMutation<
    CapstoneReviewResponse,
    Error,
    UpdateCapstoneReviewVariables
  >({
    mutationFn: ({ id, payload }) => updateCapstoneReview(id, payload),
    onSuccess: (data, variables) => {
      toast.success('Review updated successfully!');

      // Invalidate specific review
      queryClient.invalidateQueries({
        queryKey: queryKeys.capstone.reviews.detail(variables.id),
      });

      // Invalidate reviews lists
      queryClient.invalidateQueries({
        queryKey: queryKeys.capstone.reviews.lists(),
      });
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update review');
    },
  });
}
