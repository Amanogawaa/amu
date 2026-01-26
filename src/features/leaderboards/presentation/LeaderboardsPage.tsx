"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Trophy,
  Medal,
  Award,
  Flame,
  TrendingUp,
  BookOpen,
  GraduationCap,
} from "lucide-react";
import {
  useLeaderboards,
  useMyStats,
} from "@/features/leaderboards/application/useLeaderboards";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/features/auth/application/AuthContext";
import { useState } from "react";
import type { LeaderboardFilters } from "@/server/features/leaderboards/types";

export function LeaderboardsPage() {
  const { user } = useAuth();
  const [sortBy, setSortBy] = useState<LeaderboardFilters["sortBy"]>("score");
  const { data, isLoading, isError } = useLeaderboards({ limit: 50, sortBy });
  const { data: myStats } = useMyStats();

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Award className="h-6 w-6 text-amber-600" />;
      default:
        return null;
    }
  };

  const getRankBadge = (rank: number) => {
    if (rank <= 3) {
      const colors = {
        1: "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400 border-yellow-300",
        2: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-gray-300",
        3: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400 border-amber-300",
      };
      return colors[rank as keyof typeof colors];
    }
    return "";
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getSortIcon = (type: string) => {
    switch (type) {
      case "score":
        return <TrendingUp className="h-4 w-4" />;
      case "lessons":
        return <BookOpen className="h-4 w-4" />;
      case "courses":
        return <GraduationCap className="h-4 w-4" />;
      case "streak":
        return <Flame className="h-4 w-4" />;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 max-w-6xl">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-10 w-32" />
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
          <Card>
            <CardContent className="p-6 space-y-4">
              {Array.from({ length: 10 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="container mx-auto p-6 max-w-6xl">
        <Card>
          <CardContent className="p-12 text-center">
            <Trophy className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              Unable to load leaderboard
            </h3>
            <p className="text-muted-foreground">Please try again later</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const leaderboardData = data.data || [];

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Trophy className="h-8 w-8 text-yellow-500" />
              Leaderboard
            </h1>
            <p className="text-muted-foreground mt-1">
              See how you rank among other learners
            </p>
          </div>
        </div>

        {/* User Stats */}
        {myStats && (
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Your Rank</p>
                    <p className="text-2xl font-bold">#{myStats.rank || "—"}</p>
                  </div>
                  <Trophy className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total XP</p>
                    <p className="text-2xl font-bold">
                      {myStats.totalPoints.toLocaleString()}
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Current Streak
                    </p>
                    <p className="text-2xl font-bold">
                      {myStats.currentStreak} days
                    </p>
                  </div>
                  <Flame className="h-8 w-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Lessons</p>
                    <p className="text-2xl font-bold">
                      {myStats.totalLessonsCompleted}
                    </p>
                  </div>
                  <BookOpen className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Sorting Tabs */}
        <Card>
          <CardHeader>
            <Tabs
              value={sortBy}
              onValueChange={(v) => setSortBy(v as any)}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="score" className="flex items-center gap-2">
                  {getSortIcon("score")}
                  <span className="hidden sm:inline">XP</span>
                </TabsTrigger>
                <TabsTrigger
                  value="lessons"
                  className="flex items-center gap-2"
                >
                  {getSortIcon("lessons")}
                  <span className="hidden sm:inline">Lessons</span>
                </TabsTrigger>
                <TabsTrigger
                  value="courses"
                  className="flex items-center gap-2"
                >
                  {getSortIcon("courses")}
                  <span className="hidden sm:inline">Courses</span>
                </TabsTrigger>
                <TabsTrigger value="streak" className="flex items-center gap-2">
                  {getSortIcon("streak")}
                  <span className="hidden sm:inline">Streak</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent className="space-y-2">
            {leaderboardData.length === 0 ? (
              <div className="text-center py-12">
                <Trophy className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No leaderboard data yet</p>
              </div>
            ) : (
              leaderboardData.map((entry) => {
                const isCurrentUser = user?.uid === entry.userId;
                const isTopThree = entry.rank <= 3;

                return (
                  <div
                    key={entry.userId}
                    className={`flex items-center gap-4 p-4 rounded-lg transition-all ${
                      isCurrentUser
                        ? "bg-primary/10 border-2 border-primary/30 shadow-sm"
                        : isTopThree
                          ? `border-2 ${getRankBadge(entry.rank)}`
                          : "hover:bg-muted/50 border border-transparent"
                    }`}
                  >
                    {/* Rank */}
                    <div className="flex items-center justify-center w-12 h-12">
                      {getRankIcon(entry.rank) || (
                        <span className="text-lg font-bold text-muted-foreground">
                          #{entry.rank}
                        </span>
                      )}
                    </div>

                    {/* Avatar */}
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={entry.photoURL} alt={entry.userName} />
                      <AvatarFallback
                        className={isTopThree ? getRankBadge(entry.rank) : ""}
                      >
                        {getInitials(entry.userName)}
                      </AvatarFallback>
                    </Avatar>

                    {/* User Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate flex items-center gap-2">
                        {entry.userName}
                        {isCurrentUser && (
                          <Badge variant="default" className="text-xs">
                            You
                          </Badge>
                        )}
                      </p>
                      <div className="flex gap-3 text-xs text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          {entry.score.toLocaleString()} XP
                        </span>
                        <span className="flex items-center gap-1">
                          <Flame className="h-3 w-3" />
                          {entry.currentStreak} day streak
                        </span>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="hidden md:flex gap-4 text-sm">
                      <div className="text-center">
                        <p className="font-semibold">
                          {entry.lessonsCompleted}
                        </p>
                        <p className="text-xs text-muted-foreground">Lessons</p>
                      </div>
                      <div className="text-center">
                        <p className="font-semibold">
                          {entry.coursesCompleted}
                        </p>
                        <p className="text-xs text-muted-foreground">Courses</p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
