import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { cache } from "react";
import { prisma } from "@/lib/prisma";
import MangaCard from "@/component/MangaCard";
import MangaBackground from "@/component/titles/MangaBackground";
import { getChapterDisplayNumbers } from "@/lib/chapter-number";

// An author's public page: who they are and everything they've published.
// Only exists for accounts with at least one manga — a reader-only account
// 404s, so this can't be used to look up arbitrary users. Shows the public
// display name and avatar only (never email or role). cache(): the page
// and generateMetadata share one lookup per request.
const getAuthor = cache(async (id: string) => {
  const author = await prisma.user.findUnique({
    where: { id },
    select: {
      name: true,
      tag: true,
      image: true,
      manga: {
        orderBy: { updated_at: "desc" },
        select: {
          id: true,
          manga_title: true,
          cover_image_url: true,
          updated_at: true,
          view_count: true,
          chapters: { select: { id: true, chapter_number: true, chapter_is_ex: true, chapter_name: true } },
          _count: { select: { bookmarks: true } },
        },
      },
    },
  });
  return author && author.manga.length > 0 ? author : null;
});

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const author = await getAuthor(id);
  if (!author) return {};
  const name = author.name ?? "Unknown";
  const titles = author.manga.map((m) => m.manga_title);
  const description = `Manga by ${name} on YafuuGallery: ${titles.slice(0, 5).join(", ")}${titles.length > 5 ? "…" : ""}.`;
  return {
    title: name,
    description,
    openGraph: { title: name, description, siteName: "YafuuGallery", type: "profile" },
  };
}

export default async function AuthorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const author = await getAuthor(id);
  if (!author) notFound();

  const name = author.name ?? "Unknown";
  const stats = [
    { label: "Manga", value: author.manga.length },
    { label: "Chapters", value: author.manga.reduce((sum, m) => sum + m.chapters.length, 0) },
    { label: "Views", value: author.manga.reduce((sum, m) => sum + m.view_count, 0) },
    { label: "Favorites", value: author.manga.reduce((sum, m) => sum + m._count.bookmarks, 0) },
  ];

  return (
    <div className="relative min-h-screen bg-bg px-6 sm:px-8 py-12">
      <div className="hidden sm:block">
        <MangaBackground imageUrl="/mangabg.png" />
      </div>

      <div className="relative z-10 max-w-350 mx-auto">
        <div className="flex items-center gap-5 sm:gap-6 mb-8">
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 shrink-0 rounded-full overflow-hidden bg-surface border border-border flex items-center justify-center">
            {author.image ? (
              <Image src={author.image} alt="" fill sizes="96px" className="object-cover" />
            ) : (
              <span aria-hidden="true" className="text-3xl text-fg font-(family-name:--font-display)">
                {name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-widest text-fg-secondary sm:text-white/70">Author</p>
            <h1 className="text-3xl sm:text-4xl text-fg sm:text-white font-(family-name:--font-display) wrap-anywhere">
              {name}
              {/* the tag tells apart two authors with the same name */}
              {author.tag && (
                <span className="ml-2 align-middle text-base text-fg-muted sm:text-white/50 font-(family-name:--font-body)">
                  #{author.tag}
                </span>
              )}
            </h1>
          </div>
        </div>

        {/* same stat boxes as /manage */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10 max-w-3xl">
          {stats.map((s) => (
            <div key={s.label} className="border border-border rounded-md p-4 bg-surface/60">
              <div className="text-2xl text-fg font-(family-name:--font-display)">{s.value.toLocaleString()}</div>
              <div className="text-xs text-fg-secondary mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        <h2 className="text-xl text-fg mb-5 font-(family-name:--font-display)">
          Manga by {name}
          <span className="ml-2 align-middle text-xs text-fg-muted font-(family-name:--font-body) font-medium">
            {author.manga.length}
          </span>
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
          {author.manga.map((manga) => {
            const latest = manga.chapters.slice().sort((a, b) => b.chapter_number - a.chapter_number)[0];
            const displayNumbers = getChapterDisplayNumbers(manga.chapters);
            return (
              <MangaCard
                key={manga.id}
                id={manga.id}
                title={manga.manga_title}
                author={name}
                coverImageUrl={manga.cover_image_url}
                latestChapterDisplayNumber={latest ? (displayNumbers.get(latest.id) ?? null) : null}
                latestChapterIsEx={latest?.chapter_is_ex ?? false}
                latestChapterName={latest?.chapter_name ?? null}
                updatedAt={manga.updated_at}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
