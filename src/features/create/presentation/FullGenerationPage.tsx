'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { GenerationStatus } from '@/server/features/course/types';
import { CheckCircle2, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useFullGeneration } from '../application/useFullGeneration';
import { FullGenerationForm } from '../presentation/FullGenerationForm';
import { GenerationProgressDisplay } from '../presentation/GenerationProgressDisplay';

export default function FullGenerationPage() {
  const router = useRouter();
  const { progress, isGenerating, startGeneration, resetGeneration } =
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
        </div>

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
