import { redirect } from "next/navigation";
import { parseSearchFilters, searchHref } from "@/lib/search-filters";

// /browse used to be MangaDex's own listing. MangaDex titles are now
// part of /search, in the same grid as the site's manga, so old links
// land there with their search text and language intact.
// (/browse/[id], a MangaDex title's page, is unchanged.)
export default async function BrowsePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { q, lang } = parseSearchFilters(await searchParams);
  redirect(searchHref({ q, lang }));
}
