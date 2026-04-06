'use client';

import { AlertCircle, Home, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ErrorFallbackProps {
  error?: Error;
  reset?: () => void;
  showHome?: boolean;
}

export function ErrorFallback({
  error,
  reset,
  showHome = true,
}: ErrorFallbackProps) {
  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-background via-background to-muted/20">
      <Card className="max-w-md w-full border-destructive/50">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="rounded-full bg-destructive/10 p-3">
              <AlertCircle className="h-6 w-6 text-destructive" />
            </div>
            <CardTitle className="text-xl">Something went wrong</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            We encountered an unexpected error. Don't worry, our team has been
            notified and we're working on a fix.
          </p>

          {error && process.env.NODE_ENV === 'development' && (
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-xs font-mono text-destructive break-all">
                {error.message}
              </p>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            {reset && (
              <Button onClick={reset} className="flex-1 gap-2">
                <RefreshCw className="h-4 w-4" />
                Try Again
              </Button>
            )}
            {showHome && (
              <Button
                variant="outline"
                onClick={() => (window.location.href = '/')}
                className="flex-1 gap-2"
              >
                <Home className="h-4 w-4" />
                Go Home
              </Button>
            )}
          </div>

          <p className="text-xs text-center text-muted-foreground">
            Error ID: {Math.random().toString(36).substring(7)}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
