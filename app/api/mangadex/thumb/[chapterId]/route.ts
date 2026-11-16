import { NextRequest } from "next/server";
import { MD_USER_AGENT } from "@/lib/mangadex/client";
import { getChapter, getChapterPages } from "@/lib/mangadex/queries";

// GET /api/mangadex/thumb/[chapterId]
//
// A small picture of a MangaDex chapter's first page, for the chapter
// rows on its title page — the same idea as the site's own chapters,
// whose cover is the first page of the uploaded PDF.
//
// The site's own covers are made once, at upload, and stored. Nothing
// from MangaDex is stored, and its page addresses only last a few
// minutes, so this is made on demand instead: look up the chapter's
// pages, fetch the first, shrink it, and hand it back marked immutable.
// The CDN then keeps it for 30 days, so MangaDex is asked about once a
// month per chapter, however many people open the title page.
//
// Anything that goes wrong is a 404 that is NOT cached: the row falls
// back to the manga's cover, and the next visit tries again.

const WIDTH = 432; // the row's picture box is 216px wide; 2x for sharp screens
const MISSING = { status: 404, headers: { "Cache-Control": "no-store" } } as const;

export async function GET(_request: NextRequest, { params }: { params: Promise<{ chapterId: string }> }) {
  const { chapterId } = await params;

  let original: ArrayBuffer;
  let originalType: string;
  try {
    // getChapter first: it rejects ids that aren't MangaDex ids and
    // chapters of titles outside the allowed content ratings.
    await getChapter(chapterId);
    const [firstPage] = await getChapterPages(chapterId);
    const upstream = await fetch(firstPage, {
      headers: { "User-Agent": MD_USER_AGENT },
      cache: "no-store",
      redirect: "error",
      signal: AbortSignal.timeout(10_000),
    });
    originalType = upstream.headers.get("content-type") ?? "";
    if (!upstream.ok || !originalType.startsWith("image/")) return new Response(null, MISSING);
    original = await upstream.arrayBuffer();
  } catch {
    return new Response(null, MISSING);
  }

  const headers = { "Cache-Control": "public, max-age=86400, s-maxage=2592000, immutable" };

  try {
    // Loaded here rather than at the top: if the resizer can't load on
    // some platform, the route still works, just with the full-size page.
    const { default: sharp } = await import("sharp");
    const small = await sharp(Buffer.from(original))
      .resize({ width: WIDTH, withoutEnlargement: true })
      .webp({ quality: 72 })
      .toBuffer();
    return new Response(new Uint8Array(small), { headers: { ...headers, "Content-Type": "image/webp" } });
  } catch (err) {
    console.error("[GET /api/mangadex/thumb/[chapterId]] resize failed, sending the page as it is:", err);
    return new Response(original, { headers: { ...headers, "Content-Type": originalType } });
  }
}
