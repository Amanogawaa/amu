"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Sparkles, BookMarked, TrendingUp } from "lucide-react";

export function QuickActions() {
  const actions = [
    {
      label: "Generate Course",
      icon: Sparkles,
      variant: "default" as const,
      description: "Create a new AI-powered course",
    },
    {
      label: "Browse Courses",
      icon: BookMarked,
      variant: "outline" as const,
      description: "Explore available courses",
    },
    {
      label: "View Progress",
      icon: TrendingUp,
      variant: "outline" as const,
      description: "Check your learning stats",
    },
  ];

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="font-semibold text-lg mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <Button
                key={action.label}
                variant={action.variant}
                className="h-auto flex-col items-start py-4 px-4 gap-2"
              >
                <Icon className="h-5 w-5" />
                <div className="text-left">
                  <p className="font-semibold text-sm">{action.label}</p>
                  <p className="text-xs text-muted-foreground font-normal">
                    {action.description}
                  </p>
                </div>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
