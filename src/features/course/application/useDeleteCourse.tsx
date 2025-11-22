import { deleteCourse } from '@/server/features/course';
import { useMutation } from '@tanstack/react-query';

export default function useDeleteCourse() {
  return useMutation({
    mutationKey: ['delete-course'],
    mutationFn: async (courseId: string) => {
      return await deleteCourse(courseId);
    },
  });
}
