import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { viewsLimiter, rateLimitResponse } from "@/lib/rate-limit";

// POST /api/views/[username] - Track a profile view
export async function POST(
  request: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  const { success } = viewsLimiter(request);
  if (!success) {
    return rateLimitResponse();
  }

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
  } catch {
    return NextResponse.json({ error: "Failed to track view" }, { status: 500 });
  }
}
