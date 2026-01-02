"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/application/AuthContext";
import {
  useEnrollmentStatus,
  useEnrollCourse,
} from "@/features/enrollment/application/useEnrollment";
import { ModuleList } from "@/features/modules/presentation/list/ModuleList";
import { useProgressForCourse } from "@/features/progress/application/useProgress";
import { CourseStatusBadge } from "@/features/progress/presentation/CourseStatusBadge";
import { ProgressBar } from "@/features/progress/presentation/ProgressBar";
import {
  AlertCircle,
  Clock,
  Video,
  Code,
  Users,
  BookmarkIcon,
  MoreHorizontal,
  Calendar,
} from "lucide-react";
import { useGetCourse } from "../../application/useGetCourses";
import { CourseCreatorCard } from "./CourseCreatorCard";
import { useState } from "react";

const CourseDetailPage = ({ courseId }: { courseId: string }) => {
  const { data, isLoading, isError } = useGetCourse(courseId);
  const { user } = useAuth();
  const { data: progress, isLoading: progressLoading } =
    useProgressForCourse(courseId);
  const { data: enrollmentStatus, isLoading: enrollmentLoading } =
    useEnrollmentStatus(courseId);
  const { mutate: enroll, isPending: isEnrolling } = useEnrollCourse();
  const [showFullDescription, setShowFullDescription] = useState(false);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-950 dark:to-slate-900 rounded-xl p-8">
          <Skeleton className="h-6 w-32 mb-4" />
          <Skeleton className="h-10 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
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

  const isOwner = user?.uid === data.uid;
  const isEnrolled = enrollmentStatus?.isEnrolled || false;
  const showEnrollButton = !isEnrolled && !isOwner;

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "beginner":
        return "bg-green-500/10 text-green-600 dark:text-green-400";
      case "intermediate":
        return "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400";
      case "advanced":
        return "bg-red-500/10 text-red-600 dark:text-red-400";
      default:
        return "bg-gray-500/10 text-gray-600 dark:text-gray-400";
    }
  };

  const handleEnroll = () => {
    enroll(courseId);
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-950 dark:to-slate-900 rounded-xl p-8 text-white">
        <div className="flex items-center gap-2 mb-4">
          <Badge variant="secondary" className="text-xs uppercase font-medium">
            Interactive Course
          </Badge>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold mb-3">{data.name}</h1>

        {data.subtitle && (
          <p className="text-lg text-slate-300 mb-6">{data.subtitle}</p>
        )}

        <div className="flex flex-wrap items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Badge className={getLevelColor(data.level)}>
              {data.level.charAt(0).toUpperCase() + data.level.slice(1)}
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <Calendar className="h-4 w-4" />
            <span>
              Updated:{" "}
              {new Date(
                data.updatedAt || data.createdAt || ""
              ).toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mt-6">
          {showEnrollButton && (
            <Button
              size="lg"
              className="bg-green-500 hover:bg-green-600 text-white"
              onClick={handleEnroll}
              disabled={isEnrolling}
            >
              {isEnrolling ? "Enrolling..." : "Continue"}
            </Button>
          )}
          {isEnrolled && !isOwner && (
            <Button
              size="lg"
              className="bg-green-500 hover:bg-green-600 text-white"
            >
              Continue Learning
            </Button>
          )}
          <Button
            size="lg"
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10"
          >
            <BookmarkIcon className="h-4 w-4 mr-2" />
            Bookmark
          </Button>
          <Button
            size="lg"
            variant="ghost"
            className="text-white hover:bg-white/10"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="flex items-center gap-3 p-4 border rounded-lg">
          <Clock className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="text-sm text-muted-foreground">Duration</p>
            <p className="font-semibold">{data.duration}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4 border rounded-lg">
          <Video className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="text-sm text-muted-foreground">Modules</p>
            <p className="font-semibold">{data.noOfModules}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4 border rounded-lg">
          <Code className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="text-sm text-muted-foreground">Exercises</p>
            <p className="font-semibold">{data.noOfModules * 10}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4 border rounded-lg">
          <Users className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="text-sm text-muted-foreground">Students</p>
            <p className="font-semibold">{data.enrollmentCount || 0}+</p>
          </div>
        </div>
      </div>

      {/* Progress Section */}
      {!progressLoading && progress && isEnrolled && (
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

      {/* Description */}
      <Card>
        <CardContent className="pt-6">
          <h2 className="text-xl font-bold mb-4">Description</h2>
          <div
            className={`text-muted-foreground ${
              !showFullDescription && "line-clamp-3"
            }`}
          >
            {data.description}
          </div>
          {data.description && data.description.length > 200 && (
            <Button
              variant="link"
              className="p-0 h-auto mt-2"
              onClick={() => setShowFullDescription(!showFullDescription)}
            >
              {showFullDescription ? "Read Less" : "Read Less"} ↑
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Prerequisites */}
      {data.prerequisites && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-2">Prerequisites</h3>
                <p className="text-sm text-muted-foreground">
                  {data.prerequisites}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Creator Info */}
      <CourseCreatorCard creatorId={data.uid} createdAt={data.createdAt} />

      {/* Course Content */}
      <ModuleList courseId={courseId} />
    </div>
  );
};

export default CourseDetailPage;
