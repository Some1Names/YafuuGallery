-- CreateTable
CREATE TABLE "CommentReport" (
    "id" TEXT NOT NULL,
    "comment_id" TEXT NOT NULL,
    "reporter_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CommentReport_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CommentReport_comment_id_idx" ON "CommentReport"("comment_id");

-- CreateIndex
CREATE UNIQUE INDEX "CommentReport_comment_id_reporter_id_key" ON "CommentReport"("comment_id", "reporter_id");

-- CreateIndex
CREATE INDEX "Comment_user_id_created_at_idx" ON "Comment"("user_id", "created_at");

-- AddForeignKey
ALTER TABLE "CommentReport" ADD CONSTRAINT "CommentReport_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentReport" ADD CONSTRAINT "CommentReport_reporter_id_fkey" FOREIGN KEY ("reporter_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
