"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Maximize2, X, Loader2, CheckCircle2, XCircle } from "lucide-react";
import {
  GenerationProgress,
  GenerationStatus,
} from "@/server/features/course/types";
import { motion } from "framer-motion";

interface MiniProgressIndicatorProps {
  progress: GenerationProgress;
  onExpand: () => void;
  onClose: () => void;
}

export function MiniProgressIndicator({
  progress,
  onExpand,
  onClose,
}: MiniProgressIndicatorProps) {
  const isCompleted = progress.status === GenerationStatus.COMPLETED;
  const isFailed = progress.status === GenerationStatus.FAILED;
  const isInProgress = progress.status === GenerationStatus.IN_PROGRESS;

  const getStatusIcon = () => {
    if (isCompleted) return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    if (isFailed) return <XCircle className="h-4 w-4 text-destructive" />;
    return <Loader2 className="h-4 w-4 animate-spin text-primary" />;
  };

  const getStatusText = () => {
    if (isCompleted) return "Completed";
    if (isFailed) return "Failed";
    return progress.currentStep || "Generating...";
  };

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      className="w-[380px]"
    >
      <Card className="shadow-lg border-2 hover:shadow-xl transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">{getStatusIcon()}</div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-1">
                <p className="text-sm font-medium truncate">
                  {progress.data?.courseName || "Generating Course"}
                </p>
                <Badge
                  variant={
                    isCompleted
                      ? "default"
                      : isFailed
                      ? "destructive"
                      : "secondary"
                  }
                  className="text-xs flex-shrink-0"
                >
                  {isInProgress && progress.estimatedTimeRemaining
                    ? progress.estimatedTimeRemaining
                    : isCompleted
                    ? "Done"
                    : isFailed
                    ? "Failed"
                    : `${Math.round(progress.progress || 0)}%`}
                </Badge>
              </div>

              <p className="text-xs text-muted-foreground truncate mb-2">
                {getStatusText()}
              </p>

              <Progress value={progress.progress || 0} className="h-1.5" />
            </div>

            <div className="flex items-center gap-1 flex-shrink-0">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={onExpand}
                title="Expand"
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={onClose}
                title="Close"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
