import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProgressBar } from './ProgressBar';
import { CourseStatusBadge } from './CourseStatusBadge';
import type { UserProgress } from '@/server/features/progress/types';
import Link from 'next/link';

interface ProgressCardProps {
  progress: UserProgress;
  courseName?: string;
  courseDescription?: string;
}

export function ProgressCard({
  progress,
  courseName,
  courseDescription,
}: ProgressCardProps) {
  const lastActivity = new Date(progress.lastActivityAt).toLocaleDateString(
    'en-US',
    {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }
  );

  return (
    <Link href={`/courses/${progress.courseId}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-lg">{courseName || 'Course'}</CardTitle>
            <CourseStatusBadge percentComplete={progress.percentComplete} />
          </div>
          {courseDescription && (
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {courseDescription}
            </p>
          )}
        </CardHeader>
        <CardContent>
          <ProgressBar percent={progress.percentComplete} />
          <div className="flex justify-between text-xs text-muted-foreground mt-3">
            <span>
              {progress.lessonsCompleted.length} / {progress.totalLessons}{' '}
              lessons
            </span>
            <span>Last activity: {lastActivity}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
