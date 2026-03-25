"use client";

import { Empty } from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import type { RecommendationWithCourse } from "@/server/features/recommendation/types";
import {
  useLearningContinuityRecommendations,
  useLikedBasedRecommendations,
} from "../application/useRecommendations";
import { RecommendationCard } from "./cards/RecommendationCard";

interface RecommendationListProps {
  type: "learning-continuity" | "liked-based";
  courseId?: string;
  limit?: number;
  context?: "learn" | "dashboard";
  className?: string;
}

export function RecommendationList({
  type,
  courseId,
  limit = 10,
  context = "learn",
  className = "",
}: RecommendationListProps) {
  const learnQuery = useLearningContinuityRecommendations(
    courseId || "",
    limit,
    type === "learning-continuity" && !!courseId,
  );
  const likedQuery = useLikedBasedRecommendations(type === "liked-based");

  const {
    data: recommendations,
    isLoading,
    error,
  } = type === "learning-continuity" ? learnQuery : likedQuery;

  console.log(recommendations);

  if (isLoading) {
    return (
      <div
        className={`grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 ${className}`}
      >
        {Array.from({ length: limit }).map((_, i) => (
          <Skeleton key={i} className="h-96 rounded-lg" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Empty
        title="Error loading recommendations"
        // description="We encountered an error while loading recommendations. Please try again later."
      />
    );
  }

  if (!recommendations || recommendations.length === 0) {
    return (
      <Empty
        title="No recommendations found"
        // description={
        //   type === "learning-continuity"
        //     ? "Complete more courses to get personalized recommendations."
        //     : "Like more courses to get personalized recommendations."
        // }
      />
    );
  }

  return (
    <div className={`w-full ${className}`}>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full h-full">
        {recommendations.map((recommendation) => (
          <RecommendationCard
            key={recommendation.courseId}
            recommendation={recommendation}
            context={context}
          />
        ))}
      </div>
    </div>
  );
}
