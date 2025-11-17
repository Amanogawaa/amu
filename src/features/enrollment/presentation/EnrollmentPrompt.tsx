'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, CheckCircle2, BookOpen, Trophy, Users } from 'lucide-react';
import { useEnrollCourse } from '../application/useEnrollment';

interface EnrollmentPromptProps {
  courseId: string;
  variant?: 'card' | 'banner' | 'inline';
  title?: string;
  benefits?: string[];
}

const defaultBenefits = [
  'Access all course modules and lessons',
  'Track your learning progress',
  'Complete quizzes and earn achievements',
  'Join the learning community',
];

export const EnrollmentPrompt = ({
  courseId,
  variant = 'card',
  title = 'Enroll to unlock this content',
  benefits = defaultBenefits,
}: EnrollmentPromptProps) => {
  const { mutate: enroll, isPending } = useEnrollCourse();

  const handleEnroll = () => {
    enroll(courseId);
  };

  if (variant === 'banner') {
    return (
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-l-4 border-primary p-6 rounded-lg">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <Lock className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{title}</h3>
              <p className="text-sm text-muted-foreground">
                Join this course to access all content and track your progress
              </p>
            </div>
          </div>
          <Button onClick={handleEnroll} disabled={isPending} size="lg">
            {isPending ? 'Enrolling...' : 'Enroll Now'}
          </Button>
        </div>
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <div className="flex items-center justify-center p-8 border-2 border-dashed rounded-lg bg-muted/30">
        <div className="text-center space-y-4 max-w-md">
          <div className="flex justify-center">
            <div className="rounded-full bg-primary/10 p-3">
              <Lock className="h-8 w-8 text-primary" />
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2">{title}</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Enroll in this course to access lesson content and start learning
            </p>
          </div>
          <Button onClick={handleEnroll} disabled={isPending} size="lg">
            {isPending ? 'Enrolling...' : 'Enroll for Free'}
          </Button>
        </div>
      </div>
    );
  }

  // Default card variant
  return (
    <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="rounded-full bg-primary/10 p-3 flex-shrink-0">
              <Lock className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-xl mb-2">{title}</h3>
              <p className="text-muted-foreground">
                This content is available to enrolled students. Join this course
                to unlock all lessons and features.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium">What you'll get:</p>
            <ul className="space-y-2">
              {benefits.map((benefit, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-4">
            <Button
              onClick={handleEnroll}
              disabled={isPending}
              size="lg"
              className="w-full"
            >
              {isPending ? 'Enrolling...' : 'Enroll in this Course'}
            </Button>
            <p className="text-center text-xs text-muted-foreground mt-2">
              Free • Instant Access • No Credit Card Required
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
