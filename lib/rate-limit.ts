/**
 * lib/rate-limit.ts
 *
 * Simple in-memory sliding-window rate limiter for Next.js API routes.
 * No external dependencies — uses a Map with automatic cleanup.
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const ipMap = new Map<string, RateLimitEntry>();

// Clean up stale entries every 5 minutes to prevent memory leaks
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000;
let lastCleanup = Date.now();

function cleanupStaleEntries() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;
  for (const [key, entry] of ipMap) {
    if (now > entry.resetTime) {
      ipMap.delete(key);
    }
  }
}

/**
 * Check if the given IP is within the rate limit.
 * @param ip        - Client IP address
 * @param limit     - Max requests per window (default: 60)
 * @param windowMs  - Window duration in ms (default: 60_000 = 1 minute)
 * @returns { success: boolean, remaining: number }
 */
export function rateLimit(
  ip: string,
  limit: number = 60,
  windowMs: number = 60_000
): { success: boolean; remaining: number } {
  cleanupStaleEntries();

  const now = Date.now();
  const entry = ipMap.get(ip);

  if (!entry || now > entry.resetTime) {
    // First request or window expired — start a new window
    ipMap.set(ip, { count: 1, resetTime: now + windowMs });
    return { success: true, remaining: limit - 1 };
  }

  if (entry.count >= limit) {
    return { success: false, remaining: 0 };
  }

  entry.count++;
  return { success: true, remaining: limit - entry.count };
}
