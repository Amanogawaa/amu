"use client";

import { AnimatePresence } from "framer-motion";
import { useGenerationContext } from '../application/GenerationContext';
import { MiniProgressIndicator } from "./MiniProgressIndicator";
import { ExpandedProgressView } from "./ExpandedProgressView";
import { StreamingResponseWindow } from "./StreamingResponseWindow";

export function FloatingGenerationWidget() {
  const {
    isWidgetVisible,
    isMinimized,
    progress,
    isStreamWindowVisible,
    toggleMinimize,
    hideWidget,
  } = useGenerationContext();

  return (
    <>
      {/* Progress Widget — only shown when NOT streaming */}
      {isWidgetVisible && !isStreamWindowVisible && progress && (
        <div className="fixed bottom-4 right-4 z-50">
          <AnimatePresence mode="wait">
            {isMinimized ? (
              <MiniProgressIndicator
                key="mini"
                progress={progress}
                onExpand={toggleMinimize}
                onClose={hideWidget}
              />
            ) : (
              <ExpandedProgressView
                key="expanded"
                progress={progress}
                onMinimize={toggleMinimize}
                onClose={hideWidget}
              />
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Streaming Dialog — manages its own position and maximized state */}
      <StreamingResponseWindow />
    </>
  );
}
