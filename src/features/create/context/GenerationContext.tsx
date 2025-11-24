'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  ReactNode,
} from 'react';
import { useSocket } from '@/provider/SocketProvider';
import { toast } from 'sonner';
import { generateFullCourse } from '@/server/features/course';
import {
  GenerationProgress,
  FullGenerationRequest,
  GenerationStatus,
} from '@/server/features/course/types';
import { logger } from '@/lib/loggers';
import { useRouter } from 'next/navigation';

interface GenerationState {
  progress: GenerationProgress | null;
  isGenerating: boolean;
  isMinimized: boolean;
  isWidgetVisible: boolean;
  error: string | null;
}

interface GenerationContextType extends GenerationState {
  startGeneration: (request: FullGenerationRequest) => Promise<void>;
  setProgress: (progress: GenerationProgress | null) => void;
  setIsGenerating: (value: boolean) => void;
  toggleMinimize: () => void;
  setIsMinimized: (value: boolean) => void;
  showWidget: () => void;
  hideWidget: () => void;
  resetGeneration: () => void;
  navigateToCourse: () => void;
}

const STORAGE_KEY = 'coursecraft_active_generation';
const GENERATION_TIMEOUT = 10 * 60 * 1500;

const GenerationContext = createContext<GenerationContextType | null>(null);

export function GenerationProvider({ children }: { children: ReactNode }) {
  const { socket, isConnected } = useSocket();
  const router = useRouter();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [state, setState] = useState<GenerationState>({
    progress: null,
    isGenerating: false,
    isMinimized: false,
    isWidgetVisible: false,
    error: null,
  });

  useEffect(() => {
    const loadPersistedState = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (
            parsed.isGenerating &&
            parsed.progress?.status === GenerationStatus.IN_PROGRESS
          ) {
            setState((prev) => ({
              ...prev,
              ...parsed,
              isWidgetVisible: true,
            }));
            logger.info('Restored active generation from localStorage');
          } else {
            localStorage.removeItem(STORAGE_KEY);
          }
        }
      } catch (error) {
        logger.error('Failed to load persisted generation state:', error);
        localStorage.removeItem(STORAGE_KEY);
      }
    };

    loadPersistedState();
  }, []);

  useEffect(() => {
    if (state.isGenerating && state.progress) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch (error) {
        logger.error('Failed to persist generation state:', error);
      }
    } else if (!state.isGenerating) {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [state]);

  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleProgress = (data: GenerationProgress) => {
      logger.info('Generation progress update:', data);

      setState((prev) => ({
        ...prev,
        progress: data,
      }));

      if (data.status === GenerationStatus.COMPLETED) {
        setState((prev) => ({
          ...prev,
          isGenerating: false,
          error: null,
        }));

        toast.success('Course generated successfully!', {
          description: `Created ${data.data?.modulesCount || 0} modules, ${
            data.data?.chaptersCount || 0
          } chapters, and ${data.data?.lessonsCount || 0} lessons`,
          duration: 5000,
          action: {
            label: 'View Course',
            onClick: () => {
              if (data.data?.courseId) {
                router.push(`/create/${data.data.courseId}`);
              }
            },
          },
        });

        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
      }

      if (data.status === GenerationStatus.FAILED) {
        setState((prev) => ({
          ...prev,
          isGenerating: false,
          error: data.error || 'Generation failed',
        }));

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
  }, [socket, isConnected, router]);

  const startGeneration = useCallback(
    async (request: FullGenerationRequest) => {
      if (!socket || !isConnected) {
        toast.error('Socket connection required', {
          description: 'Please wait for connection to establish',
        });
        return;
      }

      try {
        setState((prev) => ({
          ...prev,
          isGenerating: true,
          isWidgetVisible: true,
          isMinimized: false,
          error: null,
          progress: null,
        }));

        const response = await generateFullCourse(request);

        toast.info('Generation started', {
          description:
            response.note ||
            'Generating your course... You can continue browsing.',
          duration: 3000,
        });

        setTimeout(() => {
          setState((prev) => ({
            ...prev,
            isMinimized: true,
          }));
        }, 3000);

        timeoutRef.current = setTimeout(() => {
          setState((prev) => ({
            ...prev,
            isGenerating: false,
            error: 'Generation timed out',
          }));

          toast.error('Generation timed out', {
            description: 'Please try again or contact support',
          });
        }, GENERATION_TIMEOUT);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to start generation';

        setState((prev) => ({
          ...prev,
          isGenerating: false,
          error: errorMessage,
          isWidgetVisible: false,
        }));

        toast.error('Failed to start generation', {
          description: errorMessage,
        });

        logger.error('Generation start failed:', error);
      }
    },
    [socket, isConnected]
  );

  const setProgress = useCallback((progress: GenerationProgress | null) => {
    setState((prev) => ({ ...prev, progress }));
  }, []);

  const setIsGenerating = useCallback((value: boolean) => {
    setState((prev) => ({ ...prev, isGenerating: value }));
  }, []);

  const toggleMinimize = useCallback(() => {
    setState((prev) => ({ ...prev, isMinimized: !prev.isMinimized }));
  }, []);

  const setIsMinimized = useCallback((value: boolean) => {
    setState((prev) => ({ ...prev, isMinimized: value }));
  }, []);

  const showWidget = useCallback(() => {
    setState((prev) => ({ ...prev, isWidgetVisible: true }));
  }, []);

  const hideWidget = useCallback(() => {
    setState((prev) => ({ ...prev, isWidgetVisible: false }));
  }, []);

  const resetGeneration = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    setState({
      progress: null,
      isGenerating: false,
      isMinimized: false,
      isWidgetVisible: false,
      error: null,
    });

    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const navigateToCourse = useCallback(() => {
    if (state.progress?.data?.courseId) {
      router.push(`/create/${state.progress.data.courseId}`);
      hideWidget();
    }
  }, [state.progress, router]);

  const value: GenerationContextType = {
    ...state,
    startGeneration,
    setProgress,
    setIsGenerating,
    toggleMinimize,
    setIsMinimized,
    showWidget,
    hideWidget,
    resetGeneration,
    navigateToCourse,
  };

  return (
    <GenerationContext.Provider value={value}>
      {children}
    </GenerationContext.Provider>
  );
}

export function useGenerationContext() {
  const context = useContext(GenerationContext);
  if (!context) {
    throw new Error(
      'useGenerationContext must be used within GenerationProvider'
    );
  }
  return context;
}
