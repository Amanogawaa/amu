import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { queryKeys } from '@/lib/queryKeys';
import {
  uploadCapstoneReviewImage,
  deleteCapstoneReviewImage,
} from '@/server/features/capstone';

export function useUploadCapstoneReviewImage() {
  const queryClient = useQueryClient();

  return useMutation<
    string,
    Error,
    { reviewId: string; file: File }
  >({
    mutationFn: ({ reviewId, file }) =>
      uploadCapstoneReviewImage(reviewId, file),
    onSuccess: (imageUrl, variables) => {
      toast.success('Image uploaded successfully!');

      // Invalidate review queries to refetch with new image
      queryClient.invalidateQueries({
        queryKey: queryKeys.capstone.reviews.detail(variables.reviewId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.capstone.reviews.lists(),
      });
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to upload image');
    },
  });
}

export function useDeleteCapstoneReviewImage() {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    Error,
    { reviewId: string; imageUrl: string }
  >({
    mutationFn: async ({ reviewId, imageUrl }) => {
      await deleteCapstoneReviewImage(reviewId, imageUrl);
    },
    onSuccess: (_, variables) => {
      toast.success('Image deleted successfully!');

      queryClient.invalidateQueries({
        queryKey: queryKeys.capstone.reviews.detail(variables.reviewId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.capstone.reviews.lists(),
      });
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete image');
    },
  });
}

