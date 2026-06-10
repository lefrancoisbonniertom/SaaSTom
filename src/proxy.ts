import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { SESSION_MARKER_COOKIE } from "@/lib/session-marker";

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
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
    pathname.startsWith("/login") || pathname.startsWith("/register");

  const hasActiveSession = request.cookies.has(SESSION_MARKER_COOKIE);

  // The session-token cookie outlives the browser session, but our marker
  // cookie doesn't: if the JWT is still valid but the marker is gone, the
  // browser was closed and reopened since login, so force a logout.
  if (token && !hasActiveSession && !isAuthPage) {
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete(
      secureCookie ? "__Secure-authjs.session-token" : "authjs.session-token",
    );
    return response;
  }

  const isLoggedIn = !!token && hasActiveSession;

  if (!isLoggedIn && !isAuthPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isLoggedIn && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}
