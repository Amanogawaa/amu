import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  Code,
  Eye,
  GitFork,
  Heart,
  Star,
  ExternalLink,
  Trophy,
} from 'lucide-react';
import { MetricStatsGrid, type MetricStat } from './MetricStatsGrid';
import type { CapstoneSubmission } from '@/server/features/capstone/types';

interface CapstoneAnalyticsSectionProps {
  submissions: CapstoneSubmission[] | undefined;
  total?: number;
  isLoading?: boolean;
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export function CapstoneAnalyticsSection({
  submissions,
  total = 0,
  isLoading,
}: CapstoneAnalyticsSectionProps) {
  if (isLoading) {
    return <MetricStatsGrid isLoading skeletonCount={4} />;
  }

  if (!submissions || submissions.length === 0) {
    return (
      <Card>
        <CardContent className="py-10 text-center space-y-4">
          <Trophy className="h-12 w-12 text-muted-foreground mx-auto" />
          <div>
            <h3 className="text-xl font-semibold">No Capstone submissions yet</h3>
            <p className="text-muted-foreground mt-2">
              Submit a capstone project to start tracking detailed repository
              analytics.
            </p>
          </div>
          <Link href="/capstone">
            <Button>Go to Capstone Hub</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  const aggregate = submissions.reduce(
    (acc, submission) => {
      const { repoMetadata } = submission;
      if (repoMetadata) {
        acc.totalStars += repoMetadata.stars || 0;
        acc.totalForks += repoMetadata.forks || 0;
        if (repoMetadata.language) {
          acc.languageCount[repoMetadata.language] =
            (acc.languageCount[repoMetadata.language] || 0) + 1;
        }
      }
      acc.totalViews += submission.viewCount || 0;
      acc.totalLikes += submission.likeCount || 0;
      if (submission.averageRating !== undefined) {
        acc.ratingSum += submission.averageRating;
        acc.ratingCount += 1;
      }
      return acc;
    },
    {
      totalStars: 0,
      totalForks: 0,
      totalViews: 0,
      totalLikes: 0,
      ratingSum: 0,
      ratingCount: 0,
      languageCount: {} as Record<string, number>,
    }
  );

  const primaryLanguage =
    Object.entries(aggregate.languageCount).sort((a, b) => b[1] - a[1])[0]?.[0] ||
    'N/A';
  const averageRating =
    aggregate.ratingCount > 0
      ? (aggregate.ratingSum / aggregate.ratingCount).toFixed(1)
      : 'N/A';

  const stats: MetricStat[] = [
    {
      title: 'Primary Language',
      value: primaryLanguage,
      icon: Code,
      color: 'primary',
      description: 'Most used across submissions',
    },
    {
      title: 'Repo Stars',
      value: aggregate.totalStars,
      icon: Star,
      color: 'yellow-500',
      description: 'Stars across GitHub repos',
    },
    {
      title: 'Repo Forks',
      value: aggregate.totalForks,
      icon: GitFork,
      color: 'blue-500',
      description: 'Forks across repos',
    },
    {
      title: 'Views',
      value: aggregate.totalViews,
      icon: Eye,
      color: 'cyan-500',
      description: 'Total submission views',
    },
    {
      title: 'Likes',
      value: aggregate.totalLikes,
      icon: Heart,
      color: 'red-500',
      description: 'Hearts from peers',
      iconFillOnHover: true,
    },
    {
      title: 'Average Rating',
      value: averageRating,
      icon: Star,
      color: 'amber-500',
      description: 'Average of peer reviews',
    },
  ];

  const latestSubmission = [...submissions].sort(
    (a, b) =>
      new Date(b.updatedAt || b.submittedAt).getTime() -
      new Date(a.updatedAt || a.submittedAt).getTime()
  )[0];

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h3 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Capstone Analytics
          </h3>
          <p className="text-muted-foreground mt-1">
            Track how your capstone projects perform across the platform
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary">
          Total Submissions: {total}
        </div>
      </div>

      <MetricStatsGrid stats={stats} />

      {latestSubmission && (
        <Card>
          <CardHeader>
            <CardTitle className="flex flex-col gap-1">
              <span className="text-sm text-muted-foreground uppercase tracking-wide">
                Latest Repository
              </span>
              <span>{latestSubmission.title}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Owner</p>
              <a
                href={`https://github.com/${latestSubmission.githubRepoOwner}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium hover:text-primary inline-flex items-center gap-1"
              >
                {latestSubmission.githubRepoOwner}
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>

            <Separator />

            <div>
              <p className="text-sm text-muted-foreground mb-1">Repository</p>
              <a
                href={latestSubmission.githubRepoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium hover:text-primary inline-flex items-center gap-1"
              >
                {latestSubmission.githubRepoName}
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>

            <Separator />

            <div className="flex flex-wrap gap-6 text-sm">
              <div>
                <p className="text-muted-foreground mb-1">Last Updated</p>
                <p className="font-medium">
                  {latestSubmission.repoMetadata?.lastUpdated
                    ? formatDate(latestSubmission.repoMetadata.lastUpdated)
                    : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Visibility</p>
                <Badge
                  variant={
                    latestSubmission.repoMetadata?.isPrivate
                      ? 'secondary'
                      : 'default'
                  }
                >
                  {latestSubmission.repoMetadata?.isPrivate ? 'Private' : 'Public'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

