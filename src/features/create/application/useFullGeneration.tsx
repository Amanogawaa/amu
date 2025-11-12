'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useSocket } from '@/provider/SocketProvider';
import { toast } from 'sonner';
import { generateFullCourse } from '@/server/features/course';
import {
  GenerationProgress,
  FullGenerationRequest,
  GenerationStatus,
} from '@/server/features/course/types';
import { useRouter } from 'next/navigation';

interface UseFullGenerationReturn {
  progress: GenerationProgress | null;
  isGenerating: boolean;
  error: string | null;
  startGeneration: (request: FullGenerationRequest) => Promise<void>;
  cancelGeneration: () => void;
  resetGeneration: () => void;
}

const GENERATION_TIMEOUT = 10 * 60 * 1500;

export function useFullGeneration(): UseFullGenerationReturn {
  const router = useRouter();
  const { socket, isConnected } = useSocket();
  const [progress, setProgress] = useState<GenerationProgress | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleProgress = (data: GenerationProgress) => {
      setProgress(data);

      if (data.status === GenerationStatus.COMPLETED) {
        setIsGenerating(false);
        toast.success('Course generated successfully!', {
          description: `Created ${data.data?.modulesCount || 0} modules, ${
            data.data?.chaptersCount || 0
          } chapters, and ${data.data?.lessonsCount || 0} lessons`,
          duration: 5000,
        });

        router.push(`/create/${data.data?.courseId}`);

        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
      }

      if (data.status === GenerationStatus.FAILED) {
        setIsGenerating(false);
        setError(data.error || 'Generation failed');
        toast.error('Course generation failed', {
          description: data.error || 'An unknown error occurred',
          duration: 5000,
        });

        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
      }
    };

    socket.on('generation:progress', handleProgress);

    return () => {
      socket.off('generation:progress', handleProgress);
    };
  }, [socket, isConnected]);

  // Start generation
  const startGeneration = useCallback(
    async (request: FullGenerationRequest) => {
      if (!socket || !isConnected) {
        toast.error('Socket connection required', {
          description: 'Please wait for connection to establish',
        });
        return;
      }

      try {
        setIsGenerating(true);
        setError(null);
        setProgress(null);

        const response = await generateFullCourse(request);

        toast.info('Generation started', {
          description: response.note || 'Generating your course...',
          duration: 3000,
        });

        timeoutRef.current = setTimeout(() => {
          setIsGenerating(false);
          setError('Generation timeout');
          toast.error('Generation timed out', {
            description: 'The generation took too long. Please try again.',
          });
        }, GENERATION_TIMEOUT);
      } catch (err: any) {
        setIsGenerating(false);
        setError(err.message || 'Failed to start generation');
        toast.error('Failed to start generation', {
          description: err.message || 'Please try again',
        });
      }
    },
    [socket, isConnected]
  );

  const cancelGeneration = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsGenerating(false);
    toast.info('Generation cancelled');
  }, []);

  const resetGeneration = useCallback(() => {
    setProgress(null);
    setError(null);
    setIsGenerating(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    progress,
    isGenerating,
    error,
    startGeneration,
    cancelGeneration,
    resetGeneration,
  };
}
