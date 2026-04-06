"use client";

import CourseCardSkeleton from "@/components/states/CourseCardSkeleton";
import { EnhancedEmptyState } from "@/components/states/EnhancedEmptyState";
import { useUserEnrollments } from "../application/useEnrollment";
import EnrolledCourseCard from "@/features/enrollment/presentation/EnrolledCourseCard";
import { useAuth } from "@/features/auth/application/AuthContext";
import { useMemo } from "react";

interface EnrolledCoursesGridProps {
  searchQuery?: string;
  level?: string;
  sortBy?: string;
}

const EnrolledCoursesGrid = ({
  searchQuery,
  level,
  sortBy = "newest",
}: EnrolledCoursesGridProps) => {
  const { user, loading: authLoading } = useAuth();
  const {
    data: enrollments,
    isPending,
    isError,
  } = useUserEnrollments(undefined, !!user && !authLoading);

  const filteredAndSortedEnrollments = useMemo(() => {
    if (!enrollments) return [];

    let result = [...enrollments];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (enrollment) =>
          enrollment.course.name.toLowerCase().includes(query) ||
          enrollment.course.topic?.toLowerCase().includes(query) ||
          enrollment.course.description?.toLowerCase().includes(query)
      );
    }

    if (level) {
      result = result.filter((enrollment) => enrollment.course.level === level);
    }

    switch (sortBy) {
      case "newest":
        result.sort((a, b) => {
          const dateA = a.enrolledAt ? new Date(a.enrolledAt).getTime() : 0;
          const dateB = b.enrolledAt ? new Date(b.enrolledAt).getTime() : 0;
          return dateB - dateA;
        });
        break;
      case "oldest":
        result.sort((a, b) => {
          const dateA = a.enrolledAt ? new Date(a.enrolledAt).getTime() : 0;
          const dateB = b.enrolledAt ? new Date(b.enrolledAt).getTime() : 0;
          return dateA - dateB;
        });
        break;
      case "name-asc":
        result.sort((a, b) => a.course.name.localeCompare(b.course.name));
        break;
      case "name-desc":
        result.sort((a, b) => b.course.name.localeCompare(a.course.name));
        break;
    }

    return result;
  }, [enrollments, searchQuery, level, sortBy]);

  if (authLoading || isPending) {
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

  if (filteredAndSortedEnrollments.length === 0) {
    return <EnhancedEmptyState type="no-search-results" />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-5">
      {filteredAndSortedEnrollments.map((enrollment) => (
        <EnrolledCourseCard key={enrollment.id} enrollment={enrollment} />
      ))}
    </div>
  );
};

export default EnrolledCoursesGrid;
