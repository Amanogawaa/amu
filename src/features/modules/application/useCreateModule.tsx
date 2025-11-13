import { queryKeys } from '@/lib/queryKeys';
import { showErrorToast } from '@/lib/errorHandling';
import { createModules } from '@/server/features/modules';
import { CreateModulePayload } from '@/server/features/modules/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function useCreateModules() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateModulePayload) => {
      await createModules(payload);
    },

    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.modules.list(variables.courseId),
      });

      toast.success('Modules generated successfully!');
      router.refresh();
    },

    onError: (error) => {
      showErrorToast(error, 'Failed to create modules. Please try again.');
    },
  });
}
