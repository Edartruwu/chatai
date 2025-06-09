import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

interface JWTPayload {
  user_id: string;
  email: string;
  is_admin: boolean;
  role: string;
  exp: number;
  iat: number;
}

function verifyJWT(token: string): JWTPayload | null {
  try {
    // Simple JWT decode without verification (verification happens on backend)
    const payload = JSON.parse(atob(token.split(".")[1]));

    // Check if token is expired
    if (payload.exp * 1000 < Date.now()) {
      return null;
    }

    return payload;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for API routes, static files, and public routes
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.includes(".") ||
    pathname === "/" ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/chat") ||
    pathname.startsWith("/integrations")
  ) {
    return NextResponse.next();
  }

  // Get token from Authorization header or cookie
  let token = request.headers.get("authorization")?.replace("Bearer ", "");

  // If no Authorization header, check for token in cookie (fallback)
  if (!token) {
    token = request.cookies.get("access_token")?.value;
  }

  // For admin routes, require authentication and admin role
  if (pathname.startsWith("/admin")) {
    if (!token) {
      return NextResponse.redirect(new URL("/auth", request.url));
    }

    const payload = verifyJWT(token);
    if (!payload) {
      return NextResponse.redirect(new URL("/auth", request.url));
    }

    // Check admin access
    if (!payload.is_admin && payload.role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // Add user info to headers for server components
    const response = NextResponse.next();
    response.headers.set("x-user-id", payload.user_id);
    response.headers.set("x-user-email", payload.email);
    response.headers.set("x-is-admin", payload.is_admin.toString());
    response.headers.set("x-user-role", payload.role || "linko-user");

    return response;
  }

  // For other protected routes, just verify token exists
  if (token) {
    const payload = verifyJWT(token);
    if (payload) {
      const response = NextResponse.next();
      response.headers.set("x-user-id", payload.user_id);
      response.headers.set("x-user-email", payload.email);
      response.headers.set("x-is-admin", payload.is_admin.toString());
      response.headers.set("x-user-role", payload.role || "linko-user");

      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
};
