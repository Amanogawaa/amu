'use client';

// parent component
import React from 'react';
import CourseCard from './CourseCard';
import { useInfiniteListCourses } from '../application/useGetCourses';
import GeneralLoadingPage from '@/components/loading/GeneralLoadingPage';

const CourseGrid = () => {
  const { data, isLoading, hasNextPage, isFetchingNextPage, isError } =
    useInfiniteListCourses();

  const flatData = data?.pages.flatMap((page) => page.results) || [];

  console.log('Courses Data:', flatData);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-5">
      <div className="col-span-3">{isLoading && <GeneralLoadingPage />}</div>

      {flatData.map((course) => (
        <CourseCard course={course} key={course.id} />
      ))}
    </div>
  );
};

export default CourseGrid;
