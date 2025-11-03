'use client';

import { ChapterList } from '@/features/chapters/presentation/list/ChapterList';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, ChevronRight, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React from 'react';
import { useGetModules } from '@/features/modules/application/useGetModules';

const ModulePage = () => {
  const params = useParams();
  const moduleId = params.moduleId as string;

  // Get all modules to find the current one
  // Note: Ideally the backend should have a GET /modules/:moduleId endpoint
  const { data: modules, isLoading, isError } = useGetModules('');

  const currentModule = modules?.find((m) => m.id === moduleId);

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

  if (isError || !currentModule) {
    return (
      <section className="flex flex-col min-h-screen w-full pb-10 pt-6">
        <div className="container mx-auto max-w-5xl">
          <Card className="border-red-500/20 bg-red-500/5">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
                <AlertCircle className="h-5 w-5" />
                <div>
                  <p className="font-semibold">Error Loading Module</p>
                  <p className="text-sm text-muted-foreground">
                    Unable to load module details. Please try again later.
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
        <nav className="flex items-center text-sm text-muted-foreground mb-8 uppercase tracking-wider">
          <Link
            href="/courses"
            className="hover:text-foreground transition-colors font-medium"
          >
            Courses
          </Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <Link
            href={`/courses/${currentModule.courseId}`}
            className="hover:text-foreground transition-colors font-medium"
          >
            Course
          </Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span className="font-medium text-foreground">
            {currentModule.moduleName}
          </span>
        </nav>

        {/* Module Content */}
        <div className="space-y-6">
          {/* Module Header */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-primary">
              <BookOpen className="h-6 w-6" />
              <span className="text-sm font-medium uppercase tracking-wider">
                Module {currentModule.moduleOrder}
              </span>
            </div>
            <h1 className="text-3xl font-bold">{currentModule.moduleName}</h1>
            <p className="text-muted-foreground text-lg">
              {currentModule.moduleDescription}
            </p>
          </div>

          {/* Module Details */}
          <Card>
            <CardContent className="pt-6">
              <div className="grid gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Learning Objectives</h3>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    {currentModule.learningObjectives?.map((objective, idx) => (
                      <li key={idx}>{objective}</li>
                    ))}
                  </ul>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>Duration: {currentModule.estimatedDuration}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Chapters List */}
          <ChapterList moduleId={moduleId} />
        </div>
      </div>
    </section>
  );
};

export default ModulePage;
