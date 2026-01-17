"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAuth } from "@/features/auth/application/AuthContext";
import { useGetCourse } from "@/features/course/application/useGetCourses";
import { ChevronLeft, ChevronRight, Menu } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";

interface LessonPageHeaderProps {
  courseId: string;
  courseName?: string;
  lessonId: string;
  currentLessonOrder?: number;
  hasNextLesson?: boolean;
  hasPrevLesson?: boolean;
  onNavigateNext?: () => void;
  onNavigatePrev?: () => void;
}

export const LessonPageHeader = ({
  courseId,
  courseName,
  lessonId,
  currentLessonOrder,
  hasNextLesson,
  hasPrevLesson,
  onNavigateNext,
  onNavigatePrev,
}: LessonPageHeaderProps) => {
  const logo = {
    url: "/",
    src: "/coursecraft.png",
    alt: "logo",
    title: "CourseCraft",
  };
  const { user } = useAuth();
  const { data: course } = useGetCourse(courseId);
  const router = useRouter();
  const [isOutlineOpen, setIsOutlineOpen] = useState(false);

  const displayCourseName = courseName || course?.name || "Course";

  return (
    <div className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-4 justify-between">
        <div className="flex gap-2 items-center">
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
          {/* Left side - Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link
              href="/my-learning"
              className="hover:text-foreground transition-colors"
            >
              Learn
            </Link>
            <span>/</span>
            <Link
              href="/courses"
              className="hover:text-foreground transition-colors"
            >
              Courses
            </Link>
            <span>/</span>
            <Link
              href={`/courses/${courseId}`}
              className="hover:text-foreground transition-colors max-w-[200px] truncate"
            >
              {displayCourseName}
            </Link>
          </div>
        </div>
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onNavigatePrev}
            disabled={!hasPrevLesson}
            className="h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Sheet open={isOutlineOpen} onOpenChange={setIsOutlineOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Menu className="h-4 w-4" />
                Course Outline
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[400px] sm:w-[540px]">
              <SheetHeader>
                <SheetTitle>{displayCourseName}</SheetTitle>
              </SheetHeader>
              <div className="mt-4">
                <p className="text-sm text-muted-foreground">later</p>
              </div>
            </SheetContent>
          </Sheet>

          <Button
            variant="ghost"
            size="icon"
            onClick={onNavigateNext}
            disabled={!hasNextLesson}
            className="h-8 w-8"
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
