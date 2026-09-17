-- AlterTable
ALTER TABLE "User" ADD COLUMN "tag" TEXT;

-- Backfill existing users with a random 4-digit tag, same format new
-- signups get — collisions are harmless here since the constraint below
-- is on (name, tag) together, not tag alone, and no two existing users
-- share a name.
UPDATE "User" SET "tag" = LPAD((FLOOR(RANDOM() * 10000))::text, 4, '0') WHERE "name" IS NOT NULL AND "tag" IS NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_name_tag_key" ON "User"("name", "tag");
