"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { getExerciseGuidelineByLessonId } from "@/server/features/code-playground";
import {
  AlertCircle,
  BookOpen,
  CheckCircle2,
  Code2,
  ExternalLink,
  FileText,
  Lightbulb,
  ListChecks,
  Monitor,
  Target,
  TestTube2,
  TriangleAlert,
} from "lucide-react";

interface LessonExerciseContentProps {
  lessonId: string;
}

export const LessonExerciseContent = ({
  lessonId,
}: LessonExerciseContentProps) => {
  const {
    data: guideline,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["exerciseGuideline", lessonId],
    queryFn: () => getExerciseGuidelineByLessonId(lessonId),
    enabled: !!lessonId,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(2000 * 2 ** attemptIndex, 15000),
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6 space-y-4">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (isError || !guideline) {
    return (
      <Card className="border-yellow-500/20 bg-yellow-500/5">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 text-yellow-600 dark:text-yellow-400">
            <AlertCircle className="h-5 w-5" />
            <div>
              <p className="font-semibold">Exercise Not Available Yet</p>
              <p className="text-sm text-muted-foreground">
                The exercise guideline for this lesson is still being generated.
                Please check back in a moment.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Title & Description */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Code2 className="h-5 w-5 text-primary" />
            {guideline.title}
          </CardTitle>
          {guideline.description && (
            <p className="text-muted-foreground">{guideline.description}</p>
          )}
        </CardHeader>
      </Card>

      {/* Objectives */}
      {guideline.objectives && guideline.objectives.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Target className="h-5 w-5 text-blue-500" />
              Objectives
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {guideline.objectives.map((obj, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{obj}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Problem Statement */}
      {guideline.problemStatement && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="h-5 w-5 text-orange-500" />
              Problem Statement
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm">{guideline.problemStatement.description}</p>

            {guideline.problemStatement.constraints?.length > 0 && (
              <div>
                <h4 className="font-semibold text-sm mb-2">Constraints</h4>
                <ul className="space-y-1">
                  {guideline.problemStatement.constraints.map((c, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-orange-500 mt-0.5">•</span>
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {guideline.problemStatement.acceptanceCriteria?.length > 0 && (
              <div>
                <h4 className="font-semibold text-sm mb-2">
                  Acceptance Criteria
                </h4>
                <ul className="space-y-1">
                  {guideline.problemStatement.acceptanceCriteria.map((c, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-500 mt-0.5 flex-shrink-0" />
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Solution Approach */}
      {guideline.solutionApproach && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Lightbulb className="h-5 w-5 text-yellow-500" />
              Solution Approach
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {guideline.solutionApproach.steps?.length > 0 && (
              <ol className="space-y-2">
                {guideline.solutionApproach.steps.map((step, i) => (
                  <li key={i} className="text-sm flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                      {i + 1}
                    </span>
                    <span className="pt-0.5">{step}</span>
                  </li>
                ))}
              </ol>
            )}

            {guideline.solutionApproach.keyAlgorithms &&
              guideline.solutionApproach.keyAlgorithms.length > 0 && (
                <div>
                  <h4 className="font-semibold text-sm mb-2">
                    Key Algorithms
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {guideline.solutionApproach.keyAlgorithms.map((algo, i) => (
                      <span
                        key={i}
                        className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary font-medium"
                      >
                        {algo}
                      </span>
                    ))}
                  </div>
                </div>
              )}
          </CardContent>
        </Card>
      )}

      {/* Getting Started */}
      {guideline.gettingStarted && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Monitor className="h-5 w-5 text-purple-500" />
              Getting Started
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {guideline.gettingStarted.editorOptions?.length > 0 && (
              <div>
                <h4 className="font-semibold text-sm mb-3">
                  Recommended Editors
                </h4>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {guideline.gettingStarted.editorOptions.map((editor, i) => (
                    <a
                      key={i}
                      href={editor.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block rounded-lg border p-3 hover:bg-accent transition-colors"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">
                          {editor.name}
                        </span>
                        <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {editor.description}
                      </p>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {guideline.gettingStarted.environmentSetup?.length > 0 && (
              <div>
                <h4 className="font-semibold text-sm mb-2">
                  Environment Setup
                </h4>
                <ol className="space-y-1">
                  {guideline.gettingStarted.environmentSetup.map((step, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="font-mono text-xs text-primary">
                        {i + 1}.
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {guideline.gettingStarted.recommendedApproach && (
              <div className="rounded-lg bg-purple-500/5 border border-purple-500/20 p-3">
                <p className="text-sm text-purple-800 dark:text-purple-200">
                  <span className="font-semibold">💡 Tip: </span>
                  {guideline.gettingStarted.recommendedApproach}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Testing Guidelines */}
      {guideline.testingGuidelines && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <TestTube2 className="h-5 w-5 text-teal-500" />
              Testing Guidelines
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {guideline.testingGuidelines.whatToTest?.length > 0 && (
              <div>
                <h4 className="font-semibold text-sm mb-2">What to Test</h4>
                <ul className="space-y-1">
                  {guideline.testingGuidelines.whatToTest.map((item, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <ListChecks className="h-3.5 w-3.5 text-teal-500 mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {guideline.testingGuidelines.sampleTestCases &&
              guideline.testingGuidelines.sampleTestCases.length > 0 && (
                <div>
                  <h4 className="font-semibold text-sm mb-2">
                    Sample Test Cases
                  </h4>
                  <div className="space-y-2">
                    {guideline.testingGuidelines.sampleTestCases.map(
                      (tc, i) => (
                        <div
                          key={i}
                          className="rounded-lg border p-3 text-sm font-mono bg-muted/50"
                        >
                          <div>
                            <span className="text-muted-foreground">
                              Input:{" "}
                            </span>
                            {tc.input}
                          </div>
                          <div>
                            <span className="text-muted-foreground">
                              Expected:{" "}
                            </span>
                            <span className="text-green-600 dark:text-green-400">
                              {tc.expectedOutput}
                            </span>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
          </CardContent>
        </Card>
      )}

      {/* Common Mistakes */}
      {guideline.commonMistakes && guideline.commonMistakes.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <TriangleAlert className="h-5 w-5 text-red-500" />
              Common Mistakes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {guideline.commonMistakes.map((m, i) => (
                <div
                  key={i}
                  className="rounded-lg border p-3 space-y-1"
                >
                  <p className="text-sm font-medium text-red-600 dark:text-red-400">
                    ❌ {m.mistake}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    ✅ {m.correction}
                  </p>
                  <p className="text-xs text-muted-foreground italic">
                    Prevention: {m.prevention}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Best Practices */}
      {guideline.bestPractices && guideline.bestPractices.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <BookOpen className="h-5 w-5 text-emerald-500" />
              Best Practices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {guideline.bestPractices.map((bp, i) => (
                <li key={i} className="text-sm flex items-start gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                  {bp}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
