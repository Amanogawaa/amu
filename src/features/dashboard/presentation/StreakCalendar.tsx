"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Flame } from "lucide-react";
import { useMyStats } from "@/features/leaderboards/application/useLeaderboards";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export function StreakCalendar() {
  const { data: stats, isLoading } = useMyStats();

  const getIntensity = (xp: number) => {
    if (xp === 0) return "bg-muted";
    if (xp < 100) return "bg-green-200 dark:bg-green-900/40";
    if (xp < 300) return "bg-green-400 dark:bg-green-700/60";
    return "bg-green-600 dark:bg-green-500";
  };

  const getStreakMessage = (streak: number) => {
    if (streak === 0) return "Start your streak!";
    if (streak === 1) return "Great start!";
    if (streak < 7) return "Keep it up!";
    if (streak < 30) return "You're on fire! 🔥";
    return "Unstoppable!";
  };

  const generateCalendarDays = () => {
    return Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      const isToday = i === 29;
      const isRecent = i >= 29 - (stats?.currentStreak || 0);
      return {
        date,
        xp: isRecent && stats?.currentStreak ? (isToday ? 200 : 150) : 0,
      };
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-orange-500" />
            Daily Streak
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Skeleton className="h-10 w-24 mb-2" />
                <Skeleton className="h-4 w-32" />
              </div>
              <div className="text-right">
                <Skeleton className="h-8 w-8 mb-2" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
            <div className="grid grid-cols-10 gap-1.5">
              {Array.from({ length: 30 }).map((_, idx) => (
                <Skeleton key={idx} className="aspect-square rounded-sm" />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const currentStreak = stats?.currentStreak || 0;
  const longestStreak = stats?.longestStreak || 0;
  const totalXP = stats?.totalPoints || 0;
  const days = generateCalendarDays();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Flame className="h-5 w-5 text-orange-500" />
          Daily Streak
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Streak Stats */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold">
                {currentStreak} {currentStreak === 1 ? "day" : "days"}
              </p>
              <p className="text-sm text-muted-foreground">Current streak</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-semibold text-orange-500">
                {currentStreak > 0 ? "🔥" : "💤"}
              </p>
              <p className="text-sm text-muted-foreground">
                {getStreakMessage(currentStreak)}
              </p>
            </div>
          </div>

          {/* Additional Stats */}
          <div className="flex gap-4 text-sm">
            <div className="flex-1">
              <p className="text-muted-foreground">Longest</p>
              <p className="font-semibold">{longestStreak} days</p>
            </div>
            <div className="flex-1">
              <p className="text-muted-foreground">Total XP</p>
              <p className="font-semibold">{totalXP.toLocaleString()}</p>
            </div>
          </div>

          {/* Activity Calendar */}
          <div className="grid grid-cols-10 gap-1.5">
            {days.map((day, idx) => (
              <div
                key={idx}
                className={`aspect-square rounded-sm ${getIntensity(day.xp)} transition-colors cursor-pointer hover:ring-2 hover:ring-primary`}
                title={`${day.date.toLocaleDateString()}: ${day.xp} XP`}
              />
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Less</span>
            <div className="flex gap-1">
              <div className="w-3 h-3 rounded-sm bg-muted" />
              <div className="w-3 h-3 rounded-sm bg-green-200 dark:bg-green-900/40" />
              <div className="w-3 h-3 rounded-sm bg-green-400 dark:bg-green-700/60" />
              <div className="w-3 h-3 rounded-sm bg-green-600 dark:bg-green-500" />
            </div>
            <span>More</span>
          </div>

          {/* Lessons & Courses Completed */}
          {/* <div className="pt-3 border-t flex gap-2">
            <Badge variant="outline" className="flex-1 justify-center">
              📚 {stats?.totalLessonsCompleted || 0} lessons
            </Badge>
            <Badge variant="outline" className="flex-1 justify-center">
              🎓 {stats?.totalCoursesCompleted || 0} courses
            </Badge>
          </div> */}
        </div>
      </CardContent>
    </Card>
  );
}
