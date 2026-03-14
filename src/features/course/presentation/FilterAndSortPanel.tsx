'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';

interface FilterAndSortPanelProps {
  selectedLevel?: string;
  onLevelChange: (level: string | undefined) => void;
  selectedSort: string;
  onSortChange: (sort: string) => void;
  selectedStatus?: 'published' | 'unpublished' | 'drafted' | 'all';
  onStatusChange?: (
    status: 'published' | 'unpublished' | 'drafted' | 'all'
  ) => void;
  showStatus?: boolean;
}

const levels = [
  { value: 'all', label: 'All Levels' },
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
];

const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'name-asc', label: 'Name (A-Z)' },
  { value: 'name-desc', label: 'Name (Z-A)' },
];

const statuses = [
  { value: 'all', label: 'All Courses' },
  { value: 'published', label: 'Published' },
  { value: 'unpublished', label: 'Unpublished' },
  { value: 'drafted', label: 'Drafted' },
];

export function FilterAndSortPanel({
  selectedLevel,
  onLevelChange,
  selectedSort,
  onSortChange,
  selectedStatus = 'all',
  onStatusChange,
  showStatus = false,
}: FilterAndSortPanelProps) {
  const handleLevelClick = (value: string) => {
    onLevelChange(value === 'all' ? undefined : value);
  };

  const isLevelSelected = (value: string) => {
    if (value === 'all') {
      return selectedLevel === undefined;
    }
    return selectedLevel === value;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 whitespace-nowrap"
        >
          <Filter className="h-4 w-4" />
          Filter
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {/* Level Filter */}
        <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground uppercase">
          Level
        </DropdownMenuLabel>
        {levels.map((level) => (
          <DropdownMenuCheckboxItem
            key={level.value}
            checked={isLevelSelected(level.value)}
            onCheckedChange={() => handleLevelClick(level.value)}
            className="capitalize"
          >
            {level.label}
          </DropdownMenuCheckboxItem>
        ))}

        <DropdownMenuSeparator className="my-2" />

        {/* Sort Options */}
        <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground uppercase">
          Sort By
        </DropdownMenuLabel>
        {sortOptions.map((option) => (
          <DropdownMenuCheckboxItem
            key={option.value}
            checked={selectedSort === option.value}
            onCheckedChange={() => onSortChange(option.value)}
          >
            {option.label}
          </DropdownMenuCheckboxItem>
        ))}

        {/* Status Filter (optional, for Courses page) */}
        {showStatus && (
          <>
            <DropdownMenuSeparator className="my-2" />
            <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground uppercase">
              Status
            </DropdownMenuLabel>
            {statuses.map((status) => (
              <DropdownMenuCheckboxItem
                key={status.value}
                checked={selectedStatus === status.value}
                onCheckedChange={() =>
                  onStatusChange?.(status.value as any)
                }
              >
                {status.label}
              </DropdownMenuCheckboxItem>
            ))}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
