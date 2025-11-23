import { deleteCourse } from '@/server/features/course';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function useDeleteCourse() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationKey: ['delete-course'],
    mutationFn: async (courseId: string) => {
      return await deleteCourse(courseId);
    },
    onSuccess: (data, courseId) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.courses.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.modules.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.chapters.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.lessons.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.progress.all });

      queryClient.removeQueries({
        queryKey: queryKeys.courses.detail(courseId),
      });

      toast.success('Course deleted successfully');

      router.push('/courses');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to delete course');
    },
  });
}
