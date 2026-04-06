"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Flame, Target, BookOpen } from "lucide-react";

export function DashboardStats() {
  const stats = [
    {
      label: "Total XP",
      value: "1,250",
      icon: Trophy,
      color: "text-yellow-500",
      bgColor: "bg-yellow-50 dark:bg-yellow-950/30",
    },
    {
      label: "Day Streak",
      value: "7",
      icon: Flame,
      color: "text-orange-500",
      bgColor: "bg-orange-50 dark:bg-orange-950/30",
    },
    {
      label: "Courses Enrolled",
      value: "4",
      icon: BookOpen,
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-950/30",
    },
    {
      label: "Completed",
      value: "2",
      icon: Target,
      color: "text-green-500",
      bgColor: "bg-green-50 dark:bg-green-950/30",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card
            key={stat.label}
            className="shadow-sm hover:shadow-md transition-shadow"
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`${stat.bgColor} p-2.5 rounded-lg`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
