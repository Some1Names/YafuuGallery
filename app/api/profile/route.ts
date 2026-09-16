import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// PATCH /api/profile — a user updating their own name/avatar.
// Deliberately doesn't accept role or email here — those aren't
// self-service; role changes go through /api/admin/users/[id]/role.
export async function PATCH(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const { name, image } = body ?? {};

  if (name !== undefined && (typeof name !== "string" || name.trim().length === 0)) {
    return NextResponse.json({ error: "Name can't be empty" }, { status: 400 });
  }
  if (name !== undefined && /\s/.test(name.trim())) {
    return NextResponse.json({ error: "Display name can't contain spaces" }, { status: 400 });
  }

  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      ...(name !== undefined ? { name: name.trim() } : {}),
      ...(image !== undefined ? { image } : {}),
    },
  });

  return NextResponse.json({ name: user.name, image: user.image });
}