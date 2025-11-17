'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Filter, X } from 'lucide-react';
import { useState } from 'react';

interface FilterPanelProps {
  onFilterChange: (filters: CourseFiltersState) => void;
  initialFilters?: CourseFiltersState;
}

export interface CourseFiltersState {
  category?: string;
  level?: string;
  language?: string;
}

const categories = [
  'Web Development',
  'Mobile Development',
  'Data Science',
  'Machine Learning',
  'DevOps',
  'Cybersecurity',
  'Cloud Computing',
  'Game Development',
  'Programming Fundamentals',
  'Database',
];

const levels = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
];

const languages = ['English', 'Spanish', 'French', 'German', 'Japanese'];

export function FilterPanel({
  onFilterChange,
  initialFilters = {},
}: FilterPanelProps) {
  const [filters, setFilters] = useState<CourseFiltersState>(initialFilters);
  const [isOpen, setIsOpen] = useState(false);

  const updateFilter = (
    key: keyof CourseFiltersState,
    value: string | undefined
  ) => {
    const newFilters = {
      ...filters,
      [key]: value === 'all' ? undefined : value,
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    setFilters({});
    onFilterChange({});
  };

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="space-y-4">
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden">
        <Button
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full justify-between"
        >
          <span className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filters
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFilterCount}
              </Badge>
            )}
          </span>
        </Button>
      </div>

      {/* Filter Content */}
      <Card className={`${isOpen || 'hidden lg:block'}`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filters
              {activeFilterCount > 0 && (
                <Badge variant="secondary">{activeFilterCount}</Badge>
              )}
            </CardTitle>
            {activeFilterCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="h-8 gap-1"
              >
                <X className="h-3 w-3" />
                Clear
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Category Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Category</label>
            <Select
              value={filters.category || 'all'}
              onValueChange={(value) => updateFilter('category', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Level Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Level</label>
            <div className="flex flex-wrap gap-2">
              <Badge
                variant={!filters.level ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => updateFilter('level', undefined)}
              >
                All Levels
              </Badge>
              {levels.map((level) => (
                <Badge
                  key={level.value}
                  variant={
                    filters.level === level.value ? 'default' : 'outline'
                  }
                  className="cursor-pointer capitalize"
                  onClick={() => updateFilter('level', level.value)}
                >
                  {level.label}
                </Badge>
              ))}
            </div>
          </div>

          {/* Language Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Language</label>
            <Select
              value={filters.language || 'all'}
              onValueChange={(value) => updateFilter('language', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Languages" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Languages</SelectItem>
                {languages.map((language) => (
                  <SelectItem key={language} value={language}>
                    {language}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
