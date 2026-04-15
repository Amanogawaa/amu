"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CapstoneGallery } from "@/features/capstone/presentation";
import { QuickActions } from "@/features/dashboard/presentation/QuickActions";
import { useRefreshRecommendations } from "@/features/recommendations/application";
import { RecommendationList } from "@/features/recommendations/presentation/RecommendationList";
import { Sparkles } from "lucide-react";
import { useInfiniteListMyCourses } from "@/features/course/application/useGetCourses";
import { useUserEnrollments } from "@/features/enrollment/application/useEnrollment";
import { CourseCard } from "@/features/dashboard/presentation";

const DashboardPage = () => {
  // Fetch user's generated courses
  const {
    data: generatedCoursesData,
    isLoading: isGeneratedLoading,
    error: generatedError,
  } = useInfiniteListMyCourses({ draft: true }, true);

  // Fetch user's enrolled courses
  const {
    data: enrolledData,
    isLoading: isEnrolledLoading,
    error: enrolledError,
  } = useUserEnrollments({ status: "active" }, true);

  const { mutate: refresh, isPending } = useRefreshRecommendations();

  // Extract courses from paginated response
  const generatedCourses = generatedCoursesData?.pages?.[0]?.results || [];

  // Extract enrolled courses from enrollment data
  const enrolledCourses =
    enrolledData?.map((enrollment) => enrollment.course) || [];

  return (
    <section className="flex flex-col min-h-screen w-full pb-10">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="py-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back! 👋</h1>
          <p className="text-muted-foreground">
            Continue your learning journey and reach your goals
          </p>
        </div>

        {/* Main Grid Layout */}
        <div className="space-y-8">
          {/* Left Column - Main Content */}
          <div className="space-y-6">
            {/* Stats */}
            {/* <DashboardStats /> */}
            {/* Quick Actions */}
            <QuickActions />
            {/* Courses Tabs */}
            <Tabs defaultValue="enrolled" className="w-full">
              <TabsList className="grid w-full grid-cols-2 max-w-md">
                <TabsTrigger value="enrolled">Enrolled Courses</TabsTrigger>
                <TabsTrigger value="generated">My Generated</TabsTrigger>
              </TabsList>

              <TabsContent value="enrolled" className="mt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-semibold">Your Courses</h2>
                    <p className="text-sm text-muted-foreground">
                      {enrolledCourses.length} courses
                    </p>
                  </div>
                  {isEnrolledLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <p className="text-muted-foreground">
                        Loading your courses...
                      </p>
                    </div>
                  ) : enrolledError ? (
                    <div className="flex items-center justify-center py-12">
                      <p className="text-destructive">Failed to load courses</p>
                    </div>
                  ) : enrolledCourses.length === 0 ? (
                    <div className="flex items-center justify-center py-12">
                      <p className="text-muted-foreground">
                        No enrolled courses yet. Start learning!
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {enrolledCourses.map((course) => (
                        <CourseCard
                          key={course.id}
                          course={course}
                          context="learn"
                        />
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="generated" className="mt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-semibold">
                      Generated Courses
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {generatedCourses.length} courses
                    </p>
                  </div>
                  {isGeneratedLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <p className="text-muted-foreground">
                        Loading your generated courses...
                      </p>
                    </div>
                  ) : generatedError ? (
                    <div className="flex items-center justify-center py-12">
                      <p className="text-destructive">
                        Failed to load generated courses
                      </p>
                    </div>
                  ) : generatedCourses.length === 0 ? (
                    <div className="flex items-center justify-center py-12">
                      <p className="text-muted-foreground">
                        No generated courses yet. Create your first one!
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {generatedCourses.map((course) => (
                        <CourseCard
                          key={course.id}
                          course={course}
                          context="course"
                        />
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-12 space-y-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-foreground">
                    Capstone Gallery
                  </h2>
                  <p className="text-muted-foreground">
                    Explore standout projects from fellow learners
                  </p>
                </div>
              </div>
              <CapstoneGallery limit={12} />
            </div>
          </div>

          {/* Recommendations Section */}
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-semibold mb-2">
                Recommended for You
              </h2>
              <p className="text-sm text-muted-foreground">
                Courses based on your interests
              </p>
            </div>
            <RecommendationList type="liked-based" context="dashboard" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardPage;
