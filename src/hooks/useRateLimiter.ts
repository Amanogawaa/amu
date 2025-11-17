'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  checkRateLimit,
  recordAttempt,
  clearRateLimit,
  getTimeUntilReset,
  RateLimitConfig,
  RateLimitStatus,
} from '@/utils/rateLimiter';

interface UseRateLimiterOptions {
  config?: Partial<RateLimitConfig>;
  autoRefresh?: boolean;
}

export function useRateLimiter(options: UseRateLimiterOptions = {}) {
  const { config, autoRefresh = true } = options;

  const [status, setStatus] = useState<RateLimitStatus>(() =>
    checkRateLimit(config)
  );
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);

  const refreshStatus = useCallback(() => {
    const newStatus = checkRateLimit(config);
    setStatus(newStatus);
    return newStatus;
  }, [config]);

  const record = useCallback(() => {
    recordAttempt(config);
    refreshStatus();
  }, [config, refreshStatus]);

  const clear = useCallback(() => {
    clearRateLimit();
    refreshStatus();
  }, [refreshStatus]);

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      refreshStatus();

      const remaining = getTimeUntilReset(config);
      setTimeRemaining(remaining);
    }, 1000);

    return () => clearInterval(interval);
  }, [autoRefresh, config, refreshStatus]);

  return {
    ...status,
    timeRemaining,
    refreshStatus,
    recordAttempt: record,
    clearRateLimit: clear,
  };
}
