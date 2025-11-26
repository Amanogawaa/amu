"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/features/auth/application/AuthContext";
import { CapstoneGuidelineCard } from "@/features/capstone/presentation/card/CapstoneGuidelineCard";
import { useGetCourse } from "@/features/course/application/useGetCourses";
import { CourseValidationStatus } from "@/features/course/presentation/components/CourseValidationStatus";
import {
  useDraftCourse,
  useUndraftCourse,
} from "@/features/create/application/useDraftCourse";
import {
  usePublishCourse,
  useValidateCourse,
} from "@/features/create/application/usePublishCourse";
import { CoursePreviewSkeleton } from "@/features/create/presentation/CoursePreview";
import { PublishDraftActions } from "@/features/create/presentation/PublishDraftActions";
import { useGetLessons } from "@/features/lessons/application/useGetLesson";
import { useGetModules } from "@/features/modules/application/useGetModules";
import { getChapters } from "@/server/features/chapters";
import { Chapter } from "@/server/features/chapters/types";
import { getLessons } from "@/server/features/lessons";
import { Lesson } from "@/server/features/lessons/types";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, ArrowLeft } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { redirect, useParams, useRouter } from "next/navigation";

const CoursePreview = dynamic(
  () =>
    import("@/features/create/presentation/CoursePreview").then((mod) => ({
      default: mod.CoursePreview,
    })),
  {
    loading: () => <CoursePreviewSkeleton />,
    ssr: false,
  }
);

const PublishPage = () => {
  const params = useParams();
  const router = useRouter();
  const courseId = params.params as string;

  const { user } = useAuth();

  const {
    data: course,
    isLoading: isCourseLoading,
    isError: isCourseError,
  } = useGetCourse(courseId);
  const { data: modules = [], isLoading: isModulesLoading } =
    useGetModules(courseId);

  const { data: validationData, isLoading: isValidating } =
    useValidateCourse(courseId);

  const { data: allChapters = [], isLoading: isChaptersLoading } = useQuery({
    queryKey: ["all-chapters", courseId, modules],
    queryFn: async () => {
      if (modules.length === 0) return [];

      const chaptersPromises = modules.map((module) =>
        getChapters(module.id).catch(() => [])
      );
      const chaptersArrays = await Promise.all(chaptersPromises);
      return chaptersArrays.flat() as Chapter[];
    },
    enabled: modules.length > 0,
  });

  const { data: allLessons = [], isLoading: isLessonsLoading } = useQuery({
    queryKey: ["all-lessons", courseId, allChapters],
    queryFn: async () => {
      if (allChapters.length === 0) return [];

      const lessonsPromises = allChapters.map((chapter) =>
        getLessons(chapter.id).catch(() => [])
      );
      const lessonsArrays = await Promise.all(lessonsPromises);
      return lessonsArrays.flat() as Lesson[];
    },
    enabled: allChapters.length > 0,
  });

  const { data: lessons } = useGetLessons(
    allChapters.length > 0 ? allChapters[0].id : ""
  );

  const { mutate: publishCourse, isPending: isPublishing } = usePublishCourse();
  const { mutate: moveToDraft, isPending: isDrafting } = useDraftCourse();
  const { mutate: restoreFromDraft, isPending: isUndrafting } =
    useUndraftCourse();

  if (!courseId) {
    redirect("/create");
  }

  const isLoading =
    isCourseLoading ||
    isModulesLoading ||
    isChaptersLoading ||
    isLessonsLoading;

  if (isLoading) {
    return (
      <section className="flex flex-col min-h-screen w-full">
        <div className="container mx-auto max-w-6xl py-10 px-4">
          <div className="mb-6">
            <Link href="/create">
              <Button variant="ghost" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Create
              </Button>
            </Link>
          </div>
          <CoursePreviewSkeleton />
        </div>
      </section>
    );
  }

  if (isCourseError || !course) {
    return (
      <section className="flex flex-col min-h-screen w-full">
        <div className="container mx-auto max-w-6xl py-10 px-4">
          <div className="mb-6">
            <Button onClick={() => router.back()}>
              <Button variant="ghost" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Create
              </Button>
            </Button>
          </div>
          <Card className="border-destructive">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-destructive">
                <AlertCircle className="h-5 w-5" />
                <p className="font-semibold">Failed to load course</p>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                The course you're looking for could not be found or you don't
                have permission to view it.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  const handlePublish = () => {
    publishCourse(courseId);
  };

  const handleDraft = () => {
    moveToDraft(courseId);
  };

  const handleUndraft = () => {
    restoreFromDraft(courseId);
  };

  return (
    <section className="flex flex-col min-h-screen w-full pb-10">
      <div className="container mx-auto max-w-6xl py-10 px-4 space-y-6">
        <div className="mb-8 space-y-4">
          <div className="flex items-center justify-between">
            <Link href="/create">
              <Button variant="ghost" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Create
              </Button>
            </Link>
          </div>

          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              Review & Publish Your Course
            </h1>
            <p className="text-muted-foreground mt-2 text-base md:text-lg">
              Review your course content and choose to publish it publicly or
              save it as a draft for later.
            </p>
          </div>
        </div>

        <PublishDraftActions
          course={course}
          validation={validationData?.data}
          isValidating={isValidating}
          onPublish={handlePublish}
          onDraft={handleDraft}
          onUndraft={handleUndraft}
          isPublishing={isPublishing}
          isDrafting={isDrafting}
          isUndrafting={isUndrafting}
        />

        {user?.uid === course.uid && (
          <div className="space-y-6">
            <CourseValidationStatus courseId={courseId} />
            {/* <ManualGenerationPanel
              courseId={courseId}
              modules={modules}
              chapters={allChapters}
              lessons={allLessons}
              missingComponents={validationData?.data?.missingComponents}
            /> */}
          </div>
        )}

        <CoursePreview
          course={course}
          modules={modules}
          chapters={allChapters}
          lessons={allLessons}
        />

        <CapstoneGuidelineCard courseId={courseId} />
      </div>
    </section>
  );
};

export default PublishPage;
