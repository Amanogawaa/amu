import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { LucideIcon } from 'lucide-react';

export interface MetricStat {
  title: string;
  value: number | string;
  icon: LucideIcon;
  color?: string;
  description?: string;
  iconFillOnHover?: boolean;
}

interface MetricStatsGridProps {
  stats?: MetricStat[];
  isLoading?: boolean;
  skeletonCount?: number;
}

const baseGridClass =
  'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8';

export function MetricStatsGrid({
  stats = [],
  isLoading,
  skeletonCount = 4,
}: MetricStatsGridProps) {
  if (isLoading) {
    return (
      <div className={baseGridClass}>
        {[...Array(skeletonCount)].map((_, i) => (
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

  if (!stats.length) {
    return null;
  }

  return (
    <div className={baseGridClass}>
      {stats.map((stat) => {
        const Icon = stat.icon;
        const color = stat.color || 'primary';

        return (
          <Card
            key={stat.title}
            className={`relative overflow-hidden border-2 border-${color}/20 hover:border-${color}/40 transition-all duration-300 hover:shadow-lg group`}
          >
            <div
              className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-${color}/20 to-transparent rounded-bl-full`}
            />
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  {stat.title}
                </CardTitle>
                <div
                  className={`p-2 rounded-lg bg-${color}/10 group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon
                    className={`h-5 w-5 text-${color} ${
                      stat.iconFillOnHover ? 'group-hover:fill-current' : ''
                    } transition-all duration-300`}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div
                className={`text-4xl font-bold ${
                  color === 'primary'
                    ? 'bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent'
                    : `text-${color}`
                }`}
              >
                {stat.value}
              </div>
              {stat.description && (
                <p className="text-xs text-muted-foreground mt-2">
                  {stat.description}
                </p>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

