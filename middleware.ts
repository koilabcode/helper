import { NextResponse, NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export const middleware = (request: NextRequest) => {
  // Skip auth redirects when accessed via Laborario's rewrite proxy
  // (already protected by Laborario's Basic Auth)
  const forwardedHost = request.headers.get("x-forwarded-host");
  if (forwardedHost && !forwardedHost.includes("helper")) {
    return NextResponse.next();
  }
  return updateSession(request);
};

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
