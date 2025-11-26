import apiRequest from '@/server/helpers/apiRequest';
import {
  Course,
  CourseFilters,
  CourseValidationResponse,
  CreateCoursePayload,
  FullGenerationRequest,
  FullGenerationResponse,
  ListCoursesResponse,
} from './types';

export async function listCourses(
  page: number,
  filters?: CourseFilters
): Promise<ListCoursesResponse> {
  const params = new URLSearchParams();
  params.append('page', page.toString());

  if (filters) {
    if (filters.category) {
      params.append('category', filters.category);
    }
    if (filters.level) {
      params.append('level', filters.level);
    }
    if (filters.language) {
      params.append('language', filters.language);
    }

    if (filters.publish !== undefined) {
      params.append('publish', filters.publish.toString());
    }

    if (filters.draft !== undefined) {
      params.append('draft', filters.draft.toString());
    }
  }

  const queryString = params.toString();
  const url = `/courses?${queryString ? `${queryString}` : ''}`;

  return apiRequest<null, ListCoursesResponse>(url, 'get');
}

export async function listMyCourses(
  page: number,
  filters?: CourseFilters
): Promise<ListCoursesResponse> {
  const params = new URLSearchParams();
  params.append('page', page.toString());

  if (filters) {
    if (filters.category) {
      params.append('category', filters.category);
    }
    if (filters.level) {
      params.append('level', filters.level);
    }
    if (filters.language) {
      params.append('language', filters.language);
    }

    if (filters.publish !== undefined) {
      params.append('publish', filters.publish.toString());
    }

    if (filters.draft !== undefined) {
      params.append('draft', filters.draft.toString());
    }
  }

  const queryString = params.toString();
  const url = `/my-courses?${queryString ? `${queryString}` : ''}`;

  return apiRequest<null, ListCoursesResponse>(url, 'get');
}

export async function getCourseById(courseId: string): Promise<Course> {
  return apiRequest<null, Course>(`/courses/${courseId}`, 'get');
}

export async function createCourse(
  payload: CreateCoursePayload
): Promise<Course> {
  return apiRequest<CreateCoursePayload, Course>('/courses', 'post', payload);
}

export async function validateCourse(
  courseId: string
): Promise<{ data: CourseValidationResponse; message: string }> {
  return apiRequest<null, { data: CourseValidationResponse; message: string }>(
    `/courses/${courseId}/validate`,
    'get'
  );
}

export async function publishCourse(
  courseId: string
): Promise<{ data: Course; message: string }> {
  return apiRequest<null, { data: Course; message: string }>(
    `/courses/${courseId}/publish`,
    'patch'
  );
}

export async function unpublishCourse(
  courseId: string
): Promise<{ data: Course; message: string }> {
  return apiRequest<null, { data: Course; message: string }>(
    `/courses/${courseId}/unpublish`,
    'patch'
  );
}

export async function moveCourseToDraft(
  courseId: string
): Promise<{ data: Course; message: string }> {
  return apiRequest<null, { data: Course; message: string }>(
    `/courses/${courseId}/draft`,
    'patch'
  );
}

export async function restoreCourseFromDraft(
  courseId: string
): Promise<{ data: Course; message: string }> {
  return apiRequest<null, { data: Course; message: string }>(
    `/courses/${courseId}/undraft`,
    'patch'
  );
}

export async function generateFullCourse(
  payload: FullGenerationRequest
): Promise<FullGenerationResponse> {
  return apiRequest<FullGenerationRequest, FullGenerationResponse>(
    '/courses/generate-full',
    'post',
    payload
  );
}

export async function deleteCourse(courseId: string): Promise<void> {
  return apiRequest<null, void>(`/courses/${courseId}`, 'delete');
}
