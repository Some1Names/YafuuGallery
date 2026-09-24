import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// DELETE /api/history — "Clear history" on /history: removes all of the
// signed-in reader's reading progress (Continue Reading and every saved
// page with it). Their own rows only.
export async function DELETE() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const { count } = await prisma.readingProgress.deleteMany({ where: { user_id: session.user.id } });
  return NextResponse.json({ success: true, removed: count });
}
