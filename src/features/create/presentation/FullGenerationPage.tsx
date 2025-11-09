'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import {
  Sparkles,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  Wifi,
  WifiOff,
} from 'lucide-react';
import { useSocket } from '@/provider/SocketProvider';
import { useFullGeneration } from '../application/useFullGeneration';
import { FullGenerationForm } from '../presentation/FullGenerationForm';
import { GenerationProgressDisplay } from '../presentation/GenerationProgressDisplay';
import { GenerationStatus } from '@/server/features/course/types';

export default function FullGenerationPage() {
  const router = useRouter();
  const { isConnected } = useSocket();
  const { progress, isGenerating, error, startGeneration, resetGeneration } =
    useFullGeneration();

  const isCompleted = progress?.status === GenerationStatus.COMPLETED;
  const isFailed = progress?.status === GenerationStatus.FAILED;

  const handleViewCourse = () => {
    if (progress?.data?.courseId) {
      router.push(`/create/${progress.data.courseId}`);
    }
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
              <h1 className="text-3xl font-bold"> Course Generation</h1>
              <p className="text-muted-foreground">
                Generate a complete course with AI
              </p>
            </div>
          </div>

          {/* Connection Status
          <div className="flex items-center gap-2 mt-4">
            {isConnected ? (
              <div className="flex items-center gap-2 text-sm text-green-600">
                <Wifi className="h-4 w-4" />
                <span>Connected - Ready to generate</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-sm text-orange-600">
                <WifiOff className="h-4 w-4" />
                <span>Connecting to server...</span>
              </div>
            )}
          </div> */}
        </div>

        {!isConnected && (
          <Alert className="mb-6 border-orange-500">
            <AlertCircle className="h-4 w-4 text-orange-500" />
            <AlertDescription>
              Socket connection is not established. Please wait for the
              connection before generating a course.
            </AlertDescription>
          </Alert>
        )}

        {error && !isGenerating && (
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex flex-col justify-center gap-8">
          <div>
            {isGenerating ? (
              <div className="space-y-6">
                <GenerationProgressDisplay progress={progress} />

                {isCompleted && progress?.data?.courseId && (
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      onClick={handleViewCourse}
                      className="flex-1 gap-2"
                      size="lg"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      View Course
                    </Button>
                    <Button
                      onClick={handleCreateAnother}
                      variant="outline"
                      className="flex-1 gap-2"
                      size="lg"
                    >
                      <Sparkles className="h-4 w-4" />
                      Create Another
                    </Button>
                  </div>
                )}

                {isFailed && (
                  <Button
                    onClick={handleCreateAnother}
                    variant="outline"
                    className="w-full gap-2"
                    size="lg"
                  >
                    Try Again
                  </Button>
                )}
              </div>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Course Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <FullGenerationForm
                    onSubmit={startGeneration}
                    isGenerating={isGenerating}
                  />
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
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
