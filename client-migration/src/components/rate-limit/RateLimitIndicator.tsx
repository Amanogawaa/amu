'use client';

import { useRateLimiter } from '@/hooks/useRateLimiter';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface RateLimitIndicatorProps {
  maxAttempts?: number;
  showWhenAllowed?: boolean; // Show indicator even when allowed
}

export function RateLimitIndicator({
  maxAttempts = 3,
  showWhenAllowed = true,
}: RateLimitIndicatorProps) {
  const { allowed, remainingAttempts, timeRemaining, cooldownEndsAt } =
    useRateLimiter({
      config: { maxAttempts },
      autoRefresh: true,
    });

  const [formattedTime, setFormattedTime] = useState<string>('');

  // Format time remaining
  useEffect(() => {
    if (!timeRemaining) {
      setFormattedTime('');
      return;
    }

    const seconds = Math.floor(timeRemaining / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      setFormattedTime(`${hours}h ${minutes % 60}m ${seconds % 60}s`);
    } else if (minutes > 0) {
      setFormattedTime(`${minutes}m ${seconds % 60}s`);
    } else {
      setFormattedTime(`${seconds}s`);
    }
  }, [timeRemaining]);

  // Don't show if allowed and showWhenAllowed is false
  if (allowed && !showWhenAllowed) {
    return null;
  }

  // Calculate progress percentage
  const usedAttempts = maxAttempts - remainingAttempts - (allowed ? 0 : 1);
  const progressPercentage = (usedAttempts / maxAttempts) * 100;

  return (
    <Alert
      className={
        !allowed
          ? 'border-destructive bg-destructive/10'
          : remainingAttempts <= 1
          ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20'
          : 'border-green-500 bg-green-50 dark:bg-green-950/20'
      }
    >
      {!allowed ? (
        <AlertTriangle className="h-4 w-4" />
      ) : remainingAttempts <= 1 ? (
        <Clock className="h-4 w-4 text-yellow-600" />
      ) : (
        <CheckCircle2 className="h-4 w-4 text-green-600" />
      )}

      <AlertTitle>
        {!allowed
          ? 'Rate Limit Reached'
          : remainingAttempts <= 1
          ? 'Almost at Limit'
          : 'Generation Available'}
      </AlertTitle>

      <AlertDescription className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span>
            {allowed
              ? `${remainingAttempts} generation${
                  remainingAttempts !== 1 ? 's' : ''
                } remaining`
              : 'Please wait before creating another course'}
          </span>
          {!allowed && formattedTime && (
            <span className="font-mono font-semibold">{formattedTime}</span>
          )}
        </div>

        {/* Progress bar showing usage */}
        <div className="space-y-1">
          <Progress
            value={progressPercentage}
            className={`h-2 ${
              !allowed
                ? 'bg-destructive/20'
                : remainingAttempts <= 1
                ? 'bg-yellow-200 dark:bg-yellow-900'
                : 'bg-green-200 dark:bg-green-900'
            }`}
          />
          <p className="text-xs text-muted-foreground">
            {usedAttempts} of {maxAttempts} attempts used
            {!allowed && formattedTime && ` • Resets in ${formattedTime}`}
          </p>
        </div>

        {cooldownEndsAt && (
          <p className="text-xs text-muted-foreground mt-1">
            ⏱️ Cooldown period active
          </p>
        )}
      </AlertDescription>
    </Alert>
  );
}
