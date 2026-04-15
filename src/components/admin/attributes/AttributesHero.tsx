import { MdCategory, MdStar } from "react-icons/md";
import { GiPawPrint } from "react-icons/gi";

interface AttributeStats {
  totalCategories: number;
  totalCharacters: number;
  activeCategories: number;
  activeCharacters: number;
}

interface AttributesHeroProps {
  stats: AttributeStats;
}

const CATEGORY_DISTRIBUTION = [
  {
    label: "Gấu hoàn chỉnh",
    value: 4,
    color: "#17409A",
  },
  { label: "Nhân vật", value: 6, color: "#7C5CFC" },
  { label: "Phụ kiện", value: 3, color: "#FF8C42" },
];

const MAX_VALUE = Math.max(...CATEGORY_DISTRIBUTION.map((c) => c.value));

export default function AttributesHero({ stats }: AttributesHeroProps) {
  return (
    <div className="relative bg-[#17409A] rounded-3xl overflow-hidden p-6 sm:p-8 h-full flex flex-col justify-between min-h-64">
      {/* Paw watermarks */}
      <GiPawPrint
        className="absolute -top-12 -right-10 text-white/4 pointer-events-none"
        style={{ fontSize: 300 }}
      />
      <GiPawPrint
        className="absolute bottom-6 left-52 text-white/5 pointer-events-none rotate-12"
        style={{ fontSize: 80 }}
      />

      <div className="relative">
        {/* Label */}
        <p className="text-white/50 text-[10px] font-black tracking-[0.28em] uppercase mb-2">
          Bộ sưu tập thuộc tính
        </p>

        {/* Giant number */}
        <div className="flex items-end gap-4 flex-wrap mb-6">
          <span
            className="text-white font-black leading-none"
            style={{
              fontSize: "clamp(3.5rem, 6.5vw, 6rem)",
              lineHeight: 1,
            }}
          >
            {stats.totalCategories + stats.totalCharacters}
          </span>
          <div className="flex flex-col mb-1.5">
            <span className="text-white/50 text-xs font-semibold leading-tight">
              thuộc tính
            </span>
            <span className="text-[#4ECDC4] font-black text-xs leading-tight">
              {stats.activeCategories + stats.activeCharacters} đang hoạt động
            </span>
          </div>
        </div>

        {/* Category bars */}
        <div className="flex flex-col gap-2.5 mb-6">
          {CATEGORY_DISTRIBUTION.map((dist) => {
            const pct = Math.round((dist.value / MAX_VALUE) * 100);
            const barColor = dist.color === "#17409A" ? "#FFFFFF" : dist.color;
            return (
              <div key={dist.label} className="flex items-center gap-3">
                <span className="text-white/50 text-[9px] font-black tracking-wider uppercase w-28 shrink-0 leading-tight">
                  {dist.label}
                </span>
                <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${pct}%`, backgroundColor: barColor }}
                  />
                </div>
                <span className="text-[10px] font-black shrink-0 text-white/80">
                  {dist.value}
                </span>
              </div>
            );
          })}
        </div>

        {/* CTAs */}
        <div className="flex gap-2 flex-wrap">
          <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-black transition-all">
            <MdCategory className="text-sm" />
            Danh mục
          </button>
          <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-black transition-all">
            <MdStar className="text-sm" />
            Nhân vật
          </button>
        </div>
      </div>
    </div>
  );
}
