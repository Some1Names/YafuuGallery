import type { Language } from "@/lib/language";

export interface ChapterItem {
  id: string;
  chapter_number: number;
  chapter_is_ex: boolean;
  chapter_name: string;
  cover_image_url: string | null;
  published_date: Date;
  favoriteCount: number;
  commentCount: number;
  // languages this chapter has a file in (reading order of LANGUAGE_OPTIONS)
  languages: Language[];
}

export interface ArcItem {
  id: string;
  arc_name: string;
  arc_status: string;
  arc_image_url: string | null;
  chapters: ChapterItem[];
}
