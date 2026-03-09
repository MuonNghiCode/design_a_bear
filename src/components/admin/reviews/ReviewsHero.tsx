"use client";

import { ADMIN_REVIEWS, REVIEW_RATING_DIST } from "@/data/admin";
import { GiPawPrint } from "react-icons/gi";
import {
  MdStar,
  MdTrendingUp,
  MdRateReview,
  MdAccessTimeFilled,
  MdFlag,
  MdCheckCircle,
} from "react-icons/md";

const avgRating = (
  ADMIN_REVIEWS.reduce((s, r) => s + r.rating, 0) / ADMIN_REVIEWS.length
).toFixed(1);

const total      = ADMIN_REVIEWS.length;
const published  = ADMIN_REVIEWS.filter((r) => r.status === "published").length;
const pending    = ADMIN_REVIEWS.filter((r) => r.status === "pending").length;
const flagged    = ADMIN_REVIEWS.filter((r) => r.status === "flagged").length;
const fiveStar   = ADMIN_REVIEWS.filter((r) => r.rating === 5).length;

const PILLS = [
  { icon: MdRateReview,       label: "Tổng đánh giá",  value: total,     color: "bg-white/15" },
  { icon: MdCheckCircle,      label: "Đã duyệt",        value: published, color: "bg-[#4ECDC4]/20" },
  { icon: MdAccessTimeFilled, label: "Chờ duyệt",       value: pending,   color: "bg-[#FFD93D]/20" },
  { icon: MdFlag,             label: "Bị báo cáo",      value: flagged,   color: "bg-[#FF6B9D]/20" },
];

export default function ReviewsHero() {
  return (
    <div className="relative bg-[#17409A] rounded-3xl overflow-hidden p-6 sm:p-8 flex flex-col gap-5 min-h-64">
      {/* Watermarks */}
      <GiPawPrint
        className="absolute -top-14 -right-10 text-white/4 pointer-events-none select-none"
        style={{ fontSize: 340 }}
      />
      <GiPawPrint
        className="absolute -bottom-16 -left-14 text-white/3 pointer-events-none select-none"
        style={{ fontSize: 280 }}
      />

      {/* Header */}
      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="text-white/60 text-sm font-semibold uppercase tracking-widest mb-1">
            Điểm đánh giá trung bình
          </p>
          <div className="flex items-end gap-3">
            <span
              className="text-white font-black leading-none"
              style={{ fontSize: "clamp(3.5rem, 6.5vw, 6rem)" }}
            >
              {avgRating}
            </span>
            <div className="pb-2 flex flex-col gap-1">
              {/* Stars row */}
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <MdStar
                    key={s}
                    className={s <= Math.round(Number(avgRating)) ? "text-[#FFD93D]" : "text-white/20"}
                    style={{ fontSize: 18 }}
                  />
                ))}
              </div>
              {/* Trend pill */}
              <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm rounded-2xl px-3 py-1.5 self-start">
                <MdTrendingUp className="text-[#4ECDC4] text-sm" />
                <span className="text-white text-xs font-bold">+0.2 tháng này</span>
              </div>
            </div>
          </div>
        </div>

        {/* 5-star badge */}
        <div className="shrink-0 flex flex-col items-center justify-center w-20 h-20 rounded-2xl bg-[#FFD93D]/20 border border-[#FFD93D]/30 backdrop-blur-sm">
          <MdStar className="text-[#FFD93D]" style={{ fontSize: 28 }} />
          <span className="text-white font-black text-xl leading-tight">{fiveStar}</span>
          <span className="text-white/60 text-[10px] font-semibold">5 sao</span>
        </div>
      </div>

      {/* Stat pills */}
      <div className="relative grid grid-cols-2 sm:grid-cols-4 gap-2">
        {PILLS.map(({ icon: Icon, label, value, color }) => (
          <div
            key={label}
            className={`${color} backdrop-blur-sm rounded-2xl px-3 py-2.5 flex flex-col gap-1`}
          >
            <Icon className="text-white/70 text-base" />
            <span className="text-white font-black text-lg leading-none">{value}</span>
            <span className="text-white/60 text-[11px] font-semibold leading-tight">{label}</span>
          </div>
        ))}
      </div>

      {/* Rating mini-bars */}
      <div className="relative flex flex-col gap-1.5">
        {[...REVIEW_RATING_DIST].reverse().map(({ stars, count, pct }) => (
          <div key={stars} className="flex items-center gap-2">
            <span className="text-white/60 text-[11px] font-bold w-4 text-right">{stars}</span>
            <MdStar className="text-[#FFD93D]/80 shrink-0" style={{ fontSize: 12 }} />
            <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-linear-to-r from-[#FFD93D] to-[#FF8C42] transition-all duration-700"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="text-white/50 text-[11px] font-semibold w-5 text-right">{count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
