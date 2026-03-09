'use client';

import type { FullGenerationRequest } from '@/server/features/course/types';
import { useGenerationContext } from './GenerationContext';

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
