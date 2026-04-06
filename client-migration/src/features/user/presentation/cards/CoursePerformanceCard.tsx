import Link from 'next/link';
import { Heart, Users, MessageSquare, TrendingUp, BookOpen } from 'lucide-react';
import type { CourseAnalytics } from '../../domain/types';

interface CoursePerformanceCardProps {
  course: CourseAnalytics;
  isVisiting?: boolean;
}

export function CoursePerformanceCard({ course, isVisiting = false }: CoursePerformanceCardProps) {
  const engagementScore = Math.min(
    100,
    Math.round(
      (course.likesCount +
        course.commentsCount * 2 +
        course.enrollmentsCount * 0.5) /
        3
    )
  );

  // Simplified view for visitors - only show course name
  if (isVisiting) {
    return (
      <div className="p-6 hover:bg-muted/30 transition-all duration-200 group">
        <Link
          href={`/courses/${course.courseId}`}
          className="flex items-center gap-4 group"
        >
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 group-hover:from-primary/30 group-hover:to-primary/20 transition-all duration-200">
            <BookOpen className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold group-hover:text-primary transition-colors duration-200 truncate">
              {course.courseName}
            </h3>
            <p className="text-sm text-muted-foreground mt-0.5">
              Created on{' '}
              {new Date(course.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
          <TrendingUp className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
        </Link>
      </div>
    );
  }

  // Full analytics view for course owner
  return (
    <div className="p-6 hover:bg-muted/50 transition-colors duration-200 group">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Course Info */}
        <div className="flex-1 min-w-0">
          <Link
            href={`/courses/${course.courseId}`}
            className="text-lg font-semibold hover:text-primary transition-colors duration-200 group-hover:underline inline-flex items-center gap-2"
          >
            {course.courseName}
            <TrendingUp className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
          <p className="text-sm text-muted-foreground mt-1">
            Created on{' '}
            {new Date(course.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>

        {/* Metrics */}
        <div className="flex flex-wrap gap-6 lg:gap-8">
          {/* Likes */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-500/10">
              <Heart className="h-5 w-5 text-red-500" />
            </div>
            <div>
              <div className="text-2xl font-bold text-red-500">
                {course.likesCount}
              </div>
              <div className="text-xs text-muted-foreground">Likes</div>
            </div>
          </div>

          {/* Enrollments */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500/10">
              <Users className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-500">
                {course.enrollmentsCount}
              </div>
              <div className="text-xs text-muted-foreground">Students</div>
            </div>
          </div>

          {/* Comments */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-500/10">
              <MessageSquare className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-500">
                {course.commentsCount}
              </div>
              <div className="text-xs text-muted-foreground">Comments</div>
            </div>
          </div>
        </div>
      </div>

      {/* Engagement Score Bar */}
      <div className="mt-4">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
          <span>Engagement Score</span>
          <span className="font-medium">{engagementScore}%</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-red-500 via-blue-500 to-purple-500 rounded-full transition-all duration-500"
            style={{ width: `${engagementScore}%` }}
          />
        </div>
      </div>
    </div>
  );
}
