import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { queryKeys } from '@/lib/queryKeys';
import { deleteCapstoneReview } from '@/server/features/capstone';

export function useDeleteCapstoneReview() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: deleteCapstoneReview,
    onSuccess: (_, reviewId) => {
      toast.success('Review deleted successfully');

      queryClient.invalidateQueries({
        queryKey: queryKeys.capstone.reviews.detail(reviewId),
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.capstone.reviews.lists(),
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.capstone.submissions.lists(),
      });
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete review');
    },
  });
}
