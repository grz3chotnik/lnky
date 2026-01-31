import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/username/check?username=xxx
// Checks if a username is available

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username");

  if (!username) {
    return NextResponse.json(
      { error: "Username is required" },
      { status: 400 }
    );
  }

  // Check if username exists
  const existingUser = await db.user.findUnique({
    where: { username: username.toLowerCase() },
  });

  return NextResponse.json({
    available: !existingUser,
    username: username.toLowerCase(),
  });
}
