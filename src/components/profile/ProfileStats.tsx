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
    <div className="max-w-screen-2xl mx-auto px-8 md:px-16 mt-12 mb-10">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {PROFILE_STATS.map(({ label, value, color }) => {
          const Icon = STAT_ICONS[label];
          return (
            <div
              key={label}
              className="ac bg-white rounded-2xl p-5 shadow-lg shadow-[#17409A]/8 flex items-center gap-4"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: color + "18" }}
              >
                {Icon && <Icon className="text-2xl" style={{ color }} />}
              </div>
              <div>
                <p className="text-[#1A1A2E] font-black text-2xl leading-none">
                  {value}
                </p>
                <p className="text-[#9CA3AF] text-xs font-semibold mt-1">
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
