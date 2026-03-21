"use client";

import CourseCardSkeleton from "@/components/states/CourseCardSkeleton";
import { EnhancedEmptyState } from "@/components/states/EnhancedEmptyState";
import { useAuth } from "@/features/auth/application/AuthContext";
import { useInfiniteListCourses } from "@/features/course/application/useGetCourses";
import CourseCard from "@/features/course/presentation/card/CourseCard";
import { FilterAndSortPanel } from "@/features/course/presentation/FilterAndSortPanel";
import { SearchBar } from "@/features/course/presentation/SearchBar";
import { useResourceEvents } from "@/hooks/use-socket-events";
import { CourseFilters } from "@/server/features/course/types/request";
import { StarsIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useInView } from "react-intersection-observer";

const ExplorePage = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<string | undefined>(
    undefined,
  );
  const [selectedSort, setSelectedSort] = useState("newest");

  const filters: CourseFilters = {
    publish: true,
    draft: false,
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

    // Filter out current user's own courses
    if (user?.uid) {
      result = result.filter((course) => course.uid !== user.uid);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (course) =>
          course.name.toLowerCase().includes(query) ||
          course.topic?.toLowerCase().includes(query) ||
          course.description?.toLowerCase().includes(query),
      );
    }

    if (selectedLevel) {
      result = result.filter((course) => course.level === selectedLevel);
    }

    // Apply sorting
    switch (selectedSort) {
      case "oldest":
        result.sort(
          (a, b) =>
            new Date(a.createdAt || 0).getTime() -
            new Date(b.createdAt || 0).getTime(),
        );
        break;
      case "name-asc":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "newest":
      default:
        result.sort(
          (a, b) =>
            new Date(b.createdAt || 0).getTime() -
            new Date(a.createdAt || 0).getTime(),
        );
    }

    return result;
  }, [flatData, searchQuery, selectedLevel, selectedSort, user?.uid]);

  const { ref: sentinelRef, inView } = useInView({
    threshold: 0,
    rootMargin: "200px",
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  useResourceEvents({
    resourceType: "course",
    queryKey: ["courses"],
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleLevelChange = (level: string | undefined) => {
    setSelectedLevel(level);
  };

  const handleSortChange = (sort: string) => {
    setSelectedSort(sort);
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

  if (flatData.length === 0) {
    return <EnhancedEmptyState type="no-published-courses" />;
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
                    LEARN
                  </h1>
                  <p className="text-muted-foreground text-lg">
                    Discover courses tailored to your interests
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <div className="flex gap-3">
              <SearchBar
                onSearch={handleSearch}
                placeholder="Search courses by title or topic..."
              />
              <FilterAndSortPanel
                selectedLevel={selectedLevel}
                onLevelChange={handleLevelChange}
                selectedSort={selectedSort}
                onSortChange={handleSortChange}
                showStatus={false}
              />
            </div>
          </div>

          {filteredCourses.length === 0 ? (
            <div className="mt-8">
              <EnhancedEmptyState type="no-search-results" />
            </div>
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
        </div>
      </section>
    </>
  );
};

export default ExplorePage;
