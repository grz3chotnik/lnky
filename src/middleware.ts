import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

// Middleware runs BEFORE every request to matched routes
// We use it to protect routes that require authentication

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { pathname } = req.nextUrl;

  // Protected routes - require login
  const protectedRoutes = ["/dashboard"];
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Auth routes - redirect to dashboard if already logged in
  const authRoutes = ["/login", "/signup"];
  const isAuthRoute = authRoutes.includes(pathname);

  // If trying to access protected route without login, redirect to login
  if (isProtectedRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // If logged in and trying to access login/signup, redirect to dashboard
  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Allow the request to continue
  return NextResponse.next();
});

// Configure which routes middleware runs on
export const config = {
  // Match all routes except static files and API routes
  matcher: ["/((?!api|_next/static|_next/image|icon.svg).*)"],
};
