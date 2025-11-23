'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  CheckCircle2,
  Circle,
  Loader2,
  XCircle,
  BookOpen,
  Layers,
  BookMarked,
  FileText,
} from 'lucide-react';
import {
  GenerationProgress,
  GenerationStep,
  GenerationStatus,
} from '@/server/features/course/types';

interface GenerationProgressDisplayProps {
  progress: GenerationProgress | null;
}

const STEP_INFO = {
  [GenerationStep.COURSE]: {
    label: 'Course Structure',
    description: 'Generating course metadata and overview',
    icon: BookOpen,
    color: 'text-blue-500',
  },
  [GenerationStep.MODULES]: {
    label: 'Course Modules',
    description: 'Creating learning modules',
    icon: Layers,
    color: 'text-purple-500',
  },
  [GenerationStep.CHAPTERS]: {
    label: 'Module Chapters',
    description: 'Building chapter structure',
    icon: BookMarked,
    color: 'text-orange-500',
  },
  [GenerationStep.LESSONS]: {
    label: 'Lesson Content',
    description: 'Generating detailed lessons',
    icon: FileText,
    color: 'text-green-500',
  },
};

export function GenerationProgressDisplay({
  progress,
}: GenerationProgressDisplayProps) {
  if (!progress) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            <p>Ready to generate your course</p>
            <p className="text-sm mt-2">Fill in the form to get started</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const isCompleted = progress.status === GenerationStatus.COMPLETED;
  const isFailed = progress.status === GenerationStatus.FAILED;
  const isInProgress = progress.status === GenerationStatus.IN_PROGRESS;

  return (
    <Card className="w-full border-none">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Generation Progress</CardTitle>
          {isInProgress && (
            <Badge variant="default" className="gap-1">
              <Loader2 className="h-3 w-3 animate-spin" />
              Generating...
            </Badge>
          )}
          {isCompleted && (
            <Badge variant="default" className="bg-green-500 gap-1">
              <CheckCircle2 className="h-3 w-3" />
              Completed
            </Badge>
          )}
          {isFailed && (
            <Badge variant="destructive" className="gap-1">
              <XCircle className="h-3 w-3" />
              Failed
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">{progress.message}</span>
            <span className="text-muted-foreground">{progress.progress}%</span>
          </div>
          <Progress value={progress.progress} className="h-2" />
        </div>

        {/* Steps */}
        <div className="space-y-3">
          {Object.entries(STEP_INFO).map(([step, info]) => {
            const Icon = info.icon;
            const isCurrent = progress.currentStep === step;
            const isStepCompleted =
              progress.progress >=
              getStepProgressThreshold(step as GenerationStep);
            const isStepActive = isCurrent && isInProgress;

            return (
              <div
                key={step}
                className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                  isStepActive
                    ? 'bg-primary/5 border-primary'
                    : isStepCompleted
                    ? 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800'
                    : 'bg-muted/30'
                }`}
              >
                <div
                  className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                    isStepActive
                      ? 'bg-primary text-primary-foreground'
                      : isStepCompleted
                      ? 'bg-green-500 text-white'
                      : 'bg-muted'
                  }`}
                >
                  {isStepActive ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : isStepCompleted ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    <Circle className="h-5 w-5" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Icon className={`h-4 w-4 ${info.color}`} />
                    <p className="font-medium text-sm">{info.label}</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {info.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Result Details */}
        {isCompleted && progress.data && (
          <div className="mt-6 p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
            <h4 className="font-semibold text-green-900 dark:text-green-100 mb-3">
              Course Generated Successfully!
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {progress.data.modulesCount || 0}
                </div>
                <div className="text-xs text-muted-foreground">Modules</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {progress.data.chaptersCount || 0}
                </div>
                <div className="text-xs text-muted-foreground">Chapters</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {progress.data.lessonsCount || 0}
                </div>
                <div className="text-xs text-muted-foreground">Lessons</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {progress.data.courseId ? '✓' : '-'}
                </div>
                <div className="text-xs text-muted-foreground">Course ID</div>
              </div>
            </div>
          </div>
        )}

        {/* Error Details */}
        {isFailed && progress.error && (
          <div className="mt-6 p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
            <h4 className="font-semibold text-red-900 dark:text-red-100 mb-2">
              Generation Failed
            </h4>
            <p className="text-sm text-red-700 dark:text-red-300">
              {progress.error}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Helper function to determine progress threshold for each step
function getStepProgressThreshold(step: GenerationStep): number {
  switch (step) {
    case GenerationStep.COURSE:
      return 10;
    case GenerationStep.MODULES:
      return 40;
    case GenerationStep.CHAPTERS:
      return 70;
    case GenerationStep.LESSONS:
      return 95;
    default:
      return 0;
  }
}
