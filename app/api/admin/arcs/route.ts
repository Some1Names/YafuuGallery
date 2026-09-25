import { NextRequest, NextResponse } from "next/server";
import { checkText, MAX_ARC_NAME_LENGTH } from "@/lib/content-limits";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { canManageManga } from "@/lib/manga-access";
import { isAllowedUrlWrite } from "@/lib/storage";

// `instanceof Prisma.PrismaClientKnownRequestError` doesn't reliably match
// here — Turbopack ends up with more than one instance of the generated
// client's module graph, so the class reference this file imports isn't
// always the same one the thrown error was constructed with. Checking the
// `code` property directly is what Prisma's own docs recommend for exactly
// this reason, and it isn't fooled by cross-module class identity.
function isUniqueConstraintError(err: unknown): boolean {
  return typeof err === "object" && err !== null && "code" in err && err.code === "P2002";
}

// POST /api/admin/arcs — create
export async function POST(request: NextRequest) {
  const session = await auth();

  const body = await request.json().catch(() => null);
  const { manga_id, arc_name, arc_order, arc_status, arc_image_url, arc_is_ex } = body ?? {};

  if (!manga_id || !arc_name || arc_order === undefined || arc_order === null) {
    return NextResponse.json(
      { error: "manga_id, arc_name, and arc_order are required" },
      { status: 400 }
    );
  }

  // type, blank and length checks (lib/content-limits.ts); stores trimmed text
  const name = checkText(arc_name, "Arc name", MAX_ARC_NAME_LENGTH);
  if ("error" in name) return NextResponse.json({ error: name.error }, { status: 400 });

  if (!(await canManageManga(session?.user, manga_id))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
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

  // SECURITY: see isAllowedUrlWrite — whatever URL is stored here gets
  // deleted from R2 when this arc is later deleted or its image replaced.
  if (!isAllowedUrlWrite(arc_image_url, session!.user!.id)) {
    return NextResponse.json({ error: "Invalid image URL" }, { status: 400 });
  }

  try {
    const arc = await prisma.arc.create({
      data: {
        manga_id,
        arc_name: name.value,
        arc_order: order,
        arc_is_ex: isEx,
        arc_status: status,
        arc_image_url: arc_image_url || null,
      },
    });

    return NextResponse.json(arc, { status: 201 });
  } catch (err) {
    if (isUniqueConstraintError(err)) {
      return NextResponse.json(
        { error: "This manga already has an arc with that order number." },
        { status: 409 }
      );
    }
    console.error("[POST /api/admin/arcs]", err);
    return NextResponse.json({ error: "Failed to create arc." }, { status: 500 });
  }
}
