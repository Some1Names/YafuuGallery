-- CreateEnum
CREATE TYPE "ReadingDirection" AS ENUM ('rtl', 'ltr');

-- AlterTable
ALTER TABLE "Manga" ADD COLUMN     "reading_direction" "ReadingDirection" NOT NULL DEFAULT 'rtl';
