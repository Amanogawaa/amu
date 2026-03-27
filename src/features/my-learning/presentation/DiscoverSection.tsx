"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Navigation, Compass } from "lucide-react";
import { RecommendationList } from "@/features/recommendations/presentation/RecommendationList";

interface DiscoverSectionProps {
  courseId?: string;
  showContinuityPath?: boolean;
  showExplore?: boolean;
}

export function DiscoverSection({
  courseId,
  showContinuityPath = true,
  showExplore = true,
}: DiscoverSectionProps) {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-foreground">
              Continue Discovering
            </h2>
            <p className="text-muted-foreground">
              Personalized recommendations based on your learning journey
            </p>
          </div>
        </div>
      </div>

      {/* Recommendations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Continue Your Path */}
        {showContinuityPath && courseId && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Navigation className="w-5 h-5 text-blue-500" />
              <h3 className="text-lg font-semibold">Continue Your Path</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Pick up where you left off with courses that build on what you've
              learned
            </p>
            <RecommendationList
              type="learning-continuity"
              courseId={courseId}
              context="dashboard"
              className="grid-cols-1 sm:grid-cols-2"
            />
          </div>
        )}

        {/* Explore Your Interests */}
        {showExplore && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-amber-500" />
              <h3 className="text-lg font-semibold">Explore Your Interests</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Discover new courses based on what you've liked and enjoyed
              learning about
            </p>
            <RecommendationList
              type="liked-based"
              context="dashboard"
              className="grid-cols-1 sm:grid-cols-2"
            />
          </div>
        )}
      </div>

      {/* Empty State Message */}
      {!courseId && !showExplore && (
        <Card className="bg-muted/50">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              Start learning to get personalized recommendations!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
