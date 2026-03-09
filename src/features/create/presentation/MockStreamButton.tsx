"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, Square } from "lucide-react";
import { useGenerationContext } from "../application/GenerationContext";
import { GenerationStatus, GenerationStep } from "@/server/features/course/types";

// Fake course data that will be streamed character-by-character
const MOCK_COURSE = JSON.stringify({
  name: "Introduction to React Hooks",
  description:
    "Learn the fundamentals of React Hooks, a powerful feature that allows you to use state and side effects in functional components.",
  category: "Programming",
  level: "beginner",
  duration: "5 hours",
  language: "English",
  noOfChapters: 2,
  learningOutcomes: [
    "Understand what React Hooks are and why they were introduced",
    "Master the useState hook for managing component state",
    "Learn useEffect for handling side effects",
  ],
  prerequisites: ["Basic JavaScript knowledge", "HTML and CSS fundamentals"],
  skillsGained: ["React Hooks", "State Management", "Functional Components"],
});

const MOCK_MODULE_1 = JSON.stringify({
  chapterName: "Getting Started with Hooks",
  chapterDescription:
    "Introduction to React Hooks and the useState hook for state management in functional components.",
  chapterObjectives: [
    "Understand the motivation behind Hooks",
    "Use useState to manage local state",
  ],
});

const MOCK_LESSONS_1 = JSON.stringify({
  lessons: [
    {
      title: "What are React Hooks?",
      content:
        "React Hooks are functions that let you use state and lifecycle features in functional components. They were introduced in React 16.8.",
      duration: "15 minutes",
    },
    {
      title: "The useState Hook",
      content:
        "useState returns a stateful value and a function to update it. It takes an initial value as an argument.",
      duration: "20 minutes",
    },
  ],
});

/**
 * DEV ONLY: Simulates streaming data into the StreamingResponseWindow
 * so you can test the UI without calling the Gemini API.
 * Delete this component before production.
 */
export function MockStreamButton() {
  const {
    isGenerating,
    showStreamWindow,
    clearStreamChunks,
    setIsGenerating,
    setProgress,
    showWidget,
  } = useGenerationContext();

  const [isMocking, setIsMocking] = useState(false);

  // Simulate streaming a string chunk-by-chunk via custom events on window
  const streamText = (step: string, text: string, charsPerTick = 8) => {
    return new Promise<void>((resolve) => {
      let pos = 0;
      const interval = setInterval(() => {
        const chunk = text.substring(pos, pos + charsPerTick);
        pos += charsPerTick;

        // Dispatch a custom event that the context can listen for
        window.dispatchEvent(
          new CustomEvent("mock:stream:chunk", {
            detail: { step, chunk },
          }),
        );

        if (pos >= text.length) {
          clearInterval(interval);
          resolve();
        }
      }, 100); // matches the 100ms flush interval
    });
  };

  const runMockStream = async () => {
    setIsMocking(true);
    clearStreamChunks();
    showStreamWindow();
    showWidget();
    setIsGenerating(true);
    setProgress({
      jobId: "mock-job",
      userId: "mock-user",
      status: GenerationStatus.IN_PROGRESS,
      currentStep: GenerationStep.COURSE,
      progress: 10,
      message: "Generating course metadata...",
      timestamp: new Date().toISOString(),
    });

    // Stream course
    await streamText("course", MOCK_COURSE);
    await new Promise((r) => setTimeout(r, 500)); // pause between steps

    // Stream module 1
    setProgress({
      jobId: "mock-job",
      userId: "mock-user",
      status: GenerationStatus.IN_PROGRESS,
      currentStep: GenerationStep.CHAPTERS,
      progress: 40,
      message: "Generating Module 1...",
      timestamp: new Date().toISOString(),
    });
    await streamText("module-1", MOCK_MODULE_1);
    await new Promise((r) => setTimeout(r, 500));

    // Stream lessons for module 1
    setProgress({
      jobId: "mock-job",
      userId: "mock-user",
      status: GenerationStatus.IN_PROGRESS,
      currentStep: GenerationStep.LESSONS,
      progress: 70,
      message: "Generating lessons for Module 1...",
      timestamp: new Date().toISOString(),
    });
    await streamText("lessons-1", MOCK_LESSONS_1);
    await new Promise((r) => setTimeout(r, 500));

    // Complete
    setProgress({
      jobId: "mock-job",
      userId: "mock-user",
      status: GenerationStatus.COMPLETED,
      currentStep: GenerationStep.LESSONS,
      progress: 100,
      message: "Course generation completed successfully!",
      timestamp: new Date().toISOString(),
      data: {
        courseId: "mock-course-id",
        courseName: "Introduction to React Hooks",
        chaptersCount: 2,
        lessonsCount: 4,
      },
    });

    setIsGenerating(false);
    setIsMocking(false);
  };

  return (
    <Button
      onClick={runMockStream}
      variant="outline"
      size="sm"
      disabled={isGenerating || isMocking}
      className="gap-2 text-xs border-dashed border-orange-500 text-orange-600 hover:bg-orange-500/10"
    >
      {isMocking ? (
        <>
          <Square className="h-3 w-3" />
          Mocking...
        </>
      ) : (
        <>
          <Play className="h-3 w-3" />
          Mock Stream (DEV)
        </>
      )}
    </Button>
  );
}
