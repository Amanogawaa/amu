import { logger } from '@/lib/loggers';
import { createChapter } from '@/server/features/chapters';
import { CreateChapterPayload } from '@/server/features/chapters/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function useCreateChapter() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateChapterPayload) => {
      await createChapter(payload);
    },

    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['chapters', variables.moduleId],
      });

      queryClient.invalidateQueries({
        queryKey: ['module', variables.moduleId],
      });

      toast.success('Chapter created successfully!');
      router.refresh();
    },

    onError: (error) => {
      toast.error('Failed to create chapter. Please try again.');
      logger.error('Error creating chapter:', error);
    },
  });
}
