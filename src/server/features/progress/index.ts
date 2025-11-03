import apiRequest from '@/server/helpers/apiRequest';
import {
  ProgressUpdatePayload,
  ProgressResponse,
  ProgressListResponse,
  ProgressSummaryResponse,
  CourseStatisticsResponse,
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

export async function getProgressSummary(): Promise<ProgressSummaryResponse> {
  return apiRequest<null, ProgressSummaryResponse>('/progress/summary', 'get');
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
