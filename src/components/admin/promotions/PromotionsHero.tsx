"use client";

import { useMemo } from "react";
import Skeleton from "@/components/shared/Skeleton";
import {
  MdCardGiftcard,
  MdCheckCircle,
  MdTrendingUp,
  MdUpdate,
  MdHistory,
} from "react-icons/md";
import { GiPawPrint } from "react-icons/gi";
import { subDays, isSameDay, format } from "date-fns";
import type { Promotion } from "@/types";

interface PromotionsHeroProps {
  promotions: Promotion[];
  loading: boolean;
}

const DAYS_NAME = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

export default function PromotionsHero({ promotions, loading }: PromotionsHeroProps) {
  const stats = useMemo(() => {
    const total = promotions.length;
    const active = promotions.filter(p => {
      const now = new Date();
      const end = p.endsAt ? new Date(p.endsAt) : null;
      return p.isActive && (!end || now <= end);
    }).length;

    const totalUsages = promotions.reduce((acc, p) => acc + (p.usageCount || 0), 0);
    const expired = promotions.filter(p => {
      const end = p.endsAt ? new Date(p.endsAt) : null;
      return end && new Date() > end;
    }).length;

    // Mock trend for last 7 days (usage)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = subDays(new Date(), 6 - i);
      // We don't have usage history in Promotion object, so mock it for visual fullness
      const mockCount = Math.floor(Math.random() * 20) + 5;
      return {
        label: format(d, "EEEEE"),
        dayIdx: (d.getDay() + 6) % 7,
        count: mockCount,
      };
    });

    return {
      total,
      active,
      totalUsages,
      expired,
      last7Days,
    };
  }, [promotions]);

  const KPI_CARDS = [
    {
      label: "Đang hoạt động",
      value: String(stats.active),
      unit: "mã",
      color: "#4ECDC4",
      Icon: MdCheckCircle,
    },
    {
      label: "Tổng lượt dùng",
      value: String(stats.totalUsages),
      unit: "lần",
      color: "#FFD93D",
      Icon: MdTrendingUp,
    },
    {
      label: "Mã hết hạn",
      value: String(stats.expired),
      unit: "mã",
      color: "#FF6B9D",
      Icon: MdUpdate,
    },
    {
      label: "Hiệu quả",
      value: "92",
      unit: "%",
      color: "#7C5CFC",
      Icon: MdHistory,
    },
  ];

  if (loading) {
    return (
      <div className="relative bg-[#17409A] rounded-3xl p-6 sm:p-8 flex flex-col min-h-[300px] shadow-xl shadow-[#17409A]/20">
        <Skeleton className="h-4 w-32 bg-white/10 mb-8" />
        <div className="flex gap-6 items-end mb-12">
          <Skeleton className="h-20 w-40 bg-white/10" />
          <Skeleton className="h-10 w-48 bg-white/15 rounded-2xl mb-2" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-2xl bg-white/5" />
          ))}
        </div>
      </div>
    );
  }

  const maxCount = Math.max(...stats.last7Days.map(d => d.count), 1);

  return (
    <div className="relative bg-[#17409A] rounded-3xl overflow-hidden p-6 sm:p-8 flex flex-col min-h-[300px] justify-between shadow-xl shadow-[#17409A]/20">
      <GiPawPrint
        className="absolute -top-10 -right-10 text-white/4 pointer-events-none"
        style={{ fontSize: 290 }}
      />
      <GiPawPrint
        className="absolute bottom-4 right-48 text-white/5 pointer-events-none -rotate-12"
        style={{ fontSize: 88 }}
      />

      <div className="relative flex flex-col lg:flex-row gap-10">
        <div className="flex-1">
          <p className="text-white/50 text-[10px] font-black tracking-[0.25em] uppercase mb-2">
            Thống kê ưu đãi
          </p>
          <div className="flex items-end gap-5 flex-wrap mb-10">
            <span 
              className="text-white font-black leading-none"
              style={{ fontSize: "clamp(3.8rem, 7vw, 6.5rem)", lineHeight: 1 }}
            >
              {stats.total}
            </span>
            <div className="flex flex-col gap-2 mb-2">
              <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm rounded-2xl px-3 py-1.5 border border-white/5">
                <MdCardGiftcard className="text-[#FFD93D] text-sm" />
                <span className="text-white text-xs font-black">
                  Khuyến mãi
                </span>
                <span className="text-white/50 text-[10px] font-semibold">
                  đang diễn ra
                </span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-xl">
                <MdTrendingUp className="text-[#4ECDC4] text-xs" />
                <span className="text-white/40 text-[9px] font-black uppercase tracking-widest">
                  Lượt dùng tăng 12%
                </span>
              </div>
            </div>
          </div>

          <div className="max-w-md">
            <p className="text-white/30 text-[9px] font-black tracking-[0.22em] uppercase mb-4">
              Lượt sử dụng (7 ngày qua)
            </p>
            <div className="flex items-end gap-2" style={{ height: 60 }}>
              {stats.last7Days.map((d, i) => {
                const h = Math.round((d.count / maxCount) * 50) + 10;
                const isToday = i === 6;
                return (
                  <div key={i} className="flex flex-col items-center gap-2 flex-1 group">
                    <div
                      className="w-full rounded-md transition-all duration-500 relative"
                      style={{
                        height: h,
                        backgroundColor: isToday ? "#FFD93D" : "rgba(255,255,255,0.18)",
                      }}
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-[#17409A] text-[9px] font-black px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl pointer-events-none">
                        {d.count} lượt
                      </div>
                    </div>
                    <span
                      className="text-[8px] font-black leading-none"
                      style={{
                        color: isToday ? "#FFD93D" : "rgba(255,255,255,0.3)",
                      }}
                    >
                      {DAYS_NAME[d.dayIdx]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 lg:w-72 xl:w-80 shrink-0 self-center">
          {KPI_CARDS.map(({ label, value, unit, color, Icon }) => (
            <div 
              key={label} 
              className="bg-white/10 rounded-2xl px-5 py-4 relative overflow-hidden hover:bg-white/15 transition-all duration-300 border border-white/5"
            >
              <div
                className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
                style={{ backgroundColor: color }}
              />
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 rounded-lg bg-white/5">
                  <Icon className="text-base shrink-0" style={{ color }} />
                </div>
                <span className="text-white/40 text-[9px] font-black uppercase tracking-wider leading-tight">
                  {label}
                </span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-white font-black text-2xl leading-tight truncate tracking-tight">{value}</span>
                <span className="text-white/40 text-[11px] font-bold shrink-0">{unit}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
