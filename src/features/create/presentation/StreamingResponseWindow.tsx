"use client";

import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Minimize2, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useSocket } from "@/provider/SocketProvider";

interface StreamingResponseWindowProps {
  isVisible?: boolean;
  onClose?: () => void;
  onComplete?: (courseId: string) => void;
}

export function StreamingResponseWindow({
  isVisible = false,
  onClose,
  onComplete,
}: StreamingResponseWindowProps) {
  const [isMinimized, setIsMinimized] = useState(false);
  const [streamedContent, setStreamedContent] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const { socket, isConnected } = useSocket();

  // Auto-scroll to bottom as content streams
  useEffect(() => {
    if (contentRef.current && !isMinimized) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [streamedContent, isMinimized]);

  // Listen for streaming events
  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleStreamStart = () => {
      setIsStreaming(true);
      setStreamedContent("");
    };

    const handleStreamChunk = (data: { chunk: string }) => {
      setStreamedContent((prev) => prev + data.chunk);
    };

    const handleStreamComplete = (data: {
      courseId: string;
      courseName: string;
    }) => {
      setIsStreaming(false);
      setStreamedContent(
        (prev) =>
          prev + `\n\n✅ Course "${data.courseName}" created successfully!`,
      );

      if (onComplete) {
        onComplete(data.courseId);
      }
    };

    const handleStreamError = (data: { error: string }) => {
      setIsStreaming(false);
      setStreamedContent((prev) => prev + `\n\n❌ Error: ${data.error}`);
    };

    socket.on("course:stream:start", handleStreamStart);
    socket.on("course:stream", handleStreamChunk);
    socket.on("course:stream:complete", handleStreamComplete);
    socket.on("course:stream:error", handleStreamError);

    return () => {
      socket.off("course:stream:start", handleStreamStart);
      socket.off("course:stream", handleStreamChunk);
      socket.off("course:stream:complete", handleStreamComplete);
      socket.off("course:stream:error", handleStreamError);
    };
  }, [socket, isConnected, onComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <AnimatePresence mode="wait">
        {isMinimized ? (
          <motion.div
            key="minimized"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="flex items-center gap-3 p-3 shadow-lg bg-background border-2">
              <div className="flex items-center gap-2">
                <div
                  className={`h-2 w-2 rounded-full ${isStreaming ? "bg-green-500 animate-pulse" : "bg-gray-400"}`}
                />
                <span className="text-sm font-medium">
                  {isStreaming ? "Streaming..." : "Response Ready"}
                </span>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setIsMinimized(false)}
                >
                  <Maximize2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={onClose}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="expanded"
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="w-96 shadow-2xl bg-background border-2">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center gap-2">
                  <div
                    className={`h-2 w-2 rounded-full ${isStreaming ? "bg-green-500 animate-pulse" : "bg-gray-400"}`}
                  />
                  <h3 className="font-semibold">Backend Response</h3>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setIsMinimized(true)}
                  >
                    <Minimize2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={onClose}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Content Area */}
              <div
                ref={contentRef}
                className="p-4 h-80 overflow-y-auto text-sm space-y-2"
              >
                {streamedContent ? (
                  <div className="whitespace-pre-wrap">
                    {streamedContent}
                    {isStreaming && (
                      <span className="inline-block w-2 h-4 ml-1 bg-primary animate-pulse" />
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    <p>No active stream</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 border-t flex gap-2">
                <Button
                  onClick={() => setStreamedContent("")}
                  variant="outline"
                  size="sm"
                  disabled={isStreaming}
                >
                  Clear
                </Button>
                <div className="text-xs text-muted-foreground flex items-center ml-auto">
                  {isConnected ? "🟢 Connected" : "🔴 Disconnected"}
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
