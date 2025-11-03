'use client';

import { useAuth } from '@/features/auth/application/AuthContext';
import {
  useAllProgress,
  useProgressSummary,
} from '@/features/progress/application/useProgress';
import { ProgressCard } from '@/features/progress/presentation/ProgressCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  User2Icon,
  BookOpen,
  TrendingUp,
  CheckCircle2,
  Award,
} from 'lucide-react';
import React from 'react';

// TODO: here will be account settings and preferences management, where user will be able to update their profile and choose their profile image

// TODO: the image will be uploaded and displayed here, user can choose from a set of predefined images or upload their own

const AccountPage = () => {
  const { user } = useAuth();
  const { data: progressSummary, isLoading: isSummaryLoading } =
    useProgressSummary();
  const { data: allProgress, isLoading: isProgressLoading } = useAllProgress();

  console.log('Authenticated user:', user?.uid);

  return (
    <section className="flex flex-col min-h-screen w-full pb-10">
      <div className="container mx-auto max-w-6xl ">
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
          <h2 className="text-2xl font-bold mb-4">My Courses</h2>
          {isProgressLoading ? (
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
          ) : allProgress && allProgress.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {allProgress.map((progress) => (
                <ProgressCard
                  key={progress.id}
                  progress={progress}
                  courseName={`Course ${progress.courseId.substring(0, 8)}`}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-center">
                  No courses enrolled yet. Start learning by exploring our
                  courses!
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
};

export default AccountPage;
