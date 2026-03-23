"use client";

import { Button } from "@/components/ui/button";
import {
  SheetClose,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAuth } from "@/features/auth/application/AuthContext";
import { useGetCourse } from "@/features/course/application/useGetCourses";
import { ChevronDown, ChevronLeft, ChevronRight, Dot, Menu, PlayCircle } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { useLessonNavigation } from "@/features/lessons/application/useLessonNavigation";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";

interface LessonPageHeaderProps {
  courseId: string;
  courseName?: string;
  lessonId: string;
}

export const LessonPageHeader = ({
  courseId,
  courseName,
  lessonId,
}: LessonPageHeaderProps) => {
  const logo = {
    url: "/",
    src: "/coursecraft.png",
    alt: "logo",
    title: "CourseCraft",
  };
  const { user } = useAuth();
  const { data: course } = useGetCourse(courseId);
  const pathname = usePathname();
  const [isOutlineOpen, setIsOutlineOpen] = useState(false);
  const {
    chaptersWithLessons,
    currentLessonOrder,
    totalLessons,
    hasNextLesson,
    hasPrevLesson,
    navigateNext,
    navigatePrev,
    navigateToLesson,
  } = useLessonNavigation(courseId, lessonId);

  const displayCourseName = courseName || course?.name || "Course";
  const isMyLearningRoute = pathname?.startsWith("/my-learning/");

  return (
    <div className="sticky top-0 z-50 w-full border-b bg-background/90 backdrop-blur-md supports-[backdrop-filter]:bg-background/70">
      <div className="flex h-16 items-center justify-between gap-4 px-4 md:px-6">
        <div className="flex min-w-0 items-center gap-2 md:gap-3">
          <a href={logo.url} className="flex items-center gap-2">
            <Image
              src={logo.src}
              className="max-h-8 dark:invert"
              alt={logo.alt}
              width={32}
              height={32}
            />
            {!user && (
              <span className="text-lg font-semibold tracking-tighter">
                {logo.title}
              </span>
            )}
          </a>
          <div className="hidden md:flex items-center gap-1.5 text-sm text-muted-foreground min-w-0">
            <Link
              href={isMyLearningRoute ? "/my-learning" : "/learn"}
              className="hover:text-foreground transition-colors"
            >
              {isMyLearningRoute ? "My Learning" : "Learn"}
            </Link>
            <Dot className="h-4 w-4" />
            <Link
              href="/courses"
              className="hover:text-foreground transition-colors"
            >
              Courses
            </Link>
            <Dot className="h-4 w-4" />
            <Link
              href={`/courses/${courseId}`}
              className="hover:text-foreground transition-colors max-w-[220px] truncate"
            >
              {displayCourseName}
            </Link>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2">
          

          <Button
            variant="ghost"
            size="icon"
            onClick={navigatePrev}
            disabled={!hasPrevLesson}
            className="h-9 w-9"
            aria-label="Previous lesson"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Sheet open={isOutlineOpen} onOpenChange={setIsOutlineOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="gap-2 rounded-full px-4">
                <Menu className="h-4 w-4" />
                Course Outline
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-xl p-0">
              <SheetHeader className="border-b p-5 pb-4">
                <SheetTitle className="text-xl font-semibold">{displayCourseName}</SheetTitle>
                <SheetDescription>
                  Pick a lesson to jump quickly through your course outline.
                </SheetDescription>
              </SheetHeader>

              <div className="h-[calc(100vh-96px)] overflow-y-auto p-5">
                {chaptersWithLessons.length === 0 ? (
                  <div className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">
                    No course outline available yet.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {chaptersWithLessons.map((chapter) => (
                    <Collapsible key={chapter.id} defaultOpen>
                      <div className="rounded-xl border bg-muted/20">
                        <CollapsibleTrigger className="flex w-full items-center justify-between px-4 py-3 text-left">
                          <div>
                            <p className="text-xs uppercase tracking-wide text-muted-foreground">
                              Chapter {chapter.chapterOrder}
                            </p>
                            <p className="font-medium text-foreground">
                              {chapter.chapterName}
                            </p>
                          </div>
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        </CollapsibleTrigger>

                        <CollapsibleContent className="px-2 pb-2">
                          <div className="space-y-1">
                            {chapter.lessons.map((lesson) => {
                              const isActive = lesson.id === lessonId;

                              return (
                                <SheetClose asChild key={lesson.id}>
                                  <button
                                    type="button"
                                    onClick={() => navigateToLesson(lesson.id)}
                                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors ${
                                      isActive
                                        ? "bg-primary/10 text-primary"
                                        : "hover:bg-muted"
                                    }`}
                                  >
                                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border bg-background text-xs font-medium">
                                      {lesson.lessonOrder}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <p className="truncate text-sm font-medium">
                                        {lesson.lessonName}
                                      </p>
                                      <p className="text-xs text-muted-foreground capitalize">
                                        {lesson.type}
                                      </p>
                                    </div>
                                    {isActive && <PlayCircle className="h-4 w-4 shrink-0" />}
                                  </button>
                                </SheetClose>
                              );
                            })}
                          </div>
                        </CollapsibleContent>
                      </div>
                    </Collapsible>
                    ))}
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>

          <Button
            variant="ghost"
            size="icon"
            onClick={navigateNext}
            disabled={!hasNextLesson}
            className="h-9 w-9"
            aria-label="Next lesson"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Daily XP</span>
            <span className="text-sm font-bold text-primary">0</span>
          </div>

          {user?.photoURL ? (
            <img
              src={user.photoURL}
              alt={user.displayName || "User"}
              className="h-8 w-8 rounded-full border-2 border-primary"
            />
          ) : (
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-xs font-semibold text-primary">
                {user?.displayName?.charAt(0)?.toUpperCase() || "U"}
              </span>
            </div>
          )}
        </div> */}
      </div>
    </div>
  );
};
