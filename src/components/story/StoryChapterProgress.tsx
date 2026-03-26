"use client";

interface StoryChapterProgressProps {
  chapters: { id: string; label: string; short: string }[];
  activeId: string;
}

export default function StoryChapterProgress({
  chapters,
  activeId,
}: StoryChapterProgressProps) {
  return (
    <aside className="hidden xl:flex fixed right-6 top-1/2 -translate-y-1/2 z-40 flex-col gap-2.5">
      <div className="rounded-2xl border border-[#E5E7EB] bg-white/90 backdrop-blur-sm p-3 shadow-lg">
        <p className="text-[10px] uppercase tracking-[0.18em] font-bold text-[#9CA3AF] mb-2">
          Chương truyện
        </p>

        <div className="flex flex-col gap-1.5">
          {chapters.map((chapter) => {
            const active = chapter.id === activeId;
            return (
              <button
                key={chapter.id}
                onClick={() =>
                  document
                    .getElementById(chapter.id)
                    ?.scrollIntoView({ behavior: "smooth", block: "start" })
                }
                className={`min-h-11 px-3 py-2 rounded-xl text-left transition-all cursor-pointer ${
                  active
                    ? "bg-[#17409A] text-white"
                    : "bg-white text-[#6B7280] hover:bg-[#F4F7FF]"
                }`}
              >
                <p className="text-[10px] font-black uppercase tracking-wider">
                  {chapter.short}
                </p>
                <p className="text-xs font-semibold mt-0.5">{chapter.label}</p>
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
