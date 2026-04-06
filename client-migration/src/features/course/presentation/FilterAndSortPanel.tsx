"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Filter } from "lucide-react";

interface FilterAndSortPanelProps {
  selectedLevel?: string;
  onLevelChange: (level: string | undefined) => void;
  selectedSort: string;
  onSortChange: (sort: string) => void;
  selectedStatus?: "published" | "unpublished" | "drafted" | "all";
  onStatusChange?: (
    status: "published" | "unpublished" | "drafted" | "all",
  ) => void;
  showStatus?: boolean;
}

type CourseStatus = "published" | "unpublished" | "drafted" | "all";

const levels = [
  { value: "all", label: "All Levels" },
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

const sortOptions = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "name-asc", label: "Name (A-Z)" },
  { value: "name-desc", label: "Name (Z-A)" },
];

const statuses = [
  { value: "all", label: "All Courses" },
  { value: "published", label: "Published" },
  { value: "unpublished", label: "Unpublished" },
  { value: "drafted", label: "Drafted" },
];

export function FilterAndSortPanel({
  selectedLevel,
  onLevelChange,
  selectedSort,
  onSortChange,
  selectedStatus = "all",
  onStatusChange,
  showStatus = false,
}: FilterAndSortPanelProps) {
  const selectedLevelValue = selectedLevel ?? "all";
  const selectedStatusValue = selectedStatus ?? "all";

  const selectedLevelLabel =
    levels.find((level) => level.value === selectedLevelValue)?.label ??
    "All Levels";
  const selectedSortLabel =
    sortOptions.find((option) => option.value === selectedSort)?.label ??
    "Newest First";
  const selectedStatusLabel =
    statuses.find((status) => status.value === selectedStatusValue)?.label ??
    "All Courses";

  const activeFilterCount =
    (selectedLevel ? 1 : 0) +
    (showStatus && selectedStatusValue !== "all" ? 1 : 0);

  const canReset =
    selectedLevelValue !== "all" ||
    selectedSort !== "newest" ||
    (showStatus && selectedStatusValue !== "all");

  const handleReset = () => {
    onLevelChange(undefined);
    onSortChange("newest");
    if (showStatus) {
      onStatusChange?.("all");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 whitespace-nowrap">
          <Filter className="h-4 w-4" />
          <span className="hidden sm:inline">Filter & Sort</span>
          <span className="sm:hidden">Filter</span>
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="h-5 px-1.5 text-xs">
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72">
        {/* Level Filter */}
        <DropdownMenuLabel className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          <span>Level</span>
          <span className="font-normal normal-case tracking-normal text-foreground/80">
            {selectedLevelLabel}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuRadioGroup
          value={selectedLevelValue}
          onValueChange={(value) =>
            onLevelChange(value === "all" ? undefined : value)
          }
        >
          {levels.map((level) => (
            <DropdownMenuRadioItem
              key={level.value}
              value={level.value}
              className="capitalize"
            >
              {level.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>

        <DropdownMenuSeparator className="my-2" />

        {/* Sort Options */}
        <DropdownMenuLabel className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          <span>Sort By</span>
          <span className="font-normal normal-case tracking-normal text-foreground/80">
            {selectedSortLabel}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuRadioGroup
          value={selectedSort}
          onValueChange={onSortChange}
        >
          {sortOptions.map((option) => (
            <DropdownMenuRadioItem key={option.value} value={option.value}>
              {option.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>

        {/* Status Filter (optional, for Courses page) */}
        {showStatus && (
          <>
            <DropdownMenuSeparator className="my-2" />
            <DropdownMenuLabel className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <span>Status</span>
              <span className="font-normal normal-case tracking-normal text-foreground/80">
                {selectedStatusLabel}
              </span>
            </DropdownMenuLabel>
            <DropdownMenuRadioGroup
              value={selectedStatusValue}
              onValueChange={(value) => onStatusChange?.(value as CourseStatus)}
            >
              {statuses.map((status) => (
                <DropdownMenuRadioItem key={status.value} value={status.value}>
                  {status.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </>
        )}

        <DropdownMenuSeparator className="my-2" />
        <DropdownMenuItem
          disabled={!canReset}
          onClick={handleReset}
          className="justify-center text-sm font-medium"
        >
          Reset filters and sort
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
