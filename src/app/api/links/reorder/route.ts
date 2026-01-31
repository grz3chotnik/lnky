import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

// POST /api/links/reorder - Reorder links
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { linkIds } = await request.json();

    if (!Array.isArray(linkIds)) {
      return NextResponse.json(
        { error: "linkIds must be an array" },
        { status: 400 }
      );
    }

    // Verify all links belong to the user
    const userLinks = await db.link.findMany({
      where: { userId: session.user.id },
      select: { id: true },
    });

    const userLinkIds = new Set(userLinks.map((l: { id: string }) => l.id));
    const allBelongToUser = linkIds.every((id: string) => userLinkIds.has(id));

    if (!allBelongToUser) {
      return NextResponse.json(
        { error: "Invalid link IDs" },
        { status: 400 }
      );
    }

    // Update order for each link
    await Promise.all(
      linkIds.map((id: string, index: number) =>
        db.link.update({
          where: { id },
          data: { order: index },
        })
      )
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Reorder links error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
