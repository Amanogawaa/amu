'use client';

import { queryKeys } from '@/lib/queryKeys';
import { showErrorToast } from '@/lib/errorHandling';
import { createCourse } from '@/server/features/course';
import { CreateCoursePayload } from '@/server/features/course/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function useCreateCourse() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateCoursePayload) => {
      const result = await createCourse(payload);
      return result;
    },

    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.courses.all });
      toast.success('Course created successfully!');
      router.push(`/create/${data.data.id}`);
    },

    onError: (error) => {
      showErrorToast(error, 'Failed to create course. Please try again.');
    },
  });
}
