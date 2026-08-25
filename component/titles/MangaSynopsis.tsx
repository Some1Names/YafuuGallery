interface MangaSynopsisProps {
  synopsis: string;
}

export default function MangaSynopsis({ synopsis }: MangaSynopsisProps) {
  return (
    <p className="text-base leading-relaxed max-w-2xl text-[#ece6d8]/90 mb-6 sm:mb-8">
      {synopsis}
    </p>
  );
}
