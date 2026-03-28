export type Recommendation = {
  courseId: string;
  score: number;
  reason: string;
  metadata: {
    isSequentialNext?: boolean;
    topicSimilarity?: number;
    tagOverlap?: number;
    difficultyProgression?: boolean;
    enrollmentCount?: number;
  };
};

export type RecommendationCourse = {
  courseId: string;
  name: string;
  topic: string;
  level: string;
  description: string;
  category: string;
  thumbnailUrl?: string;
  authorId: string;
  enrollmentCount?: number;
  likesCount?: number;
};

export type RecommendationWithCourse = Recommendation & {
  course: RecommendationCourse;
};

export type RecommendationType =
  | "learning-continuity"
  | "liked-based"
  | "general";

export type RecommendationResponse = {
  recommendations: RecommendationWithCourse[];
  type: RecommendationType;
  generatedAt: string;
  fromCache: boolean;
  message: string;
};

export type RefreshRecommendationsPayload = {
  type: RecommendationType;
  courseId?: string;
};

export type RefreshRecommendationsResponse = {
  data: {
    message: string;
    type: RecommendationType;
    courseId: string | null;
  };
  message: string;
};
