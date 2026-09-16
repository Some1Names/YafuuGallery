-- AlterTable
ALTER TABLE "Manga" ADD COLUMN     "featured_order" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "is_featured" BOOLEAN NOT NULL DEFAULT false;
