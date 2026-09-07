import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { canManageManga } from "@/lib/manga-access";

// POST /api/admin/arcs/reorder — bulk re-number a manga's arcs to match a
// new drag-and-drop order. arc_order is purely a sort key (arc_is_ex is a
// separate column, so the special "ex" arc participates in this ordering
// like any other row and can end up anywhere in the sequence).
//
// Naively PATCHing arc_order one at a time can collide mid-sequence with
// the @@unique([manga_id, arc_order]) constraint (e.g. swapping #0 and #1
// hits a duplicate the moment the first update lands). Sidestepped with a
// two-phase update inside one transaction: first push every row to a
// negative, guaranteed-unique placeholder, then set final 0..N-1 values —
// neither phase can ever collide with a real order value.
//
// `ordered_ids` doesn't strictly need to cover every arc on the manga —
// any arc left out simply keeps its current arc_order untouched.
export async function POST(request: NextRequest) {
  const session = await auth();

  const body = await request.json().catch(() => null);
  const { manga_id, ordered_ids } = body ?? {};

  if (!manga_id || !Array.isArray(ordered_ids) || ordered_ids.length === 0) {
    return NextResponse.json(
      { error: "manga_id and ordered_ids are required" },
      { status: 400 }
    );
  }

  if (!(await canManageManga(session?.user, manga_id))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const existing = await prisma.arc.findMany({
    where: { manga_id },
    select: { id: true },
  });
  const existingIds = new Set(existing.map((a) => a.id));
  const incomingIds = new Set(ordered_ids);

  const isValidSubset =
    incomingIds.size === ordered_ids.length &&
    ordered_ids.every((id: string) => existingIds.has(id));

  if (!isValidSubset) {
    return NextResponse.json(
      { error: "ordered_ids must be distinct arc ids belonging to this manga" },
      { status: 400 }
    );
  }

  await prisma.$transaction([
    ...ordered_ids.map((id: string, i: number) =>
      prisma.arc.update({ where: { id }, data: { arc_order: -(i + 1) } })
    ),
    ...ordered_ids.map((id: string, i: number) =>
      prisma.arc.update({ where: { id }, data: { arc_order: i } })
    ),
  ]);

  return NextResponse.json({ success: true });
}
