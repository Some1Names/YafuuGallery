import { NextRequest, NextResponse } from "next/server";
import { getChapter, getChapterPages } from "@/lib/mangadex/queries";
import { MangaDexError, type MdErrorKind } from "@/lib/mangadex/types";

const STATUS: Record<MdErrorKind, number> = { not_found: 404, rate_limited: 429, unavailable: 502 };

// GET /api/mangadex/chapter/[chapterId]/pages
//
// Fresh page image URLs for a chapter. The reader gets its first set
// from the server-rendered page; it calls this only when images stop
// loading, because the image server address in those URLs expires after
// a few minutes (a reader who leaves a chapter open comes back to dead
// links).
export async function GET(_request: NextRequest, { params }: { params: Promise<{ chapterId: string }> }) {
  const { chapterId } = await params;
  const headers = { "Cache-Control": "no-store" };

  try {
    // getChapter first: it refuses chapters of titles outside the allowed
    // content ratings, which the at-home endpoint alone wouldn't.
    await getChapter(chapterId);
    const pages = await getChapterPages(chapterId);
    return NextResponse.json({ pages }, { headers });
  } catch (err) {
    if (err instanceof MangaDexError) {
      return NextResponse.json({ error: err.kind }, { status: STATUS[err.kind], headers });
    }
    console.error("[GET /api/mangadex/chapter/[chapterId]/pages]", err);
    return NextResponse.json({ error: "unavailable" }, { status: 502, headers });
  }
}
