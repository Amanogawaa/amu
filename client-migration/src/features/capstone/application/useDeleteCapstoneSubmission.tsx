import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { queryKeys } from '@/lib/queryKeys';
import { deleteCapstoneSubmission } from '@/server/features/capstone';
import { useRouter } from 'next/navigation';

export function useDeleteCapstoneSubmission() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation<void, Error, string>({
    mutationFn: deleteCapstoneSubmission,
    onSuccess: (_, submissionId) => {
      toast.success('Capstone project deleted successfully');

      queryClient.invalidateQueries({
        queryKey: queryKeys.capstone.submissions.detail(submissionId),
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.capstone.submissions.lists(),
      });

      router.push('/explore');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete capstone project');
    },
  });
}
