"use client";

import { DashboardStats } from "@/features/dashboard/presentation/DashboardStats";
import { StreakCalendar } from "@/features/dashboard/presentation/StreakCalendar";
import { Leaderboard } from "@/features/dashboard/presentation/Leaderboard";
import { CourseCard } from "@/features/dashboard/presentation/CourseCard";
import { QuickActions } from "@/features/dashboard/presentation/QuickActions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RecommendationList } from "@/features/recommendations/presentation/RecommendationList";
import { Button } from "@/components/ui/button";
import { useRefreshRecommendations } from "@/features/recommendations/application";
import { CapstoneGallery } from "@/features/capstone/presentation";
import { Sparkles } from "lucide-react";

const DashboardPage = () => {
  // Mock data for generated courses
  const generatedCourses = [
    {
      title: "Introduction to React Hooks",
      description:
        "Master the fundamentals of React Hooks and state management",
      progress: 65,
      totalLessons: 12,
      completedLessons: 8,
      estimatedTime: "4 hours",
      difficulty: "Intermediate" as const,
      category: "Web Development",
      isGenerated: true,
    },
    {
      title: "Python for Data Science",
      description:
        "Learn Python basics and data analysis with pandas and numpy",
      progress: 30,
      totalLessons: 20,
      completedLessons: 6,
      estimatedTime: "8 hours",
      difficulty: "Beginner" as const,
      category: "Data Science",
      isGenerated: true,
    },
    {
      title: "Advanced TypeScript Patterns",
      description:
        "Deep dive into advanced TypeScript features and design patterns",
      progress: 0,
      totalLessons: 15,
      completedLessons: 0,
      estimatedTime: "6 hours",
      difficulty: "Advanced" as const,
      category: "Programming",
      isGenerated: true,
    },
  ];

  const { mutate: refresh, isPending } = useRefreshRecommendations();

  // Mock data for enrolled courses
  const enrolledCourses = [
    {
      title: "Full Stack Web Development",
      description: "Complete guide to building modern web applications",
      progress: 45,
      totalLessons: 30,
      completedLessons: 14,
      estimatedTime: "15 hours",
      difficulty: "Intermediate" as const,
      category: "Web Development",
      isGenerated: false,
    },
    {
      title: "Machine Learning Fundamentals",
      description: "Introduction to ML algorithms and practical applications",
      progress: 78,
      totalLessons: 18,
      completedLessons: 14,
      estimatedTime: "10 hours",
      difficulty: "Advanced" as const,
      category: "AI/ML",
      isGenerated: false,
    },
    {
      title: "Database Design & SQL",
      description: "Learn database concepts and SQL query optimization",
      progress: 90,
      totalLessons: 10,
      completedLessons: 9,
      estimatedTime: "5 hours",
      difficulty: "Beginner" as const,
      category: "Backend",
      isGenerated: false,
    },
    {
      title: "UI/UX Design Principles",
      description: "Master user interface and user experience design",
      progress: 20,
      totalLessons: 16,
      completedLessons: 3,
      estimatedTime: "7 hours",
      difficulty: "Beginner" as const,
      category: "Design",
      isGenerated: false,
    },
  ];

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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {enrolledCourses.map((course, index) => (
                      <CourseCard key={index} {...course} />
                    ))}
                  </div>
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {generatedCourses.map((course, index) => (
                      <CourseCard key={index} {...course} />
                    ))}
                  </div>
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
            {/* <Button
              onClick={() => refresh({ type: "liked-based" })}
              disabled={isPending}
            >
              Refresh Recommendations
            </Button> */}
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
