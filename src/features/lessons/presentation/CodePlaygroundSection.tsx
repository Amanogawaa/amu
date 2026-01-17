"use client";

import { Card, CardContent } from "@/components/ui/card";
import { CodePlayground } from "@/features/code-playground/presentation/CodePlayground";
import { Info } from "lucide-react";

interface CodePlaygroundSectionProps {
  lessonId: string;
  courseId?: string;
  courseLanguage?: string;
}

export const CodePlaygroundSection = ({
  lessonId,
  courseId,
  courseLanguage,
}: CodePlaygroundSectionProps) => {
  return (
    <>
      <Card className="bg-blue-500/5 border-blue-500/20">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1 space-y-1">
              <p className="font-semibold text-blue-900 dark:text-blue-100">
                Code Playground Limitations
              </p>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                The code playground supports vanilla programming languages
                (Python, JavaScript, Java, C++, etc.) but does not support web
                development frameworks like React, Next.js, Vue, or backend
                frameworks. It's designed for learning core programming concepts
                and algorithms.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      <CodePlayground
        lessonId={lessonId}
        courseId={courseId}
        courseLanguage={courseLanguage}
      />
    </>
  );
};
