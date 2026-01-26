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
  const endpoint = queryString
    ? `/leaderboards?${queryString}`
    : "/leaderboards";

  return apiRequest<null, LeaderboardResponse>(endpoint, "get");
}

export async function getUserStats(
  userId?: string,
): Promise<UserStatsResponse> {
  const endpoint = userId
    ? `/leaderboards/user/${userId}`
    : "/leaderboards/user";

  return apiRequest<null, UserStatsResponse>(endpoint, "get");
}

export async function getMyStats(): Promise<UserStatsResponse> {
  return apiRequest<null, UserStatsResponse>("/leaderboards/user", "get");
}

export async function updateStreak(
  payload?: UpdateStreakPayload,
): Promise<StreakResponse> {
  return apiRequest<UpdateStreakPayload, StreakResponse>(
    "/leaderboards/streak",
    "post",
    payload || {},
  );
}

export async function getLeaderboardStats(): Promise<LeaderboardStatsResponse> {
  return apiRequest<null, LeaderboardStatsResponse>(
    "/leaderboards/stats",
    "get",
  );
}
