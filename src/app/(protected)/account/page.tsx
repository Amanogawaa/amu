'use client';

import { useAuth } from '@/features/auth/application/AuthContext';
import {
  useAllProgress,
  useProgressSummary,
} from '@/features/progress/application/useProgress';
import { useProgressWithCourseDetails } from '@/features/progress/application/useProgressWithCourseDetails';
import { ProgressCard } from '@/features/progress/presentation/ProgressCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  User2Icon,
  BookOpen,
  TrendingUp,
  CheckCircle2,
  Award,
  ArrowUpDown,
} from 'lucide-react';
import React, { useState, useMemo } from 'react';
import { ProfilePictureSelector } from '@/features/user/presentation/ProfilePictureSelector';
import { UserProfileForm } from '@/features/user/presentation/UserProfileForm';
import { useUserProfile } from '@/features/user/application/useUser';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Link from 'next/link';
import { GitHubConnectButton } from '@/features/auth/presentation/GithubButton';

// TODO: here will be account settings and preferences management, where user will be able to update their profile and choose their profile image

// TODO: the image will be uploaded and displayed here, user can choose from a set of predefined images or upload their own

type SortOption = 'recent' | 'progress' | 'name';
type FilterOption = 'all' | 'in-progress' | 'completed' | 'not-started';

const AccountPage = () => {
  const { user } = useAuth();
  const { data: userProfile } = useUserProfile();
  const { data: progressSummary, isLoading: isSummaryLoading } =
    useProgressSummary();
  const { data: allProgress, isLoading: isProgressLoading } = useAllProgress();
  const { data: progressWithCourses, isLoading: isEnrichingProgress } =
    useProgressWithCourseDetails(allProgress);

  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');

  // Filtered and sorted progress
  const displayedProgress = useMemo(() => {
    if (!progressWithCourses) return [];

    // Filter
    let filtered = progressWithCourses.filter((p) => {
      if (filterBy === 'all') return true;
      if (filterBy === 'completed') return p.percentComplete === 100;
      if (filterBy === 'in-progress')
        return p.percentComplete > 0 && p.percentComplete < 100;
      if (filterBy === 'not-started') return p.percentComplete === 0;
      return true;
    });

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === 'recent') {
        return (
          new Date(b.lastActivityAt).getTime() -
          new Date(a.lastActivityAt).getTime()
        );
      }
      if (sortBy === 'progress') {
        return b.percentComplete - a.percentComplete;
      }
      if (sortBy === 'name') {
        return (a.courseName || '').localeCompare(b.courseName || '');
      }
      return 0;
    });

    return filtered;
  }, [progressWithCourses, sortBy, filterBy]);

  return (
    <section className="flex flex-col min-h-screen w-full pb-10">
      <div className="container mx-auto max-w-6xl ">
        {/* Profile Header */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mt-10">
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
                <User2Icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight uppercase">
                  MY PROFILE
                </h1>
                <p className="text-muted-foreground text-lg">
                  Track your learning progress and achievements
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* User Profile Card */}
        <Card className="mt-8">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="flex flex-col items-center gap-3">
                <Avatar className="h-32 w-32 border-4 border-primary/20">
                  <AvatarImage
                    src={user?.photoURL || '/profile_1'}
                    alt={user?.displayName || 'User profile'}
                  />
                  <AvatarFallback className="text-3xl">
                    {user?.email?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <ProfilePictureSelector currentPhotoURL={user?.photoURL} />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl font-bold">
                  {userProfile?.firstName || userProfile?.lastName
                    ? `${user?.displayName || ''} ${
                        userProfile.lastName || ''
                      }`.trim()
                    : user?.displayName || user?.uid}
                </h2>
                <p className="text-muted-foreground mt-1">{user?.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <GitHubConnectButton />

        {/* User Profile Edit Form */}
        <div className="mt-6">
          <UserProfileForm
            firstName={userProfile?.firstName}
            lastName={userProfile?.lastName}
          />
        </div>

        {/* Progress Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          {isSummaryLoading ? (
            <>
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
            </>
          ) : (
            <>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    Total Courses
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {progressSummary?.totalCourses || 0}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    In Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">
                    {progressSummary?.coursesInProgress || 0}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    Completed
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">
                    {progressSummary?.coursesCompleted || 0}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    Lessons Done
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-600">
                    {progressSummary?.totalLessonsCompleted || 0}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Course Progress List */}
        <div className="mt-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h2 className="text-2xl font-bold">My Courses</h2>
            <div className="flex flex-wrap gap-3">
              {/* Filter Buttons */}
              <div className="flex gap-2">
                <Button
                  variant={filterBy === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterBy('all')}
                >
                  All
                </Button>
                <Button
                  variant={filterBy === 'in-progress' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterBy('in-progress')}
                >
                  In Progress
                </Button>
                <Button
                  variant={filterBy === 'completed' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterBy('completed')}
                >
                  Completed
                </Button>
              </div>

              {/* Sort Select */}
              <Select
                value={sortBy}
                onValueChange={(value) => setSortBy(value as SortOption)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Recent Activity</SelectItem>
                  <SelectItem value="progress">Progress %</SelectItem>
                  <SelectItem value="name">Alphabetical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {isProgressLoading || isEnrichingProgress ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full mt-2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-2 w-full" />
                    <div className="flex justify-between mt-3">
                      <Skeleton className="h-3 w-20" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : displayedProgress && displayedProgress.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {displayedProgress.map((progress) => (
                <ProgressCard
                  key={progress.id}
                  progress={progress}
                  courseName={
                    progress.courseName ||
                    `Course ${progress.courseId.substring(0, 8)}`
                  }
                  courseDescription={progress.courseDescription}
                />
              ))}
            </div>
          ) : progressWithCourses && progressWithCourses.length > 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-center mb-4">
                  No courses match the selected filter.
                </p>
                <Button variant="outline" onClick={() => setFilterBy('all')}>
                  Show All Courses
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-center mb-4">
                  No courses enrolled yet. Start learning by exploring our
                  courses!
                </p>
                <Link href="/explore">
                  <Button>Explore Courses</Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
};

export default AccountPage;
