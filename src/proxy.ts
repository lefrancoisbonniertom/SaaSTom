import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { SESSION_MARKER_COOKIE } from "@/lib/session-marker";

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|opengraph-image|twitter-image|icon|apple-icon).*)",
  ],
};

export default async function proxy(request: NextRequest) {
  const secureCookie = request.nextUrl.protocol === "https:";
  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
    secureCookie,
  });

  const { pathname } = request.nextUrl;
  const isAuthPage =
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/reset-password");

  const isPublicPage =
    isAuthPage ||
    pathname === "/" ||
    pathname.startsWith("/mentions-legales") ||
    pathname.startsWith("/cgv") ||
    pathname.startsWith("/confidentialite");

  const hasActiveSession = request.cookies.has(SESSION_MARKER_COOKIE);

  // The session-token cookie outlives the browser session, but our marker
  // cookie doesn't: if the JWT is still valid but the marker is gone, the
  // browser was closed and reopened since login, so force a logout.
  if (token && !hasActiveSession && !isPublicPage) {
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete(
      secureCookie ? "__Secure-authjs.session-token" : "authjs.session-token",
    );
    return response;
  }

  const isLoggedIn = !!token && hasActiveSession;

  if (!isLoggedIn && !isPublicPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isLoggedIn && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}
