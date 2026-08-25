import { Anton, Work_Sans, Space_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

import MangaBackground from "@/component/titles/MangaBackground";
import MangaHero from "@/component/titles/MangaHero";
import ChapterArcTabs from "@/component/titles/ChapterArcTabs";
import ChapterList from "@/component/titles/ChapterList";
import ArcList from "@/component/titles/ArcList";
import MangaSidebar from "@/component/titles/MangaSidebar";
import Breadcrumb from "@/component/titles/Breadcrumb";

const anton = Anton({ subsets: ["latin"], weight: "400", variable: "--font-display" });
const workSans = Work_Sans({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-body" });
const spaceMono = Space_Mono({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-mono" });

export default async function MangaDetailPage({
    params,
    searchParams,
}: {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ sort?: string; view?: string; arc?: string }>;
}) {
    const { id } = await params;
    const { sort, view, arc: arcFilterId } = await searchParams;

    const sortOrder: "asc" | "desc" = sort === "desc" ? "desc" : "asc";
    const activeView: "chapters" | "arcs" = view === "arcs" ? "arcs" : "chapters";

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

    const bookmark = session?.user?.id
        ? await prisma.bookmark.findUnique({
            where: {
                user_id_manga_id: { user_id: session.user.id, manga_id: manga.id },
            },
        })
        : null;

    let allChapters = [...manga.arcs.flatMap((arc) => arc.chapters), ...manga.chapters];

    const filteredArc = arcFilterId ? manga.arcs.find((a) => a.id === arcFilterId) : null;
    if (filteredArc) {
        allChapters = filteredArc.chapters;
    }

    allChapters = allChapters.sort((a, b) =>
        sortOrder === "asc" ? a.chapter_number - b.chapter_number : b.chapter_number - a.chapter_number
    );

    return (
        <div
            className={`${anton.variable} ${workSans.variable} ${spaceMono.variable} relative min-h-screen bg-[#0a0a0a] px-0 sm:px-5 py-0 sm:py-12 md:py-20 flex justify-center font-(family-name:--font-body)`}
        >
            <div className="hidden sm:block">
                <MangaBackground imageUrl="/mangabg.png" />
            </div>

            <div className="relative z-10 w-full max-w-350 text-[#ece6d8]">

                <div className="px-4 sm:px-0">
                    <Breadcrumb mangaTitle={manga.manga_title} />
                </div>

                <MangaHero imageUrl={manga.cover_image_url} />

                {/* Sidebar content — title, author, synopsis, favorite
                    button — now a full-width section right below the hero,
                    not a narrow side column anymore */}
                <div className="px-4 sm:px-0 mb-8 sm:mb-12">
                    <MangaSidebar
                        mangaId={manga.id}
                        title={manga.manga_title}
                        author={manga.author.name ?? "Unknown"}
                        synopsis={manga.manga_synopsis}
                        isFavorited={bookmark !== null}
                    />
                </div>

                {/* Chapters / Arcs — full width now that the sidebar no
                    longer shares a row with it */}
                <div className="px-4 sm:px-0 pb-8 sm:pb-0">
                    <ChapterArcTabs
                        activeView={activeView}
                        chapterCount={allChapters.length}
                        sortOrder={sortOrder}
                        filteredArc={filteredArc}
                    />

                    {activeView === "chapters" ? (
                        <ChapterList chapters={allChapters} />
                    ) : (
                        <ArcList arcs={manga.arcs} />
                    )}
                </div>
            </div>
        </div>
    );
}