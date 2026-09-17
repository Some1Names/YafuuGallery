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
};

export default nextConfig;
