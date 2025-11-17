'use client';

import dynamic from 'next/dynamic';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertCircle,
  Video,
  FileText,
  BookOpen,
  ExternalLink,
} from 'lucide-react';
import { useGetLesson } from '@/features/lessons/application/useGetLesson';
import { useQuizForLesson } from '@/features/quiz/application/useQuiz';
import { useLessonCourse } from '@/features/lessons/application/useLessonCourse';
import { MarkCompleteButton } from '@/features/progress/presentation/MarkCompleteButton';
import { useProgressForCourse } from '@/features/progress/application/useProgress';
import { useCourseLessonCount } from '@/features/progress/application/useCourseLessonCount';
import { useAuth } from '@/features/auth/application/AuthContext';
import { useEnrollmentStatus } from '@/features/enrollment/application/useEnrollment';
import { EnrollmentPrompt } from '@/features/enrollment/presentation/EnrollmentPrompt';
import { CodePlayground } from '@/features/code-playground/presentation/CodePlayground';

const VideoSelector = dynamic(
  () =>
    import('@/components/video/VideoSelector').then((mod) => ({
      default: mod.VideoSelector,
    })),
  {
    loading: () => (
      <div className="space-y-4">
        <Skeleton className="h-96 w-full rounded-lg" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    ),
    ssr: false,
  }
);

const TranscriptViewer = dynamic(
  () =>
    import('@/components/video/TranscriptViewer').then((mod) => ({
      default: mod.TranscriptViewer,
    })),
  {
    loading: () => <Skeleton className="h-64 w-full rounded-lg" />,
    ssr: false,
  }
);

const QuizPlayer = dynamic(
  () =>
    import('@/features/quiz/presentation/QuizPlayer').then((mod) => ({
      default: mod.QuizPlayer,
    })),
  {
    loading: () => (
      <Card>
        <CardContent className="pt-6">
          <Skeleton className="h-8 w-full mb-4" />
          <Skeleton className="h-32 w-full mb-4" />
          <Skeleton className="h-10 w-32" />
        </CardContent>
      </Card>
    ),
    ssr: false,
  }
);

interface LessonContentProps {
  lessonId: string;
}

export const LessonContent = ({ lessonId }: LessonContentProps) => {
  const { data: lesson, isLoading, isError } = useGetLesson(lessonId);
  const { data: quiz, isLoading: quizLoading } = useQuizForLesson(lessonId);
  const { data: courseInfo } = useLessonCourse(lessonId);
  const { data: progress } = useProgressForCourse(courseInfo?.courseId || '');
  const { data: totalLessons } = useCourseLessonCount(
    courseInfo?.courseId || ''
  );
  const { data: enrollmentStatus, isLoading: enrollmentLoading } =
    useEnrollmentStatus(courseInfo?.courseId || '', !!courseInfo?.courseId);

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

  const isEnrolled = enrollmentStatus?.isEnrolled || false;

  return (
    <div className="space-y-6">
      {/* Lesson Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-primary">
          {getLessonIcon(lesson.type)}
          <span className="text-sm font-medium uppercase tracking-wider">
            Lesson {lesson.lessonOrder} • {lesson.type}
          </span>
        </div>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{lesson.lessonName}</h1>
            <p className="text-muted-foreground text-lg mt-2">
              {lesson.lessonDescription}
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
              <span>Duration: {lesson.duration}</span>
            </div>
          </div>
          {courseInfo?.courseId && isEnrolled && (
            <div className="flex-shrink-0">
              <MarkCompleteButton
                courseId={courseInfo.courseId}
                lessonId={lessonId}
                totalLessons={totalLessons}
                initialCompleted={
                  progress?.lessonsCompleted?.includes(lessonId) || false
                }
              />
            </div>
          )}
        </div>
      </div>

      {/* Enrollment Gate */}
      {!enrollmentLoading && !isEnrolled && courseInfo?.courseId && (
        <EnrollmentPrompt
          courseId={courseInfo.courseId}
          variant="card"
          title="Enroll to access this lesson"
          benefits={[
            'Watch video lessons and access transcripts',
            'Read detailed lesson content and resources',
            'Complete quizzes and track your progress',
            'Unlock all course materials',
          ]}
        />
      )}

      {/* Lesson Content - Only show if enrolled */}
      {isEnrolled && (
        <>
          {/* Video Search Query (if video type) */}
          {lesson.type === 'video' && lesson.videoSearchQuery && (
            <Card className="bg-blue-500/5 border-blue-500/20">
              <CardContent className="pt-6">
                <VideoSelector
                  searchQuery={lesson.videoSearchQuery}
                  lessonId={lessonId}
                  selectedVideoId={lesson.selectedVideoId}
                />

                <TranscriptViewer
                  lessonId={lessonId}
                  videoId={lesson.selectedVideoId}
                />
              </CardContent>
            </Card>
          )}

          {lesson.type === 'quiz' && (
            <div>
              {quizLoading ? (
                <Card>
                  <CardContent className="pt-6">
                    <Skeleton className="h-8 w-full mb-4" />
                    <Skeleton className="h-32 w-full mb-4" />
                    <Skeleton className="h-10 w-32" />
                  </CardContent>
                </Card>
              ) : quiz ? (
                <QuizPlayer quiz={quiz} lessonId={lessonId} />
              ) : (
                <Card className="border-yellow-500/20 bg-yellow-500/5">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 text-yellow-600 dark:text-yellow-400">
                      <AlertCircle className="h-5 w-5" />
                      <div>
                        <p className="font-semibold">Quiz Not Available</p>
                        <p className="text-sm text-muted-foreground">
                          The quiz for this lesson hasn't been generated yet.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
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

          <CodePlayground />

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
        </>
      )}
    </div>
  );
};
