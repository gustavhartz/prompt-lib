import { NextRequest, NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { logger } from "./utils/logger";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(20, "10 s"),
  //analytics: true,
  prefix: "@upstash/ratelimit",
});
// Define which routes you want to rate limit
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico|blocked|api/auth).*)",
  ],
};

export default async function middleware(request: NextRequest) {
  // disable rate limiting for development
  if (
    process.env.NODE_ENV !== "development" &&
    process.env.UPSTASH_REDIS_REST_URL &&
    process.env.UPSTASH_REDIS_REST_TOKEN
  ) {
    const ip = request.ip ?? "127.0.0.1";
    const { success, pending, limit, reset, remaining } = await ratelimit.limit(
      ip,
    );
    const res = success
      ? NextResponse.next()
      : NextResponse.redirect(new URL("/blocked", request.url));

    if (!success) {
      logger.info(`Rate limit exceeded for IP: ${ip}, remaining: ${remaining}`);
    }

    res.headers.set("X-RateLimit-Limit", limit.toString());
    res.headers.set("X-RateLimit-Remaining", remaining.toString());
    res.headers.set("X-RateLimit-Reset", reset.toString());
    return res;
  }
  return NextResponse.next();
}
