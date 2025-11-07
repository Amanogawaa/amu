'use client';

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
      await createCourse(payload);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast.success('Course created successfully!');
      router.push('/courses');
    },

    onError: (error) => {
      toast.error('Failed to create course. Please try again.');
      console.error('Error creating course:', error);
    },
  });
}
