import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookMarked, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { AnalyticsStatsCards } from './AnalyticsStatsCards';
import { CoursePerformanceList } from './CoursePerformanceList';
import { CapstoneAnalyticsSection } from './CapstoneAnalyticsSection';
import type { UserAnalytics } from '../domain/types';
import type { CapstoneSubmission } from '@/server/features/capstone/types';

interface AnalyticsTabProps {
  analytics: UserAnalytics | undefined;
  isLoading: boolean;
  capstoneSubmissions?: CapstoneSubmission[];
  capstoneTotal?: number;
  isCapstoneLoading?: boolean;
}

export function AnalyticsTab({
  analytics,
  isLoading,
  capstoneSubmissions,
  capstoneTotal,
  isCapstoneLoading,
}: AnalyticsTabProps) {
  if (!isLoading && (!analytics || analytics.totalCoursesCreated === 0)) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-20">
          <BookMarked className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Courses Created Yet</h3>
          <p className="text-muted-foreground text-center mb-6 max-w-md">
            Start creating courses to see your analytics and track your impact
            as an educator.
          </p>
          <Link href="/create">
            <Button size="lg">
              <BookMarked className="mr-2 h-5 w-5" />
              Create Your First Course
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Creator Analytics
          </h2>
          <p className="text-muted-foreground mt-1">
            Track your course performance and engagement
          </p>
        </div>
        {analytics && (
          <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
            <TrendingUp className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              {analytics.totalCoursesCreated}{' '}
              {analytics.totalCoursesCreated === 1 ? 'Course' : 'Courses'}
            </span>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <AnalyticsStatsCards analytics={analytics} isLoading={isLoading} />

      {/* Course Performance */}
      <CoursePerformanceList analytics={analytics} isLoading={isLoading} />

      <CapstoneAnalyticsSection
        submissions={capstoneSubmissions}
        total={capstoneTotal}
        isLoading={isCapstoneLoading}
      />
    </>
  );
}
