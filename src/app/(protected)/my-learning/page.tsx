"use client";

import { useAuth } from "@/features/auth/application/AuthContext";
import EnrolledCoursesGrid from "@/features/enrollment/presentation/EnrolledCoursesGrid";
import { CapstoneGallery } from "@/features/capstone/presentation";
import { SearchBar } from "@/features/course/presentation/SearchBar";
import { FilterAndSortPanel } from "@/features/course/presentation/FilterAndSortPanel";
import { BookOpenIcon, Sparkles } from "lucide-react";
import { redirect } from "next/navigation";
import { useState } from "react";


const MyLearningPage = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<string | undefined>(
    undefined,
  );
  const [selectedSort, setSelectedSort] = useState("newest");

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
                  MY LEARNING
                </h1>
                <p className="text-muted-foreground text-lg">
                  List of courses you are enrolled in
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <div className="flex gap-3">
            <SearchBar
              onSearch={handleSearch}
              placeholder="Search enrolled courses..."
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

        <EnrolledCoursesGrid
          searchQuery={searchQuery}
          level={selectedLevel}
          sortBy={selectedSort}
        />
      </div>
    </section>
  );
};

export default MyLearningPage;
