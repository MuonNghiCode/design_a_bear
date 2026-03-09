"use client";

import { IoStarOutline } from "react-icons/io5";
import { PROFILE_REVIEWS } from "@/data/profile";

export default function ReviewsTab() {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-[#1A1A2E] font-black text-base mb-1">
        Đánh giá của bạn
      </p>

      {PROFILE_REVIEWS.map((r, i) => (
        <div key={i} className="bg-[#F8F9FF] rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[#1A1A2E] font-bold text-sm">{r.product}</p>
            <span className="text-[#9CA3AF] text-[10px] font-semibold">
              {r.date}
            </span>
          </div>

          <div className="flex gap-0.5 mb-2">
            {Array.from({ length: 5 }).map((_, si) => (
              <IoStarOutline
                key={si}
                className={`text-sm ${si < r.rating ? "text-[#FFD93D]" : "text-[#E5E7EB]"}`}
                style={{ fill: si < r.rating ? "#FFD93D" : "none" }}
              />
            ))}
          </div>

          <p className="text-[#4B5563] text-sm font-semibold leading-relaxed">
            {r.content}
          </p>
        </div>
      ))}
    </div>
  );
}
