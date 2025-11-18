'use client';

import { useState } from 'react';
import { CapstoneSubmissionCard } from '../card/CapstoneSubmissionCard';
import { useCapstoneSubmissions } from '../../application/useCapstoneSubmissions';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Empty } from '@/components/ui/empty';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AlertCircle, Loader2 } from 'lucide-react';
import type { CapstoneSubmissionFilters } from '@/server/features/capstone/types';

interface CapstoneGalleryProps {
  courseId?: string;
  userId?: string;
  limit?: number;
}

export function CapstoneGallery({
  courseId,
  userId,
  limit = 12,
}: CapstoneGalleryProps) {
  const [sortBy, setSortBy] = useState<
    'recent' | 'popular' | 'mostReviewed' | 'topRated'
  >('recent');
  const [offset, setOffset] = useState(0);

  const filters: CapstoneSubmissionFilters = {
    courseId,
    userId,
    sortBy,
    limit,
    offset,
  };

  const { data, isLoading, error } = useCapstoneSubmissions(filters);

  const handleLoadMore = () => {
    setOffset((prev) => prev + limit);
  };

  const handleSortChange = (
    value: 'recent' | 'popular' | 'mostReviewed' | 'topRated'
  ) => {
    setSortBy(value);
    setOffset(0);
  };

  if (isLoading && offset === 0) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {error.message || 'Failed to load submissions'}
        </AlertDescription>
      </Alert>
    );
  }

  const submissions = data?.data.submissions || [];
  const total = data?.data.total || 0;
  const hasMore = submissions.length + offset < total;

  if (submissions.length === 0 && offset === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold mb-2">No capstone projects yet</h3>
        <p className="text-muted-foreground">
          {courseId
            ? 'Be the first to submit a capstone project for this course!'
            : 'No capstone projects have been submitted yet.'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Sort */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Capstone Projects</h2>
          <p className="text-sm text-muted-foreground">
            {total} {total === 1 ? 'project' : 'projects'}
          </p>
        </div>

        <Select value={sortBy} onValueChange={handleSortChange}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Latest</SelectItem>
            <SelectItem value="popular">Popular</SelectItem>
            <SelectItem value="mostReviewed">Most Reviewed</SelectItem>
            <SelectItem value="topRated">Top Rated</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {submissions.map((submission) => (
          <CapstoneSubmissionCard
            key={submission.id}
            submission={submission}
            showActions={false}
          />
        ))}
      </div>

      {/* Load More */}
      {hasMore && (
        <div className="flex justify-center pt-4">
          <Button
            variant="outline"
            onClick={handleLoadMore}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              'Load More'
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
