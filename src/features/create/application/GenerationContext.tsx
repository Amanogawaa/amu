"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  ReactNode,
} from "react";
import { useSocket } from "@/provider/SocketProvider";
import { toast } from "sonner";
import { generateFullCourseSequentialTransactionalStreaming } from "@/server/features/course";
import {
  GenerationProgress,
  FullGenerationRequest,
  GenerationStatus,
} from "@/server/features/course/types";
import { logger } from "@/lib/loggers";
import { useRouter } from "next/navigation";

export interface StreamChunk {
  step: string;
  text: string;
}

interface GenerationState {
  progress: GenerationProgress | null;
  isGenerating: boolean;
  isMinimized: boolean;
  isWidgetVisible: boolean;
  error: string | null;
  isStreamWindowVisible: boolean;
  streamChunks: StreamChunk[];
  currentStreamStep: string | null;
}

interface GenerationContextType extends GenerationState {
  startGeneration: (request: FullGenerationRequest) => Promise<void>;
  startStreamingGeneration: (request: FullGenerationRequest) => Promise<void>;
  setProgress: (progress: GenerationProgress | null) => void;
  setIsGenerating: (value: boolean) => void;
  toggleMinimize: () => void;
  setIsMinimized: (value: boolean) => void;
  showWidget: () => void;
  hideWidget: () => void;
  showStreamWindow: () => void;
  hideStreamWindow: () => void;
  resetGeneration: () => void;
  navigateToCourse: () => void;
  clearStreamChunks: () => void;
}

const STORAGE_KEY = "coursecraft_active_generation";
const GENERATION_TIMEOUT = 10 * 60 * 1500;

const GenerationContext = createContext<GenerationContextType | null>(null);

