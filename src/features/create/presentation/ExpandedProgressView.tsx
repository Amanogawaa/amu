'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Minimize2, X, CheckCircle2 } from 'lucide-react';
import {
  GenerationProgress,
  GenerationStatus,
} from '@/server/features/course/types';
import { GenerationProgressDisplay } from './GenerationProgressDisplay';
import { motion } from 'framer-motion';
import { useGenerationContext } from '../context/GenerationContext';

interface ExpandedProgressViewProps {
  progress: GenerationProgress;
  onMinimize: () => void;
  onClose: () => void;
}

export function ExpandedProgressView({
  progress,
  onMinimize,
  onClose,
}: ExpandedProgressViewProps) {
  const { navigateToCourse, resetGeneration } = useGenerationContext();
  const isCompleted = progress.status === GenerationStatus.COMPLETED;
  const isFailed = progress.status === GenerationStatus.FAILED;

  const handleViewCourse = () => {
    navigateToCourse();
  };

  const handleClose = () => {
    if (isCompleted || isFailed) {
      resetGeneration();
    } else {
      onClose();
    }
  };

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.9, opacity: 0, y: 20 }}
      className="w-[420px] max-h-[600px] flex flex-col"
    >
      <Card className="shadow-2xl border-2 flex flex-col max-h-[600px]">
        <CardHeader className="pb-3 flex-shrink-0">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Course Generation</CardTitle>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={onMinimize}
                title="Minimize"
              >
                <Minimize2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handleClose}
                title="Close"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 overflow-y-auto">
          <GenerationProgressDisplay progress={progress} />

          {/* Action Buttons */}
          {isCompleted && progress.data?.courseId && (
            <div className="mt-4 space-y-2">
              <Button
                onClick={handleViewCourse}
                className="w-full gap-2"
                size="lg"
              >
                <CheckCircle2 className="h-4 w-4" />
                View Course
              </Button>
              <Button
                onClick={handleClose}
                variant="outline"
                className="w-full"
                size="lg"
              >
                Close
              </Button>
            </div>
          )}

          {isFailed && (
            <div className="mt-4">
              <Button
                onClick={handleClose}
                variant="outline"
                className="w-full"
                size="lg"
              >
                Close
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
