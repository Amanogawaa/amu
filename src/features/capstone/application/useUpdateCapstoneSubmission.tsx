import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { queryKeys } from '@/lib/queryKeys';
import { updateCapstoneSubmission } from '@/server/features/capstone';
import type {
  UpdateCapstoneSubmissionPayload,
  CapstoneSubmissionResponse,
} from '@/server/features/capstone/types';

interface UpdateCapstoneSubmissionVariables {
  id: string;
  payload: UpdateCapstoneSubmissionPayload;
}

export function useUpdateCapstoneSubmission() {
  const queryClient = useQueryClient();

  return useMutation<
    CapstoneSubmissionResponse,
    Error,
    UpdateCapstoneSubmissionVariables
  >({
    mutationFn: ({ id, payload }) => updateCapstoneSubmission(id, payload),
    onSuccess: (data, variables) => {
      toast.success('Capstone project updated successfully!');

      // Invalidate specific submission
      queryClient.invalidateQueries({
        queryKey: queryKeys.capstone.submissions.detail(variables.id),
      });

      // Invalidate submissions lists
      queryClient.invalidateQueries({
        queryKey: queryKeys.capstone.submissions.lists(),
      });
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update capstone project');
    },
  });
}
