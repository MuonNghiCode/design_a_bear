import { GiBearFace } from "react-icons/gi";
import { TOP_PRODUCTS } from "@/data/admin";

const MAX_SALES = TOP_PRODUCTS[0].sales;

export default function TopProductsList() {
  return (
    <div className="bg-white rounded-3xl p-6 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <p className="text-[#9CA3AF] text-[10px] font-black tracking-[0.22em] uppercase">
            TOP sản phẩm
          </p>
          <p className="text-[#1A1A2E] font-black text-xl mt-0.5">
            Bán chạy nhất
          </p>
        </div>
        <button className="text-[#17409A] text-xs font-black hover:underline underline-offset-2">
          Xem tất cả
        </button>
      </div>

      {/* Product list */}
      <div className="flex flex-col gap-4 flex-1">
        {TOP_PRODUCTS.map((p, i) => (
          <div
            key={p.name}
            className="flex items-center gap-3 group cursor-pointer"
          >
            {/* Rank + bear icon */}
            <div
              className="relative w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105"
              style={{ backgroundColor: p.color + "18" }}
            >
              <GiBearFace className="text-xl" style={{ color: p.color }} />
              {/* Rank badge */}
              <span
                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full text-white text-[9px] font-black flex items-center justify-center ring-2 ring-white"
                style={{ backgroundColor: p.color }}
              >
                {i + 1}
              </span>
            </div>

            {/* Info + bar */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-[#1A1A2E] font-bold text-sm truncate pr-2">
                  {p.name}
                </p>
                <span className="text-[#1A1A2E] font-black text-sm shrink-0">
                  {p.sales}
                  <span className="text-[#9CA3AF] font-semibold text-[10px] ml-0.5">
                    đơn
                  </span>
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Progress bar */}
                <div className="flex-1 h-1.5 bg-[#F4F7FF] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${(p.sales / MAX_SALES) * 100}%`,
                      backgroundColor: p.color,
                      transition: "width 0.6s ease",
                    }}
                  />
                </div>
                {/* Badge */}
                <span
                  className="text-[9px] font-black px-2 py-0.5 rounded-full shrink-0"
                  style={{ backgroundColor: p.color + "18", color: p.color }}
                >
                  {p.badge}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom paw decoration */}
      <div className="flex justify-end mt-4 opacity-5">
        <GiBearFace className="text-5xl text-[#17409A]" />
      </div>
    </div>
  );
}
