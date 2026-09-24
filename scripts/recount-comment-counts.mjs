// One-off repair: recompute every chapter's stored comment_count as the
// number of VISIBLE (not admin-hidden) comments it has.
//
// comment_count drifted before the comment routes kept it in step: deleting
// a comment never lowered it, and hidden comments were still counted. The
// routes now maintain it (hide/unhide/delete), and nothing on the site
// displays the column any more (the reader, manga page and public API all
// count live) — this just makes the stored value correct again.
//
// Dry run by default (prints what would change); pass --apply to write.
//   node --env-file=.env scripts/recount-comment-counts.mjs
//   node --env-file=.env scripts/recount-comment-counts.mjs --apply

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/index.js";

const apply = process.argv.includes("--apply");
const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });

try {
  const [chapters, visibleCounts] = await Promise.all([
    prisma.chapter.findMany({
      select: { id: true, chapter_name: true, comment_count: true, manga: { select: { manga_title: true } } },
    }),
    prisma.comment.groupBy({ by: ["chapter_id"], where: { hidden_at: null }, _count: { _all: true } }),
  ]);

  const actual = new Map(visibleCounts.map((row) => [row.chapter_id, row._count._all]));
  const changes = chapters
    .map((c) => ({ ...c, correct: actual.get(c.id) ?? 0 }))
    .filter((c) => c.comment_count !== c.correct);

  console.log(`${chapters.length} chapters checked, ${changes.length} wrong.`);
  for (const c of changes) {
    console.log(`  ${c.manga.manga_title} / ${c.chapter_name} (${c.id}): ${c.comment_count} -> ${c.correct}`);
  }

  if (changes.length === 0) {
    console.log("Nothing to fix.");
  } else if (!apply) {
    console.log("Dry run — nothing written. Re-run with --apply to fix these.");
  } else {
    await prisma.$transaction(
      changes.map((c) => prisma.chapter.update({ where: { id: c.id }, data: { comment_count: c.correct } }))
    );
    console.log(`Fixed ${changes.length} chapter(s).`);
  }
} finally {
  await prisma.$disconnect();
}
