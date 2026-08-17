/*
  Warnings:

  - You are about to drop the `Test` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "password_hash" TEXT;

-- DropTable
DROP TABLE "Test";

-- CreateTable
CREATE TABLE "ChapterBookmark" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "chapter_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChapterBookmark_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ChapterBookmark_chapter_id_idx" ON "ChapterBookmark"("chapter_id");

-- CreateIndex
CREATE UNIQUE INDEX "ChapterBookmark_user_id_chapter_id_key" ON "ChapterBookmark"("user_id", "chapter_id");

-- AddForeignKey
ALTER TABLE "ChapterBookmark" ADD CONSTRAINT "ChapterBookmark_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChapterBookmark" ADD CONSTRAINT "ChapterBookmark_chapter_id_fkey" FOREIGN KEY ("chapter_id") REFERENCES "Chapter"("id") ON DELETE CASCADE ON UPDATE CASCADE;
