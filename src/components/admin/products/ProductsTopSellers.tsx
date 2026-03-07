import Image from "next/image";
import { MdStar, MdTrendingUp } from "react-icons/md";
import { PRODUCTS_ADMIN } from "@/data/admin";

// Top 5 by sold
const TOP5 = [...PRODUCTS_ADMIN]
  .filter((p) => p.sold > 0)
  .sort((a, b) => b.sold - a.sold)
  .slice(0, 5);

const MAX_SOLD = TOP5[0]?.sold ?? 1;

export default function ProductsTopSellers() {
  return (
    <div className="bg-white rounded-3xl p-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <p className="text-[#9CA3AF] text-[10px] font-black tracking-[0.22em] uppercase mb-0.5">
            Hiệu suất
          </p>
          <p className="text-[#1A1A2E] font-black text-lg">Bán chạy nhất</p>
        </div>
        <div className="flex items-center gap-1 bg-[#FFD93D]/15 rounded-full px-2.5 py-1">
          <MdTrendingUp className="text-[#FF8C42] text-sm" />
          <span className="text-[10px] font-black text-[#FF8C42]">Top 5</span>
        </div>
      </div>

      {/* Product rows */}
      <div className="flex flex-col gap-4 flex-1">
        {TOP5.map((p, i) => {
          const barPct = Math.round((p.sold / MAX_SOLD) * 100);
          return (
            <div key={p.id} className="group cursor-pointer">
              <div className="flex items-center gap-3 mb-1.5">
                {/* Rank thumbnail */}
                <div className="relative w-10 h-10 rounded-2xl overflow-hidden shrink-0 transition-transform duration-200 group-hover:scale-105 bg-[#F4F7FF]">
                  <Image
                    src={p.image}
                    alt={p.name}
                    width={40}
                    height={40}
                    className="object-contain w-full h-full"
                  />
                  <span
                    className="absolute -top-1 -right-1 w-4.5 h-4.5 text-white text-[8px] font-black rounded-full flex items-center justify-center ring-2 ring-white"
                    style={{
                      backgroundColor: i === 0 ? "#FFD93D" : p.badgeColor,
                    }}
                  >
                    {i + 1}
                  </span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-[#1A1A2E] font-bold text-sm leading-tight truncate pr-1">
                      {p.name}
                    </p>
                    <span className="text-[#1A1A2E] font-black text-sm shrink-0">
                      {p.sold}
                      <span className="text-[#9CA3AF] font-semibold text-[10px] ml-0.5">
                        đơn
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    {p.badge && (
                      <span
                        className="text-[8px] font-black px-1.5 py-0.5 rounded-full"
                        style={{
                          color: p.badgeColor,
                          backgroundColor: p.badgeColor + "18",
                        }}
                      >
                        {p.badge}
                      </span>
                    )}
                    {p.rating > 0 && (
                      <span className="flex items-center gap-0.5 text-[9px] font-black text-[#FFD93D]">
                        <MdStar className="text-xs" />
                        {p.rating}
                      </span>
                    )}
                    <span className="text-[#9CA3AF] text-[9px] font-semibold ml-auto">
                      {((p.price * p.sold) / 1_000_000).toFixed(1)}M VND
                    </span>
                  </div>
                </div>
              </div>

              {/* Sold bar */}
              <div className="ml-13 h-1 bg-[#F4F7FF] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${barPct}%`,
                    backgroundColor: i === 0 ? "#FFD93D" : p.badgeColor,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
