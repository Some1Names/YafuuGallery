import { Anton, Work_Sans, Space_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

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
            className={`${anton.variable} ${workSans.variable} ${spaceMono.variable} relative min-h-screen bg-[#0a0a0a] px-5 py-20 flex justify-center font-(family-name:--font-body)`}
        >
            <MangaBackground imageUrl="/mangabg.png" />

            <div className="relative z-10 w-full max-w-295 text-[#ece6d8]">

                <Breadcrumb mangaTitle={manga.manga_title} />

                <MangaHero imageUrl={manga.cover_image_url} />

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12.5">
                    <div>
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

                    <MangaSidebar
                        title={manga.manga_title}
                        author={manga.author.name ?? "Unknown"}
                        synopsis={manga.manga_synopsis}
                    />
                </div>
            </div>
        </div>
    );
}