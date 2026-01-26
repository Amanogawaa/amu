"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award } from "lucide-react";
import { useLeaderboards } from "@/features/leaderboards/application/useLeaderboards";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/features/auth/application/AuthContext";

export function Leaderboard() {
  const { user } = useAuth();
  const { data, isLoading, isError } = useLeaderboards({
    limit: 10,
    sortBy: "score",
  });

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Award className="h-5 w-5 text-amber-600" />;
      default:
        return null;
    }
  };

  const getRankBadge = (rank: number) => {
    if (rank <= 3) {
      const colors = {
        1: "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400",
        2: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
        3: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
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

  if (isLoading) {
    return (
      <Card className="h-fit sticky top-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (isError || !data) {
    return (
      <Card className="h-fit sticky top-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-4">
            Unable to load leaderboard
          </p>
        </CardContent>
      </Card>
    );
  }

  const leaderboardData = data.data || [];

  return (
    <Card className="h-fit sticky top-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {leaderboardData.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No leaderboard data yet
          </p>
        ) : (
          <>
            {leaderboardData.map((entry) => {
              const isCurrentUser = user?.uid === entry.userId;
              return (
                <div
                  key={entry.userId}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                    isCurrentUser
                      ? "bg-primary/10 border border-primary/20"
                      : "hover:bg-muted/50"
                  }`}
                >
                  <div className="flex items-center justify-center w-8">
                    {getRankIcon(entry.rank) || (
                      <span className="text-sm font-semibold text-muted-foreground">
                        #{entry.rank}
                      </span>
                    )}
                  </div>

                  <Avatar className="h-10 w-10">
                    <AvatarImage src={entry.photoURL} alt={entry.userName} />
                    <AvatarFallback className={getRankBadge(entry.rank)}>
                      {getInitials(entry.userName)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">
                      {entry.userName}
                      {isCurrentUser && (
                        <Badge variant="secondary" className="ml-2 text-xs">
                          You
                        </Badge>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {entry.score.toLocaleString()} XP • {entry.currentStreak}{" "}
                      day streak
                    </p>
                  </div>
                </div>
              );
            })}

            <div className="pt-3 border-t">
              <p className="text-xs text-center text-muted-foreground">
                {data.userRank && data.userRank > 10 && (
                  <>Your rank: #{data.userRank} • </>
                )}
                Keep learning to climb the ranks!
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
