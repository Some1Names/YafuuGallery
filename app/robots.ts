import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-url";

// /robots.txt — let crawlers index the public reading pages, keep them out
// of account/admin areas and the API (nothing useful to index there, and
// most of it just redirects to sign-in), and point them at the sitemap.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/admin",
        "/manage",
        "/profile",
        "/favorites",
        "/history",
        "/login",
        "/signup",
        "/forgot-password",
        "/reset-password",
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
