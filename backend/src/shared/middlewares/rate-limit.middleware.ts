import type { NextFunction, Request, Response } from "express";

const WINDOW_MS = 60_000;
const MAX_ATTEMPT = 5;

interface RateLimitEntry {
    count: number;
    windowStartedAt: number;
}

const attempts = new Map<string, RateLimitEntry>();

export function loginRateLimit(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const key = req.ip ?? "unknown";

  const now = Date.now();

  const existing = attempts.get(key);

  if (!existing || now - existing.windowStartedAt >= WINDOW_MS) {
    attempts.set(key, {
      count: 1,
      windowStartedAt: now,
    });
    next();
    return;
  }

  if (existing.count >= MAX_ATTEMPT) {
    const retryAfterSeconds = Math.ceil(
      (WINDOW_MS - (now - existing.windowStartedAt)) / 1000,
    );

    res.setHeader("Retry-After", retryAfterSeconds);

    res.status(429).json({
      error: {
        code: "RATE_LIMIT_EXCEEDED",
        message: "Too many login attempts. Please try again later",
      },
    });
    return;
  }
  existing.count += 1;
  next();
}