export function GenerationProvider({ children }: { children: ReactNode }) {
  const { socket, isConnected } = useSocket();
  const router = useRouter();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Chunk buffering: accumulate rapid Socket.IO chunks in a ref,
  // then flush to React state every ~50ms to avoid jittery re-renders.
  const chunkBufferRef = useRef<Map<string, string>>(new Map());
  const flushIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const [state, setState] = useState<GenerationState>({
    progress: null,
    isGenerating: false,
    isMinimized: false,
    isWidgetVisible: false,
    error: null,
    isStreamWindowVisible: false,
    streamChunks: [],
    currentStreamStep: null,
  });

  // Restore persisted state on mount
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
              // Don't restore stream chunks — they're ephemeral
              streamChunks: [],
              currentStreamStep: null,
            }));
            logger.info("Restored active generation from localStorage");
          } else {
            localStorage.removeItem(STORAGE_KEY);
          }
        }
      } catch (error) {
        logger.error("Failed to load persisted generation state:", error);
        localStorage.removeItem(STORAGE_KEY);
      }
    };

    loadPersistedState();
  }, []);

  // Persist state (excluding stream chunks which are too large)
  useEffect(() => {
    if (state.isGenerating && state.progress) {
      try {
        const { streamChunks, currentStreamStep, ...persistable } = state;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(persistable));
      } catch (error) {
        logger.error("Failed to persist generation state:", error);
      }
    } else if (!state.isGenerating) {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [state]);

  // Flush buffered chunks into React state every ~100ms for smooth typing pace
  useEffect(() => {
    flushIntervalRef.current = setInterval(() => {
      const buffer = chunkBufferRef.current;
      if (buffer.size === 0) return;

      setState((prev) => {
        const chunks = [...prev.streamChunks];
        let latestStep = prev.currentStreamStep;

        buffer.forEach((text, step) => {
          const existing = chunks.find((c) => c.step === step);
          if (existing) {
            existing.text += text;
          } else {
            chunks.push({ step, text });
          }
          latestStep = step;
        });

        buffer.clear();
        return { ...prev, streamChunks: chunks, currentStreamStep: latestStep };
      });
    }, 100);

    // DEV: Listen for mock stream events (from MockStreamButton)
    const handleMockChunk = (e: Event) => {
      const { step, chunk } = (e as CustomEvent).detail;
      const buffer = chunkBufferRef.current;
      const existing = buffer.get(step) || "";
      buffer.set(step, existing + chunk);
    };
    window.addEventListener("mock:stream:chunk", handleMockChunk);

    return () => {
      if (flushIntervalRef.current) {
        clearInterval(flushIntervalRef.current);
      }
      window.removeEventListener("mock:stream:chunk", handleMockChunk);
    };
  }, []);

  // Listen for Socket.IO events
  useEffect(() => {
    if (!socket || !isConnected) return;

    // Progress events (same as before)
    const handleProgress = (data: GenerationProgress) => {
      logger.info("Generation progress update:", data);

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

        toast.success("Course generated successfully!", {
          description: `Created ${data.data?.chaptersCount || 0} chapters and ${data.data?.lessonsCount || 0} lessons`,
          duration: 5000,
          action: {
            label: "View Course",
            onClick: () => {
              if (data.data?.courseId) {
                router.push(`/courses/${data.data.courseId}`);
              }
            },
          },
        });

        if (data.data?.courseId) router.push(`/courses/${data.data.courseId}`);

        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
      }

      if (data.status === GenerationStatus.FAILED) {
        setState((prev) => ({
          ...prev,
          isGenerating: false,
          error: data.error || "Generation failed",
        }));

        toast.error("Course generation failed", {
          description: data.error || "An unknown error occurred",
          duration: 5000,
        });

        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
      }
    };

    // NEW: Streaming chunk events — buffer them, don't setState directly
    const handleStreamChunk = (data: { step: string; chunk: string }) => {
      const buffer = chunkBufferRef.current;
      const existing = buffer.get(data.step) || "";
      buffer.set(data.step, existing + data.chunk);
    };

    socket.on("generation:progress", handleProgress);
    socket.on("generation:stream", handleStreamChunk);

    return () => {
      socket.off("generation:progress", handleProgress);
      socket.off("generation:stream", handleStreamChunk);
    };
  }, [socket, isConnected, router]);

  // Start generation using the sequential-transactional-streaming endpoint
  const startGeneration = useCallback(
    async (request: FullGenerationRequest) => {
      if (!socket || !isConnected) {
        toast.error("Socket connection required", {
          description: "Please wait for connection to establish",
        });
        return;
      }

      try {
        setState((prev) => ({
          ...prev,
          isGenerating: true,
          isWidgetVisible: true,
          isStreamWindowVisible: true,
          isMinimized: false,
          error: null,
          progress: null,
          streamChunks: [],
          currentStreamStep: null,
        }));

        chunkBufferRef.current.clear();

        const response =
          await generateFullCourseSequentialTransactionalStreaming(request);

        toast.info("Generation started", {
          description:
            response.note ||
            "Generating your course... Watch the streaming output!",
          duration: 3000,
        });

        timeoutRef.current = setTimeout(() => {
          setState((prev) => ({
            ...prev,
            isGenerating: false,
            error: "Generation timed out",
          }));

          toast.error("Generation timed out", {
            description: "Please try again or contact support",
          });
        }, GENERATION_TIMEOUT);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to start generation";

        setState((prev) => ({
          ...prev,
          isGenerating: false,
          error: errorMessage,
          isWidgetVisible: false,
          isStreamWindowVisible: false,
        }));

        toast.error("Failed to start generation", {
          description: errorMessage,
        });

        logger.error("Generation start failed:", error);
      }
    },
    [socket, isConnected],
  );

  const startStreamingGeneration = startGeneration;

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

    chunkBufferRef.current.clear();

    setState({
      progress: null,
      isGenerating: false,
      isMinimized: false,
      isWidgetVisible: false,
      error: null,
      isStreamWindowVisible: false,
      streamChunks: [],
      currentStreamStep: null,
    });

    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const navigateToCourse = useCallback(() => {
    if (state.progress?.data?.courseId) {
      router.push(`/create/${state.progress.data.courseId}`);
      hideWidget();
    }
  }, [state.progress, router]);

  const showStreamWindow = useCallback(() => {
    setState((prev) => ({ ...prev, isStreamWindowVisible: true }));
  }, []);

  const hideStreamWindow = useCallback(() => {
    setState((prev) => ({ ...prev, isStreamWindowVisible: false }));
  }, []);

  const clearStreamChunks = useCallback(() => {
    chunkBufferRef.current.clear();
    setState((prev) => ({
      ...prev,
      streamChunks: [],
      currentStreamStep: null,
    }));
  }, []);

  const value: GenerationContextType = {
    ...state,
    startGeneration,
    startStreamingGeneration,
    setProgress,
    setIsGenerating,
    toggleMinimize,
    setIsMinimized,
    showWidget,
    hideWidget,
    showStreamWindow,
    hideStreamWindow,
    resetGeneration,
    navigateToCourse,
    clearStreamChunks,
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
      "useGenerationContext must be used within GenerationProvider",
    );
  }
  return context;
}
