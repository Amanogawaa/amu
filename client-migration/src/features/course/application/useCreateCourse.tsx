'use client';

import { queryKeys } from '@/lib/queryKeys';
import { showErrorToast } from '@/lib/errorHandling';
import { createCourse } from '@/server/features/course';
import { CreateCoursePayload } from '@/server/features/course/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { checkRateLimit, recordAttempt } from '@/utils/rateLimiter';

export default function useCreateCourse() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateCoursePayload) => {
      // Check rate limit before making request
      const rateLimitStatus = checkRateLimit();

      if (!rateLimitStatus.allowed) {
        throw new Error(
          rateLimitStatus.message ||
            'Rate limit exceeded. Please try again later.'
        );
      }

      const result = await createCourse(payload);

      // Record successful attempt
      recordAttempt();

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
