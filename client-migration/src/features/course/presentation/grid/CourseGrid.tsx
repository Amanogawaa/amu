"use client";

import CourseCardSkeleton from "@/components/states/CourseCardSkeleton";
import { EnhancedEmptyState } from "@/components/states/EnhancedEmptyState";
import { useResourceEvents } from "@/hooks/use-socket-events";
import { CourseFilters } from "@/server/features/course/types";
import { useInfiniteListMyCourses } from "../../application/useGetCourses";
import CourseCard from "../card/CourseCard";
import { useAuth } from "@/features/auth/application/AuthContext";
import { useMemo } from "react";

interface CourseGridProps {
  uid?: string;
  filters?: CourseFilters;
  searchQuery?: string;
  level?: string;
  sortBy?: string;
  status?: "published" | "unpublished" | "drafted" | "all";
}

const CourseGrid = ({
  uid,
  filters,
  searchQuery,
  level,
  sortBy = "newest",
  status = "all",
}: CourseGridProps) => {
  const { user, loading: authLoading } = useAuth();

  const courseFilters: CourseFilters = {
    ...filters,
    ...(uid && { uid }),
  };

  const { data, isPending, hasNextPage, isFetchingNextPage, isError } =
    useInfiniteListMyCourses(courseFilters, !!user && !authLoading);

  const flatData = data?.pages.flatMap((page) => page.results) || [];

  // Filter and sort courses
  const filteredAndSortedCourses = useMemo(() => {
    let result = [...flatData];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (course) =>
          course.name.toLowerCase().includes(query) ||
          course.topic?.toLowerCase().includes(query) ||
          course.description?.toLowerCase().includes(query)
      );
    }

    // Apply level filter
    if (level) {
      result = result.filter((course) => course.level === level);
    }

    // Apply status filter
    if (status === "published") {
      result = result.filter(
        (course) => course.publish === true && course.draft === false
      );
    } else if (status === "unpublished") {
      result = result.filter(
        (course) => course.publish === false && course.draft === false
      );
    } else if (status === "drafted") {
      result = result.filter((course) => course.draft === true);
    }

    // Apply sorting
    switch (sortBy) {
      case "newest":
        result.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        });
        break;
      case "oldest":
        result.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateA - dateB;
        });
        break;
      case "name-asc":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
    }

    return result;
  }, [flatData, searchQuery, level, sortBy, status]);

  useResourceEvents({
    resourceType: "course",
    queryKey: ["courses"],
  });

  if (authLoading || isPending) {
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

  if (filteredAndSortedCourses.length === 0) {
    return <EnhancedEmptyState type="no-search-results" />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-5">
      {filteredAndSortedCourses.map((course) => (
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
