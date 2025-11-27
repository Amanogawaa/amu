import { Heart, Users, MessageSquare, BookMarked } from 'lucide-react';
import type { UserAnalytics } from '../domain/types';
import { MetricStatsGrid, type MetricStat } from './MetricStatsGrid';

interface AnalyticsStatsCardsProps {
  analytics: UserAnalytics | undefined;
  isLoading: boolean;
}

export function AnalyticsStatsCards({
  analytics,
  isLoading,
}: AnalyticsStatsCardsProps) {
  if (!analytics && !isLoading) return null;

  const stats: MetricStat[] = analytics
    ? [
    {
      title: 'Courses Created',
      value: analytics.totalCoursesCreated,
      icon: BookMarked,
      color: 'primary',
      description: 'Total published courses',
    },
    {
      title: 'Total Likes',
      value: analytics.totalLikesReceived,
      icon: Heart,
      color: 'red-500',
      description: 'Hearts from learners',
    },
    {
      title: 'Enrollments',
      value: analytics.totalEnrollments,
      icon: Users,
      color: 'blue-500',
      description: 'Active students learning',
    },
    {
      title: 'Comments',
      value: analytics.totalComments,
      icon: MessageSquare,
      color: 'purple-500',
      description: 'Community engagement',
    },
    ]
    : [];

  if (stats.length) {
    stats[1].iconFillOnHover = true; // Heart fill animation
  }

  return <MetricStatsGrid stats={stats} isLoading={isLoading} />;
}
