import { logger } from '@/lib/loggers';
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
        queryKey: ['modules', variables.courseId],
      });

      toast.success('Modules generated successfully!');
      router.refresh();
    },

    onError: (error) => {
      toast.error('Failed to create modules. Please try again.');
      logger.error('Error creating modules:', error);
    },
  });
}
