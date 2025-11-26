'use client';

import React from 'react';
import { useGetCapstoneSubmission } from '@/features/capstone/application/useGetCapstoneSubmission';
import { useToggleCapstoneLike } from '@/features/capstone/application/useToggleCapstoneLike';
import { useGetCapstoneLikeStatus } from '@/features/capstone/application/useGetCapstoneLikeStatus';
import { useAuth } from '@/features/auth/application/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Github,
  ExternalLink,
  Heart,
  Star,
  Calendar,
  Code,
  GitFork,
  Eye,
  MessageSquare,
  ArrowLeft,
  AlertCircle,
} from 'lucide-react';
import Link from 'next/link';
import { CapstoneReviewForm } from '@/features/capstone/presentation';
import { CapstoneReviewList } from '@/features/capstone/presentation';
import { ScreenshotManager } from '@/features/capstone/presentation/ScreenshotManager';
import { GitHubRepoViewer } from '@/features/github/presentation';
import { useRouter } from 'next/navigation';
import { useDeleteCapstoneReview } from '@/features/capstone/application/useDeleteCapstoneReview';
import { useDeleteCapstoneSubmission } from '@/features/capstone/application/useDeleteCapstoneSubmission';

interface CapstoneSubmissionPageProps {
  params: Promise<{
    submissionId: string;
  }>;
}

export default function CapstoneSubmissionPage({
  params,
}: CapstoneSubmissionPageProps) {
  const { submissionId } = React.use(params);
  const { user } = useAuth();
  const router = useRouter();

  const { data: submissionResponse, isLoading } =
    useGetCapstoneSubmission(submissionId);
  const toggleLike = useToggleCapstoneLike();
  const { data: likeStatus } = useGetCapstoneLikeStatus(submissionId);
  const deleteSubmission = useDeleteCapstoneSubmission();

  const submission = submissionResponse?.data;
  const isLiked = likeStatus?.data?.liked || false;

  if (isLoading) {
    return (
      <div className="container max-w-6xl mx-auto py-8">
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-96" />
            <Skeleton className="h-64" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-64" />
          </div>
        </div>
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="container max-w-6xl py-8">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Capstone submission not found or has been removed.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const isOwner = user?.uid === submission.userId;

  const handleLike = () => {
    toggleLike.mutate(submissionId);
  };

  const handleDeleteSubmission = () => {
    deleteSubmission.mutate(submissionId);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="container max-w-6xl mx-auto py-8">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Gallery
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="space-y-4">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">
                    {submission.title}
                  </h1>
                  <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Submitted on {formatDate(submission.submittedAt)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="" alt="Author" />
                    <AvatarFallback>
                      {submission.userId.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">
                      {submission.userId}
                      {isOwner && (
                        <Badge variant="secondary" className="ml-2">
                          You
                        </Badge>
                      )}
                    </p>
                    <a
                      href={`https://github.com/${submission.githubRepoOwner}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-muted-foreground hover:text-primary inline-flex items-center gap-1"
                    >
                      <Github className="h-3 w-3" />@
                      {submission.githubRepoOwner}
                    </a>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button asChild className="flex-1">
                    <a
                      href={submission.githubRepoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Github className="mr-2 h-4 w-4" />
                      View on GitHub
                      <ExternalLink className="ml-2 h-3 w-3" />
                    </a>
                  </Button>
                  <Button
                    variant={isLiked ? 'default' : 'outline'}
                    size="icon"
                    onClick={handleLike}
                    disabled={toggleLike.isPending}
                  >
                    <Heart
                      className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`}
                    />
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>About This Project</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {submission.description}
              </p>
            </CardContent>
          </Card>

          {/* Screenshots */}
          <ScreenshotManager
            submissionId={submissionId}
            screenshots={submission.screenshots || []}
            canEdit={isOwner}
          />

          {/* GitHub Repository Viewer */}
          {/* <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Github className="h-5 w-5" />
                Repository Code
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[600px]">
                <GitHubRepoViewer
                  owner={submission.githubRepoOwner}
                  repo={submission.githubRepoName}
                />
              </div>
            </CardContent>
          </Card> */}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Reviews & Feedback
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {!isOwner && user && (
                <>
                  <div>
                    <h3 className="text-sm font-semibold mb-3">
                      Write a Review
                    </h3>
                    <CapstoneReviewForm capstoneSubmissionId={submissionId} />
                  </div>
                  <Separator />
                </>
              )}

              <CapstoneReviewList
                onDelete={handleDeleteSubmission}
                capstoneSubmissionId={submissionId}
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Repository Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <Code className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Language</span>
                </div>
                <Badge variant="secondary">
                  {submission.repoMetadata?.language || 'N/A'}
                </Badge>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <Star className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Stars</span>
                </div>
                <span className="font-semibold">
                  {submission.repoMetadata?.stars || 0}
                </span>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <GitFork className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Forks</span>
                </div>
                <span className="font-semibold">
                  {submission.repoMetadata?.forks || 0}
                </span>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <Eye className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Views</span>
                </div>
                <span className="font-semibold">{submission.viewCount}</span>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <Heart className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Likes</span>
                </div>
                <span className="font-semibold">{submission.likeCount}</span>
              </div>

              {submission.averageRating !== undefined && (
                <>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="text-muted-foreground">
                        Average Rating
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-semibold">
                        {submission.averageRating.toFixed(1)}
                      </span>
                      <span className="text-sm text-muted-foreground">/5</span>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Repository</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Owner</p>
                <a
                  href={`https://github.com/${submission.githubRepoOwner}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium hover:text-primary inline-flex items-center gap-1"
                >
                  {submission.githubRepoOwner}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>

              <Separator />

              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Repository Name
                </p>
                <a
                  href={submission.githubRepoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium hover:text-primary inline-flex items-center gap-1"
                >
                  {submission.githubRepoName}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>

              <Separator />

              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Last Updated
                </p>
                <p className="text-sm font-medium">
                  {submission.repoMetadata?.lastUpdated
                    ? formatDate(submission.repoMetadata.lastUpdated)
                    : 'N/A'}
                </p>
              </div>

              <Separator />

              <div>
                <p className="text-sm text-muted-foreground mb-1">Visibility</p>
                <Badge
                  variant={
                    submission.repoMetadata?.isPrivate ? 'secondary' : 'default'
                  }
                >
                  {submission.repoMetadata?.isPrivate ? 'Private' : 'Public'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Actions for Owner */}
          {isOwner && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Manage</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
             
                <Button
                  variant="outline"
                  onClick={handleDeleteSubmission}
                  className="w-full text-red-600 hover:text-red-700"
                >
                  Delete Submission
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
