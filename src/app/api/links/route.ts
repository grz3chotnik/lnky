import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

// POST /api/links - Create a new link
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, url, order, type, platform } = body;

    // Validate required fields
    if (!title || !url) {
      return NextResponse.json(
        { error: "Title and URL are required" },
        { status: 400 }
      );
    }

    // Create the link
    const link = await db.link.create({
      data: {
        title,
        url,
        order: order ?? 0,
        type: type ?? "link",
        platform: platform ?? null,
        userId: session.user.id,
      },
    });

    return NextResponse.json(link, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Database error" },
      { status: 500 }
    );
  }
}

// GET /api/links - Get all links for current user
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const links = await db.link.findMany({
      where: { userId: session.user.id },
      orderBy: { order: "asc" },
    });

    return NextResponse.json(links);
  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
