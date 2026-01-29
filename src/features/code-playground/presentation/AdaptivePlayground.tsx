"use client";

import { Suspense, lazy } from "react";
import type { Lesson } from "@/server/features/lessons/types/response";
import { Skeleton } from "@/components/ui/skeleton";

const SandpackPlayground = lazy(() =>
  import("./SandpackPlayground").then((mod) => ({
    default: mod.SandpackPlayground,
  })),
);

const CodePlayground = lazy(() =>
  import("./CodePlayground").then((mod) => ({
    default: mod.CodePlayground,
  })),
);

const BackendPlayground = lazy(() =>
  import("./BackendPlayground").then((mod) => ({
    default: mod.BackendPlayground,
  })),
);

interface AdaptivePlaygroundProps {
  lesson: Lesson;
  className?: string;
}

export function AdaptivePlayground({
  lesson,
  className = "",
}: AdaptivePlaygroundProps) {
  const env = lesson.playgroundEnvironment;

  if (!env || env.type === "none") {
    return null;
  }

  const LoadingFallback = () => (
    <div className="space-y-4">
      <Skeleton className="h-[500px] w-full" />
      <div className="flex gap-2">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-24" />
      </div>
    </div>
  );

  return (
    <div className={`adaptive-playground ${className}`}>
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Code Playground</h3>
          <p className="text-sm text-muted-foreground">
            {getPlaygroundDescription(env.type, env.framework)}
          </p>
        </div>

        {/* Environment Badge */}
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            {env.framework || env.type}
          </span>
          {env.executionEngine && (
            <span className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
              {env.executionEngine}
            </span>
          )}
        </div>
      </div>

      {/* Playground Renderer */}
      <Suspense fallback={<LoadingFallback />}>
        {renderPlayground(lesson, env)}
      </Suspense>

      {/* Dependencies Info */}
      {env.dependencies && env.dependencies.length > 0 && (
        <div className="mt-4 rounded-lg border bg-muted/50 p-4">
          <p className="text-sm font-medium">Dependencies:</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {env.dependencies.map((dep: string) => (
              <code
                key={dep}
                className="rounded bg-background px-2 py-1 text-xs"
              >
                {dep}
              </code>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function renderPlayground(lesson: Lesson, env: any) {
  if (env.type === "frontend" && env.supportsExecution) {
    return (
      <SandpackPlayground
        environment={env}
        initialCode={env.config?.starterCode || lesson.content}
        lessonId={lesson.id}
      />
    );
  }

  if (env.type === "vanilla" && env.supportsExecution) {
    const language = env.framework?.toLowerCase() || "python";

    return (
      <CodePlayground
        lessonId={lesson.id}
        starterCode={env.config?.starterCode || ""}
        defaultLanguage={language}
      />
    );
  }

  if (env.type === "backend") {
    return <BackendPlayground environment={env} lessonId={lesson.id} />;
  }

  return (
    <div className="rounded-lg border bg-muted/50 p-8 text-center">
      <p className="text-sm text-muted-foreground">
        No code playground available for this lesson.
      </p>
    </div>
  );
}

function getPlaygroundDescription(
  type: string,
  framework?: string | null,
): string {
  if (framework) {
    return `Interactive ${framework} environment with live preview`;
  }

  switch (type) {
    case "vanilla":
      return "Execute code and see results instantly";
    case "frontend":
      return "Interactive frontend framework with live preview";
    case "backend":
      return "Explore backend framework structure";
    default:
      return "Code execution environment";
  }
}
