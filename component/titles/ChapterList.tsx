import ChapterRow from "./ChapterRow";
import type { ChapterItem } from "./types";

interface ChapterListProps {
  chapters: ChapterItem[];
  favoritedChapterIds: string[];
}

export default function ChapterList({ chapters, favoritedChapterIds }: ChapterListProps) {
  const favoritedSet = new Set(favoritedChapterIds);

  return (
    <div className="flex flex-col gap-3 sm:gap-4">
      {chapters.map((chapter) => (
        <ChapterRow key={chapter.id} chapter={chapter} isFavorited={favoritedSet.has(chapter.id)} />
      ))}
    </div>
  );
}
