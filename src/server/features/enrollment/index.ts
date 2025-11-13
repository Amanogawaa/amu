import apiRequest from '@/server/helpers/apiRequest';
import type {
  Enrollment,
  EnrollmentWithCourse,
  EnrollmentStatusResponse,
  EnrollmentCountResponse,
  EnrollmentResponse,
  EnrollmentFilters,
} from './types';

export async function enrollInCourse(courseId: string): Promise<Enrollment> {
  const response = await apiRequest<
    null,
    { data: Enrollment; message: string }
  >(`/courses/${courseId}/enroll`, 'post');
  return response.data;
}

export async function unenrollFromCourse(
  courseId: string
): Promise<{ message: string }> {
  return apiRequest<null, { message: string }>(
    `/courses/${courseId}/unenroll`,
    'delete'
  );
}

export async function getEnrollmentStatus(
  courseId: string
): Promise<EnrollmentStatusResponse> {
  const response = await apiRequest<
    null,
    { data: EnrollmentStatusResponse; message: string }
  >(`/courses/${courseId}/enrollment-status`, 'get');
  return response.data;
}

export async function getUserEnrollments(
  filters?: EnrollmentFilters
): Promise<EnrollmentWithCourse[]> {
  const params = new URLSearchParams();

  if (filters?.status) params.append('status', filters.status);
  if (filters?.courseId) params.append('courseId', filters.courseId);
  if (filters?.limit) params.append('limit', filters.limit.toString());
  if (filters?.offset) params.append('offset', filters.offset.toString());

  const queryString = params.toString();
  const url = `/enrollments${queryString ? `?${queryString}` : ''}`;

  const response = await apiRequest<null, EnrollmentResponse>(url, 'get');

  return Array.isArray(response.data)
    ? (response.data as EnrollmentWithCourse[])
    : ([response.data] as EnrollmentWithCourse[]);
}

export async function getEnrollmentCount(courseId: string): Promise<number> {
  const response = await apiRequest<
    null,
    { data: EnrollmentCountResponse; message: string }
  >(`/courses/${courseId}/enrollment-count`, 'get');
  return response.data.count;
}
