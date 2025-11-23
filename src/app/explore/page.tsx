'use client';

import CourseCardSkeleton from '@/components/states/CourseCardSkeleton';
import { EnhancedEmptyState } from '@/components/states/EnhancedEmptyState';
import { useInfiniteListCourses } from '@/features/course/application/useGetCourses';
import CourseCard from '@/features/course/presentation/card/CourseCard';
import { LevelFilterPanel } from '@/features/course/presentation/LevelFilterPanel';
import { SearchBar } from '@/features/course/presentation/SearchBar';
import { useResourceEvents } from '@/hooks/use-socket-events';
import { CourseFilters } from '@/server/features/course/types/request';
import { StarsIcon } from 'lucide-react';
import { useEffect, useState, useMemo } from 'react';
import { useInView } from 'react-intersection-observer';

const ExplorePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string | undefined>(
    undefined
  );

  // Only fetch published courses, no filters
  const filters: CourseFilters = {
    publish: true,
  };

  const {
    data,
    isPending,
    hasNextPage,
    isFetchingNextPage,
    isError,
    fetchNextPage,
  } = useInfiniteListCourses(filters);

  const flatData = data?.pages.flatMap((page) => page.results) || [];

  // Client-side filtering
  const filteredCourses = useMemo(() => {
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
    if (selectedLevel) {
      result = result.filter((course) => course.level === selectedLevel);
    }

    return result;
  }, [flatData, searchQuery, selectedLevel]);

  const { ref: sentinelRef, inView } = useInView({
    threshold: 0,
    rootMargin: '200px',
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  useResourceEvents({
    resourceType: 'course',
    queryKey: ['courses'],
  });

  // Handle search callback from SearchBar
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Handle level filter changes
  const handleLevelChange = (level: string | undefined) => {
    setSelectedLevel(level);
  };

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
    return <EnhancedEmptyState type="no-published-courses" />;
  }

  if (filteredCourses.length === 0) {
    return <EnhancedEmptyState type="no-search-results" />;
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

        <div className="mt-8 space-y-4">
          <SearchBar
            onSearch={handleSearch}
            placeholder="Search courses by title or topic..."
          />
          <LevelFilterPanel
            selectedLevel={selectedLevel}
            onLevelChange={handleLevelChange}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {filteredCourses.map((course) => (
            <CourseCard course={course} key={course.id} />
          ))}

          {isFetchingNextPage &&
            Array.from({ length: 3 }).map((_, index) => (
              <CourseCardSkeleton key={`loading-${index}`} />
            ))}
        </div>

        {hasNextPage && (
          <div
            ref={sentinelRef}
            className="h-10 mt-4 flex items-center justify-center"
          >
            {!isFetchingNextPage && (
              <p className="text-sm text-muted-foreground">
                Loading more courses...
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default ExplorePage;
