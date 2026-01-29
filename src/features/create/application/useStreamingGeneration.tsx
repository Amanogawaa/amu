"use client";

import { useState } from "react";
import { useGenerationContext } from "../context/GenerationContext";
import { CreateCoursePayload } from "@/server/features/course/types";

export function useStreamingGeneration() {
  const { startStreamingGeneration, isGenerating, error } =
    useGenerationContext();
  const [isLoading, setIsLoading] = useState(false);

  const generateWithStreaming = async (payload: CreateCoursePayload) => {
    setIsLoading(true);
    try {
      await startStreamingGeneration(payload);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    generateWithStreaming,
    isLoading: isLoading || isGenerating,
    error,
  };
}
