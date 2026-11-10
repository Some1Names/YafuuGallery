import { NextRequest } from "next/server";
import { MD_USER_AGENT } from "@/lib/mangadex/client";
import { coverUpstreamUrl } from "@/lib/mangadex/cover";

// GET /api/mangadex/cover/[mangaId]/[fileName]?size=256|512
//
// Passes a MangaDex cover thumbnail through our server. A browser can't
// load covers from MangaDex itself: anything with a browser User-Agent
// is redirected to a bot challenge, which an <img> can't pass.
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

  let upstream: Response;
  try {
    upstream = await fetch(upstreamUrl, {
      headers: { "User-Agent": MD_USER_AGENT },
      // the CDN header below does the caching; image bodies don't belong
      // in Next's data cache
      cache: "no-store",
      redirect: "error",
      signal: AbortSignal.timeout(10_000),
    });
  } catch {
    return new Response(null, { status: 404 });
  }

  const contentType = upstream.headers.get("content-type") ?? "";
  if (!upstream.ok || !contentType.startsWith("image/") || !upstream.body) {
    return new Response(null, { status: 404 });
  }

  return new Response(upstream.body, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=86400, s-maxage=2592000, immutable",
    },
  });
}
