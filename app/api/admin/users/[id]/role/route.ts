import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const VALID_ROLES = ["reader", "author", "admin"] as const;

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const role = body?.role;

  if (!VALID_ROLES.includes(role)) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }

  // An admin changing their OWN role would drop their admin access
  // instantly, mid-session — the dashboard doesn't offer it, and this is
  // the real enforcement.
  if (id === session.user.id) {
    return NextResponse.json({ error: "You can't change your own role." }, { status: 400 });
  }

  // Never leave the site with zero admins — nobody could get admin access
  // back without editing the database directly.
  if (role !== "admin") {
    const target = await prisma.user.findUnique({ where: { id }, select: { role: true } });
    if (target?.role === "admin") {
      const adminCount = await prisma.user.count({ where: { role: "admin" } });
      if (adminCount <= 1) {
        return NextResponse.json({ error: "Can't remove the last admin." }, { status: 400 });
      }
    }
  }

  await prisma.user.update({
    where: { id },
    data: { role },
  });

  return NextResponse.json({ success: true, role });
}