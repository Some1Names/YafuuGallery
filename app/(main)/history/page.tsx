import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import MangaBackground from "@/component/titles/MangaBackground";
import ShowMoreLink from "@/component/ShowMoreLink";
import HistoryRow from "@/component/history/HistoryRow";
import ClearHistoryButton from "@/component/history/ClearHistoryButton";
import { getReadingHistory } from "@/lib/reading-history";
import { loginHref } from "@/lib/login-redirect";
import { parsePageCount, splitExtraRow } from "@/lib/pagination";

export const metadata: Metadata = { title: "Reading history" };

const HISTORY_PAGE_SIZE = 20;

// Every chapter this reader has opened, newest first — the full list that
// the home page and profile's Continue Reading (a few cards, one per
// manga) only sample from. Entries can be removed one by one or all at once.
export default async function HistoryPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string | string[] }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect(loginHref("/history"));
  const userId = session.user.id;

  const pageCount = parsePageCount((await searchParams).page);
  const limit = pageCount * HISTORY_PAGE_SIZE;
  const [rows, total] = await Promise.all([
    getReadingHistory(userId, limit),
    prisma.readingProgress.count({ where: { user_id: userId } }),
  ]);
  const { items, hasMore } = splitExtraRow(rows, limit);

  return (
    <div className="relative min-h-screen bg-bg px-6 sm:px-8 py-12">
      <div className="hidden sm:block">
        <MangaBackground imageUrl="/mangabg.png" />
      </div>

      <div className="relative z-10 max-w-350 mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl text-fg sm:text-white font-(family-name:--font-display) mb-2">Reading history</h1>
          <p className="text-sm text-fg-secondary sm:text-white/70">Every chapter you&apos;ve opened, newest first.</p>
        </div>

        {items.length === 0 ? (
          <div className="border border-border rounded-md bg-surface/60 py-16 px-6 text-center">
            <p className="text-fg-secondary text-sm">
              Nothing here yet —{" "}
              <Link href="/search" className="text-fg underline underline-offset-2 hover:no-underline">
                find something to read
              </Link>
              .
            </p>
          </div>
        ) : (
          <div className="max-w-3xl">
            <div className="flex items-center justify-between gap-4 mb-4">
              <p className="text-sm text-fg-secondary">
                {total} {total === 1 ? "chapter" : "chapters"}
              </p>
              <ClearHistoryButton />
            </div>
            <div className="flex flex-col gap-2">
              {items.map((item) => (
                <HistoryRow key={item.chapterId} item={item} />
              ))}
            </div>
            {hasMore && <ShowMoreLink href={`/history?page=${pageCount + 1}`} />}
          </div>
        )}
      </div>
    </div>
  );
}
