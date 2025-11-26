import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { queryKeys } from '@/lib/queryKeys';
import {
  uploadCapstoneScreenshot,
  deleteCapstoneScreenshot,
} from '@/server/features/capstone';

export function useUploadCapstoneScreenshot() {
  const queryClient = useQueryClient();

  return useMutation<
    string,
    Error,
    { submissionId: string; file: File }
  >({
    mutationFn: ({ submissionId, file }) =>
      uploadCapstoneScreenshot(submissionId, file),
    onSuccess: (screenshotUrl, variables) => {
      toast.success('Screenshot uploaded successfully!');

      // Invalidate submission queries to refetch with new screenshot
      queryClient.invalidateQueries({
        queryKey: queryKeys.capstone.submissions.detail(variables.submissionId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.capstone.submissions.lists(),
      });
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to upload screenshot');
    },
  });
}

export function useDeleteCapstoneScreenshot() {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    Error,
    { submissionId: string; screenshotUrl: string }
  >({
    mutationFn: async ({ submissionId, screenshotUrl }) => {
      await deleteCapstoneScreenshot(submissionId, screenshotUrl);
    },
    onSuccess: (_, variables) => {
      toast.success('Screenshot deleted successfully!');

      queryClient.invalidateQueries({
        queryKey: queryKeys.capstone.submissions.detail(variables.submissionId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.capstone.submissions.lists(),
      });
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete screenshot');
    },
  });
}

