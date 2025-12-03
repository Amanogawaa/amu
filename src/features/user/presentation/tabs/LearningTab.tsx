import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { BookOpen } from 'lucide-react';
import Link from 'next/link';
import { ProgressCard } from '@/features/progress/presentation/ProgressCard';
import type { UserProgress } from '@/server/features/progress/types';

type SortOption = 'recent' | 'progress' | 'name';
type FilterOption = 'all' | 'in-progress' | 'completed' | 'not-started';

interface CourseDetails {
  courseName?: string;
  courseDescription?: string;
  courseSubtitle?: string;
  courseCategory?: string;
  courseLevel?: string;
}

type ProgressWithCourseDetails = UserProgress & CourseDetails;

interface LearningTabProps {
  progressWithCourses: ProgressWithCourseDetails[] | undefined;
  isLoading: boolean;
}

export function LearningTab({
  progressWithCourses,
  isLoading,
}: LearningTabProps) {
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');

  const displayedProgress = useMemo(() => {
    if (!progressWithCourses) return [];

    let filtered = progressWithCourses.filter((p) => {
      if (filterBy === 'all') return true;
      if (filterBy === 'completed') return p.percentComplete === 100;
      if (filterBy === 'in-progress')
        return p.percentComplete > 0 && p.percentComplete < 100;
      if (filterBy === 'not-started') return p.percentComplete === 0;
      return true;
    });

    filtered.sort((a, b) => {
      if (sortBy === 'recent') {
        return (
          new Date(b.lastActivityAt).getTime() -
          new Date(a.lastActivityAt).getTime()
        );
      }
      if (sortBy === 'progress') {
        return b.percentComplete - a.percentComplete;
      }
      if (sortBy === 'name') {
        return (a.courseName || '').localeCompare(b.courseName || '');
      }
      return 0;
    });

    return filtered;
  }, [progressWithCourses, sortBy, filterBy]);

  return (
    <>
      <div className="space-y-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              My Learning
            </h2>
            <p className="text-muted-foreground mt-1">
              Stay on top of your enrolled courses and progress
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary">
            <BookOpen className="h-4 w-4" />
            {progressWithCourses?.length || 0} Enrolled
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={filterBy === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterBy('all')}
            >
              All
            </Button>
            <Button
              variant={filterBy === 'in-progress' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterBy('in-progress')}
            >
              In Progress
            </Button>
            <Button
              variant={filterBy === 'completed' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterBy('completed')}
            >
              Completed
            </Button>
          </div>

          <Select
            value={sortBy}
            onValueChange={(value) => setSortBy(value as SortOption)}
          >
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Recent Activity</SelectItem>
              <SelectItem value="progress">Progress %</SelectItem>
              <SelectItem value="name">Alphabetical</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full mt-2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-2 w-full" />
                <div className="flex justify-between mt-3">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : displayedProgress && displayedProgress.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayedProgress.map((progress) => (
            <ProgressCard
              key={progress.id}
              progress={progress}
              courseName={
                progress.courseName ||
                `Course ${progress.courseId.substring(0, 8)}`
              }
              courseDescription={progress.courseDescription}
            />
          ))}
        </div>
      ) : progressWithCourses && progressWithCourses.length > 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center mb-4">
              No courses match the selected filter.
            </p>
            <Button variant="outline" onClick={() => setFilterBy('all')}>
              Show All Courses
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center mb-4">
              No courses enrolled yet. Start learning by exploring our courses!
            </p>
            <Link href="/explore">
              <Button>Explore Courses</Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </>
  );
}
