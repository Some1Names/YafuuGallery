-- AlterTable
ALTER TABLE "Chapter" ADD COLUMN     "cover_image_url" TEXT;

-- AlterTable
ALTER TABLE "Manga" ADD COLUMN     "banner_image_url" TEXT;

-- CreateTable
CREATE TABLE "Test" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Test_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Test_email_key" ON "Test"("email");
