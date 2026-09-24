-- CreateEnum
CREATE TYPE "MangaStatus" AS ENUM ('ongoing', 'completed');

-- AlterTable
ALTER TABLE "Bookmark" ADD COLUMN     "updates_seen_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Manga" ADD COLUMN     "genres" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "manga_status" "MangaStatus" NOT NULL DEFAULT 'ongoing',
ADD COLUMN     "view_count" INTEGER NOT NULL DEFAULT 0;

-- Backfill: a manga's view_count starts as the sum of its chapters' views.
UPDATE "Manga" m SET "view_count" = COALESCE((SELECT SUM(c."view_count") FROM "Chapter" c WHERE c."manga_id" = m."id"), 0);
