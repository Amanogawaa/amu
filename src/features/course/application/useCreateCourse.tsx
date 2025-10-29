'use client';

import { createCourse } from '@/server/features/course';
import { CreateCoursePayload } from '@/server/features/course/types';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function useCreateCourse() {
  const router = useRouter();

  return useMutation({
    mutationFn: async (payload: CreateCoursePayload) => {
      await createCourse(payload);
    },

    onSuccess: () => {
      toast.success('Course created successfully!');
      router.push('/courses');
    },

    onError: (error) => {
      toast.error('Failed to create course. Please try again.');
      console.error('Error creating course:', error);
    },
  });
}
