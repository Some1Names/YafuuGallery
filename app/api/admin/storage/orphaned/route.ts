import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { deleteObjects } from "@/lib/storage";

// DELETE /api/admin/storage/orphaned — permanently remove R2 objects the
// admin dashboard identified as unreferenced by any manga/chapter/arc/user
// row. Admin-only, same as the featured-toggle route — this isn't
// something ManageMangaDashboard's author-facing reuse of the admin
// components should ever be able to reach.
export async function DELETE(request: NextRequest) {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const keys = body?.keys;
  if (!Array.isArray(keys) || keys.length === 0 || !keys.every((k) => typeof k === "string")) {
    return NextResponse.json({ error: "keys (non-empty string array) is required" }, { status: 400 });
  }

  await deleteObjects(keys);

  return NextResponse.json({ success: true, deletedCount: keys.length });
}
