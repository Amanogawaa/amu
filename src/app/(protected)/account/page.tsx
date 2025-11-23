'use client';

import { useAuth } from '@/features/auth/application/AuthContext';
import {
  useAllProgress,
  useProgressSummary,
} from '@/features/progress/application/useProgress';
import { useProgressWithCourseDetails } from '@/features/progress/application/useProgressWithCourseDetails';
import { User2Icon, BookOpen, TrendingUp } from 'lucide-react';
import React from 'react';
import {
  useUserProfile,
  useUserAnalytics,
} from '@/features/user/application/useUser';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProfileHeader } from '@/features/user/presentation/ProfileHeader';
import { UserProfileForm } from '@/features/user/presentation/UserProfileForm';
import { OverviewTab } from '@/features/user/presentation/OverviewTab';
import { LearningTab } from '@/features/user/presentation/LearningTab';
import { AnalyticsTab } from '@/features/user/presentation/AnalyticsTab';

const AccountPage = () => {
  const { user } = useAuth();
  const { data: userProfile } = useUserProfile();
  const { data: userAnalytics, isLoading: isAnalyticsLoading } =
    useUserAnalytics();
  const { data: progressSummary, isLoading: isSummaryLoading } =
    useProgressSummary();
  const { data: allProgress, isLoading: isProgressLoading } = useAllProgress();
  const { data: progressWithCourses, isLoading: isEnrichingProgress } =
    useProgressWithCourseDetails(allProgress);

  const isLearningLoading = isProgressLoading || isEnrichingProgress;

  return (
    <section className="flex flex-col min-h-screen w-full pb-10">
      <div className="container mx-auto max-w-6xl">
        {/* Page Header */}
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

        <ProfileHeader user={user} userProfile={userProfile} />

        <div className="mt-6">
          <UserProfileForm
            firstName={userProfile?.firstName}
            lastName={userProfile?.lastName}
          />
        </div>

        <Tabs defaultValue="overview" className="mt-10">
          <TabsList className="grid w-full grid-cols-3 lg:w-[500px]">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <User2Icon className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="learning" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              My Learning
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <OverviewTab
              progressSummary={progressSummary}
              isLoading={isSummaryLoading}
            />
          </TabsContent>

          <TabsContent value="learning" className="mt-6">
            <LearningTab
              progressWithCourses={progressWithCourses}
              isLoading={isLearningLoading}
            />
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            <AnalyticsTab
              analytics={userAnalytics}
              isLoading={isAnalyticsLoading}
            />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default AccountPage;
