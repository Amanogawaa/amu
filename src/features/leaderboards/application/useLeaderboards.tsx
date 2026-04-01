"use client";

import { queryKeys } from "@/lib/queryKeys";
import { showErrorToast } from "@/lib/errorHandling";
import {
  getLeaderboards,
  getUserStats,
  getMyStats,
  updateStreak,
  getLeaderboardStats,
} from "@/server/features/leaderboards";
import type {
  LeaderboardFilters,
  LeaderboardEntry,
  UserStats,
  StreakData,
  UpdateStreakPayload,
} from "@/server/features/leaderboards/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useLeaderboards(filters?: LeaderboardFilters) {
  return useQuery({
    queryKey: queryKeys.leaderboards.list(filters),
    queryFn: async () => {
      const response = await getLeaderboards(filters);
      return response;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useMyStats(userId: string) {
  return useQuery<UserStats>({
    queryKey: queryKeys.leaderboards.myStats(),
    queryFn: async () => {
      const response = await getMyStats(userId);
      return response.data;
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

export function useUserStats(userId?: string) {
  return useQuery<UserStats>({
    queryKey: queryKeys.leaderboards.userStats(userId),
    queryFn: async () => {
      const response = await getUserStats(userId);
      return response.data;
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useLeaderboardStats() {
  return useQuery({
    queryKey: queryKeys.leaderboards.stats(),
    queryFn: async () => {
      const response = await getLeaderboardStats();
      return response.data;
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

export function useUpdateStreak() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload?: UpdateStreakPayload) => {
      const response = await updateStreak(payload);
      return response.data;
    },

    onSuccess: (data: StreakData) => {
      toast.success("Streak updated! 🔥");
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: queryKeys.leaderboards.all });
    },

    onError: (error) => {
      showErrorToast(error, "Failed to update streak. Please try again.");
    },
  });
}

/**
 * Hook to easily trigger streak updates from any component.
 * Automatically handles mutations and shows success/error toasts.
 *
 * Usage:
 * const trackStreak = useStreakTracker();
 * trackStreak(); // Updates streak for today
 * trackStreak(new Date('2024-01-01')); // Updates streak for specific date
 */
export function useStreakTracker() {
  const updateStreakMutation = useUpdateStreak();

  return (activityDate?: Date | string) => {
    const payload = activityDate ? { activityDate } : undefined;
    return updateStreakMutation.mutate(payload);
  };
}
