import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { queryKeys } from '@/lib/queryKeys';
import { createCapstoneSubmission } from '@/server/features/capstone';
import type {
  CreateCapstoneSubmissionPayload,
  CapstoneSubmissionResponse,
} from '@/server/features/capstone/types';

export function useCreateCapstoneSubmission() {
  const queryClient = useQueryClient();

  return useMutation<
    CapstoneSubmissionResponse,
    Error,
    CreateCapstoneSubmissionPayload
  >({
    mutationFn: createCapstoneSubmission,
    onSuccess: (data) => {
      toast.success('Capstone project submitted successfully!');

      // Invalidate submissions list
      queryClient.invalidateQueries({
        queryKey: queryKeys.capstone.submissions.lists(),
      });

      // Invalidate course-specific submissions
      queryClient.invalidateQueries({
        queryKey: queryKeys.capstone.submissions.list({
          courseId: data.data.courseId,
        }),
      });

      // Invalidate user's submissions
      queryClient.invalidateQueries({
        queryKey: queryKeys.capstone.submissions.list({
          userId: data.data.userId,
        }),
      });
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to submit capstone project');
    },
  });
}
