"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award } from "lucide-react";

export function Leaderboard() {
  const leaderboardData = [
    {
      rank: 1,
      name: "Sarah Chen",
      avatar: "",
      xp: 3850,
      streak: 15,
      initials: "SC",
    },
    {
      rank: 2,
      name: "John Martinez",
      avatar: "",
      xp: 3420,
      streak: 12,
      initials: "JM",
    },
    {
      rank: 3,
      name: "Emma Wilson",
      avatar: "",
      xp: 3180,
      streak: 10,
      initials: "EW",
    },
    {
      rank: 4,
      name: "You",
      avatar: "",
      xp: 1250,
      streak: 7,
      initials: "ME",
      isCurrentUser: true,
    },
    {
      rank: 5,
      name: "Michael Brown",
      avatar: "",
      xp: 980,
      streak: 5,
      initials: "MB",
    },
  ];

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

  return (
    <Card className="h-fit sticky top-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {leaderboardData.map((user) => (
          <div
            key={user.rank}
            className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
              user.isCurrentUser
                ? "bg-primary/10 border border-primary/20"
                : "hover:bg-muted/50"
            }`}
          >
            <div className="flex items-center justify-center w-8">
              {getRankIcon(user.rank) || (
                <span className="text-sm font-semibold text-muted-foreground">
                  #{user.rank}
                </span>
              )}
            </div>

            <Avatar className="h-10 w-10">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className={getRankBadge(user.rank)}>
                {user.initials}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate">
                {user.name}
                {user.isCurrentUser && (
                  <Badge variant="secondary" className="ml-2 text-xs">
                    You
                  </Badge>
                )}
              </p>
              <p className="text-xs text-muted-foreground">
                {user.xp.toLocaleString()} XP • {user.streak} day streak
              </p>
            </div>
          </div>
        ))}

        <div className="pt-3 border-t">
          <p className="text-xs text-center text-muted-foreground">
            Keep learning to climb the ranks!
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
