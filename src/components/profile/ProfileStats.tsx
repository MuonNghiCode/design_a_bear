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
    <div className="max-w-screen-2xl mx-auto px-8 md:px-16 mt-10 mb-10" style={{ fontFamily: "'Nunito', sans-serif" }}>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {PROFILE_STATS.map(({ label, value, color }) => {
          const Icon = STAT_ICONS[label];
          return (
            <div
              key={label}
              className="ac bg-white rounded-3xl p-6 shadow-sm border border-slate-50 flex items-center gap-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50/50 rounded-full opacity-40 translate-x-4 -translate-y-4 z-0 pointer-events-none group-hover:scale-110 transition-transform duration-500" />
              
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm transition-all group-hover:scale-110 duration-300 relative z-10"
                style={{ backgroundColor: color + "15" }}
              >
                {Icon && <Icon className="text-2xl" style={{ color }} />}
              </div>
              
              <div className="relative z-10">
                <p className={`font-black text-2xl md:text-3xl leading-none tracking-tight mb-1`} style={{ color }}>
                  {value}
                </p>
                <p className="text-[#9CA3AF] text-xs font-bold tracking-wide uppercase">
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
