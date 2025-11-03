'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertCircle,
  ChevronRight,
  BookOpen,
  Video,
  FileText,
  ExternalLink,
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React from 'react';
import { useGetLesson } from '@/features/lessons/application/useGetLesson';
import { Button } from '@/components/ui/button';

const LessonPage = () => {
  const params = useParams();
  const lessonId = params.lessonId as string;

  const { data: lesson, isLoading, isError } = useGetLesson(lessonId);

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

  if (isError || !lesson) {
    return (
      <section className="flex flex-col min-h-screen w-full pb-10 pt-6">
        <div className="container mx-auto max-w-5xl">
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
        </div>
      </section>
    );
  }

  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="h-6 w-6" />;
      case 'article':
        return <FileText className="h-6 w-6" />;
      default:
        return <BookOpen className="h-6 w-6" />;
    }
  };

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
            href={`/chapters/${lesson.chapterId}`}
            className="hover:text-foreground transition-colors font-medium"
          >
            Chapter
          </Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span className="font-medium text-foreground">
            {lesson.lessonName}
          </span>
        </nav>

        {/* Lesson Content */}
        <div className="space-y-6">
          {/* Lesson Header */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-primary">
              {getLessonIcon(lesson.type)}
              <span className="text-sm font-medium uppercase tracking-wider">
                Lesson {lesson.lessonOrder} • {lesson.type}
              </span>
            </div>
            <h1 className="text-3xl font-bold">{lesson.lessonName}</h1>
            <p className="text-muted-foreground text-lg">
              {lesson.lessonDescription}
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>Duration: {lesson.duration}</span>
            </div>
          </div>

          {/* Video Search Query (if video type) */}
          {lesson.type === 'video' && lesson.videoSearchQuery && (
            <Card className="bg-blue-500/5 border-blue-500/20">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <Video className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <h3 className="font-semibold mb-1">Video Content</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      Search for:{' '}
                      <span className="font-medium">
                        {lesson.videoSearchQuery}
                      </span>
                    </p>
                    <Button size="sm" variant="outline" asChild>
                      <a
                        href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
                          lesson.videoSearchQuery
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Search on YouTube
                        <ExternalLink className="h-3 w-3 ml-2" />
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Lesson Content */}
          {lesson.content && (
            <Card>
              <CardContent className="pt-6">
                <div className="prose dark:prose-invert max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Learning Outcome */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-2">Learning Outcome</h3>
              <p className="text-muted-foreground">{lesson.learningOutcome}</p>
            </CardContent>
          </Card>

          {/* Prerequisites */}
          {lesson.prerequisites && lesson.prerequisites.length > 0 && (
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">Prerequisites</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  {lesson.prerequisites.map((prereq, idx) => (
                    <li key={idx}>{prereq}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Resources */}
          {lesson.resources && lesson.resources.length > 0 && (
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4">Additional Resources</h3>
                <div className="grid gap-3">
                  {lesson.resources.map((resource, idx) => (
                    <a
                      key={idx}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                      <ExternalLink className="h-4 w-4 mt-1 text-primary" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{resource.title}</h4>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                            {resource.type}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {resource.description}
                        </p>
                      </div>
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
};

export default LessonPage;
