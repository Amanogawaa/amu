"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/features/auth/application/AuthContext";
import { useEnrollmentStatus } from "@/features/enrollment/application/useEnrollment";
import { EnrollmentPrompt } from "@/features/enrollment/presentation/EnrollmentPrompt";
import { ModuleList } from "@/features/modules/presentation/list/ModuleList";
import { useProgressForCourse } from "@/features/progress/application/useProgress";
import { CourseStatusBadge } from "@/features/progress/presentation/CourseStatusBadge";
import { ProgressBar } from "@/features/progress/presentation/ProgressBar";
import { AlertCircle } from "lucide-react";
import { useGetCourse } from "../../application/useGetCourses";
import { CourseInfoCard } from "../card/CourseInfoCard";
import { CourseContent } from "./CourseContent";
import { CourseHeader } from "./CourseHeader";
import { CourseValidationStatus } from "./CourseValidationStatus";

const CourseDetailPage = ({ courseId }: { courseId: string }) => {
  const { data, isLoading, isError } = useGetCourse(courseId);
  const { user } = useAuth();
  const { data: progress, isLoading: progressLoading } =
    useProgressForCourse(courseId);
  const { data: enrollmentStatus, isLoading: enrollmentLoading } =
    useEnrollmentStatus(courseId);

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

  return (
    <div className="space-y-6">
      <CourseHeader
        courseId={courseId}
        name={data.name}
        subtitle={data.subtitle}
        category={data.category}
        level={data.level}
        ownerId={data.uid}
        isPublished={data.publish}
        isDraft={data.draft}
      />

      <CourseInfoCard
        duration={data.duration}
        noOfModules={data.noOfModules}
        language={data.language}
        level={data.level}
      />

      {!enrollmentLoading &&
        !enrollmentStatus?.isEnrolled &&
        user?.uid != data.uid && (
          <EnrollmentPrompt courseId={courseId} variant="banner" />
        )}

      {!progressLoading && progress && enrollmentStatus?.isEnrolled && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">Your Progress</h3>
                <CourseStatusBadge percentComplete={progress.percentComplete} />
              </div>
              <ProgressBar
                percent={progress.percentComplete}
                showLabel
                size="lg"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>
                  {progress.lessonsCompleted.length} of {progress.totalLessons}{" "}
                  lessons completed
                </span>
                <span>{progress.percentComplete}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <CourseContent
        description={data.description}
        learningOutcomes={data.learning_outcomes}
        prerequisites={data.prequisites}
      />

      <ModuleList courseId={courseId} />
    </div>
  );
};

export default CourseDetailPage;
