/**
 * Rate limiting middleware
 * Prevents brute force attacks and abuse
 */

import { headers } from "next/headers";

// In-memory rate limit store
// TODO: Replace with Redis in production
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

interface RateLimitOptions {
  limit: number; // Max requests
  window: number; // Time window in milliseconds
  key?: string; // Custom key (default: IP address)
}

/**
 * Check if request is rate limited
 * Throws error if limit exceeded
 */
export async function checkRateLimit(options: RateLimitOptions) {
  const key = options.key || (await getClientIp());
  const now = Date.now();

  const record = rateLimitStore.get(key);

  // Reset window if expired
  if (record && now >= record.resetTime) {
    rateLimitStore.delete(key);
  }

  const current = rateLimitStore.get(key);

  if (!current) {
    // First request in window
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + options.window,
    });
    return { success: true, remaining: options.limit - 1 };
  }

  if (current.count >= options.limit) {
    throw new Error(
      `Rate limited. Try again in ${Math.ceil((current.resetTime - now) / 1000)}s`
    );
  }

  current.count++;
  return { success: true, remaining: options.limit - current.count };
}

/**
 * Get client IP address
 */
async function getClientIp(): Promise<string> {
  const headersList = await headers();
  return (
    headersList.get("x-forwarded-for")?.split(",")[0] ||
    headersList.get("x-real-ip") ||
    "unknown"
  );
}

/**
 * Rate limit presets for common use cases
 */
export const rateLimitPresets = {
  // Login: 5 attempts per 15 minutes
  login: { limit: 5, window: 15 * 60 * 1000 },

  // API: 100 requests per minute
  api: { limit: 100, window: 60 * 1000 },

  // Search: 30 requests per minute
  search: { limit: 30, window: 60 * 1000 },

  // File upload: 10 per 5 minutes
  upload: { limit: 10, window: 5 * 60 * 1000 },

  // Form submission: 10 per 10 minutes
  form: { limit: 10, window: 10 * 60 * 1000 },

  // Public API: 1000 per hour
  publicApi: { limit: 1000, window: 60 * 60 * 1000 },
};

// Cleanup old entries every hour
if (typeof window === "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitStore.entries()) {
      if (now >= record.resetTime) {
        rateLimitStore.delete(key);
      }
    }
  }, 60 * 60 * 1000);
}
