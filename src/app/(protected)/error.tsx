'use client';

import { useEffect } from 'react';
import { ErrorFallback } from '@/components/errors/ErrorFallback';
import { logger } from '@/lib/loggers';

export default function ProtectedError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logger.error('Protected Route Error:', {
      message: error.message,
      digest: error.digest,
      stack: error.stack,
    });
  }, [error]);

  return <ErrorFallback error={error} reset={reset} />;
}
