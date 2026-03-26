"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ChapterList } from "@/features/chapters/presentation/list/ChapterList";
import { EnrollmentPrompt } from "@/features/enrollment/presentation/EnrollmentPrompt";
import { useProgressForCourse } from "@/features/progress/application/useProgress";
import { CourseStatusBadge } from "@/features/progress/presentation/CourseStatusBadge";
import { ProgressBar } from "@/features/progress/presentation/ProgressBar";
import { AlertCircle, CheckCircle2Icon } from "lucide-react";
import { useCourseContext } from "../../application/useCourseContext";
import { useGetCourse } from "../../application/useGetCourses";
import { CourseContent } from "./CourseContent";
import { CourseCreatorCard } from "./CourseCreatorCard";
import { CourseHeader } from "./CourseHeader";
import { CommentList } from "@/features/comments/presentation/CommentList";
import { RecommendationList } from "@/features/recommendations/presentation/RecommendationList";

type CourseDetailContext = "course" | "my-learning" | "learn";

interface CourseDetailPageProps {
  courseId: string;
  context?: CourseDetailContext;
}

const CourseDetailPage = ({
  courseId,
  context = "course",
}: CourseDetailPageProps) => {
  const { data, isLoading, isError } = useGetCourse(courseId);
  const courseCtx = useCourseContext(courseId);
  const { data: progress, isLoading: progressLoading } =
    useProgressForCourse(courseId);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-start gap-4">
          <Skeleton className="h-16 w-16 rounded-xl" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <Card className="border-red-500/20 bg-red-500/5">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
            <AlertCircle className="h-5 w-5" />
            <div>
              <p className="font-semibold">Error Loading Course</p>
              <p className="text-sm text-muted-foreground">
                Unable to load course details. Please try again later.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Determine if we should show progress bar
  const showProgressBar =
    context === "my-learning"
      ? !progressLoading &&
        progress &&
        (courseCtx.isEnrolled || courseCtx.isOwner)
      : context === "course"
        ? !progressLoading && progress && courseCtx.isEnrolled
        : false;

  // Determine if we should show comments (my-learning view only)
  const showComments = context === "my-learning";

  return (
    <div>
      <CourseHeader
        courseId={courseId}
        name={data.name}
        subtitle={data.subtitle}
        category={data.category}
        level={data.level}
        ownerId={data.uid}
        isPublished={data.publish}
        isDrafted={data.draft}
        duration={data.duration}
        noOfChapters={data.noOfChapters}
        language={data.language}
      />

      {/* Grid layout with sidebar - visible in all contexts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          <CourseContent
            description={data.description}
            learningOutcomes={data.learning_outcomes}
            prerequisites={data.prerequisites}
          />
          <ChapterList courseId={courseId} courseOwnerId={data.uid} />

          {showComments && (
            <Card>
              <CardContent className="pt-6">
                <CommentList courseId={courseId} />
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {showProgressBar && (
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg">Your Progress</h3>
                    <CourseStatusBadge
                      percentComplete={progress!.percentComplete}
                    />
                  </div>
                  <ProgressBar
                    percent={progress!.percentComplete}
                    showLabel
                    size="lg"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>
                      {progress!.lessonsCompleted.length} of{" "}
                      {progress!.totalLessons} lessons completed
                    </span>
                    <span>{progress!.percentComplete}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {!courseCtx.isLoading &&
            !courseCtx.isEnrolled &&
            !courseCtx.isOwner && (
              <EnrollmentPrompt courseId={courseId} variant="card" />
            )}

          {/* Instructor Card */}
          <CourseCreatorCard creatorId={data.uid} />

          {/* What You'll Learn */}
          {data.learning_outcomes && data.learning_outcomes.length > 0 && (
            <Card className="shadow-none">
              <CardContent className="pt-6 ">
                <h3 className="font-semibold text-base mb-4">
                  What You'll Learn
                </h3>
                <ul className="space-y-2">
                  {data.learning_outcomes.map((outcome, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <CheckCircle2Icon className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{outcome}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Prerequisites */}
          {data.prerequisites && (
            <Card className="shadow-none">
              <CardContent className="pt-6">
                <h3 className="font-semibold text-base mb-3">Prerequisites</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {data.prerequisites}
                </p>
              </CardContent>
            </Card>
          )}

          <RecommendationList
            courseId={data.uid}
            type={"learning-continuity"}
          />
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;
