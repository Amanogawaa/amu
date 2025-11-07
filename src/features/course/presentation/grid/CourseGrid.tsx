'use client';

import CourseCardSkeleton from '@/components/states/CourseCardSkeleton';
import GeneralEmptyPage from '@/components/states/GeneralEmptyPage';
import { useResourceEvents } from '@/hooks/use-socket-events';
import { useInfiniteListCourses } from '../../application/useGetCourses';
import CourseCard from '../card/CourseCard';

const CourseGrid = () => {
  const { data, isPending, hasNextPage, isFetchingNextPage, isError } =
    useInfiniteListCourses();

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
    return (
      <div className="mt-5">
        <GeneralEmptyPage type="course" />
      </div>
    );
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
