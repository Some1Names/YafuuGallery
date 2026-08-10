export interface Chapter {
  number: string;
  date: string;
  title: string;
}

export interface MangaDetailProps {
  titleJp?: string;
  title: string;
  author: string;
  synopsis: string;
  chapters: Chapter[];
}