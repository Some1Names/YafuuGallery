import { isUuid } from "./client";

// A MangaDex cover file name: a UUID plus an image extension. Anything
// else (slashes, dots, a URL) is refused, so the pass-through route can
// only ever be made to fetch a cover — never another path or host.
const COVER_FILE_RE = /^[0-9a-f-]{36}\.(jpg|jpeg|png|gif|webp)$/i;

// Where MangaDex serves the thumbnail for a cover, or null if the inputs
// aren't a real manga id and cover file name. size: "512" for the title
// page, anything else gives the 256px one used in grids.
export function coverUpstreamUrl(mangaId: string, fileName: string, size: string | null): string | null {
  if (!isUuid(mangaId) || !COVER_FILE_RE.test(fileName)) return null;
  const px = size === "512" ? 512 : 256;
  return `https://uploads.mangadex.org/covers/${mangaId}/${fileName}.${px}.jpg`;
}
