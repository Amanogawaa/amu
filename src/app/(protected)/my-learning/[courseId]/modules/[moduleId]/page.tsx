'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, ChevronRight, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React from 'react';
import { useGetModules } from '@/features/modules/application/useGetModules';
import { useGetCourse } from '@/features/course/application/useGetCourses';
import { SidebarTrigger } from '@/components/ui/sidebar';

const ModulePage = () => {
  const params = useParams();
  const courseId = params.courseId as string;
  const moduleId = params.moduleId as string;

  const { data: modules, isLoading, isError } = useGetModules(courseId);
  const { data: course } = useGetCourse(courseId);
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
    <>
      <div className="p-6 pb-0 md:hidden">
        <SidebarTrigger />
      </div>

      <div className="p-6">
        <nav className="flex items-center text-sm text-muted-foreground mb-8 uppercase tracking-wider">
          <Link
            href="/my-learning"
            className="hover:text-foreground transition-colors font-medium"
          >
            Courses
          </Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <Link
            href={`/my-learning/${courseId}`}
            className="hover:text-foreground transition-colors font-medium truncate"
          >
            {course?.name || 'Course'}
          </Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span className="font-medium text-foreground truncate">
            {currentModule.moduleName}
          </span>
        </nav>

        <div className="space-y-6">
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
                {currentModule.keySkills &&
                  currentModule.keySkills.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-2">Key Skills</h3>
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        {currentModule.keySkills.map((skill, idx) => (
                          <li key={idx}>{skill}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>Duration: {currentModule.estimatedDuration}</span>
                  {currentModule.level && (
                    <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs">
                      {currentModule.level}
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-blue-500/5 border-blue-500/20">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">
                👈 Select a lesson from the sidebar to begin learning
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default ModulePage;
