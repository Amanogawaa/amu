"use client";

import { useAuth } from "@/features/auth/application/AuthContext";
import CourseGrid from "@/features/course/presentation/grid/CourseGrid";
import { SearchBar } from "@/features/course/presentation/SearchBar";
import { LevelFilterPanel } from "@/features/course/presentation/LevelFilterPanel";
import { SortingPanel } from "@/features/course/presentation/SortingPanel";
import { StatusFilterPanel } from "@/features/course/presentation/StatusFilterPanel";
import { BookOpenIcon } from "lucide-react";
import { redirect } from "next/navigation";
import { useState } from "react";

const CoursesPage = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<string | undefined>(
    undefined
  );
  const [selectedSort, setSelectedSort] = useState("newest");
  const [selectedStatus, setSelectedStatus] = useState<
    "published" | "unpublished" | "drafted" | "all"
  >("all");

  if (!user) {
    throw redirect("/");
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleLevelChange = (level: string | undefined) => {
    setSelectedLevel(level);
  };

  const handleSortChange = (sort: string) => {
    setSelectedSort(sort);
  };

  const handleStatusChange = (
    status: "published" | "unpublished" | "drafted" | "all"
  ) => {
    setSelectedStatus(status);
  };

  return (
    <section className="flex flex-col min-h-screen w-full pb-10">
      <div className="container mx-auto max-w-5xl ">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mt-10">
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
                <BookOpenIcon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight uppercase">
                  MY COURSES
                </h1>
                <p className="text-muted-foreground text-lg">
                  Manage your generated courses
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <SearchBar
            onSearch={handleSearch}
            placeholder="Search your courses..."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <LevelFilterPanel
              selectedLevel={selectedLevel}
              onLevelChange={handleLevelChange}
            />
            <SortingPanel
              selectedSort={selectedSort}
              onSortChange={handleSortChange}
            />
            <StatusFilterPanel
              selectedStatus={selectedStatus}
              onStatusChange={handleStatusChange}
            />
          </div>
        </div>

        <CourseGrid
          uid={user.uid}
          searchQuery={searchQuery}
          level={selectedLevel}
          sortBy={selectedSort}
          status={selectedStatus}
        />
      </div>
    </section>
  );
};

export default CoursesPage;
