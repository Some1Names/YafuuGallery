interface MangaSidebarProps {
  title: string;
  author: string;
  synopsis: string;
}

export default function MangaSidebar({ title, author, synopsis }: MangaSidebarProps) {
  return (
    <div>
      <h1 className="text-5xl mt-1 font-(family-name:--font-display)">{title}</h1>
      <p className="text-[#b6b0a2] text-lg mt-2">{author}</p>

      <div className="w-full h-px bg-white/20 my-8" />

      <p className="text-base leading-relaxed max-w-md mb-5 text-[#ece6d8]/90">{synopsis}</p>

      <button className="bg-white px-4 py-2 text-sm text-black font-mono cursor-pointer hover:bg-white/70 transition-all duration-200">
        + Add to Favorites
      </button>
    </div>
  );
}
