export interface LeaderboardEntry {
  userId: string;
  userName: string;
  photoURL?: string;
  score: number;
  rank: number;
  lessonsCompleted: number;
  coursesCompleted: number;
  currentStreak: number;
  longestStreak: number;
  lastActiveAt?: Date | string;
}

export interface LeaderboardFilters {
  limit?: number;
  period?: "all-time" | "monthly" | "weekly";
  sortBy?: "score" | "lessons" | "courses" | "streak";
}

export interface LeaderboardResponse {
  data: LeaderboardEntry[];
  message: string;
  total: number;
  userRank?: number;
  currentPage?: number;
  totalPages?: number;
}

export interface UserStats {
  totalLessonsCompleted: number;
  totalCoursesCompleted: number;
  totalPoints: number;
  currentStreak: number;
  longestStreak: number;
  lastActiveAt?: Date | string;
  streakStartDate?: Date | string;
  rank?: number;
}

export interface UserStatsResponse {
  data: UserStats;
  message: string;
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastActiveAt: Date | string;
  streakStartDate: Date | string;
}

export interface StreakResponse {
  data: StreakData;
  message: string;
}

export interface LeaderboardStatsResponse {
  data: {
    totalUsers: number;
    totalLessonsCompleted: number;
    totalCoursesCompleted: number;
  };
  message: string;
}

export interface UpdateStreakPayload {
  activityDate?: Date | string;
}
