'use client';

import CourseCardSkeleton from '@/components/states/CourseCardSkeleton';
import { EnhancedEmptyState } from '@/components/states/EnhancedEmptyState';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CapstoneGallery } from '@/features/capstone/presentation';
import { useInfiniteListCourses } from '@/features/course/application/useGetCourses';
import CourseCard from '@/features/course/presentation/card/CourseCard';
import { LevelFilterPanel } from '@/features/course/presentation/LevelFilterPanel';
import { SearchBar } from '@/features/course/presentation/SearchBar';
import { useResourceEvents } from '@/hooks/use-socket-events';
import { CourseFilters } from '@/server/features/course/types/request';
import { Sparkles, StarsIcon } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useInView } from 'react-intersection-observer';

const ExplorePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string | undefined>(
    undefined
  );

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

  const filteredCourses = useMemo(() => {
    let result = [...flatData];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (course) =>
          course.name.toLowerCase().includes(query) ||
          course.topic?.toLowerCase().includes(query) ||
          course.description?.toLowerCase().includes(query)
      );
    }

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

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

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
    <>
    <section className="flex flex-col min-h-screen w-full pb-10">
      <div className="container mx-auto max-w-5xl">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mt-10">
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
                <StarsIcon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight uppercase">
                  EXPLORE
                </h1>
                <p className="text-muted-foreground text-lg">
                  Discover courses and student capstone projects
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="courses" className="mt-8">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="courses" className="flex items-center gap-2">
              <StarsIcon className="h-4 w-4" />
              Courses
            </TabsTrigger>
            <TabsTrigger value="capstone" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Capstone Projects
            </TabsTrigger>
          </TabsList>

          {/* Courses Tab */}
          <TabsContent value="courses" className="space-y-4 mt-6">
            <SearchBar
              onSearch={handleSearch}
              placeholder="Search courses by title or topic..."
            />
            <LevelFilterPanel
              selectedLevel={selectedLevel}
              onLevelChange={handleLevelChange}
            />

            {filteredCourses.length === 0 ? (
              <EnhancedEmptyState type="no-search-results" />
            ) : (
              <>
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
              </>
            )}
          </TabsContent>

          <TabsContent value="capstone" className="mt-6">
            <CapstoneGallery limit={12} />
          </TabsContent>
        </Tabs>
      </div>
    </section>
    </>
  );
};

export default ExplorePage;
