import type { NextConfig } from "next";

// Every manga cover/banner/avatar is served from Cloudflare R2 at whatever
// host R2_PUBLIC_URL points to (the R2.dev public bucket URL by default,
// or a custom domain if one's mapped in the Cloudflare dashboard) — parsed
// from the same env var lib/storage.ts uses to build image URLs, so
// next/image stays in sync with it automatically instead of a hardcoded
// hostname silently going stale if that env var ever changes.
const r2Url = process.env.R2_PUBLIC_URL ? new URL(process.env.R2_PUBLIC_URL) : null;

const nextConfig: NextConfig = {
  // lets the dev server accept requests when reached via the LAN IP
  // (e.g. from a phone on the same Wi-Fi) instead of only localhost
  allowedDevOrigins: ["192.168.1.106"],
  images: {
    remotePatterns: [
      ...(r2Url
        ? [
            {
              protocol: r2Url.protocol.replace(":", "") as "http" | "https",
              hostname: r2Url.hostname,
            },
          ]
        : []),
      // Google sign-in sets user.image to a Google-hosted avatar URL
      // (lib/auth.ts's mapProfileToUser doesn't touch `image`) rather than
      // one of our own uploads — this is the fixed host Google serves
      // profile photos from, unrelated to R2.
      { protocol: "https" as const, hostname: "lh3.googleusercontent.com" },
    ],
  },
  // Baseline security headers on every response. Deliberately NOT a full
  // Content-Security-Policy (script-src etc.) — Next's inline scripts and
  // the theme script in app/layout.tsx would need nonces, which forces
  // every page to render dynamically. frame-ancestors on its own is safe.
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // No other site may show these pages inside a frame — stops
          // clickjacking (an invisible framed page tricking a signed-in
          // reader into clicking Delete, Favorite, etc.). X-Frame-Options
          // is the older equivalent, for browsers without frame-ancestors.
          { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
          { key: "X-Frame-Options", value: "DENY" },
          // Browsers must trust the declared Content-Type, never guess
          // (e.g. treating an uploaded file as HTML/script).
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Other sites see only the origin, not the full page URL.
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // The site never uses these — deny them outright.
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          // HTTPS only for 2 years once a browser has seen the site over
          // HTTPS (ignored on http://localhost). No includeSubDomains, so
          // other subdomains of your domain aren't affected.
          { key: "Strict-Transport-Security", value: "max-age=63072000" },
        ],
      },
    ];
  },
};

export default nextConfig;
