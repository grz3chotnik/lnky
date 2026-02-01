import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

// DELETE /api/links/[id] - Delete a link
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Verify the link belongs to the user
    const link = await db.link.findUnique({
      where: { id },
    });

    if (!link || link.userId !== session.user.id) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 });
    }

    // Delete the link
    await db.link.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

// PATCH /api/links/[id] - Update a link
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    // Verify the link belongs to the user
    const existingLink = await db.link.findUnique({
      where: { id },
    });

    if (!existingLink || existingLink.userId !== session.user.id) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 });
    }

    // Update the link (only update provided fields)
    const link = await db.link.update({
      where: { id },
      data: {
        ...(body.title !== undefined && { title: body.title }),
        ...(body.url !== undefined && { url: body.url }),
        ...(body.order !== undefined && { order: body.order }),
        ...(body.active !== undefined && { active: body.active }),
        ...("imageUrl" in body && { imageUrl: body.imageUrl }),
      },
    });

    return NextResponse.json(link);
  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
