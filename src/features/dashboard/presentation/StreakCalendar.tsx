"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Flame } from "lucide-react";

export function StreakCalendar() {
  // Mock data for the last 30 days
  const days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    const isCompleted = Math.random() > 0.3; // Random completion
    return {
      date,
      completed: isCompleted,
      xp: isCompleted ? Math.floor(Math.random() * 100) + 50 : 0,
    };
  });

  const getDayName = (date: Date) => {
    return date.toLocaleDateString("en-US", { weekday: "short" });
  };

  const getIntensity = (xp: number) => {
    if (xp === 0) return "bg-muted";
    if (xp < 50) return "bg-green-200 dark:bg-green-900/40";
    if (xp < 100) return "bg-green-400 dark:bg-green-700/60";
    return "bg-green-600 dark:bg-green-500";
  };

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
              <p className="text-3xl font-bold">7 days</p>
              <p className="text-sm text-muted-foreground">Current streak</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-semibold text-orange-500">🔥</p>
              <p className="text-sm text-muted-foreground">Keep it up!</p>
            </div>
          </div>

          <div className="grid grid-cols-10 gap-1.5">
            {days.map((day, idx) => (
              <div
                key={idx}
                className={`aspect-square rounded-sm ${getIntensity(day.xp)} transition-colors cursor-pointer hover:ring-2 hover:ring-primary`}
                title={`${day.date.toLocaleDateString()}: ${day.xp} XP`}
              />
            ))}
          </div>

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
        </div>
      </CardContent>
    </Card>
  );
}
