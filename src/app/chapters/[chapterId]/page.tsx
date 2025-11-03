'use client';

import { LessonList } from '@/features/lessons/presentation/list/LessonList';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, ChevronRight, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React from 'react';
import { useGetChapter } from '@/features/chapters/application/useGetChapter';

const ChapterPage = () => {
  const params = useParams();
  const chapterId = params.chapterId as string;

  const { data: chapter, isLoading, isError } = useGetChapter(chapterId);

  if (isLoading) {
    return (
      <section className="flex flex-col min-h-screen w-full pb-10 pt-6">
        <div className="container mx-auto max-w-5xl">
          <Skeleton className="h-8 w-64 mb-8" />
          <Skeleton className="h-12 w-full mb-4" />
          <Skeleton className="h-96 w-full" />
        </div>
      </section>
    );
  }

  if (isError || !chapter) {
    return (
      <section className="flex flex-col min-h-screen w-full pb-10 pt-6">
        <div className="container mx-auto max-w-5xl">
          <Card className="border-red-500/20 bg-red-500/5">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
                <AlertCircle className="h-5 w-5" />
                <div>
                  <p className="font-semibold">Error Loading Chapter</p>
                  <p className="text-sm text-muted-foreground">
                    Unable to load chapter details. Please try again later.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-col min-h-screen w-full pb-10 pt-6">
      <div className="container mx-auto max-w-5xl">
        {/* Breadcrumb navigation */}
        <nav className="flex items-center text-sm text-muted-foreground mb-8 uppercase tracking-wider">
          <Link
            href="/courses"
            className="hover:text-foreground transition-colors font-medium"
          >
            Courses
          </Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <Link
            href={`/courses/${chapter.courseId}`}
            className="hover:text-foreground transition-colors font-medium"
          >
            {chapter.courseName}
          </Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span className="font-medium text-foreground">{chapter.title}</span>
        </nav>

        {/* Chapter Content */}
        <div className="space-y-6">
          {/* Chapter Header */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-primary">
              <BookOpen className="h-6 w-6" />
              <span className="text-sm font-medium uppercase tracking-wider">
                Chapter {chapter.chapterOrder}
              </span>
            </div>
            <h1 className="text-3xl font-bold">{chapter.title}</h1>
            <p className="text-muted-foreground text-lg">
              {chapter.description}
            </p>
          </div>

          {/* Chapter Details */}
          <Card>
            <CardContent className="pt-6">
              <div className="grid gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Learning Objectives</h3>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    {chapter.learningObjectives?.map((objective, idx) => (
                      <li key={idx}>{objective}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Key Topics</h3>
                  <div className="flex flex-wrap gap-2">
                    {chapter.keyTopics?.map((topic, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>Duration: {chapter.estimatedDuration}</span>
                  <span>•</span>
                  <span>{chapter.estimatedLessonCount} lessons</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lessons List */}
          <LessonList chapterId={chapterId} />
        </div>
      </div>
    </section>
  );
};

export default ChapterPage;
