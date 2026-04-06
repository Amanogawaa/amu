"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LikeButton } from "@/features/likes/presentation/LikeButton";
import type { RecommendationWithCourse } from "@/server/features/recommendation/types";
import { ArrowRight, Zap } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/features/auth/application/AuthContext";

interface RecommendationCardProps {
  recommendation: RecommendationWithCourse;
}

export function RecommendationCard({
  recommendation,
}: RecommendationCardProps) {
  const { user } = useAuth();
  const course = recommendation.course;

  const levelColors = {
    beginner:
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 capitalize",
    intermediate:
      "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 capitalize",
    advanced:
      "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 capitalize",
  };

  const isOwner = user?.uid === course.authorId;

  return (
    <Card className="flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-300 w-full ">
      {course.thumbnailUrl && (
        <div className="relative h-48 overflow-hidden bg-gray-200 dark:bg-gray-800">
          <img
            src={course.thumbnailUrl}
            alt={course.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

          {/* Score Badge */}
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-yellow-400/90 text-yellow-900 px-2 py-1 rounded-full text-sm font-semibold">
            <Zap size={16} />
            {(recommendation.score * 100).toFixed(0)}%
          </div>
        </div>
      )}

      <CardHeader className="pb-3">
        <div className="space-y-2">
          <CardTitle className="line-clamp-2 text-lg">{course.name}</CardTitle>
          <CardDescription className="line-clamp-2">
            {course.description}
          </CardDescription>
        </div>
        <div className="flex flex-wrap gap-2 pt-2">
          <Badge
            variant="secondary"
            className={
              levelColors[course.level as keyof typeof levelColors] ||
              levelColors.beginner
            }
          >
            {course.level}
          </Badge>
          <Badge variant="outline" className="capitalize">
            {course.category}
          </Badge>
          {recommendation.metadata.isSequentialNext && (
            <Badge
              variant="default"
              className="bg-amber-500/80 hover:bg-amber-500"
            >
              Next in Sequence
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 pb-3">
        <div className="space-y-2 text-sm">
          <div className="text-muted-foreground">{recommendation.reason}</div>

          {recommendation.metadata.topicSimilarity && (
            <div className="text-xs text-muted-foreground">
              Topic Similarity:{" "}
              {(recommendation.metadata.topicSimilarity * 100).toFixed(0)}%
            </div>
          )}

          {recommendation.metadata.difficultyProgression && (
            <div className="text-xs text-blue-600 dark:text-blue-400">
              ✓ Good difficulty progression
            </div>
          )}

          <div className="flex items-center justify-between pt-3 text-xs text-muted-foreground">
            {course.enrollmentCount !== undefined && (
              <span>{course.enrollmentCount.toLocaleString()} enrollments</span>
            )}
            {course.likesCount !== undefined && (
              <span>{course.likesCount} likes</span>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-3 flex gap-2">
        <Button variant="default" size="sm" className="flex-1" asChild>
          <Link href={`/courses/${course.courseId}`}>
            View Course
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
        <LikeButton courseId={course.name} />
      </CardFooter>
    </Card>
  );
}
