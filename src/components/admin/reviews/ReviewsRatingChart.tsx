"use client";

import { REVIEW_RATING_DIST } from "@/data/admin";
import { MdStar } from "react-icons/md";

const STAR_COLORS: Record<number, string> = {
  5: "#FFD93D",
  4: "#FF8C42",
  3: "#4ECDC4",
  2: "#7C5CFC",
  1: "#FF6B9D",
};

export default function ReviewsRatingChart() {
  const total = REVIEW_RATING_DIST.reduce((s, r) => s + r.count, 0);

  return (
    <div className="bg-white rounded-3xl p-6 flex flex-col gap-5 h-full">
      {/* Title */}
      <div>
        <h3 className="font-black text-[#1A1A2E] text-base">Phân bổ sao</h3>
        <p className="text-[#9CA3AF] text-xs mt-0.5">{total} đánh giá tổng cộng</p>
      </div>

      {/* Bars 5 → 1 */}
      <div className="flex flex-col gap-3 flex-1 justify-center">
        {REVIEW_RATING_DIST.map(({ stars, count, pct }) => (
          <div key={stars} className="flex items-center gap-3">
            {/* Star label */}
            <div className="shrink-0 flex items-center gap-1 w-12">
              <span className="font-black text-[#1A1A2E] text-sm">{stars}</span>
              <MdStar style={{ color: STAR_COLORS[stars], fontSize: 15 }} />
            </div>

            {/* Bar track */}
            <div className="flex-1 h-2.5 bg-[#F4F7FF] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${pct}%`,
                  backgroundColor: STAR_COLORS[stars],
                }}
              />
            </div>

            {/* Count + pct */}
            <div className="shrink-0 flex items-center gap-1.5 w-14 justify-end">
              <span className="text-[#1A1A2E] font-bold text-sm">{count}</span>
              <span className="text-[#9CA3AF] text-xs">({pct}%)</span>
            </div>
          </div>
        ))}
      </div>

      {/* Legend chips */}
      <div className="flex flex-wrap gap-2 pt-2 border-t border-[#F4F7FF]">
        {REVIEW_RATING_DIST.map(({ stars, pct }) => (
          <div
            key={stars}
            className="flex items-center gap-1 rounded-xl px-2.5 py-1"
            style={{ backgroundColor: `${STAR_COLORS[stars]}18` }}
          >
            <span className="font-black text-xs" style={{ color: STAR_COLORS[stars] }}>
              {stars}★
            </span>
            <span className="text-[#9CA3AF] text-xs">{pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
