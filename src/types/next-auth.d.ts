import { DefaultSession } from "next-auth";

// Extend NextAuth types to include our custom fields
// This gives us proper TypeScript support for session.user.username etc.

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username: string;
    } & DefaultSession["user"];
  }

  interface User {
    username: string;
  }
}
