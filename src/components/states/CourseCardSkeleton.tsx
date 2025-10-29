import React from 'react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const CourseCardSkeleton = () => {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          {/* Title skeleton */}
          <div className="flex-1 space-y-2">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-3/4" />
          </div>
          {/* Badge skeleton */}
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
        {/* Subtitle skeleton */}
        <Skeleton className="h-4 w-2/3 mt-2" />
      </CardHeader>

      <CardContent className="flex-1 pb-3">
        {/* Description skeleton */}
        <div className="space-y-2 mb-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>

        {/* Course Info Grid skeleton */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded" />
            <Skeleton className="h-4 w-20" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>

        {/* Learning Outcomes skeleton */}
        <div className="mt-4 pt-4 border-t border-border">
          <Skeleton className="h-4 w-32 mb-2" />
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <Skeleton className="h-2 w-2 rounded-full mt-1" />
              <Skeleton className="h-3 w-full" />
            </div>
            <div className="flex items-start gap-2">
              <Skeleton className="h-2 w-2 rounded-full mt-1" />
              <Skeleton className="h-3 w-5/6" />
            </div>
          </div>
          <Skeleton className="h-3 w-16 mt-2" />
        </div>
      </CardContent>

      <CardFooter className="pt-4 border-t border-border">
        <Skeleton className="h-10 w-full rounded-lg" />
      </CardFooter>
    </Card>
  );
};

export default CourseCardSkeleton;
