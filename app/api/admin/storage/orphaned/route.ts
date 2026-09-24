import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { deleteObjects, listObjects } from "@/lib/storage";
import { findOrphanedObjects, getReferencedStorageKeys } from "@/lib/storage-references";

// DELETE /api/admin/storage/orphaned — permanently remove R2 objects that
// no manga/chapter/arc/user row references. Admin-only, same as the
// featured-toggle route — ManageMangaDashboard's author-facing reuse of the
// admin components must never reach this.
//
// The requested keys are only a WISH LIST: the page that sent them may
// have been open for hours, and a file listed as orphaned then may be in
// use now. So orphan status is recomputed here, at delete time, and only
// keys that are STILL unreferenced (and past the minimum age — see
// ORPHAN_MIN_AGE_MS) get deleted; the rest are skipped and reported back.
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

  const [objects, referencedKeys] = await Promise.all([listObjects(), getReferencedStorageKeys()]);
  const currentlyOrphaned = new Set(findOrphanedObjects(objects, referencedKeys).map((o) => o.key));
  const safeToDelete = keys.filter((k: string) => currentlyOrphaned.has(k));

  if (safeToDelete.length > 0) await deleteObjects(safeToDelete);

  return NextResponse.json({
    success: true,
    deletedCount: safeToDelete.length,
    skippedCount: keys.length - safeToDelete.length,
  });
}
