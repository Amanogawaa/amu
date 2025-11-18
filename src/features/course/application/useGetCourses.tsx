import { queryKeys } from '@/lib/queryKeys';
import {
  getCourseById,
  listCourses,
  listMyCourses,
} from '@/server/features/course';
import { CourseFilters } from '@/server/features/course/types';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

export function useListCourses(options?: { page?: number; enabled?: boolean }) {
  const page = options?.page ?? 1;
  const enabled = options?.enabled ?? true;

  return useQuery({
    queryKey: queryKeys.courses.list(page),
    queryFn: () => listCourses(page),
    enabled,
  });
}

export function useGetCourse(courseId: string) {
  return useQuery({
    queryKey: queryKeys.courses.detail(courseId),
    queryFn: () => getCourseById(courseId),
    enabled: !!courseId,
  });
}

export function useInfiniteListCourses(filters?: CourseFilters) {
  return useInfiniteQuery({
    queryKey: queryKeys.courses.infinite(filters),
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

export function useInfiniteListMyCourses(
  filters?: CourseFilters,
  enabled: boolean = true
) {
  return useInfiniteQuery({
    queryKey: queryKeys.courses.infinite(filters),
    queryFn: async ({ pageParam = 1 }) => {
      return await listMyCourses(pageParam, filters);
    },
    enabled,
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
