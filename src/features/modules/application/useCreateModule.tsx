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
      console.log('Modules created successfully:', data);
      queryClient.invalidateQueries({
        queryKey: ['modules', variables.courseId],
      });

      queryClient.invalidateQueries({
        queryKey: ['course', variables.courseId],
      });
      toast.success('Modules generated successfully!');
      router.refresh();
    },

    onError: (error) => {
      toast.error('Failed to create modules. Please try again.');
      console.error('Error creating modules:', error);
    },
  });
}
