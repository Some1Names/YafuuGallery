-- CreateIndex
CREATE INDEX "Manga_is_featured_featured_order_idx" ON "Manga"("is_featured", "featured_order");

-- CreateIndex
CREATE INDEX "Manga_updated_at_idx" ON "Manga"("updated_at");
