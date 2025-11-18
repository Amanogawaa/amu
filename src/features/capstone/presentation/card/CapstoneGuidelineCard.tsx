'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useGetCapstoneGuideline } from '../../application/useGetCapstoneGuideline';
import { Skeleton } from '@/components/ui/skeleton';
import {
  BookOpen,
  CheckCircle2,
  Target,
  Lightbulb,
  AlertCircle,
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface CapstoneGuidelineCardProps {
  courseId: string;
}

export function CapstoneGuidelineCard({
  courseId,
}: CapstoneGuidelineCardProps) {
  const { data, isLoading, error } = useGetCapstoneGuideline(courseId);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error || !data) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {error?.message || 'Failed to load capstone guidelines'}
        </AlertDescription>
      </Alert>
    );
  }

  const guideline = data.data;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <Target className="h-6 w-6 text-primary" />
              Capstone Project Guidelines
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Complete this project to demonstrate your mastery
            </p>
          </div>
          <Badge variant="outline" className="shrink-0">
            Capstone
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Project Overview */}
        {guideline.description && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <BookOpen className="h-4 w-4 text-blue-500" />
              <span>Project Overview</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed pl-6">
              {guideline.description}
            </p>
          </div>
        )}

        <Separator />

        {/* Learning Objectives */}
        {guideline.objectives && guideline.objectives.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Target className="h-4 w-4 text-green-500" />
              <span>Learning Objectives</span>
            </div>
            <ul className="space-y-2 pl-6">
              {guideline.objectives.map((objective: string, index: number) => (
                <li
                  key={index}
                  className="text-sm text-muted-foreground flex items-start gap-2"
                >
                  <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                  <span>{objective}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <Separator />

        {/* Requirements */}
        {guideline.requiredFeatures &&
          guideline.requiredFeatures.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <CheckCircle2 className="h-4 w-4 text-orange-500" />
                <span>Required Features</span>
              </div>
              <ul className="space-y-2 pl-6 list-disc list-inside">
                {guideline.requiredFeatures.map(
                  (requirement: string, index: number) => (
                    <li
                      key={index}
                      className="text-sm text-muted-foreground leading-relaxed"
                    >
                      {requirement}
                    </li>
                  )
                )}
              </ul>
            </div>
          )}

        <Separator />

        {/* Suggested Technologies */}
        {guideline.technicalRequirements && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Lightbulb className="h-4 w-4 text-yellow-500" />
              <span>Technical Requirements</span>
            </div>
            <div className="space-y-2 pl-6">
              {guideline.technicalRequirements.languages.length > 0 && (
                <div>
                  <p className="text-xs font-medium mb-1">Languages:</p>
                  <div className="flex flex-wrap gap-2">
                    {guideline.technicalRequirements.languages.map(
                      (lang: string, index: number) => (
                        <Badge key={index} variant="secondary">
                          {lang}
                        </Badge>
                      )
                    )}
                  </div>
                </div>
              )}
              {guideline.technicalRequirements.frameworks.length > 0 && (
                <div>
                  <p className="text-xs font-medium mb-1">Frameworks:</p>
                  <div className="flex flex-wrap gap-2">
                    {guideline.technicalRequirements.frameworks.map(
                      (fw: string, index: number) => (
                        <Badge key={index} variant="secondary">
                          {fw}
                        </Badge>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Evaluation Criteria */}
        {guideline.evaluationCriteria &&
          guideline.evaluationCriteria.length > 0 && (
            <>
              <Separator />
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <CheckCircle2 className="h-4 w-4 text-purple-500" />
                  <span>Evaluation Criteria</span>
                </div>
                <ul className="space-y-2 pl-6">
                  {guideline.evaluationCriteria.map(
                    (
                      criteria: { name: string; description: string },
                      index: number
                    ) => (
                      <li
                        key={index}
                        className="text-sm text-muted-foreground leading-relaxed"
                      >
                        <span className="font-medium">{criteria.name}:</span>{' '}
                        {criteria.description}
                      </li>
                    )
                  )}
                </ul>
              </div>
            </>
          )}
      </CardContent>
    </Card>
  );
}
