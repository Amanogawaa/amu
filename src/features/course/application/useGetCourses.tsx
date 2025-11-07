import { getCourseById, listCourses } from '@/server/features/course';
import { CourseFilters } from '@/server/features/course/types';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

export function useListCourses(options?: { page?: number; enabled?: boolean }) {
  const page = options?.page ?? 1;
  const enabled = options?.enabled ?? true;

  return useQuery({
    queryKey: ['courses', page],
    queryFn: () => listCourses(page),
    enabled,
    // staleTime: 0,
    // gcTime: 10 * 60 * 1000,
  });
}

export function useGetCourse(courseId: string) {
  return useQuery({
    queryKey: ['course', courseId],
    queryFn: () => getCourseById(courseId),
    enabled: !!courseId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useInfiniteListCourses(filters?: CourseFilters) {
  return useInfiniteQuery({
    queryKey: ['courses', 'infinite', filters],
    queryFn: async ({ pageParam = 1 }) => {
      return await listCourses(pageParam, filters);
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.next) {
        try {
          const url = new URL(lastPage.next);
          return parseInt(url.searchParams.get('page') || '1');
        } catch {
          return undefined;
        }
      }
      return undefined;
    },
    getPreviousPageParam: (firstPage) => {
      if (firstPage.previous) {
        try {
          const url = new URL(firstPage.previous);
          return parseInt(url.searchParams.get('page') || '1');
        } catch {
          return undefined;
        }
      }
      return undefined;
    },
    initialPageParam: 1,
  });
}
