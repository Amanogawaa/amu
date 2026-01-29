"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/features/auth/application/AuthContext";
import { useGetCourse } from "@/features/course/application/useGetCourses";
import { useEnrollmentStatus } from "@/features/enrollment/application/useEnrollment";
import { EnrollmentPrompt } from "@/features/enrollment/presentation/EnrollmentPrompt";
import { useGetLesson } from "@/features/lessons/application/useGetLesson";
import { useLessonCourse } from "@/features/lessons/application/useLessonCourse";
import { useCourseLessonCount } from "@/features/progress/application/useCourseLessonCount";
import { useProgressForCourse } from "@/features/progress/application/useProgress";
import {
  useQuizForLesson,
  useUserAttempts,
} from "@/features/quiz/application/useQuiz";
import { AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { LessonHeader } from "./LessonHeader";
import { LessonVideoContent } from "./LessonVideoContent";
import { LessonQuizContent } from "./LessonQuizContent";
import { LessonArticleContent } from "./LessonArticleContent";
import { LessonMetadata } from "./LessonMetadata";
import { CodePlaygroundSection } from "./CodePlaygroundSection";

interface LessonContentProps {
  lessonId: string;
}

export const LessonContent = ({ lessonId }: LessonContentProps) => {
  const { data: lesson, isLoading, isError } = useGetLesson(lessonId);
  const { data: quiz, isLoading: quizLoading } = useQuizForLesson(lessonId);
  const { data: attempts } = useUserAttempts(quiz?.id || "", {
    enabled: !!quiz?.id && lesson?.type === "quiz",
  });
  const { data: courseInfo } = useLessonCourse(lessonId);
  const { data: course, isLoading: courseLoading } = useGetCourse(
    courseInfo?.courseId || "",
  );
  const { data: progress } = useProgressForCourse(courseInfo?.courseId || "");
  const { data: totalLessons } = useCourseLessonCount(
    courseInfo?.courseId || "",
  );
  const { data: enrollmentStatus, isLoading: enrollmentLoading } =
    useEnrollmentStatus(courseInfo?.courseId || "", !!courseInfo?.courseId);
  const { user } = useAuth();
  const [hasLocalQuizPass, setHasLocalQuizPass] = useState(false);

  const isOwner = user?.uid === course?.uid;
  const isEnrolled = enrollmentStatus?.isEnrolled || false;
  const hasAccess = isOwner || isEnrolled;

  useEffect(() => {
    setHasLocalQuizPass(false);
  }, [lessonId]);

  // For quiz lessons, check if user has passed the quiz
  // For non-quiz lessons, they don't need to pass a quiz
  const hasRemoteQuizPass = (() => {
    // If it's not a quiz lesson, no quiz requirement
    if (lesson?.type !== "quiz") {
      return true;
    }

    // If it's a quiz lesson but no quiz exists yet, can't mark complete
    if (!quiz) {
      return false;
    }

    // If attempts are still loading, don't allow completion yet
    if (attempts === undefined) {
      return false;
    }

    // Check if user has at least one passed attempt
    return attempts.some((attempt) => attempt.passed);
  })();

  useEffect(() => {
    if (hasRemoteQuizPass) {
      setHasLocalQuizPass(true);
    }
  }, [hasRemoteQuizPass]);

  const hasPassedQuiz = hasLocalQuizPass || hasRemoteQuizPass;

  const quizDisabledReason =
    lesson?.type === "quiz" && quiz && !hasPassedQuiz
      ? attempts && attempts.length > 0
        ? "You must pass the quiz before marking this lesson as complete"
        : "You must complete and pass the quiz before marking this lesson as complete"
      : undefined;

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (isError || !lesson) {
    return (
      <Card className="border-red-500/20 bg-red-500/5">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
            <AlertCircle className="h-5 w-5" />
            <div>
              <p className="font-semibold">Error Loading Lesson</p>
              <p className="text-sm text-muted-foreground">
                Unable to load lesson details. Please try again later.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6 w-full">
      <LessonHeader
        lesson={lesson}
        lessonId={lessonId}
        courseId={courseInfo?.courseId}
        totalLessons={totalLessons}
        isCompleted={progress?.lessonsCompleted?.includes(lessonId) || false}
        hasAccess={hasAccess}
        canMarkComplete={hasPassedQuiz}
        disabledReason={quizDisabledReason}
      />

      {/* Enrollment Gate - Only show if not owner and not enrolled */}
      {!enrollmentLoading &&
        !courseLoading &&
        !hasAccess &&
        courseInfo?.courseId && (
          <EnrollmentPrompt
            courseId={courseInfo.courseId}
            variant="card"
            title="Enroll to access this lesson"
            benefits={[
              "Watch video lessons and access transcripts",
              "Read detailed lesson content and resources",
              "Complete quizzes and track your progress",
              "Unlock all course materials",
            ]}
          />
        )}

      {/* Lesson Content - Show if owner OR enrolled */}
      {hasAccess && (
        <>
          {lesson.type === "video" && (
            <LessonVideoContent
              lessonId={lessonId}
              videoSearchQuery={lesson.videoSearchQuery!}
              selectedVideoId={lesson.selectedVideoId}
            />
          )}

          {lesson.type === "quiz" && (
            <LessonQuizContent
              quiz={quiz}
              quizLoading={quizLoading}
              lessonId={lessonId}
              onQuizPassed={() => setHasLocalQuizPass(true)}
            />
          )}

          {lesson.type === "article" && (
            <LessonArticleContent content={lesson.content!} />
          )}

          {course?.supportsCodePlayground && lesson.type === "article" && (
            <CodePlaygroundSection
              lesson={lesson}
              courseId={courseInfo?.courseId}
              courseLanguage={course?.language}
            />
          )}

          <LessonMetadata lesson={lesson} />
        </>
      )}
    </div>
  );
};
