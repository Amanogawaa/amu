import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { queryKeys } from '@/lib/queryKeys';
import { createCapstoneReview } from '@/server/features/capstone';
import type {
  CreateCapstoneReviewPayload,
  CapstoneReviewResponse,
} from '@/server/features/capstone/types';

export function useCreateCapstoneReview() {
  const queryClient = useQueryClient();

  return useMutation<
    CapstoneReviewResponse,
    Error,
    CreateCapstoneReviewPayload
  >({
    mutationFn: createCapstoneReview,
    onSuccess: (data) => {
      toast.success('Review submitted successfully!');

      queryClient.invalidateQueries({
        queryKey: queryKeys.capstone.reviews.lists(),
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.capstone.reviews.list({
          capstoneSubmissionId: data.data.capstoneSubmissionId,
        }),
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.capstone.submissions.detail(
          data.data.capstoneSubmissionId
        ),
      });
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to submit review');
    },
  });
}
