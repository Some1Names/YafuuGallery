import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// POST /api/favorites/updates/seen — "Mark all as read" on the Updates tab.
// Moves every one of this reader's favorites' updates_seen_at to now, so
// nothing uploaded before this moment counts as new any more (see
// lib/favorite-updates.ts). Doesn't touch reading progress — the chapters
// aren't marked as read in "Continue reading", only as no longer new.
export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  await prisma.bookmark.updateMany({
    where: { user_id: session.user.id },
    data: { updates_seen_at: new Date() },
  });

  return NextResponse.json({ success: true });
}
