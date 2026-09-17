import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

import MangaBackground from "@/component/titles/MangaBackground";
import MangaHero from "@/component/titles/MangaHero";
import ChapterArcSection from "@/component/titles/ChapterArcSection";
import MangaSidebar from "@/component/titles/MangaSidebar";
import Breadcrumb from "@/component/titles/Breadcrumb";
import type { ChapterItem } from "@/component/titles/types";

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

    const [manga, bookmark, favoritedChapters] = await Promise.all([
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
                author: { select: { name: true } },
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
                                _count: { select: { chapter_bookmarks: true, comments: true } },
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
                        _count: { select: { chapter_bookmarks: true, comments: true } },
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
    ]);

    if (!manga) {
        notFound();
    }

    const favoritedChapterIds = favoritedChapters.map((f) => f.chapter_id);

    // total_chapters/total_view-style: favorite/comment counts aren't
    // stored on Chapter, so map Prisma's _count into the flat shape
    // ChapterItem expects (same convention as the admin dashboard).
    function toChapterItem(c: {
        id: string;
        chapter_number: number;
        chapter_is_ex: boolean;
        chapter_name: string;
        cover_image_url: string | null;
        published_date: Date;
        _count: { chapter_bookmarks: number; comments: number };
    }): ChapterItem {
        const { _count, ...rest } = c;
        return { ...rest, favoriteCount: _count.chapter_bookmarks, commentCount: _count.comments };
    }

    const arcs = manga.arcs.map((arc) => ({ ...arc, chapters: arc.chapters.map(toChapterItem) }));
    const looseChapters = manga.chapters.map(toChapterItem);

    return (
        <div
            className="relative min-h-screen bg-[#0a0a0a] px-0 sm:px-5 py-0 sm:py-12 md:py-20 flex justify-center"
        >
            <div className="hidden sm:block">
                <MangaBackground imageUrl="/mangabg.png" />
            </div>

            <div className="relative z-10 w-full max-w-350 text-[#ece6d8]">

                <div className="px-6 sm:px-0">
                    <Breadcrumb mangaTitle={manga.manga_title} />
                </div>

                <MangaHero imageUrl={manga.banner_image_url} />

                {/* Mobile: title/synopsis/favorite stack above the
                    Chapters/Arcs tabs, same order as always. From sm up,
                    they move into a right-hand column that starts level
                    with the tabs row, with the tabs + list taking the left. */}
                <div className="sm:flex sm:gap-8 sm:items-start">
                    <div className="px-6 sm:px-0 mb-8 sm:mb-0 sm:order-2 sm:w-80 md:w-96 sm:shrink-0">
                        <MangaSidebar
                            mangaId={manga.id}
                            title={manga.manga_title}
                            author={manga.author.name ?? "Unknown"}
                            synopsis={manga.manga_synopsis}
                            isFavorited={bookmark !== null}
                        />
                    </div>

                    <div className="px-6 sm:px-0 pb-8 sm:pb-0 sm:order-1 sm:flex-1 min-w-0">
                        <ChapterArcSection
                            arcs={arcs}
                            looseChapters={looseChapters}
                            favoritedChapterIds={favoritedChapterIds}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}