"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  X,
  Minimize2,
  Maximize2,
  CheckCircle2,
  BookOpen,
  Layers,
  FileText,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useGenerationContext,
  type StreamChunk,
} from "../context/GenerationContext";
import { GenerationStatus } from "@/server/features/course/types";

/**
 * Maps step names from the backend to display labels and icons.
 * Steps arrive as: "course", "module-1", "lessons-1", "module-2", "lessons-2", etc.
 */
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

/**
 * Repairs partial/incomplete JSON so it can be parsed mid-stream.
 * Closes any open strings, arrays, and objects.
 * e.g. `{"name":"React Ho` → `{"name":"React Ho"}`
 */
function repairPartialJson(text: string): any | null {
  let cleaned = text.trim();
  if (!cleaned) return null;

  // Strip markdown code fences if present
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\s*\n?/, "");
    cleaned = cleaned.replace(/\n?```\s*$/, "");
    cleaned = cleaned.trim();
  }

  // Try parsing as-is first (fast path for complete JSON)
  try {
    return JSON.parse(cleaned);
  } catch {
    // Continue to repair
  }

  // Repair: close open strings, brackets, braces
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

  // Close open string
  if (inString) repaired += '"';

  // Remove trailing comma before we close brackets
  repaired = repaired.replace(/,\s*$/, "");

  // Close open brackets/braces
  while (stack.length > 0) {
    repaired += stack.pop();
  }

  try {
    return JSON.parse(repaired);
  } catch {
    return null;
  }
}

/**
 * Formats a JSON key into a readable label.
 * e.g. "learningObjectives" → "Learning Objectives"
 */
function formatKey(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .replace(/^\w/, (c) => c.toUpperCase())
    .trim();
}

/**
 * Renders a parsed JSON value as readable content.
 */
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
    // Array of strings → bullet list
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
    // Array of objects (e.g. lessons) → numbered cards
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
  // Nested object
  if (typeof value === "object") {
    return <ParsedJsonCard data={value} />;
  }
  return <span>{String(value)}</span>;
}

/**
 * Renders a parsed JSON object as a clean key-value card.
 * The last entry gets the blinking cursor when still streaming.
 */
function ParsedJsonCard({
  data,
  isStreaming,
}: {
  data: Record<string, any>;
  isStreaming?: boolean;
}) {
  const entries = Object.entries(data);
  return (
    <div className="space-y-1.5">
      {entries.map(([key, value], idx) => {
        const isLast = idx === entries.length - 1;
        return (
          <div key={key} className="text-xs">
            <span className="font-medium text-muted-foreground">
              {formatKey(key)}:
            </span>{" "}
            <span className="text-foreground/90">
              <FormattedValue
                value={value}
                isStreaming={isStreaming && isLast}
              />
            </span>
          </div>
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
    <div className={`rounded-lg border p-3 ${info.bgColor} transition-all`}>
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

      {/* Always try to show formatted view */}
      {parsed && typeof parsed === "object" ? (
        <div className="text-xs leading-relaxed">
          <ParsedJsonCard
            data={Array.isArray(parsed) ? { items: parsed } : parsed}
            isStreaming={isActive}
          />
        </div>
      ) : (
        /* Fallback: raw text if repair failed */
        <pre className="text-xs font-mono whitespace-pre-wrap break-all text-foreground/80 leading-relaxed">
          {chunk.text}
          {isActive && (
            <span className="inline-block w-1.5 h-3.5 ml-0.5 bg-primary animate-pulse rounded-sm" />
          )}
        </pre>
      )}
    </div>
  );
}

export function StreamingResponseWindow() {
  const {
    isStreamWindowVisible,
    hideStreamWindow,
    streamChunks,
    currentStreamStep,
    progress,
    isGenerating,
    navigateToCourse,
    resetGeneration,
    clearStreamChunks,
  } = useGenerationContext();

  const [isMaximized, setIsMaximized] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const prevChunkLengthRef = useRef(0);

  const isCompleted = progress?.status === GenerationStatus.COMPLETED;
  const isFailed = progress?.status === GenerationStatus.FAILED;
  const isStreaming = isGenerating && streamChunks.length > 0;

  // Auto-scroll to bottom when new content arrives
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
    }
  }, [isCompleted, isFailed, resetGeneration, hideStreamWindow]);

  if (!isStreamWindowVisible) return null;

  const progressPercent = progress?.progress || 0;
  const statusMessage =
    progress?.message ||
    (isStreaming ? "Streaming AI output..." : "Waiting for response...");

  // Content shared between compact and maximized views
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

  // Maximized view: render as a Dialog
  if (isMaximized) {
    return (
      <Dialog
        open={isMaximized}
        onOpenChange={(open) => !open && setIsMaximized(false)}
      >
        <DialogContent
          className="max-w-4xl h-[80vh] flex flex-col p-0 gap-0"
          showCloseButton={false}
        >
          <DialogHeader className="px-4 py-3 border-b flex-shrink-0">
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-2">
                <div
                  className={`h-2.5 w-2.5 rounded-full ${isStreaming ? "bg-green-500 animate-pulse" : "bg-gray-400"}`}
                />
                Course Generation — Live Output
              </DialogTitle>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setIsMaximized(false)}
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
            <div className="flex items-center justify-between px-4 py-3 border-b flex-shrink-0">
              <div className="flex items-center gap-2">
                <div
                  className={`h-2 w-2 rounded-full ${isStreaming ? "bg-green-500 animate-pulse" : "bg-gray-400"}`}
                />
                <h3 className="font-semibold text-sm">
                  Generation — Live Output
                </h3>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => setIsMaximized(true)}
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

            {/* Content */}
            <div className="flex-1 overflow-hidden">{streamContent}</div>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
