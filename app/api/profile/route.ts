import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { deleteReplacedUrls, isAllowedUrlWrite } from "@/lib/storage";
import { displayNameSchema } from "@/lib/signup-schema";

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
  const userId = session.user.id;

  // Same rule as signup (lib/signup-schema.ts) — including the length cap,
  // so nobody can set a multi-thousand-character name that blows out
  // comments and the navbar.
  let nextName: string | undefined;
  if (name !== undefined) {
    const parsed = displayNameSchema.safeParse(name);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }
    nextName = parsed.data;
  }

  if (image !== undefined && image !== null && typeof image !== "string") {
    return NextResponse.json({ error: "Invalid image" }, { status: 400 });
  }

  // Grabbed before the update so a replaced avatar's old R2 object can be
  // deleted afterward instead of lingering as an orphan.
  const previous =
    image !== undefined
      ? await prisma.user.findUnique({ where: { id: userId }, select: { image: true } })
      : null;

  // SECURITY: the old avatar gets DELETED from storage when replaced
  // (below), so the new one must be this user's own upload, unchanged
  // (e.g. a Google photo), or cleared — see isAllowedUrlWrite.
  if (!isAllowedUrlWrite(image, userId, [previous?.image])) {
    return NextResponse.json({ error: "Invalid image" }, { status: 400 });
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      ...(nextName !== undefined ? { name: nextName } : {}),
      ...(image !== undefined ? { image } : {}),
    },
  });

  if (previous) {
    await deleteReplacedUrls([{ oldUrl: previous.image, newUrl: image }]);
  }

  return NextResponse.json({ name: user.name, image: user.image });
}