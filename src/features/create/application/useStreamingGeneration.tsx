"use client";

import { useState } from "react";
import type { CreateCoursePayload } from "@/server/features/course/types";
import { generateCourseStream } from "@/server/features/course";
import { toast } from "sonner";
import { useGenerationContext } from "./GenerationContext";

export function useStreamingGeneration() {
  const {
    isGenerating,
    error,
    isStreamWindowVisible,
    showStreamWindow,
    hideStreamWindow,
  } = useGenerationContext();
  const [isLoading, setIsLoading] = useState(false);

  const generateWithStreaming = async (payload: CreateCoursePayload) => {
    setIsLoading(true);
    showStreamWindow();

    try {
      const response = await generateCourseStream(payload);

      toast.success("Course generated successfully!", {
        description: response.message,
        duration: 5000,
      });

      return response.data;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to generate course";

      toast.error("Failed to generate course", {
        description: errorMessage,
      });

      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    generateWithStreaming,
    isLoading: isLoading || isGenerating,
    error,
    isStreamWindowVisible,
    showStreamWindow,
    hideStreamWindow,
  };
}
