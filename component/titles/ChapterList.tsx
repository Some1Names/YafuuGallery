import ChapterRow from "./ChapterRow";
import type { ChapterItem } from "./types";

interface ChapterListProps {
  chapters: ChapterItem[];
  favoritedChapterIds: string[];
  showLanguages?: boolean;
  displayNumbers: Map<string, number>;
}

export default function ChapterList({ chapters, favoritedChapterIds, displayNumbers, showLanguages = false }: ChapterListProps) {
  const favoritedSet = new Set(favoritedChapterIds);

  return (
    <div className="flex flex-col gap-3 sm:gap-4">
      {chapters.map((chapter) => (
        <ChapterRow
          key={chapter.id}
          chapter={chapter}
          displayNumber={displayNumbers.get(chapter.id) ?? 0}
          isFavorited={favoritedSet.has(chapter.id)}
          showLanguages={showLanguages}
        />
      ))}
    </div>
  );
}
