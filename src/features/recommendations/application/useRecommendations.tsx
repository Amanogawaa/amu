"use client";

import { showErrorToast } from "@/lib/errorHandling";
import { queryKeys } from "@/lib/queryKeys";
import {
  getLearningContinuityRecommendations,
  getLikedBasedRecommendations,
  refreshRecommendations,
} from "@/server/features/recommendation";
import type { RefreshRecommendationsPayload } from "@/server/features/recommendation/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

/**
 * Hook to fetch learning continuity recommendations after completing a course
 */
export function useLearningContinuityRecommendations(
  courseId: string,
  enabled = true,
) {
  return useQuery({
    queryKey: queryKeys.recommendations.learningContinuity(courseId),
    queryFn: async () => {
      const response = await getLearningContinuityRecommendations({
        courseId,
      });
      return response.recommendations;
    },
    enabled: !!courseId && enabled,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

/**
 * Hook to fetch liked-based recommendations
 */
export function useLikedBasedRecommendations(enabled = true) {
  return useQuery({
    queryKey: queryKeys.recommendations.likedBased(),
    queryFn: async () => {
      const response = await getLikedBasedRecommendations();
      console.log("Liked-based recommendations response:", response);
      return response.recommendations;
    },
    enabled,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

/**
 * Hook to refresh recommendation cache
 */
export function useRefreshRecommendations() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: RefreshRecommendationsPayload) => {
      const response = await refreshRecommendations(payload);
      return response.data;
    },

    onSuccess: (data) => {
      toast.success("Recommendations refreshed!");
      // Invalidate all recommendation queries
      queryClient.invalidateQueries({
        queryKey: queryKeys.recommendations.all,
      });
    },

    onError: (error) => {
      showErrorToast(
        error,
        "Failed to refresh recommendations. Please try again.",
      );
    },
  });
}
