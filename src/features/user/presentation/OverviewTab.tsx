import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { BookOpen, TrendingUp, CheckCircle2, Award } from 'lucide-react';
import type { ProgressSummaryDomain } from '@/features/progress/domain/types';
import { MetricStatsGrid, type MetricStat } from './MetricStatsGrid';

interface OverviewTabProps {
  progressSummary: ProgressSummaryDomain | undefined;
  isLoading: boolean;
}

export function OverviewTab({ progressSummary, isLoading }: OverviewTabProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const stats: MetricStat[] = [
    {
      title: 'Total Courses',
      value: progressSummary?.totalCourses || 0,
      icon: BookOpen,
      color: 'primary',
      description: 'Courses you’re enrolled in',
    },
    {
      title: 'In Progress',
      value: progressSummary?.coursesInProgress || 0,
      icon: TrendingUp,
      color: 'blue-500',
      description: 'Actively learning now',
    },
    {
      title: 'Completed',
      value: progressSummary?.coursesCompleted || 0,
      icon: CheckCircle2,
      color: 'green-500',
      description: 'Finished courses',
    },
    {
      title: 'Lessons Done',
      value: progressSummary?.totalLessonsCompleted || 0,
      icon: Award,
      color: 'purple-500',
      description: 'Lessons completed overall',
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Learning Overview
          </h2>
          <p className="text-muted-foreground mt-1">
            Snapshot of your current learning progress
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary">
          Total Courses: {progressSummary?.totalCourses || 0}
        </div>
      </div>

      <MetricStatsGrid stats={stats} />
    </div>
  );
}
