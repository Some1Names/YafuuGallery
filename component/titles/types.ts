export interface ChapterItem {
  id: string;
  chapter_number: number;
  chapter_is_ex: boolean;
  chapter_name: string;
  cover_image_url: string | null;
  published_date: Date;
}

export interface ArcItem {
  id: string;
  arc_name: string;
  arc_status: string;
  arc_image_url: string | null;
  chapters: ChapterItem[];
}
