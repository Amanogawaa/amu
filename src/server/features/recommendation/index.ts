import apiRequest from "@/server/helpers/apiRequest";
import type {
  RecommendationResponse,
  RefreshRecommendationsPayload,
  RefreshRecommendationsResponse,
  GetLearningContinuityParams,
  GetLikedBasedParams,
} from "./types";

/**
 * Get course recommendations after completing a course (learning continuity)
 * @param courseId - ID of the completed course
 * @param limit - Maximum number of recommendations to return (default: 10)
 */
export async function getLearningContinuityRecommendations({
  courseId,
  limit = 10,
}: GetLearningContinuityParams): Promise<RecommendationResponse> {
  return apiRequest<null, RecommendationResponse>(
    `/learning-continuity/${courseId}`,
    "get",
  );
}

/**
 * Get course recommendations based on liked courses
 * @param limit - Maximum number of recommendations to return (default: 10)
 */
export async function getLikedBasedRecommendations(): Promise<RecommendationResponse> {
  return apiRequest<null, RecommendationResponse>(`/liked-based`, "get");
}

/**
 * Refresh the recommendation cache for the user
 * @param payload - Refresh parameters including type and optional courseId
 */
export async function refreshRecommendations(
  payload: RefreshRecommendationsPayload,
): Promise<RefreshRecommendationsResponse> {
  return apiRequest<
    RefreshRecommendationsPayload,
    RefreshRecommendationsResponse
  >("/refresh", "post", payload);
}
