'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/features/auth/application/AuthContext';
import { useCapstoneSubmissions } from '@/features/capstone/application/useCapstoneSubmissions';
import {
  useAllProgress,
  useProgressSummary,
} from '@/features/progress/application/useProgress';
import { useProgressWithCourseDetails } from '@/features/progress/application/useProgressWithCourseDetails';
import { useUserAnalytics } from '@/features/user/application/useUser';
import { OverviewTab, LearningTab, AnalyticsTab } from '@/features/user/presentation/tabs';
import { BookOpen, TrendingUp, User2Icon } from 'lucide-react';

const AnalyticsPage = () => {
  const { user } = useAuth();
  const { data: userAnalytics, isLoading: isAnalyticsLoading } =
    useUserAnalytics();
  const { data: progressSummary, isLoading: isSummaryLoading } =
    useProgressSummary();
  const { data: allProgress, isLoading: isProgressLoading } = useAllProgress();
  const { data: progressWithCourses, isLoading: isEnrichingProgress } =
    useProgressWithCourseDetails(allProgress);
  const { data: capstoneSubmissionsData, isLoading: isCapstoneLoading } =
    useCapstoneSubmissions(user?.uid ? { userId: user.uid } : undefined, {
      enabled: Boolean(user?.uid),
    });

  const isLearningLoading = isProgressLoading || isEnrichingProgress;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">
          Track your learning progress and achievements
        </p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
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
            capstoneSubmissions={capstoneSubmissionsData?.data.submissions}
            capstoneTotal={capstoneSubmissionsData?.data.total}
            isCapstoneLoading={isCapstoneLoading}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsPage;
