import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// POST /api/views/[username] - Track a profile view
export async function POST(
  request: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;

    const user = await db.user.findUnique({
      where: { username: username.toLowerCase() },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Increment the view counter
    await db.user.update({
      where: { id: user.id },
      data: { profileViews: { increment: 1 } },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Track view error:", error);
    return NextResponse.json({ error: "Failed to track view" }, { status: 500 });
  }
}
