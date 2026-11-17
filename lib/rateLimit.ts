interface RateBucket {
  timestamps: number[];
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

const DEFAULT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const DEFAULT_MAX_REQUESTS = 5;

const buckets = new Map<string, RateBucket>();

export function checkSlidingWindowRateLimit(
  key: string,
  options?: { windowMs?: number; maxRequests?: number; nowMs?: number }
): RateLimitResult {
  const windowMs = options?.windowMs ?? DEFAULT_WINDOW_MS;
  const maxRequests = options?.maxRequests ?? DEFAULT_MAX_REQUESTS;
  const now = options?.nowMs ?? Date.now();
  const windowStart = now - windowMs;

  const existing = buckets.get(key);
  const activeTimestamps = (existing?.timestamps ?? []).filter((ts) => ts > windowStart);

  if (activeTimestamps.length >= maxRequests) {
    const oldest = activeTimestamps[0] ?? now;
    const retryAfterSeconds = Math.max(1, Math.ceil((oldest + windowMs - now) / 1000));
    buckets.set(key, { timestamps: activeTimestamps });
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds,
    };
  }

  activeTimestamps.push(now);
  buckets.set(key, { timestamps: activeTimestamps });

  // Opportunistic memory hygiene for expired keys
  if (buckets.size > 500) {
    for (const [bucketKey, bucket] of buckets.entries()) {
      if (bucket.timestamps.every((ts) => ts <= windowStart)) {
        buckets.delete(bucketKey);
      }
    }
  }

  return {
    allowed: true,
    remaining: Math.max(0, maxRequests - activeTimestamps.length),
    retryAfterSeconds: 0,
  };
}

export function clearRateLimitBucketsForTest(): void {
  buckets.clear();
}
