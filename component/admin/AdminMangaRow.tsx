"use client";

import { useState } from "react";
import { alertRequestFailed, confirmDialog } from "@/component/Dialog";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "@/component/ShimmerImage"; // next/image + loading shimmer
import { Eye, Heart, ChevronDown, Star, HardDrive } from "lucide-react";
import NoImagePlaceholder from "@/component/NoImagePlaceholder";
import AdminImageUploadButton from "./AdminImageUploadButton";
import AdminChapterCreateForm from "./AdminChapterCreateForm";
import AdminChapterList from "./AdminChapterList";
import AdminArcCreateForm from "./AdminArcCreateForm";
import AdminArcList from "./AdminArcList";
import { formatBytes } from "@/lib/format-bytes";
import MangaGenreFields from "@/component/manga/MangaGenreFields";
import { knownGenres, type GenreSlug, type MangaStatusValue } from "@/lib/genres";
import type { ChapterTranslationDraft } from "./AdminChapterPdfUploads";
import SynopsisField from "@/component/manga/SynopsisField";
import { MAX_MANGA_TITLE_LENGTH } from "@/lib/content-limits";
import { useTranslations } from "next-intl";

interface ChapterItem {
  id: string;
  arcId: string | null;
  arcName: string | null;
  chapterNumber: number;
  chapterIsEx: boolean;
  chapterName: string;
  publishedDate: Date;
  coverImageUrl: string | null;
  translations: ChapterTranslationDraft[];
  favoriteCount: number;
  commentCount: number;
  storageBytes?: number;
}

interface ArcOption {
  id: string;
  arc_name: string;
  arc_order: number;
  arc_is_ex: boolean;
  arc_status: "ongoing" | "completed";
  arc_image_url: string | null;
}

interface AdminMangaRowProps {
  id: string;
  title: string;
  synopsis: string;
  authorName: string;
  chapterCount: number;
  viewCount: number;
  favoriteCount: number;
  coverImageUrl: string | null;
  bannerImageUrl: string | null;
  genres: string[];
  status: MangaStatusValue;
  chapters: ChapterItem[];
  arcs: ArcOption[];
  isExpanded: boolean;
  onToggleExpand: () => void;
  isEditing: boolean;
  onToggleEdit: () => void;
  // Featured toggle is admin-only — this row is also reused by
  // ManageMangaDashboard for authors managing their own manga, who
  // shouldn't be able to grant themselves a home page carousel slot.
  // Both default to false/undefined so existing (author-facing) callers
  // don't need to change.
  isAdmin?: boolean;
  isFeatured?: boolean;
  // Undefined (not just 0) for ManageMangaDashboard's author-facing reuse
  // of this row — storage usage is an infra/billing concern, not
  // something every author's view needs, so it's left off entirely there
  // rather than showing a possibly-misleading "0 B".
  storageBytes?: number;
}

