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
import { useAuth } from "@/features/auth/application/AuthContext";
import { useEnrollmentCount } from "@/features/enrollment/application/useEnrollment";
import { LikeButton } from "@/features/likes/presentation/LikeButton";
import { Course } from "@/server/features/course/types";
import {
  ArrowRight,
  BookOpen,
  Clock,
  GraduationCap,
  Layers,
  User2,
} from "lucide-react";
import Link from "next/link";
import { CourseValidationBadge } from "../components/CourseValidationBadge";

interface CourseCardProps {
  course: Course;
  href?: string;
}

const CourseCard = ({ course, href }: CourseCardProps) => {
  const { data: enrollmentCount } = useEnrollmentCount(course.id);
  const { user } = useAuth();
  const isOwner = user?.uid === course.uid;

  const levelColors = {
    beginner:
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 capitalize",
    intermediate:
      "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 capitalize",
    advance:
      "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 capitalize",
  };

  const cardContent = (
    <Card className="group h-full flex flex-col transition-all duration-300 hover:border-primary/50">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-xl font-bold line-clamp-2 group-hover:text-primary transition-colors">
            {course.name}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge
              className={
                levelColors[course.level as keyof typeof levelColors] ||
                levelColors.beginner
              }
            >
              {course.level}
            </Badge>
            {isOwner && <CourseValidationBadge courseId={course.id} compact />}
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

        {/* Learning Outcomes Preview */}
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
        {!isOwner && (
          <LikeButton
            courseId={course.id}
            showCount={true}
            className="shrink-0"
          />
        )}
        <Button
          className="flex-1 group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
          variant="outline"
          asChild
        >
          <Link href={`/courses/${course.id}`}>
            {isOwner ? "Manage Course" : "View Course"}
            <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );

  if (href) {
    return (
      <Link href={href} className="block h-full">
        {cardContent}
      </Link>
    );
  }

  return cardContent;
};

export default CourseCard;
