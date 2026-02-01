import { NextResponse } from "next/server";

type RateLimitConfig = {
  interval: number; // Time window in milliseconds
  limit: number; // Max requests per window
};

const rateLimitMap = new Map<string, { count: number; timestamp: number }>();

// Clean up old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitMap.entries()) {
    if (now - value.timestamp > 60000) {
      rateLimitMap.delete(key);
    }
  }
}, 300000);

function getIP(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIP = request.headers.get("x-real-ip");

  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  if (realIP) {
    return realIP;
  }
  return "unknown";
}

export function rateLimit(config: RateLimitConfig) {
  return function checkRateLimit(request: Request): { success: boolean; remaining: number } {
    const ip = getIP(request);
    const key = ip;
    const now = Date.now();

    const record = rateLimitMap.get(key);

    if (!record || now - record.timestamp > config.interval) {
      // First request or window expired
      rateLimitMap.set(key, { count: 1, timestamp: now });
      return { success: true, remaining: config.limit - 1 };
    }

    if (record.count >= config.limit) {
      return { success: false, remaining: 0 };
    }

    record.count++;
    return { success: true, remaining: config.limit - record.count };
  };
}

export function rateLimitResponse() {
  return NextResponse.json(
    { error: "Too many requests. Please try again later." },
    {
      status: 429,
      headers: {
        "Retry-After": "60",
      },
    }
  );
}

// Pre-configured rate limiters
export const signupLimiter = rateLimit({ interval: 60000, limit: 5 }); // 5 per minute
export const usernameLimiter = rateLimit({ interval: 60000, limit: 30 }); // 30 per minute
export const viewsLimiter = rateLimit({ interval: 60000, limit: 10 }); // 10 per minute per IP
