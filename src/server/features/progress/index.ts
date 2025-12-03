import apiRequest from '@/server/helpers/apiRequest';
import {
  ProgressUpdatePayload,
  ProgressResponse,
  ProgressListResponse,
  ProgressSummaryResponse,
  CourseStatisticsResponse,
  ProgressFilters,
} from './types';

export async function markLessonProgress(
  payload: ProgressUpdatePayload
): Promise<ProgressResponse> {
  return apiRequest<ProgressUpdatePayload, ProgressResponse>(
    '/progress',
    'post',
    payload
  );
}

export async function getProgressForCourse(
  courseId: string
): Promise<ProgressResponse> {
  return apiRequest<null, ProgressResponse>(
    `/progress/course/${courseId}`,
    'get'
  );
}

export async function getAllProgress(): Promise<ProgressListResponse> {
  return apiRequest<null, ProgressListResponse>('/progress/me', 'get');
}

export async function getProgressSummary(
  filters?: ProgressFilters
): Promise<ProgressSummaryResponse> {
  const params = new URLSearchParams();

  if (filters) {
    if (filters.minProgress !== undefined) {
      params.append('minProgress', filters.minProgress.toString());
    }

    if (filters.isPublished !== undefined) {
      params.append('isPublished', filters.isPublished.toString());
    }

    if (filters.status) {
      params.append('status', filters.status);
    }
  }

  const queryString = params.toString();
  const url = `/progress/summary${queryString ? `?${queryString}` : ''}`;

  return apiRequest<null, ProgressSummaryResponse>(url, 'get');
}

export async function deleteProgress(courseId: string): Promise<void> {
  return apiRequest<null, void>(`/progress/course/${courseId}`, 'delete');
}

export async function getCourseStatistics(
  courseId: string
): Promise<CourseStatisticsResponse> {
  return apiRequest<null, CourseStatisticsResponse>(
    `/progress/course/${courseId}/stats`,
    'get'
  );
}
