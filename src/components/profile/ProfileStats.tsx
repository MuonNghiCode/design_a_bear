"use client";

import {
  IoBagOutline,
  IoHeartOutline,
  IoStarOutline,
  IoGiftOutline,
} from "react-icons/io5";
import { PROFILE_STATS } from "@/data/profile";

const STAT_ICONS = {
  "Đơn hàng": IoBagOutline,
  "Yêu thích": IoHeartOutline,
  "Điểm tích lũy": IoGiftOutline,
  "Đánh giá": IoStarOutline,
} as Record<
  string,
  React.ComponentType<{ className?: string; style?: React.CSSProperties }>
>;

export default function ProfileStats() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-8 mt-12 mb-8">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {PROFILE_STATS.map(({ label, value, color }) => {
          const Icon = STAT_ICONS[label];
          return (
            <div
              key={label}
              className="ac bg-white rounded-2xl p-4 shadow-lg shadow-[#17409A]/8 flex items-center gap-3"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: color + "18" }}
              >
                {Icon && <Icon className="text-xl" style={{ color }} />}
              </div>
              <div>
                <p className="text-[#1A1A2E] font-black text-xl leading-none">
                  {value}
                </p>
                <p className="text-[#9CA3AF] text-[10px] font-semibold mt-0.5">
                  {label}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