export default function AdminMangaRow({
  id,
  title,
  synopsis,
  authorName,
  viewCount,
  favoriteCount,
  coverImageUrl,
  bannerImageUrl,
  genres,
  status,
  chapters,
  arcs,
  isExpanded,
  onToggleExpand,
  isEditing,
  onToggleEdit,
  isAdmin = false,
  isFeatured = false,
  storageBytes,
}: AdminMangaRowProps) {
  const t = useTranslations("Admin");
  const tCommon = useTranslations("Common");
  const router = useRouter();
  const [editTitle, setEditTitle] = useState(title);
  const [editSynopsis, setEditSynopsis] = useState(synopsis);
  const [editCoverImageUrl, setEditCoverImageUrl] = useState(coverImageUrl);
  const [editBannerImageUrl, setEditBannerImageUrl] = useState(bannerImageUrl);
  const [editGenres, setEditGenres] = useState<GenreSlug[]>(() => knownGenres(genres));
  const [editStatus, setEditStatus] = useState<MangaStatusValue>(status);
  const [isSaving, setIsSaving] = useState(false);
  const [isTogglingFeatured, setIsTogglingFeatured] = useState(false);

  async function toggleFeatured() {
    setIsTogglingFeatured(true);
    const res = await fetch(`/api/admin/manga/${id}/featured`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_featured: !isFeatured }),
    }).catch(() => null);
    setIsTogglingFeatured(false);
    if (!res?.ok) return alertRequestFailed(isFeatured ? t("unfeatureFailed") : t("featureFailed"), res);
    router.refresh();
  }

  // The arc create form and an arc row's edit form are mutually
  // exclusive — opening one closes the other, so at most one arc-related
  // form is ever visible at a time.
  const [arcCreateOpen, setArcCreateOpen] = useState(false);
  const [editingArcId, setEditingArcId] = useState<string | null>(null);

  function handleArcCreateOpenChange(open: boolean) {
    setArcCreateOpen(open);
    if (open) setEditingArcId(null);
  }

  function handleToggleArcEdit(arcId: string) {
    setEditingArcId((current) => (current === arcId ? null : arcId));
    setArcCreateOpen(false);
  }

  // Same mutual-exclusion pattern for the Chapters section, independent
  // of the Arc section's own state above.
  const [chapterCreateOpen, setChapterCreateOpen] = useState(false);
  const [editingChapterId, setEditingChapterId] = useState<string | null>(null);

  // Arc and Chapters are tabs, not stacked sections — only one is on
  // screen at a time. The tab switcher itself is the expand control: it
  // sits where a plain expand chevron used to, so picking a tab both
  // opens the section and selects it; clicking the tab that's already
  // open and active collapses the row instead.
  const [activeSection, setActiveSection] = useState<"arc" | "chapters">("arc");

  function handleTabClick(section: "arc" | "chapters") {
    if (isExpanded && activeSection === section) {
      onToggleExpand();
      return;
    }
    if (!isExpanded) onToggleExpand();
    setActiveSection(section);
  }

  function handleChapterCreateOpenChange(open: boolean) {
    setChapterCreateOpen(open);
    if (open) setEditingChapterId(null);
  }

  function handleToggleChapterEdit(chapterId: string) {
    setEditingChapterId((current) => (current === chapterId ? null : chapterId));
    setChapterCreateOpen(false);
  }

  async function save() {
    setIsSaving(true);
    const res = await fetch(`/api/admin/manga/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        manga_title: editTitle,
        manga_synopsis: editSynopsis,
        cover_image_url: editCoverImageUrl,
        banner_image_url: editBannerImageUrl,
        genres: editGenres,
        manga_status: editStatus,
      }),
    });
    setIsSaving(false);
    if (res.ok) {
      onToggleEdit();
      router.refresh();
    }
  }

  async function remove() {
    const confirmed = await confirmDialog({
      title: t("deleteManga.title", { title }),
      message: t("deleteManga.message"),
      confirmLabel: t("deleteManga.confirm"),
      tone: "danger",
    });
    if (!confirmed) return;
    const res = await fetch(`/api/admin/manga/${id}`, { method: "DELETE" }).catch(() => null);
    if (!res?.ok) return alertRequestFailed(t("deleteManga.failed"), res);
    router.refresh();
  }

  if (isEditing) {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          save();
        }}
        className="border border-border rounded-md p-4 sm:p-8 md:p-12 bg-surface flex flex-col gap-4"
      >
        <h3 className="text-lg text-fg font-(family-name:--font-display)">{t("editMangaHeading")}</h3>

        {/* Same layout as the create form — one shared grid, 3fr:16fr
            columns, label/field rows col-span the full row on mobile */}
        <div className="grid grid-cols-2 sm:grid-cols-[3fr_16fr] gap-x-7 gap-y-4">
          <AdminImageUploadButton
            label={t("cover")}
            value={editCoverImageUrl}
            onChange={setEditCoverImageUrl}
            boxClassName="w-full aspect-2/3"
            aspectRatio={2 / 3}
          />
          <AdminImageUploadButton
            label={t("banner")}
            // phones: full width, above the cover (see MangaCreateForm)
            className="order-first col-span-2 sm:order-none sm:col-span-1"
            value={editBannerImageUrl}
            onChange={setEditBannerImageUrl}
            boxClassName="w-full aspect-32/9"
            aspectRatio={32 / 9}
          />

          <label className="col-span-2 sm:col-span-1 text-xs text-fg-secondary sm:pt-2">
            {t("mangaTitle")}
          </label>
          <input
            value={editTitle}
            maxLength={MAX_MANGA_TITLE_LENGTH}
            onChange={(e) => setEditTitle(e.target.value)}
            required
            className="col-span-2 sm:col-span-1 w-full bg-bg border border-border rounded px-3 py-2 text-sm text-fg"
          />

          <label className="col-span-2 sm:col-span-1 text-xs text-fg-secondary sm:pt-2">
            {t("synopsis")}
          </label>
          <SynopsisField value={editSynopsis} onChange={setEditSynopsis} />

          <MangaGenreFields
            genres={editGenres}
            onGenresChange={setEditGenres}
            status={editStatus}
            onStatusChange={setEditStatus}
          />
        </div>

        <div className="flex gap-2 self-end">
          <button
            type="button"
            onClick={onToggleEdit}
            className="px-4 py-2 border border-border rounded-md text-sm text-fg-secondary hover:text-fg hover:border-fg-secondary transition-colors duration-200"
          >
            {tCommon("cancel")}
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="px-4 py-2 bg-fg text-bg text-sm font-semibold rounded-md hover:bg-fg/85 disabled:opacity-50 transition-colors duration-200"
          >
            {isSaving ? t("saving") : tCommon("save")}
          </button>
        </div>
      </form>
    );
  }

  // Divider + the Arc/Chapters tab switcher — it IS the expand control
  // here (no separate generic chevron button): picking a tab opens the row
  // to that section, and each tab carries its own chevron (rotated when
  // it's the open, active one). Rendered in one of two places depending on
  // screen width (see its two uses below); `layout` carries the
  // show/hide and padding for each.
  function tabBar(layout: string) {
    return (
      <div className={`${layout} py-3 border-t border-border items-center gap-1`}>
        <button
          type="button"
          onClick={() => handleTabClick("arc")}
          aria-expanded={isExpanded && activeSection === "arc"}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded text-sm transition-colors duration-200 ${
            isExpanded && activeSection === "arc"
              ? "bg-surface-hover text-fg"
              : "text-fg-secondary hover:text-fg"
          }`}
        >
          {t("arcTab")}
          <span className="text-xs text-fg-muted">{arcs.length}</span>
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform duration-200 ${
              isExpanded && activeSection === "arc" ? "rotate-180" : ""
            }`}
          />
        </button>
        <button
          type="button"
          onClick={() => handleTabClick("chapters")}
          aria-expanded={isExpanded && activeSection === "chapters"}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded text-sm transition-colors duration-200 ${
            isExpanded && activeSection === "chapters"
              ? "bg-surface-hover text-fg"
              : "text-fg-secondary hover:text-fg"
          }`}
        >
          {t("chaptersTab")}
          <span className="text-xs text-fg-muted">{chapters.length}</span>
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform duration-200 ${
              isExpanded && activeSection === "chapters" ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>
    );
  }

  return (
    <div className="border border-border rounded-md bg-surface overflow-hidden">
      {/* Cover — fixed at the site's standard manga-poster ratio (2:3, same
          as MangaCard and the cover uploaders) instead of stretching to
          match the content column's height. A stretched box meant a short
          title and a 2-line title gave every row a different cover shape;
          self-start keeps it a consistent size regardless of how much text
          is in the row next to it. object-contain still shows the image at
          its own proportions (letterboxed on the container's bg) rather
          than cropping/zooming it like object-cover would. */}
      <div className="flex">
        <div className="relative w-24 sm:w-32 aspect-2/3 shrink-0 self-start bg-bg">
          {coverImageUrl ? (
            <Image src={coverImageUrl} alt="" fill sizes="128px" className="object-contain" />
          ) : (
            <NoImagePlaceholder />
          )}
        </div>

        <div className="min-w-0 flex-1 flex flex-col">
          {/* Header row — stacks the action buttons below the title on
              mobile instead of squeezing them onto the same line as the
              text column. Below sm, the cover (w-24) plus p-8 padding plus
              the Featured/Edit/Delete button group left the title's
              min-w-0 flex-1 column with negative available width, which
              collapsed it to nothing rather than actually shrinking it. */}
          <div className="p-4 sm:p-8 flex-1 flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
            <div className="min-w-0 flex-1">
              <Link href={`/manga/titles/${id}`} className="block text-lg text-fg hover:underline font-medium truncate">
                {title}
              </Link>
              <p className="text-sm text-fg-secondary mt-0.5 truncate">{authorName}</p>
              <div className="flex items-center gap-4 mt-2 text-xs text-fg-muted">
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" />
                  {viewCount.toLocaleString()}
                </span>
                <span className="flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5" />
                  {favoriteCount.toLocaleString()}
                </span>
                {typeof storageBytes === "number" && (
                  <span className="flex items-center gap-1">
                    <HardDrive className="w-3.5 h-3.5" />
                    {formatBytes(storageBytes)}
                  </span>
                )}
              </div>
            </div>

            <div className="flex gap-2 flex-wrap shrink-0">
              {isAdmin && (
                <button
                  onClick={toggleFeatured}
                  disabled={isTogglingFeatured}
                  title={isFeatured ? t("featureRemove") : t("featureAdd")}
                  className={`flex items-center gap-1.5 text-xs px-3 py-1.5 border rounded transition-colors duration-200 disabled:opacity-50 ${
                    isFeatured
                      ? "border-fg/50 text-fg bg-fg/10 hover:bg-fg/15"
                      : "border-border text-fg-secondary hover:text-fg hover:border-fg-secondary"
                  }`}
                >
                  <Star className={`w-3.5 h-3.5 ${isFeatured ? "fill-current" : ""}`} />
                  {t("featured")}
                </button>
              )}
              <button
                onClick={onToggleEdit}
                className="text-xs px-3 py-1.5 border border-border rounded text-fg-secondary hover:text-fg hover:border-fg-secondary transition-colors duration-200"
              >
                {tCommon("edit")}
              </button>
              <button
                onClick={remove}
                className="text-xs px-3 py-1.5 border border-danger-text/50 rounded text-danger-text hover:bg-danger/10 transition-colors duration-200"
              >
                {tCommon("delete")}
              </button>
            </div>
          </div>

          {/* sm and up: the Arc/Chapters switcher sits under the title,
              beside the cover (see tabBar below) */}
          {tabBar("hidden sm:flex px-8")}
        </div>
      </div>

      {/* Phones: the switcher runs the full width of the row, under the
          cover. Beside the cover it only had ~180px, and "Chapters" was
          cut off at the row's edge (to "Chapter…" at 320px). */}
      {tabBar("flex sm:hidden px-3")}

      {isExpanded && (
        <div className="border-t border-border p-4 sm:p-8 md:p-12 flex flex-col gap-4 bg-bg/40">
          {activeSection === "arc" && (
            <div className="flex flex-col gap-4">
              <AdminArcCreateForm
                mangaId={id}
                totalCount={arcs.length}
                isOpen={arcCreateOpen}
                onOpenChange={handleArcCreateOpenChange}
              />

              <AdminArcList
                mangaId={id}
                arcs={arcs}
                editingArcId={editingArcId}
                onToggleEdit={handleToggleArcEdit}
              />
            </div>
          )}

          {activeSection === "chapters" && (
            <div className="flex flex-col gap-4">
              <AdminChapterCreateForm
                mangaId={id}
                arcs={arcs}
                totalCount={chapters.length}
                isOpen={chapterCreateOpen}
                onOpenChange={handleChapterCreateOpenChange}
              />

              <AdminChapterList
                mangaId={id}
                chapters={chapters}
                arcs={arcs}
                editingChapterId={editingChapterId}
                onToggleEdit={handleToggleChapterEdit}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
