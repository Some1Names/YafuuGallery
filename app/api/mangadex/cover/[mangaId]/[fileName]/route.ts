import { NextRequest } from "next/server";
import { MD_USER_AGENT } from "@/lib/mangadex/client";
import { coverUpstreamUrl } from "@/lib/mangadex/cover";

// GET /api/mangadex/cover/[mangaId]/[fileName]?size=256|512
//
// Passes a MangaDex cover thumbnail through our server. A browser can't
// load covers from MangaDex itself: anything with a browser User-Agent
// is redirected to a bot challenge, which an <img> can't pass.
//
// MangaDex's thumbnails are JPEGs of 50–70 KB each, and Browse shows 24
// at a time, so they are re-encoded as WebP on the way through (about a
// third of the size, same dimensions).
//
// A cover file never changes once uploaded (a new cover gets a new file
// name), so the response is marked immutable and the CDN keeps it for 30
// days — this function runs about once per cover per month.
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ mangaId: string; fileName: string }> },
) {
  const { mangaId, fileName } = await params;
  const upstreamUrl = coverUpstreamUrl(mangaId, fileName, request.nextUrl.searchParams.get("size"));
  if (!upstreamUrl) return new Response(null, { status: 404 });

  let original: ArrayBuffer;
  let originalType: string;
  try {
    const upstream = await fetch(upstreamUrl, {
      headers: { "User-Agent": MD_USER_AGENT },
      // the CDN header below does the caching; image bodies don't belong
      // in Next's data cache
      cache: "no-store",
      redirect: "error",
      signal: AbortSignal.timeout(10_000),
    });
    originalType = upstream.headers.get("content-type") ?? "";
    if (!upstream.ok || !originalType.startsWith("image/")) return new Response(null, { status: 404 });
    original = await upstream.arrayBuffer();
  } catch {
    return new Response(null, { status: 404 });
  }

  const headers = { "Cache-Control": "public, max-age=86400, s-maxage=2592000, immutable" };

  try {
    // Loaded here rather than at the top: if the encoder can't load on
    // some platform, the route still works, just with MangaDex's JPEG.
    const { default: sharp } = await import("sharp");
    const webp = await sharp(Buffer.from(original)).webp({ quality: 74 }).toBuffer();
    return new Response(new Uint8Array(webp), { headers: { ...headers, "Content-Type": "image/webp" } });
  } catch (err) {
    console.error("[GET /api/mangadex/cover] WebP encode failed, sending the cover as it is:", err);
    return new Response(original, { headers: { ...headers, "Content-Type": originalType } });
  }
}
