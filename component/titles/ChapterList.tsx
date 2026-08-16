import ChapterRow from "./ChapterRow";
import type { ChapterItem } from "./types";

export default function ChapterList({ chapters }: { chapters: ChapterItem[] }) {
  return (
    <div className="flex flex-col gap-4">
      {chapters.map((chapter) => (
        <ChapterRow key={chapter.id} chapter={chapter} />
      ))}
    </div>
  );
}
