import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { SITE_URL } from "@/lib/site-url";

// Rebuilt at most hourly. A sitemap route is otherwise cached indefinitely
// (built once at deploy), which would leave out every manga and chapter
// published after that.
export const revalidate = 3600;

// /sitemap.xml — every public page search engines should index: home,
// search (the browse-all listing), each manga page, each author page, and
// each chapter.
// Account/admin pages are left out (and disallowed in robots.ts).
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [manga, chapters, authors] = await Promise.all([
    prisma.manga.findMany({ select: { id: true, updated_at: true } }),
    prisma.chapter.findMany({ select: { id: true, published_date: true } }),
    // only accounts with manga have an author page (see manga/authors/[id])
    prisma.user.findMany({
      where: { manga: { some: {} } },
      select: { id: true, manga: { select: { updated_at: true }, orderBy: { updated_at: "desc" }, take: 1 } },
    }),
  ]);

  const latestUpdate = manga.reduce<Date | undefined>(
    (latest, m) => (!latest || m.updated_at > latest ? m.updated_at : latest),
    undefined
  );

  return [
    { url: `${SITE_URL}/`, lastModified: latestUpdate, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/search`, lastModified: latestUpdate, changeFrequency: "daily", priority: 0.6 },
    ...manga.map((m) => ({
      url: `${SITE_URL}/manga/titles/${m.id}`,
      lastModified: m.updated_at,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...authors.map((a) => ({
      url: `${SITE_URL}/manga/authors/${a.id}`,
      lastModified: a.manga[0]?.updated_at,
      changeFrequency: "weekly" as const,
      priority: 0.5,
    })),
    ...chapters.map((c) => ({
      url: `${SITE_URL}/viewer/${c.id}`,
      lastModified: c.published_date,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
