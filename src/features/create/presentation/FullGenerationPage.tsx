"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { GenerationStatus } from "@/server/features/course/types";
import { CheckCircle2, Sparkles, Info } from "lucide-react";
import { useRouter } from "next/navigation";
import { useFullGeneration } from "../application/useFullGeneration";
import { useGenerationContext } from "../context/GenerationContext";
import { FullGenerationForm } from "../presentation/FullGenerationForm";
import { StreamingResponseWindow } from "./StreamingResponseWindow";

export default function FullGenerationPage() {
  const router = useRouter();
  const { progress, isGenerating, startGeneration, resetGeneration } =
    useFullGeneration();
  const { setIsMinimized } = useGenerationContext();

  const isCompleted = progress?.status === GenerationStatus.COMPLETED;
  const isFailed = progress?.status === GenerationStatus.FAILED;

  const handleViewWidget = () => {
    setIsMinimized(false);
  };

  const handleCreateAnother = () => {
    resetGeneration();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Course Generation</h1>
              <p className="text-muted-foreground">
                Generate a complete course with AI
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center gap-8">
          {/* Active Generation Notice */}
          {isGenerating && (
            <Card className="border-primary/50 bg-primary/5">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-primary mt-0.5" />
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">
                      Course generation in progress
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Your course "{progress?.data?.courseName || "Untitled"}"
                      is being generated. You can continue browsing the
                      application while we work on it.
                    </p>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">
                        {progress?.estimatedTimeRemaining
                          ? `${progress.estimatedTimeRemaining} left`
                          : `${Math.round(progress?.progress || 0)}% Complete`}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleViewWidget}
                      >
                        View Progress
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div>
            {!isGenerating ? (
              <Card>
                <CardHeader>
                  <CardTitle>Course Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <FullGenerationForm
                    onSubmit={startGeneration}
                    isGenerating={isGenerating}
                  />
                  <StreamingResponseWindow />
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Start Another Generation?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    You currently have an active generation in progress. You can
                    create another course once the current one is completed.
                  </p>
                  <Button onClick={handleCreateAnother} variant="outline">
                    Cancel Current & Start New
                  </Button>
                </CardContent>
              </Card>
            )}

            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">What to Expect</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Course Structure</p>
                    <p className="text-xs text-muted-foreground">
                      AI-generated course with metadata and overview
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Learning Modules</p>
                    <p className="text-xs text-muted-foreground">
                      Organized modules with objectives and skills
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Chapter Breakdown</p>
                    <p className="text-xs text-muted-foreground">
                      Detailed chapters with topics and prerequisites
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Rich Lessons</p>
                    <p className="text-xs text-muted-foreground">
                      Complete lessons with content and resources
                    </p>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="text-xs text-muted-foreground space-y-1">
                  <p>
                    ⏱️ Estimated time: 3-8 minutes (Depends on course length and
                    complexity)
                  </p>
                  <p>🤖 Powered by AI (Gemini)</p>
                  <p>📊 Real-time progress tracking</p>
                  <p>🌐 Continue browsing while generating</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
