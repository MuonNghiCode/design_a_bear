import {
  MdInbox,
  MdShoppingBag,
  MdLocalShipping,
  MdVerified,
  MdClose,
} from "react-icons/md";
import { ORDER_PIPELINE } from "@/data/admin";

const STAGE_ICONS = [
  MdInbox,
  MdShoppingBag,
  MdLocalShipping,
  MdVerified,
  MdClose,
];
const MAX_COUNT = 312; // "Hoàn thành" — normalization anchor

export default function OrdersPipeline() {
  const total = ORDER_PIPELINE.reduce((acc, s) => acc + s.count, 0);

  return (
    <div className="bg-white rounded-3xl p-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-[#9CA3AF] text-[10px] font-black tracking-[0.22em] uppercase mb-0.5">
            Tổng quan
          </p>
          <p className="text-[#1A1A2E] font-black text-lg">Luồng đơn hàng</p>
        </div>
        <span className="text-[10px] font-black text-[#17409A] bg-[#17409A]/8 px-3 py-1.5 rounded-full">
          {total} đơn
        </span>
      </div>

      {/* Pipeline stages */}
      <div className="flex items-stretch flex-1">
        {ORDER_PIPELINE.map((stage, i) => {
          const Icon = STAGE_ICONS[i];
          const pct = Math.round((stage.count / total) * 100);
          const barW = Math.max(6, Math.round((stage.count / MAX_COUNT) * 100));
          const isLast = i === ORDER_PIPELINE.length - 1;

          return (
            <div key={stage.label} className="flex items-center flex-1 min-w-0">
              {/* Stage column */}
              <div className="flex flex-col items-center flex-1 gap-2.5 min-w-0 px-0.5">
                {/* Icon circle */}
                <div
                  className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 transition-transform duration-200 hover:scale-105"
                  style={{ backgroundColor: stage.color + "18" }}
                >
                  <Icon style={{ color: stage.color, fontSize: 22 }} />
                </div>

                {/* Count */}
                <span
                  className="font-black text-[#1A1A2E] leading-none"
                  style={{ fontSize: stage.count >= 100 ? 26 : 30 }}
                >
                  {stage.count}
                </span>

                {/* Label */}
                <p className="text-[9px] font-black text-[#9CA3AF] tracking-[0.15em] uppercase text-center leading-tight px-0.5">
                  {stage.label}
                </p>

                {/* Percentage pill */}
                <span
                  className="text-[9px] font-black px-2 py-0.5 rounded-full"
                  style={{
                    color: stage.color,
                    backgroundColor: stage.color + "18",
                  }}
                >
                  {pct}%
                </span>

                {/* Volume bar */}
                <div className="w-full h-1 bg-[#F4F7FF] rounded-full overflow-hidden mt-0.5">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${barW}%`, backgroundColor: stage.color }}
                  />
                </div>
              </div>

              {/* Arrow connector */}
              {!isLast && (
                <div className="shrink-0 w-5 text-center text-[#D1D5DB] font-black text-base select-none">
                  ›
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer note */}
      <p className="text-[#9CA3AF] text-[10px] font-semibold mt-4 pt-4 border-t border-[#F4F7FF]">
        Cập nhật theo thời gian thực · Tháng 3 / 2026
      </p>
    </div>
  );
}
