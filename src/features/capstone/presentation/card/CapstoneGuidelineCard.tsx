"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useGetCapstoneGuideline } from "../../application/useGetCapstoneGuideline";
import { useGenerateCapstone } from "../../application/useGenerateCapstone";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BookOpen,
  CheckCircle2,
  Target,
  Lightbulb,
  AlertCircle,
  Sparkles,
  Loader2,
  Rocket,
  MapPin,
  AlertTriangle,
  FolderTree,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import normalizeCapstoneGuideline from "@/utils/transform";

interface CapstoneGuidelineCardProps {
  courseId: string;
}

export function CapstoneGuidelineCard({
  courseId,
}: CapstoneGuidelineCardProps) {
  const { data, isLoading, error } = useGetCapstoneGuideline(courseId);
  const generateCapstone = useGenerateCapstone();

  const handleGenerate = () => {
    generateCapstone.mutate(courseId);
  };

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
    const is404 =
      error?.message?.includes("404") || error?.message?.includes("not found");

    if (is404) {
      return (
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <Target className="h-6 w-6 text-primary" />
              Final Project
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* <Alert>
              <Sparkles className="h-4 w-4" />
              <AlertTitle>🎓 Ready to Create Your Capstone Project?</AlertTitle>
              <AlertDescription className="space-y-2">
                <p>
                  Your capstone project hasn't been generated yet! Click the
                  button below to automatically create a comprehensive final
                  project that brings together everything from this course.
                </p>
                <p className="text-xs italic">
                  💡 This step is required before you can publish the course.
                </p>
              </AlertDescription>
            </Alert> */}

            <div className="space-y-4">
              <div className="text-sm text-muted-foreground space-y-2">
                <p>
                  <strong>What you'll get:</strong>
                </p>
                <ul className="list-disc list-inside space-y-1 pl-4">
                  <li>Project title and comprehensive description</li>
                  <li>Clear learning objectives mapped to course modules</li>
                  <li>Required and suggested features</li>
                  <li>Technical requirements and tools</li>
                  <li>Evaluation criteria and deliverables</li>
                </ul>
              </div>

              <Button
                onClick={handleGenerate}
                disabled={generateCapstone.isPending}
                className="w-full"
                size="lg"
              >
                {generateCapstone.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Capstone Project...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Capstone Project
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    }

    // Other error
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {error?.message || "Failed to load capstone guidelines"}
        </AlertDescription>
      </Alert>
    );
  }

  const guideline = data;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <Target className="h-6 w-6 text-primary" />
              Final Project Guidelines
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Complete this project to demonstrate your mastery
            </p>
          </div>
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

        {/* Getting Started Guide */}
        {guideline.gettingStarted && (
          <>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Rocket className="h-4 w-4 text-blue-500" />
                <span>Getting Started</span>
              </div>

              {guideline.gettingStarted.prerequisites &&
                guideline.gettingStarted.prerequisites.length > 0 && (
                  <div className="pl-6 space-y-2">
                    <p className="text-xs font-medium text-muted-foreground">
                      Prerequisites:
                    </p>
                    <ul className="space-y-1 list-disc list-inside text-sm text-muted-foreground">
                      {guideline.gettingStarted.prerequisites.map(
                        (prereq, index) => (
                          <li key={index}>{prereq}</li>
                        )
                      )}
                    </ul>
                  </div>
                )}

              {guideline.gettingStarted.setupInstructions &&
                guideline.gettingStarted.setupInstructions.length > 0 && (
                  <div className="pl-6 space-y-2">
                    <p className="text-xs font-medium text-muted-foreground">
                      Setup Instructions:
                    </p>
                    <ol className="space-y-2 list-decimal list-inside text-sm text-muted-foreground">
                      {guideline.gettingStarted.setupInstructions.map(
                        (instruction, index) => (
                          <li key={index} className="leading-relaxed">
                            {instruction}
                          </li>
                        )
                      )}
                    </ol>
                  </div>
                )}

              {guideline.gettingStarted.recommendedApproach && (
                <div className="pl-6 space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">
                    Recommended Approach:
                  </p>
                  <p className="text-sm text-muted-foreground italic leading-relaxed">
                    {guideline.gettingStarted.recommendedApproach}
                  </p>
                </div>
              )}
            </div>
            <Separator />
          </>
        )}

        {/* Implementation Roadmap */}
        {guideline.implementationRoadmap &&
          guideline.implementationRoadmap.length > 0 && (
            <>
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <MapPin className="h-4 w-4 text-purple-500" />
                  <span>Implementation Roadmap</span>
                </div>

                <div className="pl-6 space-y-4">
                  {guideline.implementationRoadmap.map((phase, index) => (
                    <div
                      key={index}
                      className="border-l-2 border-purple-500/30 pl-4 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-sm">{phase.phase}</p>
                        <Badge variant="outline" className="text-xs">
                          {phase.duration}
                        </Badge>
                      </div>

                      {phase.tasks && phase.tasks.length > 0 && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">
                            Tasks:
                          </p>
                          <ul className="space-y-1 list-disc list-inside text-sm text-muted-foreground">
                            {phase.tasks.map((task, taskIndex) => (
                              <li key={taskIndex}>{task}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {phase.modules && phase.modules.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          <p className="text-xs text-muted-foreground w-full mb-1">
                            Related modules:
                          </p>
                          {phase.modules.map((module, modIndex) => (
                            <Badge
                              key={modIndex}
                              variant="secondary"
                              className="text-xs"
                            >
                              {module}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <Separator />
            </>
          )}

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

        {/* Project Structure */}
        {guideline.projectStructure && (
          <>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <FolderTree className="h-4 w-4 text-cyan-500" />
                <span>Project Structure</span>
              </div>
              <div className="pl-6 space-y-2">
                <p className="text-sm text-muted-foreground">
                  {guideline.projectStructure.description}
                </p>
                <div className="bg-muted/30 rounded-md p-3 border border-border">
                  <code className="text-xs text-muted-foreground whitespace-pre-wrap font-mono">
                    {guideline.projectStructure.example}
                  </code>
                </div>
              </div>
            </div>
            <Separator />
          </>
        )}

        {/* Technical Requirements */}
        {guideline.technicalRequirements && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Lightbulb className="h-4 w-4 text-yellow-500" />
              <span>Technical Requirements</span>
            </div>
            <div className="space-y-2 pl-6">
              {guideline.technicalRequirements.languages &&
                guideline.technicalRequirements.languages.length > 0 && (
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
              {guideline.technicalRequirements.frameworks &&
                guideline.technicalRequirements.frameworks.length > 0 && (
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
              {guideline.technicalRequirements.tools &&
                guideline.technicalRequirements.tools.length > 0 && (
                  <div>
                    <p className="text-xs font-medium mb-1">Tools:</p>
                    <div className="flex flex-wrap gap-2">
                      {guideline.technicalRequirements.tools.map(
                        (tool: string, index: number) => (
                          <Badge key={index} variant="secondary">
                            {tool}
                          </Badge>
                        )
                      )}
                    </div>
                  </div>
                )}
              {guideline.technicalRequirements.database && (
                <div>
                  <p className="text-xs font-medium mb-1">Database:</p>
                  <Badge variant="secondary">
                    {guideline.technicalRequirements.database}
                  </Badge>
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
                      criteria: {
                        name: string;
                        description: string;
                        weight?: number;
                      },
                      index: number
                    ) => (
                      <li
                        key={index}
                        className="text-sm text-muted-foreground leading-relaxed"
                      >
                        <span className="font-medium">{criteria.name}</span>
                        {criteria.weight && (
                          <span className="text-xs ml-1">
                            ({criteria.weight}%)
                          </span>
                        )}
                        {criteria.description && <>: {criteria.description}</>}
                      </li>
                    )
                  )}
                </ul>
              </div>
            </>
          )}

        {/* Common Challenges */}
        {guideline.commonChallenges &&
          guideline.commonChallenges.length > 0 && (
            <>
              <Separator />
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  <span>Common Challenges & Solutions</span>
                </div>
                <ul className="space-y-2 pl-6">
                  {guideline.commonChallenges.map((challenge, index) => (
                    <li
                      key={index}
                      className="text-sm text-muted-foreground leading-relaxed flex items-start gap-2"
                    >
                      <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                      <span>{challenge}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}

        {/* Module Mapping - NEW! Shows how course modules connect to capstone */}
        {guideline.moduleMapping && guideline.moduleMapping.length > 0 && (
          <>
            <Separator />
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <BookOpen className="h-4 w-4 text-indigo-500" />
                <span>Module Connection</span>
              </div>
              <div className="space-y-3 pl-6">
                {guideline.moduleMapping.map(
                  (
                    mapping: {
                      moduleName: string;
                      skills: string[];
                      application: string;
                    },
                    index: number
                  ) => (
                    <div
                      key={index}
                      className="border-l-2 border-primary/30 pl-3 space-y-1"
                    >
                      <p className="text-sm font-medium">
                        {mapping.moduleName}
                      </p>
                      {mapping.skills && mapping.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {mapping.skills.map((skill, skillIndex) => (
                            <Badge
                              key={skillIndex}
                              variant="secondary"
                              className="text-xs"
                            >
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      )}
                      {mapping.application && (
                        <p className="text-xs text-muted-foreground italic">
                          {mapping.application}
                        </p>
                      )}
                    </div>
                  )
                )}
              </div>
            </div>
          </>
        )}

        {/* Suggested Features */}
        {guideline.suggestedFeatures &&
          guideline.suggestedFeatures.length > 0 && (
            <>
              <Separator />
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <Lightbulb className="h-4 w-4 text-yellow-500" />
                  <span>Suggested Features (Optional)</span>
                </div>
                <ul className="space-y-2 pl-6 list-disc list-inside">
                  {guideline.suggestedFeatures.map(
                    (feature: string, index: number) => (
                      <li
                        key={index}
                        className="text-sm text-muted-foreground leading-relaxed"
                      >
                        {feature}
                      </li>
                    )
                  )}
                </ul>
              </div>
            </>
          )}

        {/* Deliverables */}
        {guideline.deliverables && guideline.deliverables.length > 0 && (
          <>
            <Separator />
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>Project Deliverables</span>
              </div>
              <ul className="space-y-2 pl-6 list-disc list-inside">
                {guideline.deliverables.map(
                  (deliverable: string, index: number) => (
                    <li
                      key={index}
                      className="text-sm text-muted-foreground leading-relaxed"
                    >
                      {deliverable}
                    </li>
                  )
                )}
              </ul>
            </div>
          </>
        )}

        {/* Resources */}
        {guideline.resources && guideline.resources.length > 0 && (
          <>
            <Separator />
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <BookOpen className="h-4 w-4 text-blue-500" />
                <span>Recommended Resources</span>
              </div>
              <ul className="space-y-2 pl-6 list-disc list-inside">
                {guideline.resources.map((resource: string, index: number) => (
                  <li
                    key={index}
                    className="text-sm text-muted-foreground leading-relaxed"
                  >
                    {resource}
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}

        {/* Examples */}
        {guideline.examples && guideline.examples.length > 0 && (
          <>
            <Separator />
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Sparkles className="h-4 w-4 text-purple-500" />
                <span>Example Projects</span>
              </div>
              <ul className="space-y-2 pl-6 list-disc list-inside">
                {guideline.examples.map((example: string, index: number) => (
                  <li
                    key={index}
                    className="text-sm text-muted-foreground leading-relaxed"
                  >
                    {example}
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
