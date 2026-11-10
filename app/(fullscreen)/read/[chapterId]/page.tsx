import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import MdReader from "@/component/mangadex/MdReader";
import type { ChapterLink } from "@/component/titles/ChapterEndNav";
import { toMdLanguage } from "@/lib/mangadex/browse-params";
import { adjacentChapters, chapterLabel, isReadable } from "@/lib/mangadex/map";
import { getChapter, getChapterFeed, getChapterPages, getManga } from "@/lib/mangadex/queries";
import { MangaDexError, type MdChapter } from "@/lib/mangadex/types";

// /read/[chapterId] — reads one MangaDex chapter. `chapterId` is
// MangaDex's own chapter id. Nothing is stored: the chapter, its title,
// the chapter list and the page image addresses are all fetched as the
// page renders.

type Props = { params: Promise<{ chapterId: string }> };

// A chapter that doesn't exist (or that the zone refuses to show) is a
// 404; MangaDex being down goes to this route's error.tsx.
async function loadChapter(chapterId: string) {
  try {
    return await getChapter(chapterId);
  } catch (err) {
    if (err instanceof MangaDexError && err.kind === "not_found") notFound();
    throw err;
  }
}

async function labelWords() {
  const t = await getTranslations("Browse");
  return { chapter: (n: string) => t("chapterNumber", { n }), oneshot: t("oneshot") };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const robots = { index: false, follow: false };
  try {
    const { chapterId } = await params;
    const { chapter, mangaId } = await getChapter(chapterId);
    const manga = await getManga(mangaId, toMdLanguage(await getLocale()));
    return { title: `${chapterLabel(chapter, await labelWords())} · ${manga.title}`, robots };
  } catch {
    // the page itself reports the problem; metadata must not crash first
    return { robots };
  }
}

export default async function ReadPage({ params }: Props) {
  const { chapterId } = await params;
  const { chapter, mangaId } = await loadChapter(chapterId);

  // A chapter that lives on an official site has no pages to show here —
  // its title page links out to it instead.
  if (!isReadable(chapter)) redirect(`/browse/${mangaId}`);

  const locale = toMdLanguage(await getLocale());
  const [manga, feed, pageUrls, words] = await Promise.all([
    getManga(mangaId, locale),
    getChapterFeed(mangaId, chapter.language),
    getChapterPages(chapterId),
    labelWords(),
  ]);

  const readable = feed.filter(isReadable);

  // When several groups uploaded the same chapter number, the menu names
  // the group so the entries can be told apart.
  const uploadsPerNumber = new Map<string, number>();
  for (const c of readable) {
    if (c.number !== null) uploadsPerNumber.set(c.number, (uploadsPerNumber.get(c.number) ?? 0) + 1);
  }
  const menuLabel = (c: MdChapter) => {
    const label = chapterLabel(c, words);
    const shared = c.number !== null && (uploadsPerNumber.get(c.number) ?? 0) > 1;
    return shared && c.groups.length > 0 ? `${label} (${c.groups.join(", ")})` : label;
  };

  const toLink = (c: MdChapter | null): ChapterLink | undefined =>
    c
      ? {
          href: `/read/${c.id}`,
          badge: c.number !== null ? words.chapter(c.number) : (c.title ?? words.oneshot),
          name: c.number !== null ? (c.title ?? "") : "",
        }
      : undefined;
  const { prev, next } = adjacentChapters(feed, chapterId);

  return (
    <MdReader
      // a fresh reader per chapter: page, failed images and URLs all reset
      key={chapterId}
      chapterId={chapterId}
      mangaId={mangaId}
      mangaTitle={manga.title}
      chapterLabel={chapterLabel(chapter, words)}
      groups={chapter.groups}
      mangadexUrl={manga.mangadexUrl}
      pageUrls={pageUrls}
      longStrip={manga.longStrip}
      direction={manga.direction}
      prev={toLink(prev)}
      next={toLink(next)}
      chapters={[...readable].reverse().map((c) => ({ id: c.id, label: menuLabel(c) }))}
    />
  );
}
