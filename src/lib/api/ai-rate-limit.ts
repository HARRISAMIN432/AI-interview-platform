import { NextResponse } from "next/server";
import { applyRateLimit } from "@/lib/rate-limit";

const AI_LIMIT = 30;
const AI_WINDOW_MS = 60 * 60 * 1000;

/** Returns a 429 response if rate limited, otherwise null. */
export function enforceAiRateLimit(userId: string): NextResponse | null {
  const result = applyRateLimit(`ai:${userId}`, AI_LIMIT, AI_WINDOW_MS);

  if (!result.success) {
    const retryAfter = Math.ceil((result.resetAt - Date.now()) / 1000);
    return NextResponse.json(
      {
        success: false,
        error: "Too many AI requests. Please try again later.",
        code: "RATE_LIMIT",
        retryAfter,
      },
      {
        status: 429,
        headers: { "Retry-After": String(retryAfter) },
      },
    );
  }

  return null;
}
