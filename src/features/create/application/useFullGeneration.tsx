'use client';

import { useGenerationContext } from '../context/GenerationContext';
import type { FullGenerationRequest } from '@/server/features/course/types';

interface UseFullGenerationReturn {
  progress: ReturnType<typeof useGenerationContext>['progress'];
  isGenerating: boolean;
  error: string | null;
  startGeneration: (request: FullGenerationRequest) => Promise<void>;
  cancelGeneration: () => void;
  resetGeneration: () => void;
}

/**
 * Hook that provides access to the global generation context
 * This is a wrapper around useGenerationContext for backward compatibility
 */
export function useFullGeneration(): UseFullGenerationReturn {
  const context = useGenerationContext();

  const cancelGeneration = () => {
    // For now, just reset the generation
    // In the future, we could implement actual cancellation via API
    context.resetGeneration();
  };

  return {
    progress: context.progress,
    isGenerating: context.isGenerating,
    error: context.error,
    startGeneration: context.startGeneration,
    cancelGeneration,
    resetGeneration: context.resetGeneration,
  };
}
