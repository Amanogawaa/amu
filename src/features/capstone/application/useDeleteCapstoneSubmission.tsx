import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { queryKeys } from '@/lib/queryKeys';
import { deleteCapstoneSubmission } from '@/server/features/capstone';

export function useDeleteCapstoneSubmission() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: deleteCapstoneSubmission,
    onSuccess: (_, submissionId) => {
      toast.success('Capstone project deleted successfully');

      // Invalidate specific submission
      queryClient.invalidateQueries({
        queryKey: queryKeys.capstone.submissions.detail(submissionId),
      });

      // Invalidate submissions lists
      queryClient.invalidateQueries({
        queryKey: queryKeys.capstone.submissions.lists(),
      });
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete capstone project');
    },
  });
}
