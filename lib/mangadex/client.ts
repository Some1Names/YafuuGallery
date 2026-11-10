import { SITE_URL } from "@/lib/site-url";
import { MangaDexError } from "./types";

// The one place that talks HTTP to MangaDex's API. Server-side only:
// the API sends no Access-Control-Allow-Origin for other sites, so a
// browser on our pages can't call it.

const API_BASE = "https://api.mangadex.org";

// MangaDex wants every client to identify itself, and sends anything
// claiming to be a browser to a bot challenge — so never a browser UA.
export const MD_USER_AGENT = `YafuuGallery/1.0 (+${SITE_URL})`;

const TIMEOUT_MS = 10_000;

export type MdParams = Record<
  string,
  string | number | readonly string[] | Record<string, string> | undefined
>;

// Arrays become key[]=v and objects key[sub]=v, with the brackets
// percent-encoded: MangaDex's edge answered raw brackets with a non-JSON
// body in testing.
export function buildMdUrl(path: string, params: MdParams = {}): string {
  const parts: string[] = [];
  const add = (key: string, value: string | number) => parts.push(`${key}=${encodeURIComponent(String(value))}`);

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined) continue;
    const k = encodeURIComponent(key);
    if (typeof value === "string" || typeof value === "number") {
      add(k, value);
    } else if (Array.isArray(value)) {
      for (const v of value as readonly string[]) add(`${k}%5B%5D`, v);
    } else {
      for (const [sub, v] of Object.entries(value as Record<string, string>)) {
        add(`${k}%5B${encodeURIComponent(sub)}%5D`, v);
      }
    }
  }

  return API_BASE + path + (parts.length ? `?${parts.join("&")}` : "");
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Every MangaDex id is a UUID. Checked before an id from a URL is put
// into a request path.
export function isUuid(value: string): boolean {
  return UUID_RE.test(value);
}

// What a reader typed into the search box, made safe to send on.
export function cleanSearchText(q: string | undefined): string {
  return (q ?? "").trim().replace(/\s+/g, " ").slice(0, 200);
}

// revalidate: seconds to keep the response in Next's data cache, so
// repeat views don't reach MangaDex (its limit is ~5 requests/second).
// false or omitted: always fetch fresh.
export async function mdFetch<T>(
  path: string,
  params?: MdParams,
  opts: { revalidate?: number | false } = {},
): Promise<T> {
  const revalidate = opts.revalidate ?? false;

  let res: Response;
  try {
    res = await fetch(buildMdUrl(path, params), {
      headers: { "User-Agent": MD_USER_AGENT, Accept: "application/json" },
      signal: AbortSignal.timeout(TIMEOUT_MS),
      ...(revalidate === false ? { cache: "no-store" as const } : { next: { revalidate } }),
    });
  } catch (e) {
    throw new MangaDexError("unavailable", `MangaDex request failed: ${String(e)}`);
  }

  if (res.status === 404) throw new MangaDexError("not_found");
  if (res.status === 429) throw new MangaDexError("rate_limited");
  if (!res.ok) throw new MangaDexError("unavailable", `MangaDex answered ${res.status}`);

  let body: unknown;
  try {
    body = await res.json();
  } catch {
    throw new MangaDexError("unavailable", "MangaDex answered with a non-JSON body");
  }
  if (!body || typeof body !== "object" || (body as { result?: unknown }).result === "error") {
    throw new MangaDexError("unavailable", "MangaDex answered with an error result");
  }
  return body as T;
}
