'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/features/auth/application/AuthContext';
import { useProgressSummary } from '@/features/progress/application/useProgress';
import {
  usePublicProfile,
  usePublicUserAnalytics,
} from '@/features/user/application/useUser';
import PrivateStatus from '@/features/user/presentation/components/PrivateStatus';
import { ProfileHeader } from '@/features/user/presentation/components/ProfileHeader';
import { OverviewTab } from '@/features/user/presentation/tabs';
import { AnalyticsTab } from '@/features/user/presentation/tabs/AnalyticsTab';
import { ArrowLeft, TrendingUp, User2Icon } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React from 'react';

const AccountVisitPage = () => {
  const params = useParams();
  const router = useRouter();
  const userId = params.userId as string;

  const { user } = useAuth();
  const { data: publicProfile, isLoading: isProfileLoading } =
    usePublicProfile(userId);
  const { data: progressSummary, isLoading: isSummaryLoading } =
    useProgressSummary({
      isPublished: true,
    });
  const { data: publicAnalytics, isLoading: isAnalyticsLoading } =
    usePublicUserAnalytics(userId);

  console.log(progressSummary);

  console.log(publicProfile);
  React.useEffect(() => {
    if (user?.uid === userId) {
      router.push('/account');
    }
  }, [user?.uid, userId, router]);

  if (isProfileLoading) {
    return (
      <section className="flex flex-col min-h-screen w-full pb-10">
        <div className="container mx-auto max-w-6xl">
          <div className="mt-10">
            <Skeleton className="h-12 w-64" />
          </div>
          <Card className="mt-8">
            <CardContent className="pt-6">
              <div className="flex items-center gap-6">
                <Skeleton className="h-32 w-32 rounded-full" />
                <div className="flex-1 space-y-4">
                  <Skeleton className="h-8 w-48" />
                  <Skeleton className="h-4 w-64" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  if (!publicProfile) {
    return (
      <section className="flex flex-col min-h-screen w-full pb-10">
        <div className="container mx-auto max-w-6xl">
          <div className="mt-10">
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground">User not found</p>
                <Button
                  variant="outline"
                  onClick={() => router.back()}
                  className="mt-4"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Go Back
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    );
  }

  if (publicProfile.isPrivate) {
    const displayName =
      publicProfile.firstName || publicProfile.lastName
        ? `${publicProfile.firstName || ''} ${
            publicProfile.lastName || ''
          }`.trim()
        : undefined;
    return <PrivateStatus userName={displayName} />;
  }

  return (
    <section className="flex flex-col min-h-screen w-full pb-10">
      <div className="container mx-auto max-w-6xl">
        {/* Page Header */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mt-10">
          <div className="space-y-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="mb-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
                <User2Icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight uppercase">
                  USER PROFILE
                </h1>
                <p className="text-muted-foreground text-lg">
                  Viewing{' '}
                  {publicProfile.firstName || publicProfile.lastName
                    ? `${publicProfile.firstName || ''} ${
                        publicProfile.lastName || ''
                      }`.trim()
                    : 'user'}
                  's profile
                </p>
              </div>
            </div>
          </div>
        </div>
        <ProfileHeader
          user={null}
          userProfile={publicProfile}
          isPublicView={true}
        />
        <OverviewTab
          progressSummary={progressSummary}
          isLoading={isSummaryLoading}
        />
        <Tabs defaultValue="analytics" className="mt-10">
          <TabsList className="grid w-full grid-cols-1 lg:w-[200px]">
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analytics" className="mt-6">
            <AnalyticsTab
              analytics={publicAnalytics}
              isLoading={isAnalyticsLoading}
            />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default AccountVisitPage;
