import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Heart, Users, MessageSquare, BookMarked } from 'lucide-react';
import type { UserAnalytics } from '../domain/types';

interface AnalyticsStatsCardsProps {
  analytics: UserAnalytics | undefined;
  isLoading: boolean;
}

export function AnalyticsStatsCards({
  analytics,
  isLoading,
}: AnalyticsStatsCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="relative overflow-hidden border-2">
            <CardHeader className="pb-3">
              <Skeleton className="h-5 w-28" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-10 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!analytics) return null;

  const stats = [
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
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat) => {
        const Icon = stat.icon;
        const isHeart = stat.icon === Heart;

        return (
          <Card
            key={stat.title}
            className={`relative overflow-hidden border-2 border-${
              stat.color
            }/20 hover:border-${
              stat.color
            }/40 transition-all duration-300 hover:shadow-lg ${
              stat.color !== 'primary' ? `hover:shadow-${stat.color}/10` : ''
            } group`}
          >
            <div
              className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-${stat.color}/20 to-transparent rounded-bl-full`}
            />
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  {stat.title}
                </CardTitle>
                <div
                  className={`p-2 rounded-lg bg-${stat.color}/10 group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon
                    className={`h-5 w-5 text-${stat.color} ${
                      isHeart ? 'group-hover:fill-red-500' : ''
                    } transition-all duration-300`}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div
                className={`text-4xl font-bold ${
                  stat.color === 'primary'
                    ? 'bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent'
                    : `text-${stat.color}`
                }`}
              >
                {stat.value}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
