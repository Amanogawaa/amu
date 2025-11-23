import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { BookMarked } from 'lucide-react';
import { CoursePerformanceCard } from './CoursePerformanceCard';
import type { UserAnalytics } from '../domain/types';

interface CoursePerformanceListProps {
  analytics: UserAnalytics | undefined;
  isLoading: boolean;
}

export function CoursePerformanceList({
  analytics,
  isLoading,
}: CoursePerformanceListProps) {
  return (
    <Card className="border-2 border-border/50 shadow-lg">
      <CardHeader className="border-b bg-muted/30 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold">
              Course Performance
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Detailed analytics for each of your courses
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="p-6 space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : analytics && analytics.courses.length > 0 ? (
          <div className="divide-y divide-border">
            {analytics.courses.map((course) => (
              <CoursePerformanceCard key={course.courseId} course={course} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <BookMarked className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">
              No courses found
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
