import apiRequest from '@/server/helpers/apiRequest';
import {
  Course,
  CourseFilters,
  CreateCoursePayload,
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
  }

  const queryString = params.toString();
  const url = `/courses?${queryString ? `${queryString}` : ''}`;

  return apiRequest<null, ListCoursesResponse>(url, 'get');
}

export async function createCourse(
  payload: CreateCoursePayload
): Promise<Course> {
  return apiRequest<CreateCoursePayload, Course>('/courses', 'post', payload);
}
