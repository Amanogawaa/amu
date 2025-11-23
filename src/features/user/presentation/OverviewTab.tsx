import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { BookOpen, TrendingUp, CheckCircle2, Award } from 'lucide-react';
import type { ProgressSummaryDomain } from '@/features/progress/domain/types';

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

  const stats = [
    {
      title: 'Total Courses',
      value: progressSummary?.totalCourses || 0,
      icon: BookOpen,
      color: 'text-foreground',
    },
    {
      title: 'In Progress',
      value: progressSummary?.coursesInProgress || 0,
      icon: TrendingUp,
      color: 'text-blue-600',
    },
    {
      title: 'Completed',
      value: progressSummary?.coursesCompleted || 0,
      icon: CheckCircle2,
      color: 'text-green-600',
    },
    {
      title: 'Lessons Done',
      value: progressSummary?.totalLessonsCompleted || 0,
      icon: Award,
      color: 'text-purple-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Icon className="h-4 w-4" />
                {stat.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${stat.color}`}>
                {stat.value}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
