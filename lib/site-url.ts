// The site's public origin, for things that need absolute URLs (sitemap,
// robots.txt, metadataBase). First match wins:
//   NEXT_PUBLIC_SITE_URL           — set this to your real domain
//   BETTER_AUTH_URL                — usually the same origin, if set
//   VERCEL_PROJECT_PRODUCTION_URL  — Vercel sets this automatically
//                                    (host only, no protocol)
//   http://localhost:3000          — local development
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.BETTER_AUTH_URL;
  if (explicit) return explicit;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  return "http://localhost:3000";
}

export const SITE_URL = resolveSiteUrl().replace(/\/+$/, "");
