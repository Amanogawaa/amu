"use client";

import { AnimatePresence } from "framer-motion";
import { useGenerationContext } from "../context/GenerationContext";
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
    hideStreamWindow,
  } = useGenerationContext();

  return (
    <>
      {/* Progress Widget */}
      {isWidgetVisible && progress && (
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

      {/* Streaming Window - positioned on the left */}
      {isStreamWindowVisible && (
        <div className="fixed bottom-4 left-4 z-50 max-w-2xl">
          <StreamingResponseWindow
            isVisible={isStreamWindowVisible}
            onClose={hideStreamWindow}
          />
        </div>
      )}
    </>
  );
}
