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

      queryClient.invalidateQueries({
        queryKey: queryKeys.capstone.likeStatus(submissionId),
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.capstone.submissions.detail(submissionId),
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.capstone.submissions.lists(),
      });
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update like status');
    },
  });
}
