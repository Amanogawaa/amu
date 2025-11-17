'use client';

import CourseCardSkeleton from '@/components/states/CourseCardSkeleton';
import { EnhancedEmptyState } from '@/components/states/EnhancedEmptyState';
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
    return <EnhancedEmptyState type="no-enrolled-courses" />;
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
