import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { queryKeys } from '@/lib/queryKeys';
import { toggleCapstoneLike } from '@/server/features/capstone';
import type { CapstoneLikeToggleResponse } from '@/server/features/capstone/types';

export function useToggleCapstoneLike() {
  const queryClient = useQueryClient();

  return useMutation<CapstoneLikeToggleResponse, Error, string>({
    mutationFn: toggleCapstoneLike,
    onSuccess: (data, submissionId) => {
      const message = data.data.liked
        ? 'Added to favorites'
        : 'Removed from favorites';
      toast.success(message);

      // Invalidate like status
      queryClient.invalidateQueries({
        queryKey: queryKeys.capstone.likeStatus(submissionId),
      });

      // Invalidate the submission (like count changed)
      queryClient.invalidateQueries({
        queryKey: queryKeys.capstone.submissions.detail(submissionId),
      });

      // Invalidate submissions lists
      queryClient.invalidateQueries({
        queryKey: queryKeys.capstone.submissions.lists(),
      });
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update like status');
    },
  });
}
