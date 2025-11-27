import { useMutation, useQueryClient } from '@tanstack/react-query';
import { generateCapstoneGuideline } from '@/server/features/capstone';
import { queryKeys } from '@/lib/queryKeys';
import { toast } from 'sonner';

export function useGenerateCapstone() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (courseId: string) => generateCapstoneGuideline(courseId),
    onSuccess: (data, courseId) => {
      toast.success('Capstone project generated successfully!');
      queryClient.invalidateQueries({
        queryKey: queryKeys.capstone.guidelineByCourse(courseId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.courses.validation(courseId),
      });
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Failed to generate capstone project';
      toast.error(errorMessage);
    },
  });
}
