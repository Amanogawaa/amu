'use client';

import { AnimatePresence } from 'framer-motion';
import { useGenerationContext } from '../context/GenerationContext';
import { MiniProgressIndicator } from './MiniProgressIndicator';
import { ExpandedProgressView } from './ExpandedProgressView';

export function FloatingGenerationWidget() {
  const { isWidgetVisible, isMinimized, progress, toggleMinimize, hideWidget } =
    useGenerationContext();

  if (!isWidgetVisible || !progress) {
    return null;
  }

  return (
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
  );
}
