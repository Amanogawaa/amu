'use client';

import { useEffect } from 'react';
import { ErrorFallback } from '@/components/errors/ErrorFallback';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log critical error
    console.error('Global Error:', error);
  }, [error]);

  return (
    <html>
      <body>
        <ErrorFallback error={error} reset={reset} />
      </body>
    </html>
  );
}
