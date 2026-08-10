import { Anton, Work_Sans, Space_Mono } from "next/font/google";
import { defaultData } from "../component/detail";

const anton = Anton({ subsets: ["latin"], weight: "400", variable: "--font-display" });
const workSans = Work_Sans({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-body" });
const spaceMono = Space_Mono({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-mono" });

export default function MangaDetailPage(props: Partial<typeof defaultData> = {}) {
  const data = { ...defaultData, ...props };

  return (
    <div
      className={`${anton.variable} ${workSans.variable} ${spaceMono.variable} min-h-screen bg-[#0a0a0a] px-5 py-10 flex justify-center font-(family-name:--font-body)`}
    >
      <div className="w-full max-w-295 text-[#ece6d8]">
        {/* Hero */}
        <div
          className="w-full h-80 bg-[#ece6d8] bg-cover bg-center rounded-2xl border-2 border-[#050505] mb-8"
          style={{ backgroundImage: "url('/wide.png')" }}
        />

        {/* Body grid */}
        <div className="grid grid-cols-[1fr_300px] gap-12.5">
          <div>
            <h2 className="text-xl uppercase tracking-wide mb-4 flex justify-between items-center font-(family-name:--font-display)">
              Chapters
              <span className="text-xs normal-case text-[#b6b0a2] font-mono">
                {data.chapters.length} chapters
              </span>
            </h2>

            <div className="flex flex-col gap-3">
              {data.chapters.map((chapter) => (
                <div
                  key={chapter.number}
                  className="group flex items-center gap-6 cursor-pointer bg-[#1b1a1c] hover:bg-[#232224] border-2 border-[#050505] hover:border-[#f6f1f2] rounded-md p-3 transition-colors duration-200"
                >
                  <div
                    className="w-32 h-20 shrink-0 bg-[#ece6d8] bg-cover bg-center rounded-sm border border-black/40"
                    style={{ backgroundImage: "url('/placeholder.png')" }}
                  />

                  <div className="min-w-0">
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl text-[#ece6d8] group-hover:text-[#f2f0f0] transition-colors duration-200 font-(family-name:--font-display)">
                        {chapter.number}
                      </span>
                      <span className="text-[11px] text-[#b6b0a2] font-mono">
                        {chapter.date}
                      </span>
                    </div>
                    <div className="text-sm mt-1 text-[#ece6d8]/90 truncate">{chapter.title}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div>
              <span className="text-[11px] uppercase tracking-[2px] text-[#f7f1f2] font-mono">
                {data.titleJp}
              </span>
              <h1 className="text-5xl mt-1 font-(family-name:--font-display)">{data.title}</h1>
              <p className="text-[#b6b0a2] text-lg mt-2">{data.author}</p>
            </div>

            <div className="w-full h-px bg-white/20 my-8" />

            <p className="text-base leading-relaxed max-w-md mb-5 text-[#ece6d8]/90">{data.synopsis}</p>
          </div>
        </div>
      </div>
    </div>
  );
}