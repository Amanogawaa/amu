'use client';

import { BookOpenIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface CourseHeaderProps {
  name: string;
  subtitle?: string;
  category: string;
  level: string;
}

export const CourseHeader = ({
  name,
  subtitle,
  category,
  level,
}: CourseHeaderProps) => {
  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'beginner':
        return 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20';
      case 'intermediate':
        return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20';
      case 'advanced':
        return 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20';
      default:
        return 'bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20';
    }
  };

  return (
    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-8">
      <div className="space-y-4 flex-1">
        <div className="flex items-start gap-4">
          <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
            <BookOpenIcon className="h-8 w-8 text-primary" />
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <Badge variant="outline" className="text-xs">
                {category}
              </Badge>
              <Badge
                variant="outline"
                className={`text-xs capitalize ${getLevelColor(level)}`}
              >
                {level}
              </Badge>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
              {name}
            </h1>
            {subtitle && (
              <p className="text-muted-foreground text-base mt-2">{subtitle}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
