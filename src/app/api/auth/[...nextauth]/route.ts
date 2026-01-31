import { handlers } from "@/lib/auth";

// This file exports the HTTP handlers for NextAuth
// It handles all auth-related API routes:
// - GET /api/auth/signin - Sign in page
// - POST /api/auth/signin - Process sign in
// - GET /api/auth/signout - Sign out
// - GET /api/auth/session - Get current session
// - etc.

export const { GET, POST } = handlers;
