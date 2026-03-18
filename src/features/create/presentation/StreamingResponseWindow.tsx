"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { AnimatePresence, motion } from "framer-motion";
import {
  BookOpen,
  CheckCircle2,
  ExternalLink,
  FileText,
  Layers,
  Minus,
  Maximize2,
  Minimize2,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { GenerationStatus } from "@/server/features/course/types";
import {
  StreamChunk,
  useGenerationContext,
} from "../application/GenerationContext";

function getStepInfo(step: string) {
  if (step === "course") {
    return {
      label: "Course Metadata",
      icon: BookOpen,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10 border-blue-500/20",
    };
  }
  if (step.startsWith("module-")) {
    const num = step.replace("module-", "");
    return {
      label: `Module ${num}`,
      icon: Layers,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10 border-orange-500/20",
    };
  }
  if (step.startsWith("lessons-")) {
    const num = step.replace("lessons-", "");
    return {
      label: `Lessons for Module ${num}`,
      icon: FileText,
      color: "text-green-500",
      bgColor: "bg-green-500/10 border-green-500/20",
    };
  }
  return {
    label: step,
    icon: BookOpen,
    color: "text-gray-500",
    bgColor: "bg-gray-500/10 border-gray-500/20",
  };
}

function repairPartialJson(text: string): any | null {
  let cleaned = text.trim();
  if (!cleaned) return null;

  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\s*\n?/, "");
    cleaned = cleaned.replace(/\n?```\s*$/, "");
    cleaned = cleaned.trim();
  }

  try {
    return JSON.parse(cleaned);
  } catch {
    // skip
  }

  let repaired = cleaned;
  let inString = false;
  let escaped = false;
  const stack: string[] = [];

  for (let i = 0; i < repaired.length; i++) {
    const ch = repaired[i];
    if (escaped) {
      escaped = false;
      continue;
    }
    if (ch === "\\") {
      escaped = true;
      continue;
    }
    if (ch === '"') {
      inString = !inString;
      continue;
    }
    if (!inString) {
      if (ch === "{") stack.push("}");
      else if (ch === "[") stack.push("]");
      else if (ch === "}" || ch === "]") stack.pop();
    }
  }

  if (inString) repaired += '"';

  repaired = repaired.replace(/,\s*$/, "");

  while (stack.length > 0) {
    repaired += stack.pop();
  }

  try {
    return JSON.parse(repaired);
  } catch {
    return null;
  }
}

function formatKey(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .replace(/^\w/, (c) => c.toUpperCase())
    .trim();
}

function FormattedValue({
  value,
  isStreaming,
}: {
  value: any;
  isStreaming?: boolean;
}) {
  if (value === null || value === undefined)
    return <span className="text-muted-foreground italic">—</span>;
  if (typeof value === "boolean") return <span>{value ? "Yes" : "No"}</span>;
  if (typeof value === "number") return <span>{value}</span>;
  if (typeof value === "string")
    return (
      <span>
        {value}
        {isStreaming && (
          <span className="inline-block w-1.5 h-3.5 ml-0.5 bg-primary animate-pulse rounded-sm align-middle" />
        )}
      </span>
    );
  if (Array.isArray(value)) {
    if (value.length === 0)
      return <span className="text-muted-foreground italic">None</span>;
    if (typeof value[0] === "string") {
      return (
        <ul className="list-disc list-inside space-y-0.5">
          {value.map((item, i) => (
            <li key={i} className="text-xs">
              {item}
            </li>
          ))}
        </ul>
      );
    }
    return (
      <div className="space-y-2 mt-1">
        {value.map((item, i) => (
          <div key={i} className="rounded border bg-background/50 p-2">
            <p className="text-xs font-semibold mb-1 text-muted-foreground">
              #{i + 1}
            </p>
            <ParsedJsonCard data={item} />
          </div>
        ))}
      </div>
    );
  }
  if (typeof value === "object") {
    return <ParsedJsonCard data={value} />;
  }
  return <span>{String(value)}</span>;
}

function ParsedJsonCard({
  data,
  isStreaming,
}: {
  data: Record<string, any>;
  isStreaming?: boolean;
}) {
  let entries = Object.entries(data);

  if (isStreaming && entries.length > 0) {
    const [, lastValue] = entries[entries.length - 1];
    if (lastValue === "" || lastValue === null || lastValue === undefined) {
      entries = entries.slice(0, -1);
    }
  }

  return (
    <div className="space-y-2">
      {entries.map(([key, value], idx) => {
        const isLast = idx === entries.length - 1;
        return (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="text-xs"
          >
            <span className="font-semibold text-muted-foreground">
              {formatKey(key)}:
            </span>{" "}
            <span className="text-foreground/90">
              <FormattedValue
                value={value}
                isStreaming={isStreaming && isLast}
              />
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}

function StepSection({
  chunk,
  isActive,
}: {
  chunk: StreamChunk;
  isActive: boolean;
}) {
  const info = getStepInfo(chunk.step);
  const Icon = info.icon;
  const parsed = repairPartialJson(chunk.text);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`rounded-lg border p-3 ${info.bgColor} transition-colors`}
    >
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`h-4 w-4 ${info.color}`} />
        <span className={`text-sm font-semibold ${info.color}`}>
          {info.label}
        </span>
        {isActive && (
          <Badge variant="secondary" className="text-xs animate-pulse">
            Streaming...
          </Badge>
        )}
        {!isActive && parsed && (
          <Badge variant="outline" className="text-xs">
            Complete
          </Badge>
        )}
      </div>

      {parsed && typeof parsed === "object" ? (
        <div className="text-xs leading-relaxed">
          <ParsedJsonCard
            data={Array.isArray(parsed) ? { items: parsed } : parsed}
            isStreaming={isActive}
          />
        </div>
      ) : chunk.text.length > 0 ? (
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="inline-block w-1.5 h-3.5 bg-primary animate-pulse rounded-sm" />
          <span>Receiving data...</span>
        </div>
      ) : null}
    </motion.div>
  );
}

export function StreamingResponseWindow() {
  const {
    isStreamWindowVisible,
    hideStreamWindow,
    hideWidget,
    streamChunks,
    currentStreamStep,
    progress,
    isGenerating,
    navigateToCourse,
    resetGeneration,
    clearStreamChunks,
  } = useGenerationContext();

  const [isMaximized, setIsMaximized] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const prevChunkLengthRef = useRef(0);

  const isCompleted = progress?.status === GenerationStatus.COMPLETED;
  const isFailed = progress?.status === GenerationStatus.FAILED;
  const isStreaming = isGenerating && streamChunks.length > 0;

  useEffect(() => {
    const totalText = streamChunks.reduce((sum, c) => sum + c.text.length, 0);
    if (totalText > prevChunkLengthRef.current && scrollRef.current) {
      requestAnimationFrame(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
      });
    }
    prevChunkLengthRef.current = totalText;
  }, [streamChunks]);

  const handleClose = useCallback(() => {
    if (isCompleted || isFailed) {
      resetGeneration();
    } else {
      hideStreamWindow();
      hideWidget();
      setIsMaximized(false);
      setIsMinimized(false);
    }
  }, [isCompleted, isFailed, resetGeneration, hideStreamWindow, hideWidget]);

  const handleMinimizeToTab = useCallback(() => {
    setIsMaximized(false);
    setIsMinimized(true);
  }, []);

  const handleRestoreFromTab = useCallback(() => {
    setIsMinimized(false);
    setIsMaximized(false);
  }, []);

  const handleMaximize = useCallback(() => {
    setIsMinimized(false);
    setIsMaximized(true);
  }, []);

  if (!isStreamWindowVisible) return null;

  const progressPercent = progress?.progress || 0;
  const statusMessage =
    progress?.message ||
    (isStreaming ? "Streaming AI output..." : "Waiting for response...");
  const courseName = progress?.data?.courseName || "Course Generation";

  const streamContent = (
    <div className="flex flex-col h-full">
      {/* Progress bar */}
      <div className="px-4 py-2 border-b space-y-1">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground truncate max-w-[70%]">
            {statusMessage}
          </span>
          <span className="text-muted-foreground font-medium">
            {Math.round(progressPercent)}%
          </span>
        </div>
        <Progress value={progressPercent} className="h-1.5" />
      </div>

      {/* Streaming content */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
        {streamChunks.length > 0 ? (
          streamChunks.map((chunk) => (
            <StepSection
              key={chunk.step}
              chunk={chunk}
              isActive={currentStreamStep === chunk.step && isGenerating}
            />
          ))
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <div className="text-center space-y-2">
              <BookOpen className="h-8 w-8 mx-auto opacity-50" />
              <p className="text-sm">Waiting for AI response...</p>
            </div>
          </div>
        )}

        {/* Completion message */}
        {isCompleted && (
          <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-4 text-center space-y-3">
            <CheckCircle2 className="h-8 w-8 text-green-500 mx-auto" />
            <p className="font-semibold text-green-600 dark:text-green-400">
              Course generated successfully!
            </p>
            <p className="text-sm text-muted-foreground">
              {progress?.data?.chaptersCount || 0} chapters ·{" "}
              {progress?.data?.lessonsCount || 0} lessons
            </p>
            <Button onClick={navigateToCourse} className="gap-2">
              <ExternalLink className="h-4 w-4" />
              View Course
            </Button>
          </div>
        )}

        {/* Error message */}
        {isFailed && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-center space-y-2">
            <p className="font-semibold text-red-600 dark:text-red-400">
              Generation Failed
            </p>
            <p className="text-sm text-red-500">
              {progress?.error || "An unknown error occurred"}
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-2 border-t flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div
            className={`h-2 w-2 rounded-full ${isStreaming ? "bg-green-500 animate-pulse" : isCompleted ? "bg-green-500" : isFailed ? "bg-red-500" : "bg-gray-400"}`}
          />
          {isStreaming
            ? "Live"
            : isCompleted
              ? "Complete"
              : isFailed
                ? "Failed"
                : "Idle"}
        </div>
        <div className="flex gap-1">
          {(isCompleted || isFailed) && (
            <Button
              onClick={clearStreamChunks}
              variant="ghost"
              size="sm"
              className="text-xs h-7"
            >
              Clear
            </Button>
          )}
        </div>
      </div>
    </div>
  );

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 16 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 16 }}
          transition={{ duration: 0.2 }}
        >
          <Card className="w-[320px] shadow-xl border-2 px-3 py-2">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="text-sm font-semibold truncate">{courseName}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {Math.round(progressPercent)}% · {statusMessage}
                </p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={handleRestoreFromTab}
                  title="Restore"
                >
                  <Minimize2 className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={handleMaximize}
                  title="Maximize"
                >
                  <Maximize2 className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={handleClose}
                  title="Close"
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  if (isMaximized) {
    return (
      <Dialog
        open={isMaximized}
        onOpenChange={(open) => !open && setIsMaximized(false)}
      >
        <DialogContent
          className="min-w-4xl h-[80vh] flex flex-col p-0 gap-0"
          showCloseButton={false}
        >
          <DialogHeader className="px-4 py-3 border-b flex-shrink-0">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-base font-semibold truncate">
                {courseName}
              </DialogTitle>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setIsMaximized(false)}
                  title="Restore"
                >
                  <Minimize2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={handleMinimizeToTab}
                  title="Minimize"
                >
                  <Minus className="h-4 w-4" />
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
          </DialogHeader>
          <div className="flex-1 overflow-hidden">{streamContent}</div>
        </DialogContent>
      </Dialog>
    );
  }

  // Compact view: floating card
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <AnimatePresence mode="wait">
        <motion.div
          key="compact"
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 20 }}
          transition={{ duration: 0.2 }}
        >
          <Card className="w-[420px] h-[500px] shadow-2xl border-2 flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 border-b flex-shrink-0">
              <p className="text-sm font-semibold truncate py-2">
                {courseName}
              </p>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={handleMaximize}
                  title="Maximize"
                >
                  <Maximize2 className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={handleMinimizeToTab}
                  title="Minimize"
                >
                  <Minus className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={handleClose}
                  title="Close"
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden">{streamContent}</div>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
