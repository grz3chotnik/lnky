import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function PATCH(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { bgColor, textColor, accentColor } = await request.json();

  await db.user.update({
    where: { id: session.user.id },
    data: {
      bgColor: bgColor || null,
      textColor: textColor || null,
      accentColor: accentColor || null,
    },
  });

  return NextResponse.json({ success: true });
}
