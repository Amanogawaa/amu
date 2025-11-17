'use client';

import CourseCardSkeleton from '@/components/states/CourseCardSkeleton';
import { EnhancedEmptyState } from '@/components/states/EnhancedEmptyState';
import { useResourceEvents } from '@/hooks/use-socket-events';
import { CourseFilters } from '@/server/features/course/types';
import { useInfiniteListMyCourses } from '../../application/useGetCourses';
import CourseCard from '../card/CourseCard';

interface CourseGridProps {
  uid?: string;
  filters?: CourseFilters;
}

const CourseGrid = ({ uid, filters }: CourseGridProps) => {
  const courseFilters: CourseFilters = {
    ...filters,
    ...(uid && { uid }),
  };

  const { data, isPending, hasNextPage, isFetchingNextPage, isError } =
    useInfiniteListMyCourses(courseFilters);

  const flatData = data?.pages.flatMap((page) => page.results) || [];

  useResourceEvents({
    resourceType: 'course',
    queryKey: ['courses'],
  });

  if (isPending) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-5">
        {Array.from({ length: 6 }).map((_, index) => (
          <CourseCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (flatData.length === 0) {
    return <EnhancedEmptyState type="no-courses" />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-5">
      {flatData.map((course) => (
        <CourseCard course={course} key={course.id} />
      ))}

      {isFetchingNextPage &&
        Array.from({ length: 3 }).map((_, index) => (
          <CourseCardSkeleton key={`loading-${index}`} />
        ))}
    </div>
  );
};

export default CourseGrid;
