-- CreateEnum
CREATE TYPE "Role" AS ENUM ('reader', 'author', 'admin');

-- CreateEnum
CREATE TYPE "Language" AS ENUM ('th', 'en', 'ja');

-- CreateEnum
CREATE TYPE "ArcStatus" AS ENUM ('ongoing', 'completed');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "display_name" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'reader',
    "avatar_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Manga" (
    "id" TEXT NOT NULL,
    "author_id" TEXT NOT NULL,
    "manga_title" TEXT NOT NULL,
    "manga_synopsis" TEXT NOT NULL,
    "cover_image_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Manga_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Arc" (
    "id" TEXT NOT NULL,
    "manga_id" TEXT NOT NULL,
    "arc_name" TEXT NOT NULL,
    "arc_order" INTEGER NOT NULL,
    "arc_status" "ArcStatus" NOT NULL DEFAULT 'ongoing',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Arc_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chapter" (
    "id" TEXT NOT NULL,
    "manga_id" TEXT NOT NULL,
    "arc_id" TEXT,
    "chapter_number" DOUBLE PRECISION NOT NULL,
    "chapter_name" TEXT NOT NULL,
    "published_date" TIMESTAMP(3) NOT NULL,
    "view_count" INTEGER NOT NULL DEFAULT 0,
    "comment_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Chapter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Translation" (
    "id" TEXT NOT NULL,
    "chapter_id" TEXT NOT NULL,
    "language" "Language" NOT NULL,
    "file_url" TEXT NOT NULL,
    "translator_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Translation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "chapter_id" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "hidden_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bookmark" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "manga_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Bookmark_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReadingProgress" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "chapter_id" TEXT NOT NULL,
    "last_page_read" INTEGER NOT NULL DEFAULT 0,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReadingProgress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Manga_author_id_idx" ON "Manga"("author_id");

-- CreateIndex
CREATE INDEX "Arc_manga_id_idx" ON "Arc"("manga_id");

-- CreateIndex
CREATE UNIQUE INDEX "Arc_manga_id_arc_order_key" ON "Arc"("manga_id", "arc_order");

-- CreateIndex
CREATE INDEX "Chapter_manga_id_idx" ON "Chapter"("manga_id");

-- CreateIndex
CREATE INDEX "Chapter_arc_id_idx" ON "Chapter"("arc_id");

-- CreateIndex
CREATE UNIQUE INDEX "Chapter_manga_id_chapter_number_key" ON "Chapter"("manga_id", "chapter_number");

-- CreateIndex
CREATE INDEX "Translation_chapter_id_idx" ON "Translation"("chapter_id");

-- CreateIndex
CREATE UNIQUE INDEX "Translation_chapter_id_language_key" ON "Translation"("chapter_id", "language");

-- CreateIndex
CREATE INDEX "Comment_chapter_id_idx" ON "Comment"("chapter_id");

-- CreateIndex
CREATE INDEX "Comment_user_id_idx" ON "Comment"("user_id");

-- CreateIndex
CREATE INDEX "Bookmark_manga_id_idx" ON "Bookmark"("manga_id");

-- CreateIndex
CREATE UNIQUE INDEX "Bookmark_user_id_manga_id_key" ON "Bookmark"("user_id", "manga_id");

-- CreateIndex
CREATE INDEX "ReadingProgress_chapter_id_idx" ON "ReadingProgress"("chapter_id");

-- CreateIndex
CREATE UNIQUE INDEX "ReadingProgress_user_id_chapter_id_key" ON "ReadingProgress"("user_id", "chapter_id");

-- AddForeignKey
ALTER TABLE "Manga" ADD CONSTRAINT "Manga_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Arc" ADD CONSTRAINT "Arc_manga_id_fkey" FOREIGN KEY ("manga_id") REFERENCES "Manga"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chapter" ADD CONSTRAINT "Chapter_manga_id_fkey" FOREIGN KEY ("manga_id") REFERENCES "Manga"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chapter" ADD CONSTRAINT "Chapter_arc_id_fkey" FOREIGN KEY ("arc_id") REFERENCES "Arc"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Translation" ADD CONSTRAINT "Translation_chapter_id_fkey" FOREIGN KEY ("chapter_id") REFERENCES "Chapter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Translation" ADD CONSTRAINT "Translation_translator_id_fkey" FOREIGN KEY ("translator_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_chapter_id_fkey" FOREIGN KEY ("chapter_id") REFERENCES "Chapter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bookmark" ADD CONSTRAINT "Bookmark_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bookmark" ADD CONSTRAINT "Bookmark_manga_id_fkey" FOREIGN KEY ("manga_id") REFERENCES "Manga"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReadingProgress" ADD CONSTRAINT "ReadingProgress_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReadingProgress" ADD CONSTRAINT "ReadingProgress_chapter_id_fkey" FOREIGN KEY ("chapter_id") REFERENCES "Chapter"("id") ON DELETE CASCADE ON UPDATE CASCADE;
