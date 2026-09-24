import { prisma } from "@/lib/prisma";
import { keyFromPublicUrl, type StoredObject } from "@/lib/storage";

// R2 objects aren't tagged with what they belong to — the only record is
// whichever *_url column stored the object's public URL. This is the one
// list of those columns, shared by the admin dashboard (to SHOW orphaned
// files) and the orphan-delete route (to RE-CHECK before deleting), so the
// two can never disagree about what counts as "in use". Add any new *_url
// column here.
export async function getReferencedStorageKeys(): Promise<Set<string>> {
  const [manga, arcs, chapters, translations, users] = await Promise.all([
    prisma.manga.findMany({ select: { cover_image_url: true, banner_image_url: true } }),
    prisma.arc.findMany({ select: { arc_image_url: true } }),
    prisma.chapter.findMany({ select: { cover_image_url: true } }),
    prisma.translation.findMany({ select: { file_url: true } }),
    prisma.user.findMany({ select: { image: true } }),
  ]);

  const urls = [
    ...manga.flatMap((m) => [m.cover_image_url, m.banner_image_url]),
    ...arcs.map((a) => a.arc_image_url),
    ...chapters.map((c) => c.cover_image_url),
    ...translations.map((t) => t.file_url),
    ...users.map((u) => u.image),
  ];

  const keys = new Set<string>();
  for (const url of urls) {
    const key = keyFromPublicUrl(url);
    if (key) keys.add(key);
  }
  return keys;
}

// Files younger than this are never treated as orphaned: an upload lands
// in R2 a moment BEFORE its URL is saved to a row (a cover picked in an
// edit form that's still open, an avatar mid-save), and deleting it in
// that window would leave the row pointing at a missing file.
export const ORPHAN_MIN_AGE_MS = 24 * 60 * 60 * 1000;

export function findOrphanedObjects(
  objects: StoredObject[],
  referencedKeys: Set<string>,
  now: number = Date.now()
): StoredObject[] {
  return objects.filter(
    (o) =>
      !referencedKeys.has(o.key) &&
      o.lastModified !== null &&
      now - o.lastModified.getTime() >= ORPHAN_MIN_AGE_MS
  );
}
