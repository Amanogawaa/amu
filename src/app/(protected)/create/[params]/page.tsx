'use client';

import { redirect, useParams } from 'next/navigation';
import React from 'react';
import dynamic from 'next/dynamic';
import { useGetCourse } from '@/features/course/application/useGetCourses';
import { useGetModules } from '@/features/modules/application/useGetModules';
import {
  useValidateCourse,
  usePublishCourse,
} from '@/features/create/application/usePublishCourse';
import {
  useArchiveCourse,
  useUnarchiveCourse,
} from '@/features/create/application/useArchiveCourse';
import { CoursePreviewSkeleton } from '@/features/create/presentation/CoursePreview';
import { PublishArchiveActions } from '@/features/create/presentation/PublishArchiveActions';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Chapter } from '@/server/features/chapters/types';
import { Lesson } from '@/server/features/lessons/types';
import { getChapters } from '@/server/features/chapters';
import { getLessons } from '@/server/features/lessons';
import { useQuery } from '@tanstack/react-query';
import { useGetLessons } from '@/features/lessons/application/useGetLesson';
import { useRouter } from 'next/navigation';

const CoursePreview = dynamic(
  () =>
    import('@/features/create/presentation/CoursePreview').then((mod) => ({
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
    queryKey: ['all-chapters', courseId, modules],
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
    queryKey: ['all-lessons', courseId, allChapters],
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
    allChapters.length > 0 ? allChapters[0].id : ''
  );

  const { mutate: publishCourse, isPending: isPublishing } = usePublishCourse();
  const { mutate: archiveCourse, isPending: isArchiving } = useArchiveCourse();
  const { mutate: unarchiveCourse, isPending: isUnarchiving } =
    useUnarchiveCourse();

  if (!courseId) {
    redirect('/create');
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

  const handleArchive = () => {
    archiveCourse(courseId);
  };

  const handleUnarchive = () => {
    unarchiveCourse(courseId);
  };

  return (
    <section className="flex flex-col min-h-screen w-full pb-10">
      <div className="container mx-auto max-w-6xl py-10 px-4">
        <div className="mb-8 space-y-4">
          <div className="flex items-center justify-between">
            <Link href="/create">
              <Button variant="ghost" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Create
              </Button>
            </Link>
            <Link href={`/courses/${courseId}`}>
              <Button variant="outline" className="gap-2">
                Preview Course
              </Button>
            </Link>
          </div>

          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              Review & Publish Your Course
            </h1>
            <p className="text-muted-foreground mt-2 text-base md:text-lg">
              Review your course content and choose to publish it publicly or
              archive it for later.
            </p>
          </div>
        </div>

        <div className="mb-8">
          <PublishArchiveActions
            course={course}
            validation={validationData?.data}
            isValidating={isValidating}
            onPublish={handlePublish}
            onArchive={handleArchive}
            onUnarchive={handleUnarchive}
            isPublishing={isPublishing}
            isArchiving={isArchiving}
            isUnarchiving={isUnarchiving}
          />
        </div>

        <CoursePreview
          course={course}
          modules={modules}
          chapters={allChapters}
          lessons={allLessons}
        />
      </div>
    </section>
  );
};

export default PublishPage;
