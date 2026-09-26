import type { Metadata } from "next";
import { sortLanguages, type Language } from "@/lib/language";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

import MangaBackground from "@/component/titles/MangaBackground";
import MangaHero from "@/component/titles/MangaHero";
import ChapterArcSection from "@/component/titles/ChapterArcSection";
import MangaSidebar from "@/component/titles/MangaSidebar";
import type { ChapterItem } from "@/component/titles/types";
import { formatChapterBadge, getChapterDisplayNumbers } from "@/lib/chapter-number";

// Meta descriptions get cut off by search engines/link previews well before
// a full synopsis ends — trim to a plain, unbroken sentence length instead.
function truncate(text: string, max: number): string {
    if (text.length <= max) return text;
    return text.slice(0, max - 1).trimEnd() + "…";
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ id: string }>;
}): Promise<Metadata> {
    const { id } = await params;
    const manga = await prisma.manga.findUnique({
        where: { id },
        select: { manga_title: true, manga_synopsis: true, banner_image_url: true },
    });

    if (!manga) return {};

    const description = truncate(manga.manga_synopsis, 160);

    return {
        title: manga.manga_title,
        description,
        openGraph: {
            title: manga.manga_title,
            description,
            siteName: "YafuuGallery",
            type: "website",
            ...(manga.banner_image_url && { images: [manga.banner_image_url] }),
        },
        twitter: {
            card: "summary_large_image",
            title: manga.manga_title,
            description,
            ...(manga.banner_image_url && { images: [manga.banner_image_url] }),
        },
    };
}

