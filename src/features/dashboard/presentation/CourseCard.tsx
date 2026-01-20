"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Clock, Award, ChevronRight } from "lucide-react";

interface CourseCardProps {
  title: string;
  description: string;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  estimatedTime: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  category: string;
  isGenerated?: boolean;
}

export function CourseCard({
  title,
  description,
  progress,
  totalLessons,
  completedLessons,
  estimatedTime,
  difficulty,
  category,
  isGenerated = false,
}: CourseCardProps) {
  const difficultyColors = {
    Beginner:
      "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400",
    Intermediate:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400",
    Advanced: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400",
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-300 group">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <CardTitle className="text-lg group-hover:text-primary transition-colors">
              {title}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          </div>
          {isGenerated && (
            <Badge variant="secondary" className="shrink-0">
              Generated
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className={difficultyColors[difficulty]}>
            {difficulty}
          </Badge>
          <Badge variant="outline">{category}</Badge>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-semibold">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <BookOpen className="h-4 w-4" />
            <span>
              {completedLessons}/{totalLessons} lessons
            </span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{estimatedTime}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <Button
          className="w-full group/btn"
          variant={progress > 0 ? "default" : "outline"}
        >
          {progress > 0 ? "Continue Learning" : "Start Course"}
          <ChevronRight className="h-4 w-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
        </Button>
      </CardFooter>
    </Card>
  );
}
