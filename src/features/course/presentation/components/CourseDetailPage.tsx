'use client';

import React from 'react';
import { useGetCourse } from '../../application/useGetCourses';
import { ChapterList } from '../../../chapters/presentation/list/ChapterList';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { CourseContent } from './CourseContent';
import { CourseHeader } from './CourseHeader';
import { CourseInfoCard } from '../card/CourseInfoCard';

const CourseDetailPage = ({ courseId }: { courseId: string }) => {
  const { data, isLoading, isError } = useGetCourse(courseId);

  console.log('Course Detail Data:', data);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-start gap-4">
          <Skeleton className="h-16 w-16 rounded-xl" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <Card className="border-red-500/20 bg-red-500/5">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
            <AlertCircle className="h-5 w-5" />
            <div>
              <p className="font-semibold">Error Loading Course</p>
              <p className="text-sm text-muted-foreground">
                Unable to load course details. Please try again later.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <CourseHeader
        name={data.name}
        subtitle={data.subtitle}
        category={data.category}
        level={data.level}
      />

      <CourseInfoCard
        duration={data.duration}
        noOfChapters={data.noOfChapters}
        language={data.language}
        includeCertificate={data.include_certificate}
        level={data.level}
      />

      <CourseContent
        description={data.description}
        learningOutcomes={data.learning_outcomes}
        prerequisites={data.prequisites}
      />

      <ChapterList courseId={courseId} />
    </div>
  );
};

export default CourseDetailPage;