export default async function MangaDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    // auth() has to resolve first — the bookmark/favorite queries below need
    // session.user.id to build their WHERE clause. But none of the three
    // queries below depend on each other (they use the route's `id` param
    // directly, not manga.id, which is the same value once manga resolves),
    // so those three run as one round trip instead of two sequential ones.
    const session = await auth();

    const [manga, bookmark, favoritedChapters, lastProgress] = await Promise.all([
        prisma.manga.findUnique({
            where: { id },
            // select instead of a bare include — the page only ever reads
            // the fields listed below (matching ChapterItem/ArcItem in
            // component/titles/types.ts), not the full row for every arc
            // and chapter on the manga.
            select: {
                id: true,
                manga_title: true,
                manga_synopsis: true,
                banner_image_url: true,
                // chapter rows without their own cover fall back to these
                cover_image_url: true,
                genres: true,
                manga_status: true,
                author: { select: { id: true, name: true } },
                arcs: {
                    orderBy: { arc_order: "asc" },
                    select: {
                        id: true,
                        arc_name: true,
                        arc_status: true,
                        arc_image_url: true,
                        chapters: {
                            orderBy: { chapter_number: "asc" },
                            select: {
                                id: true,
                                chapter_number: true,
                                chapter_is_ex: true,
                                chapter_name: true,
                                cover_image_url: true,
                                published_date: true,
                                translations: { select: { language: true } },
                                _count: { select: { chapter_bookmarks: true, comments: { where: { hidden_at: null } } } },
                            },
                        },
                    },
                },
                chapters: {
                    where: { arc_id: null },
                    orderBy: { chapter_number: "asc" },
                    select: {
                        id: true,
                        chapter_number: true,
                        chapter_is_ex: true,
                        chapter_name: true,
                        cover_image_url: true,
                        published_date: true,
                        translations: { select: { language: true } },
                        _count: { select: { chapter_bookmarks: true, comments: { where: { hidden_at: null } } } },
                    },
                },
            },
        }),
        session?.user?.id
            ? prisma.bookmark.findUnique({
                where: {
                    user_id_manga_id: { user_id: session.user.id, manga_id: id },
                },
            })
            : Promise.resolve(null),
        session?.user?.id
            ? prisma.chapterBookmark.findMany({
                where: { user_id: session.user.id, chapter: { manga_id: id } },
                select: { chapter_id: true },
            })
            : Promise.resolve([]),
        // Most recently read chapter of THIS manga, for the sidebar's
        // "Continue" button. The viewer itself resumes mid-chapter from the
        // saved last_page_read; `completed` lets Continue move on to the
        // next chapter once this one was read to the end.
        session?.user?.id
            ? prisma.readingProgress.findFirst({
                where: { user_id: session.user.id, chapter: { manga_id: id } },
                orderBy: { updated_at: "desc" },
                select: { chapter_id: true, completed: true },
            })
            : Promise.resolve(null),
    ]);

    if (!manga) {
        notFound();
    }

    const favoritedChapterIds = favoritedChapters.map((f) => f.chapter_id);

    // total_chapters/total_view-style: favorite/comment counts aren't
    // stored on Chapter, so map Prisma's _count into the flat shape
    // ChapterItem expects (same convention as the admin dashboard).
    // No chapter cover / arc image: rows use the manga's wide banner (their
    // picture box is landscape), else its cover — not an empty placeholder.
    const fallbackCoverUrl = manga.banner_image_url ?? manga.cover_image_url;

    function toChapterItem(c: {
        id: string;
        chapter_number: number;
        chapter_is_ex: boolean;
        chapter_name: string;
        cover_image_url: string | null;
        published_date: Date;
        translations: { language: Language }[];
        _count: { chapter_bookmarks: number; comments: number };
    }): ChapterItem {
        const { _count, translations, ...rest } = c;
        return {
            ...rest,
            languages: sortLanguages(translations.map((t) => t.language)),
            cover_image_url: rest.cover_image_url ?? fallbackCoverUrl,
            favoriteCount: _count.chapter_bookmarks,
            commentCount: _count.comments,
        };
    }

    const arcs = manga.arcs.map((arc) => ({
        ...arc,
        // same fallback as chapter rows — the arc rows share their layout
        arc_image_url: arc.arc_image_url ?? fallbackCoverUrl,
        chapters: arc.chapters.map(toChapterItem),
    }));
    const looseChapters = manga.chapters.map(toChapterItem);

    // Sidebar's primary action: resume the last chapter this reader opened
    // (or, if they finished it, the chapter after it), otherwise start from
    // the first chapter. Null when the manga has no chapters.
    const allChapters = [...arcs.flatMap((arc) => arc.chapters), ...looseChapters].sort(
        (a, b) => a.chapter_number - b.chapter_number
    );
    const firstChapter = allChapters[0] ?? null;
    const lastReadIdx = lastProgress ? allChapters.findIndex((c) => c.id === lastProgress.chapter_id) : -1;
    const resumeChapter =
        lastReadIdx === -1
            ? null
            : lastProgress?.completed
                // finished it — continue with the next one (or, if it was the
                // latest chapter, offer it again rather than nothing)
                ? (allChapters[lastReadIdx + 1] ?? allChapters[lastReadIdx])
                : allChapters[lastReadIdx];
    const displayNumbers = getChapterDisplayNumbers(allChapters);

    // Every language any chapter can be read in (shown in the sidebar), and
    // whether chapters differ in that — only then do the chapter rows get
    // their own language codes (the same "EN" on every row says nothing).
    const availableLanguages = sortLanguages(allChapters.flatMap((c) => c.languages));
    const chaptersDifferInLanguage = allChapters.some(
        (c) => c.languages.join() !== availableLanguages.join()
    );
    const readAction = resumeChapter
        ? {
            href: `/viewer/${resumeChapter.id}`,
            label: `Continue ${formatChapterBadge(resumeChapter.chapter_is_ex, displayNumbers.get(resumeChapter.id))}`,
        }
        : firstChapter
            ? { href: `/viewer/${firstChapter.id}`, label: "Start reading" }
            : null;

    return (
        <div
            className="relative min-h-screen bg-bg px-0 sm:px-5 py-0 sm:py-12 md:py-20 flex justify-center"
        >
            <div className="hidden sm:block">
                <MangaBackground imageUrl="/mangabg.png" />
            </div>

            <div className="relative z-10 w-full max-w-350 text-fg">

                <MangaHero imageUrl={manga.banner_image_url} />

                {/* Mobile: title/synopsis/favorite stack above the
                    Chapters/Arcs tabs, same order as always. From sm up,
                    they move into a right-hand column that starts level
                    with the tabs row, with the tabs + list taking the left.
                    That column sticks below the navbar (h-16/md:h-18) so
                    the read button stays in reach down a long chapter list. */}
                <div className="sm:flex sm:gap-8 sm:items-start">
                    <div className="px-6 sm:px-0 mb-8 sm:mb-0 sm:order-2 sm:w-80 md:w-96 sm:shrink-0 sm:sticky sm:top-24 md:top-26">
                        <MangaSidebar
                            mangaId={manga.id}
                            title={manga.manga_title}
                            author={manga.author.name ?? "Unknown"}
                            authorId={manga.author.id}
                            synopsis={manga.manga_synopsis}
                            status={manga.manga_status}
                            genres={manga.genres}
                            languages={availableLanguages}
                            isFavorited={bookmark !== null}
                            readAction={readAction}
                        />
                    </div>

                    <div className="px-6 sm:px-0 pb-8 sm:pb-0 sm:order-1 sm:flex-1 min-w-0">
                        <ChapterArcSection
                            arcs={arcs}
                            looseChapters={looseChapters}
                            showChapterLanguages={availableLanguages.length > 0 && chaptersDifferInLanguage}
                            favoritedChapterIds={favoritedChapterIds}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}