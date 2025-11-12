'use client';

import CourseCardSkeleton from '@/components/states/CourseCardSkeleton';
import GeneralEmptyPage from '@/components/states/GeneralEmptyPage';
import { useInfiniteListCourses } from '@/features/course/application/useGetCourses';
import CourseCard from '@/features/course/presentation/card/CourseCard';
import CourseGrid from '@/features/course/presentation/grid/CourseGrid';
import { useResourceEvents } from '@/hooks/use-socket-events';
import { CourseFilters } from '@/server/features/course/types/request';
import { StarsIcon, User2Icon } from 'lucide-react';
import React from 'react';

// TODO: display only courses with published attr = true

const ExplorePage = () => {
  const filters: CourseFilters = {
    publish: true,
  };

  const { data, isPending, hasNextPage, isFetchingNextPage, isError } =
    useInfiniteListCourses(filters);

  const flatData = data?.pages.flatMap((page) => page.results) || [];

  useResourceEvents({
    resourceType: 'course',
    queryKey: ['courses'],
  });

  if (isPending) {
    return (
      <div className="container mx-auto max-w-5xl ">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-5">
          {Array.from({ length: 6 }).map((_, index) => (
            <CourseCardSkeleton key={index} />
          ))}
        </div>
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
    <section className="flex flex-col min-h-screen w-full pb-10">
      <div className="container mx-auto max-w-5xl ">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mt-10">
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
                <StarsIcon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight uppercase">
                  EXPLORE COURSES
                </h1>
                <p className="text-muted-foreground text-lg">
                  Discover and explore a variety of courses tailored to your
                  interests and goals.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-5">
          {flatData.map((course) => (
            <CourseCard course={course} key={course.id} />
          ))}

          {isFetchingNextPage &&
            Array.from({ length: 3 }).map((_, index) => (
              <CourseCardSkeleton key={`loading-${index}`} />
            ))}
        </div>
      </div>
    </section>
  );
};

export default ExplorePage;
