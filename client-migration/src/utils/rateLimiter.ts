const RATE_LIMIT_KEY = 'course_generation_rate_limit';

export interface RateLimitConfig {
  maxAttempts: number;
  windowMs: number;
  cooldownMs?: number;
}

export interface RateLimitStatus {
  allowed: boolean;
  remainingAttempts: number;
  resetTime: number | null;
  cooldownEndsAt: number | null;
  message?: string;
}

interface RateLimitData {
  attempts: number;
  windowStart: number;
  cooldownStart?: number;
}

const DEFAULT_CONFIG: RateLimitConfig = {
  maxAttempts: 3,
  windowMs: 60 * 60 * 1000,
  cooldownMs: 5 * 60 * 1000,
};

function getRateLimitData(): RateLimitData | null {
  if (typeof window === 'undefined') return null;

  try {
    const data = localStorage.getItem(RATE_LIMIT_KEY);
    if (!data) return null;
    return JSON.parse(data);
  } catch (error) {
    console.error('Failed to parse rate limit data:', error);
    return null;
  }
}

function saveRateLimitData(data: RateLimitData): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save rate limit data:', error);
  }
}

export function clearRateLimit(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(RATE_LIMIT_KEY);
}

export function checkRateLimit(
  config: Partial<RateLimitConfig> = {}
): RateLimitStatus {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  const now = Date.now();

  const data = getRateLimitData();

  if (!data) {
    return {
      allowed: true,
      remainingAttempts: finalConfig.maxAttempts - 1,
      resetTime: now + finalConfig.windowMs,
      cooldownEndsAt: null,
    };
  }

  if (data.cooldownStart && finalConfig.cooldownMs) {
    const cooldownEnd = data.cooldownStart + finalConfig.cooldownMs;
    if (now < cooldownEnd) {
      const remainingSeconds = Math.ceil((cooldownEnd - now) / 1000);
      return {
        allowed: false,
        remainingAttempts: 0,
        resetTime: cooldownEnd,
        cooldownEndsAt: cooldownEnd,
        message: `Please wait ${formatTime(
          remainingSeconds
        )} before generating another course.`,
      };
    } else {
      return {
        allowed: true,
        remainingAttempts: finalConfig.maxAttempts - 1,
        resetTime: now + finalConfig.windowMs,
        cooldownEndsAt: null,
      };
    }
  }

  const windowEnd = data.windowStart + finalConfig.windowMs;
  if (now >= windowEnd) {
    return {
      allowed: true,
      remainingAttempts: finalConfig.maxAttempts - 1,
      resetTime: now + finalConfig.windowMs,
      cooldownEndsAt: null,
    };
  }

  const remainingAttempts = finalConfig.maxAttempts - data.attempts;

  if (remainingAttempts > 0) {
    return {
      allowed: true,
      remainingAttempts: remainingAttempts - 1,
      resetTime: windowEnd,
      cooldownEndsAt: null,
    };
  }

  const remainingSeconds = Math.ceil((windowEnd - now) / 1000);
  return {
    allowed: false,
    remainingAttempts: 0,
    resetTime: windowEnd,
    cooldownEndsAt: null,
    message: `Rate limit exceeded. You can generate more courses in ${formatTime(
      remainingSeconds
    )}.`,
  };
}

export function recordAttempt(config: Partial<RateLimitConfig> = {}): void {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  const now = Date.now();

  const data = getRateLimitData();

  if (!data) {
    saveRateLimitData({
      attempts: 1,
      windowStart: now,
    });
    return;
  }

  const windowEnd = data.windowStart + finalConfig.windowMs;
  if (now >= windowEnd) {
    // New window
    saveRateLimitData({
      attempts: 1,
      windowStart: now,
    });
    return;
  }

  const newAttempts = data.attempts + 1;
  const newData: RateLimitData = {
    attempts: newAttempts,
    windowStart: data.windowStart,
  };

  if (newAttempts >= finalConfig.maxAttempts && finalConfig.cooldownMs) {
    newData.cooldownStart = now;
  }

  saveRateLimitData(newData);
}

function formatTime(seconds: number): string {
  if (seconds < 60) {
    return `${seconds} second${seconds !== 1 ? 's' : ''}`;
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (remainingSeconds === 0) {
    return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
  }

  return `${minutes} minute${
    minutes !== 1 ? 's' : ''
  } and ${remainingSeconds} second${remainingSeconds !== 1 ? 's' : ''}`;
}

/**
 * Get time remaining until rate limit resets (for UI display)
 */
export function getTimeUntilReset(
  config: Partial<RateLimitConfig> = {}
): number | null {
  const status = checkRateLimit(config);
  if (!status.resetTime) return null;

  const now = Date.now();
  const remaining = status.resetTime - now;
  return remaining > 0 ? remaining : null;
}
