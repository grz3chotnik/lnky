import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

// NextAuth configuration
// NOTE: We dynamically import db inside authorize() to avoid loading
// Prisma in Edge Runtime (middleware only checks JWT, doesn't need DB)

export const { handlers, signIn, signOut, auth } = NextAuth({
  // Session strategy: JWT stores session data in a cookie (stateless)
  // Alternative is "database" which stores sessions in DB
  session: {
    strategy: "jwt",
  },

  // Pages - custom pages instead of NextAuth defaults
  pages: {
    signIn: "/login", // Redirect here when not logged in
  },

  // Callbacks let us customize the auth behavior
  callbacks: {
    // Called when creating/updating JWT token
    async jwt({ token, user }) {
      // On sign in, add user data to the token
      if (user) {
        token.id = user.id;
        token.username = user.username;
      }
      return token;
    },

    // Called when creating session object (what we access in components)
    async session({ session, token }) {
      // Add our custom fields to the session
      if (token) {
        session.user.id = token.id as string;
        session.user.username = token.username as string;
      }
      return session;
    },
  },

  // Providers define HOW users can log in
  providers: [
    // Credentials provider = email/password login
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      // This function validates the login attempt
      async authorize(credentials) {
        // Check if email and password were provided
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Dynamic import to avoid loading Prisma in Edge Runtime
        const { db } = await import("./db");

        // Find user by email
        const user = await db.user.findUnique({
          where: { email: credentials.email as string },
        });

        // No user found
        if (!user) {
          return null;
        }

        // Compare provided password with stored hash
        const passwordMatch = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        // Password doesn't match
        if (!passwordMatch) {
          return null;
        }

        // Success! Return user object (without password)
        return {
          id: user.id,
          email: user.email,
          username: user.username,
          name: user.displayName,
        };
      },
    }),
  ],
});
