import apiRequest from "@/server/helpers/apiRequest";
import type {
  LeaderboardResponse,
  LeaderboardFilters,
  UserStatsResponse,
  StreakResponse,
  UpdateStreakPayload,
  LeaderboardStatsResponse,
} from "./types";

export async function getLeaderboards(
  filters?: LeaderboardFilters,
): Promise<LeaderboardResponse> {
  const params = new URLSearchParams();

  if (filters) {
    if (filters.limit !== undefined) {
      params.append("limit", filters.limit.toString());
    }
    if (filters.period) {
      params.append("period", filters.period);
    }
    if (filters.sortBy) {
      params.append("sortBy", filters.sortBy);
    }
  }

  const queryString = params.toString();
  const endpoint = queryString ? `?${queryString}` : "";

  return apiRequest<null, LeaderboardResponse>(endpoint, "get");
}

export async function getUserStats(
  userId?: string,
): Promise<UserStatsResponse> {
  const endpoint = userId ? `/user/${userId}` : "/user";

  return apiRequest<null, UserStatsResponse>(endpoint, "get");
}

export async function getMyStats(userId: string): Promise<UserStatsResponse> {
  return apiRequest<null, UserStatsResponse>(`/my-stats/${userId}`, "get");
}

export async function updateStreak(
  payload?: UpdateStreakPayload,
): Promise<StreakResponse> {
  return apiRequest<UpdateStreakPayload, StreakResponse>(
    "/streak",
    "post",
    payload || {},
  );
}

export async function getLeaderboardStats(): Promise<LeaderboardStatsResponse> {
  return apiRequest<null, LeaderboardStatsResponse>("/stats", "get");
}
