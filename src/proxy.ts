import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// TODO: Add rate limiting via @upstash/ratelimit before production
export function proxy(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
