import apiRequest from "@/server/helpers/apiRequest";
import {
  CapstoneGuideline,
  CapstoneSubmissionResponse,
  CapstoneSubmissionsListResponse,
  CapstoneReviewResponse,
  CapstoneReviewsListResponse,
  CapstoneLikeToggleResponse,
  CreateCapstoneSubmissionPayload,
  UpdateCapstoneSubmissionPayload,
  CreateCapstoneReviewPayload,
  UpdateCapstoneReviewPayload,
  CapstoneSubmissionFilters,
  CapstoneReviewFilters,
} from "./types";
import normalizeCapstoneGuideline from "@/utils/transform";

// ==================== CAPSTONE GUIDELINES ====================

export async function generateCapstoneGuideline(
  courseId: string,
): Promise<CapstoneGuideline> {
  const data = await apiRequest<null, any>(
    `guidelines/generate/${courseId}`,
    "post",
  );
  return normalizeCapstoneGuideline(data);
}

export async function getCapstoneGuidelineByCourseId(
  courseId: string,
): Promise<CapstoneGuideline> {
  const data = await apiRequest<null, any>(
    `guidelines/course/${courseId}`,
    "get",
  );
  return normalizeCapstoneGuideline(data);
}

export async function getCapstoneGuidelineById(
  id: string,
): Promise<CapstoneGuideline> {
  const data = await apiRequest<null, any>(`guidelines/${id}`, "get");
  return normalizeCapstoneGuideline(data);
}

// ==================== CAPSTONE SUBMISSIONS ====================

export async function createCapstoneSubmission(
  payload: CreateCapstoneSubmissionPayload,
): Promise<CapstoneSubmissionResponse> {
  return apiRequest<
    CreateCapstoneSubmissionPayload,
    CapstoneSubmissionResponse
  >("submissions", "post", payload);
}

export async function getCapstoneSubmissions(
  filters?: CapstoneSubmissionFilters,
): Promise<CapstoneSubmissionsListResponse> {
  const params = new URLSearchParams();

  if (filters) {
    if (filters.courseId) params.append("courseId", filters.courseId);
    if (filters.userId) params.append("userId", filters.userId);
    if (filters.sortBy) params.append("sortBy", filters.sortBy);
    if (filters.limit) params.append("limit", filters.limit.toString());
    if (filters.offset) params.append("offset", filters.offset.toString());
  }

  const queryString = params.toString();
  const url = `submissions${queryString ? `?${queryString}` : ""}`;

  return apiRequest<null, CapstoneSubmissionsListResponse>(url, "get");
}

export async function getCapstoneSubmissionById(
  id: string,
): Promise<CapstoneSubmissionResponse> {
  return apiRequest<null, CapstoneSubmissionResponse>(
    `submissions/${id}`,
    "get",
  );
}

export async function updateCapstoneSubmission(
  id: string,
  payload: UpdateCapstoneSubmissionPayload,
): Promise<CapstoneSubmissionResponse> {
  return apiRequest<
    UpdateCapstoneSubmissionPayload,
    CapstoneSubmissionResponse
  >(`submissions/${id}`, "put", payload);
}

export async function deleteCapstoneSubmission(id: string): Promise<void> {
  return apiRequest<null, void>(`submissions/${id}`, "delete");
}

// ==================== CAPSTONE REVIEWS ====================

export async function createCapstoneReview(
  payload: CreateCapstoneReviewPayload,
): Promise<CapstoneReviewResponse> {
  return apiRequest<CreateCapstoneReviewPayload, CapstoneReviewResponse>(
    "reviews",
    "post",
    payload,
  );
}

export async function getCapstoneReviews(
  filters?: CapstoneReviewFilters,
): Promise<CapstoneReviewsListResponse> {
  const params = new URLSearchParams();

  if (filters) {
    if (filters.capstoneSubmissionId)
      params.append("capstoneSubmissionId", filters.capstoneSubmissionId);
    if (filters.reviewerId) params.append("reviewerId", filters.reviewerId);
    // Handle parentReviewId: null means top-level reviews, undefined means don't filter
    if (filters.parentReviewId !== undefined) {
      if (filters.parentReviewId === null) {
        // Send empty string to indicate we want null parent reviews
        params.append("parentReviewId", "");
      } else if (filters.parentReviewId) {
        params.append("parentReviewId", filters.parentReviewId);
      }
    }
    if (filters.limit) params.append("limit", filters.limit.toString());
    if (filters.offset) params.append("offset", filters.offset.toString());
  }

  const queryString = params.toString();
  const url = `reviews${queryString ? `?${queryString}` : ""}`;

  return apiRequest<null, CapstoneReviewsListResponse>(url, "get");
}

export async function getCapstoneReviewById(
  id: string,
): Promise<CapstoneReviewResponse> {
  return apiRequest<null, CapstoneReviewResponse>(`reviews/${id}`, "get");
}

export async function updateCapstoneReview(
  id: string,
  payload: UpdateCapstoneReviewPayload,
): Promise<CapstoneReviewResponse> {
  return apiRequest<UpdateCapstoneReviewPayload, CapstoneReviewResponse>(
    `reviews/${id}`,
    "put",
    payload,
  );
}

export async function deleteCapstoneReview(id: string): Promise<void> {
  return apiRequest<null, void>(`reviews/${id}`, "delete");
}

// ==================== CAPSTONE LIKES ====================

export async function toggleCapstoneLike(
  id: string,
): Promise<CapstoneLikeToggleResponse> {
  return apiRequest<null, CapstoneLikeToggleResponse>(
    `submissions/${id}/like`,
    "post",
  );
}

export async function getCapstoneLikeStatus(
  id: string,
): Promise<CapstoneLikeToggleResponse> {
  return apiRequest<null, CapstoneLikeToggleResponse>(
    `submissions/${id}/like-status`,
    "get",
  );
}

// ==================== CAPSTONE SCREENSHOTS ====================

export interface UploadScreenshotResponse {
  data: { screenshotUrl: string };
  message: string;
}

export async function uploadCapstoneScreenshot(
  submissionId: string,
  file: File,
): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await apiRequest<FormData, UploadScreenshotResponse>(
    `submissions/${submissionId}/screenshots`,
    "post",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response.data.screenshotUrl;
}

export async function deleteCapstoneScreenshot(
  submissionId: string,
  screenshotUrl: string,
): Promise<{ message: string }> {
  return apiRequest<{ screenshotUrl: string }, { message: string }>(
    `submissions/${submissionId}/screenshots`,
    "delete",
    { screenshotUrl },
  );
}

// ==================== CAPSTONE REVIEW IMAGES ====================

export interface UploadReviewImageResponse {
  data: { imageUrl: string };
  message: string;
}

export async function uploadCapstoneReviewImage(
  reviewId: string,
  file: File,
): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await apiRequest<FormData, UploadReviewImageResponse>(
    `reviews/${reviewId}/images`,
    "post",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response.data.imageUrl;
}

export async function deleteCapstoneReviewImage(
  reviewId: string,
  imageUrl: string,
): Promise<{ message: string }> {
  return apiRequest<{ imageUrl: string }, { message: string }>(
    `reviews/${reviewId}/images`,
    "delete",
    { imageUrl },
  );
}
