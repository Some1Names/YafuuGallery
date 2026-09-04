import { Anton, Work_Sans, Space_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

import MangaBackground from "@/component/titles/MangaBackground";
import MangaHero from "@/component/titles/MangaHero";
import ChapterArcSection from "@/component/titles/ChapterArcSection";
import MangaSidebar from "@/component/titles/MangaSidebar";
import Breadcrumb from "@/component/titles/Breadcrumb";

const anton = Anton({ subsets: ["latin"], weight: "400", variable: "--font-display" });
const workSans = Work_Sans({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-body" });
const spaceMono = Space_Mono({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-mono" });

export default async function MangaDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const session = await auth();

    const manga = await prisma.manga.findUnique({
        where: { id },
        include: {
            author: { select: { name: true } },
            arcs: {
                orderBy: { arc_order: "asc" },
                include: {
                    chapters: { orderBy: { chapter_number: "asc" } },
                },
            },
            chapters: {
                where: { arc_id: null },
                orderBy: { chapter_number: "asc" },
            },
        },
    });

    if (!manga) {
        notFound();
    }

    const [bookmark, favoritedChapters] = await Promise.all([
        session?.user?.id
            ? prisma.bookmark.findUnique({
                where: {
                    user_id_manga_id: { user_id: session.user.id, manga_id: manga.id },
                },
            })
            : null,
        session?.user?.id
            ? prisma.chapterBookmark.findMany({
                where: { user_id: session.user.id, chapter: { manga_id: manga.id } },
                select: { chapter_id: true },
            })
            : [],
    ]);

    const favoritedChapterIds = favoritedChapters.map((f) => f.chapter_id);

    return (
        <div
            className={`${anton.variable} ${workSans.variable} ${spaceMono.variable} relative min-h-screen bg-[#0a0a0a] px-0 sm:px-5 py-0 sm:py-12 md:py-20 flex justify-center font-(family-name:--font-body)`}
        >
            <div className="hidden sm:block">
                <MangaBackground imageUrl="/mangabg.png" />
            </div>

            <div className="relative z-10 w-full max-w-350 text-[#ece6d8]">

                <div className="px-6 sm:px-0">
                    <Breadcrumb mangaTitle={manga.manga_title} />
                </div>

                <MangaHero imageUrl={manga.cover_image_url} />

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
                            arcs={manga.arcs}
                            looseChapters={manga.chapters}
                            favoritedChapterIds={favoritedChapterIds}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}