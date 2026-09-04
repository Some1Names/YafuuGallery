export interface ChapterItem {
  id: string;
  chapter_number: number;
  chapter_name: string;
  published_date: Date;
}

export interface ArcItem {
  id: string;
  arc_name: string;
  arc_status: string;
  chapters: ChapterItem[];
}
