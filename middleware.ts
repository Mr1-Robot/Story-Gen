import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const authToken = req.cookies.get("authToken");
  const isApiRoute = req.nextUrl.pathname.startsWith("/api");
  const isSignInRoute =
    req.nextUrl.pathname === "/sign-in" || req.nextUrl.pathname === "/sign-up";

  // Skip middleware for API routes
  if (isApiRoute) {
    return NextResponse.next();
  }

  // Redirect unauthenticated users to sign-in
  if (!authToken && !isSignInRoute) {
    return NextResponse.redirect(`${new URL("/sign-in", req.url)}`);
  }

  // Redirect authenticated users to home.
  if (authToken && isSignInRoute) {
    return NextResponse.redirect(`${new URL("/", req.url)}`);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/profile",
    "/new-story",
    "/sign-in",
    "/((?!api|_next|.*\\..*).*)",
  ],
};
