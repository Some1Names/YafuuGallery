import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { canManageArc } from "@/lib/manga-access";

// `instanceof Prisma.PrismaClientKnownRequestError` doesn't reliably match
// here — Turbopack ends up with more than one instance of the generated
// client's module graph, so the class reference this file imports isn't
// always the same one the thrown error was constructed with. Checking the
// `code` property directly is what Prisma's own docs recommend for exactly
// this reason, and it isn't fooled by cross-module class identity.
function isUniqueConstraintError(err: unknown): boolean {
  return typeof err === "object" && err !== null && "code" in err && err.code === "P2002";
}

// PATCH /api/admin/arcs/[id] — update
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();
  if (!(await canManageArc(session?.user, id))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const { arc_name, arc_order, arc_status, arc_image_url, arc_is_ex } = body ?? {};

  if (!arc_name || arc_order === undefined || arc_order === null) {
    return NextResponse.json(
      { error: "arc_name and arc_order are required" },
      { status: 400 }
    );
  }

  const order = Number(arc_order);
  if (!Number.isInteger(order) || order < 0) {
    return NextResponse.json(
      { error: "arc_order must be a whole number, 0 or higher" },
      { status: 400 }
    );
  }

  const status = arc_status === "completed" ? "completed" : "ongoing";
  const isEx = arc_is_ex === true;

  try {
    const arc = await prisma.arc.update({
      where: { id },
      data: {
        arc_name,
        arc_order: order,
        arc_is_ex: isEx,
        arc_status: status,
        arc_image_url: arc_image_url || null,
      },
    });

    return NextResponse.json(arc);
  } catch (err) {
    if (isUniqueConstraintError(err)) {
      return NextResponse.json(
        { error: "This manga already has an arc with that order number." },
        { status: 409 }
      );
    }
    console.error("[PATCH /api/admin/arcs/[id]]", err);
    return NextResponse.json({ error: "Failed to update arc." }, { status: 500 });
  }
}

// DELETE /api/admin/arcs/[id] — delete
// Chapters assigned to this arc are NOT deleted — the schema's
// `onDelete: SetNull` on Chapter.arc unassigns them instead.
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();
  if (!(await canManageArc(session?.user, id))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.arc.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
