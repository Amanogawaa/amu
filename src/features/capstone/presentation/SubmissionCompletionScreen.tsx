"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, ArrowRight, Home } from "lucide-react";
import Link from "next/link";

interface SubmissionCompletionScreenProps {
  courseId: string;
  courseName: string;
  projectTitle: string;
  onBackToDashboard?: () => void;
}

export function SubmissionCompletionScreen({
  courseId,
  courseName,
  projectTitle,
  onBackToDashboard,
}: SubmissionCompletionScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] py-8 px-4">
      <div className="max-w-2xl w-full space-y-8">
        {/* Success Icon & Message */}
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="relative">
            <div className="absolute inset-0 bg-green-500/20 blur-2xl rounded-full" />
            <CheckCircle2 className="w-20 h-20 text-green-500 relative" />
          </div>

          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">
              Capstone Submitted! 🎉
            </h1>
            <p className="text-lg text-muted-foreground">
              Great work! Your project has been submitted successfully.
            </p>
          </div>
        </div>

        {/* Submission Details */}
        <Card className="bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Course
              </p>
              <p className="text-lg font-semibold">{courseName}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Project Title
              </p>
              <p className="text-lg font-semibold">{projectTitle}</p>
            </div>
            <div className="pt-2 border-t border-primary/10">
              <p className="text-sm text-muted-foreground">
                Your project is now available for peer reviews. The community
                will provide valuable feedback on your work.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* What's Next */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">What's Next?</h2>
          <div className="grid gap-3">
            <p className="text-muted-foreground">
              Continue your learning journey or explore other courses based on
              your interests and learning path.
            </p>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button asChild variant="outline" className="flex-1 h-11">
            <Link href="/my-learning">
              <Home className="w-4 h-4 mr-2" />
              Back to Learning
            </Link>
          </Button>
          <Button asChild className="flex-1 h-11">
            <Link href="/my-learning">
              Explore More Courses
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>

        {/* Encouragement */}
        <div className="text-center space-y-2 pt-4">
          <p className="text-sm text-muted-foreground">
            Take a break or keep learning—you're in charge of your pace! 🚀
          </p>
        </div>
      </div>
    </div>
  );
}
