import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

// PrismaClient singleton pattern for Next.js
// Why? In development, Next.js hot-reloads your code. Without this pattern,
// each reload would create a NEW database connection, eventually exhausting
// the connection pool and causing errors.

// We store the client on the global object so it persists across hot reloads
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

// Use existing client if available, otherwise create a new one
export const db = globalForPrisma.prisma ?? createPrismaClient();

// In development, save the client to the global object
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
