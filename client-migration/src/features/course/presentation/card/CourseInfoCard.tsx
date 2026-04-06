"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  ClockIcon,
  BookIcon,
  LanguagesIcon,
  AwardIcon,
  BarChartIcon,
} from "lucide-react";

interface CourseInfoCardProps {
  duration: string;
  noOfChapters: number;
  language: string;
  level: string;
}

export const CourseInfoCard = ({
  duration,
  noOfChapters,
  language,
  level,
}: CourseInfoCardProps) => {
  const infoItems = [
    {
      icon: ClockIcon,
      label: "Duration",
      value: duration,
    },
    {
      icon: BookIcon,
      label: `${noOfChapters === 1 ? "Chapter" : "Chapters"}`,
      value: `${noOfChapters === undefined ? "N/A" : noOfChapters} ${
        noOfChapters === 1 ? "Chapter" : "Chapters"
      }`,
    },
    {
      icon: BarChartIcon,
      label: "Level",
      value: level.charAt(0).toUpperCase() + level.slice(1),
    },
    {
      icon: LanguagesIcon,
      label: "Language",
      value: language,
    },
  ];

  return (
    <Card className="mb-8">
      <CardContent className="pt-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {infoItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="flex flex-col items-center text-center p-3"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 mb-2">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <p className="text-xs text-muted-foreground mb-1">
                  {item.label}
                </p>
                <p className="text-sm font-semibold text-foreground">
                  {item.value}
                </p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
