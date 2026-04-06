"use client";

import { Card, CardContent } from "@/components/ui/card";
import { AdaptivePlayground } from "@/features/code-playground/presentation/AdaptivePlayground";
import { Info, Sparkles } from "lucide-react";
import type { Lesson } from "@/server/features/lessons/types/response";

interface CodePlaygroundSectionProps {
  lesson: Lesson;
  courseId?: string;
  courseLanguage?: string;
}

export const CodePlaygroundSection = ({
  lesson,
  courseId,
  courseLanguage,
}: CodePlaygroundSectionProps) => {
  const env = lesson.playgroundEnvironment;

  // No playground needed
  if (!env || env.type === "none") {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Info Banner - Different messages based on environment */}
      {renderInfoBanner(env)}

      {/* Adaptive Playground */}
      <AdaptivePlayground lesson={lesson} />
    </div>
  );
};

function renderInfoBanner(env: any) {
  // Frontend framework banner
  if (env.type === "frontend") {
    return (
      <Card className="bg-gradient-to-r from-blue-500/5 to-purple-500/5 border-blue-500/20">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1 space-y-1">
              <p className="font-semibold text-blue-900 dark:text-blue-100">
                Interactive {env.framework || "Frontend"} Playground
              </p>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                This playground runs entirely in your browser with live preview.
                You can use npm packages, edit multiple files, and see changes
                instantly. No server execution needed!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Vanilla code banner
  if (env.type === "vanilla") {
    return (
      <Card className="bg-green-500/5 border-green-500/20">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1 space-y-1">
              <p className="font-semibold text-green-900 dark:text-green-100">
                Code Execution Environment
              </p>
              <p className="text-sm text-green-800 dark:text-green-200">
                Write and execute {env.framework || "code"} with instant
                feedback. Your code runs in a secure, isolated environment.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Backend framework banner
  if (env.type === "backend") {
    return (
      <Card className="bg-amber-500/5 border-amber-500/20">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1 space-y-1">
              <p className="font-semibold text-amber-900 dark:text-amber-100">
                Backend Framework Explorer
              </p>
              <p className="text-sm text-amber-800 dark:text-amber-200">
                Explore the {env.framework || "backend"} project structure and
                code. Full execution environment coming in Phase 3.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
}
