"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EnrollmentWithCourse } from "@/server/features/enrollment/types";
import {
  ArrowRight,
  BookOpen,
  Calendar,
  Clock,
  GraduationCap,
  Layers,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface EnrolledCourseCardProps {
  enrollment: EnrollmentWithCourse;
}

const EnrolledCourseCard = ({ enrollment }: EnrolledCourseCardProps) => {
  const { course, enrolledAt, status } = enrollment;

  const levelColors = {
    beginner:
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 capitalize",
    intermediate:
      "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 capitalize",
    advance:
      "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 capitalize",
  };

  const statusColors = {
    active:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    completed: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400",
    dropped: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
  };

  const formatEnrollmentDate = (date: Date) => {
    const enrollDate = new Date(date);
    return enrollDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Card className="group h-full flex flex-col transition-all duration-300 hover:border-primary/50">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-xl font-bold line-clamp-2 group-hover:text-primary transition-colors">
            {course.name}
          </CardTitle>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Badge
              className={
                levelColors[course.level as keyof typeof levelColors] ||
                levelColors.beginner
              }
            >
              {course.level}
            </Badge>
          </div>
        </div>
        {course.subtitle && (
          <CardDescription className="text-sm line-clamp-1">
            {course.subtitle}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="flex-1 pb-3">
        <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
          {course.description}
        </p>

        <div className="mb-4">
          <Badge
            className={statusColors[status] || statusColors.active}
            variant="outline"
          >
            {status === "active"
              ? "📚 Learning"
              : status === "completed"
              ? "✓ Completed"
              : "Dropped"}
          </Badge>
        </div>

        {/* Course Info Grid */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="w-4 h-4 text-primary" />
            <span className="text-xs">{course.duration}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Layers className="w-4 h-4 text-primary" />
            <span className="text-xs">{course.noOfModules} modules</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <BookOpen className="w-4 h-4 text-primary" />
            <span className="text-xs capitalize">{course.category}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <GraduationCap className="w-4 h-4 text-primary" />
            <span className="text-xs capitalize">{course.language}</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-border flex items-center gap-2 text-xs text-muted-foreground">
          <Calendar className="w-4 h-4 text-primary" />
          <span>Enrolled on {formatEnrollmentDate(enrolledAt)}</span>
        </div>

        {course.learning_outcomes && course.learning_outcomes.length > 0 && (
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-xs font-semibold text-foreground mb-2">
              What you'll learn:
            </p>
            <ul className="space-y-1">
              {course.learning_outcomes.slice(0, 2).map((outcome, index) => (
                <li
                  key={index}
                  className="text-xs text-muted-foreground flex items-start gap-2"
                >
                  <span className="text-primary mt-0.5">•</span>
                  <span className="line-clamp-1">{outcome}</span>
                </li>
              ))}
            </ul>
            {course.learning_outcomes.length > 2 && (
              <p className="text-xs text-muted-foreground mt-1">
                +{course.learning_outcomes.length - 2} more
              </p>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-4 border-t border-border flex gap-2">
        <Button
          className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
          variant="outline"
          asChild
        >
          {course.draft === true}
          <Link href={`/my-learning/${course.id}`}>
            {status === "active" ? "Continue Learning" : "View Course"}
            <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EnrolledCourseCard;
