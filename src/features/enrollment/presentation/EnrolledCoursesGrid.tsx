'use client';

import CourseCardSkeleton from '@/components/states/CourseCardSkeleton';
import GeneralEmptyPage from '@/components/states/GeneralEmptyPage';
import { useUserEnrollments } from '../application/useEnrollment';
import EnrolledCourseCard from '@/features/enrollment/presentation/EnrolledCourseCard';

const EnrolledCoursesGrid = () => {
  const { data: enrollments, isPending, isError } = useUserEnrollments();

  if (isPending) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-5">
        {Array.from({ length: 6 }).map((_, index) => (
          <CourseCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (!enrollments || enrollments.length === 0) {
    return (
      <div className="mt-5">
        <GeneralEmptyPage
          type="course"
          title="No Enrolled Courses"
          description="You haven't enrolled in any courses yet. Browse published courses to get started!"
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-5">
      {enrollments.map((enrollment) => (
        <EnrolledCourseCard key={enrollment.id} enrollment={enrollment} />
      ))}
    </div>
  );
};

export default EnrolledCoursesGrid;
