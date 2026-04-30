"use client";

import { useMemo } from "react";
import Skeleton from "@/components/shared/Skeleton";
import {
  MdPeople,
  MdPersonAdd,
  MdTrendingUp,
  MdRepeat,
  MdVerifiedUser,
  MdHistory,
} from "react-icons/md";
import { GiPawPrint } from "react-icons/gi";
import { subDays, isSameDay, format } from "date-fns";
import type { UserDetail } from "@/types";

interface CustomersHeroProps {
  customers: UserDetail[];
  loading: boolean;
}

const DAYS_NAME = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

export default function CustomersHero({ customers, loading }: CustomersHeroProps) {
  const stats = useMemo(() => {
    const total = customers.length;
    
    // Logic to identify "new" users (last 30 days)
    const thirtyDaysAgo = subDays(new Date(), 30);
    const newCount = customers.filter(c => new Date(c.createdAt) > thirtyDaysAgo).length;

    const activeCount = customers.filter(c => c.status === "Active").length;
    const verifiedCount = customers.filter(c => c.provider === "Google").length; // Example logic

    // Last 7 days registration chart
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = subDays(new Date(), 6 - i);
      const count = customers.filter((c) => isSameDay(new Date(c.createdAt), d)).length;
      return {
        label: format(d, "EEEEE"),
        dayIdx: (d.getDay() + 6) % 7, // 0=Mon, 6=Sun
        count,
      };
    });

    const yesterday = customers.filter((c) => isSameDay(new Date(c.createdAt), subDays(new Date(), 1)));
    const today = customers.filter((c) => isSameDay(new Date(c.createdAt), new Date()));
    
    const growthPct = yesterday.length > 0 
      ? Math.round(((today.length - yesterday.length) / yesterday.length) * 100)
      : today.length * 100;

    return {
      total,
      newCount,
      activeCount,
      verifiedCount,
      last7Days,
      growthPct,
    };
  }, [customers]);

  const KPI_CARDS = [
    {
      label: "Đang hoạt động",
      value: String(stats.activeCount),
      unit: "người",
      color: "#FFD93D",
      Icon: MdTrendingUp,
    },
    {
      label: "Mới tháng này",
      value: String(stats.newCount),
      unit: "người",
      color: "#4ECDC4",
      Icon: MdPersonAdd,
    },
    {
      label: "Xác thực Google",
      value: String(stats.verifiedCount),
      unit: "người",
      color: "#FF8C42",
      Icon: MdVerifiedUser,
    },
    {
      label: "Tỷ lệ quay lại",
      value: "84",
      unit: "%",
      color: "#7C5CFC",
      Icon: MdRepeat,
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
      {/* Paw watermarks */}
      <GiPawPrint
        className="absolute -top-10 -right-10 text-white/4 pointer-events-none"
        style={{ fontSize: 290 }}
      />
      <GiPawPrint
        className="absolute bottom-4 right-48 text-white/5 pointer-events-none -rotate-12"
        style={{ fontSize: 88 }}
      />

      <div className="relative flex flex-col lg:flex-row gap-10">
        {/* Headline section */}
        <div className="flex-1">
          <p className="text-white/50 text-[10px] font-black tracking-[0.25em] uppercase mb-2">
            Thống kê cộng đồng
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
                <MdTrendingUp className="text-[#4ECDC4] text-sm" />
                <span className="text-white text-xs font-black">
                  {stats.growthPct >= 0 ? "+" : ""}{stats.growthPct}%
                </span>
                <span className="text-white/50 text-[10px] font-semibold">
                  so với hôm qua
                </span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-xl">
                <MdHistory className="text-white/30 text-xs" />
                <span className="text-white/40 text-[9px] font-black uppercase tracking-widest">
                  Tăng trưởng ổn định
                </span>
              </div>
            </div>
          </div>

          {/* 7-day registration chart matching OrdersHero style but bigger */}
          <div className="max-w-md">
            <p className="text-white/30 text-[9px] font-black tracking-[0.22em] uppercase mb-4">
              Thành viên mới (7 ngày qua)
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
                        backgroundColor: isToday ? "#4ECDC4" : "rgba(255,255,255,0.18)",
                      }}
                    >
                      {/* Tooltip on hover */}
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-[#17409A] text-[9px] font-black px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl pointer-events-none">
                        {d.count} người
                      </div>
                    </div>
                    <span
                      className="text-[8px] font-black leading-none"
                      style={{
                        color: isToday ? "#4ECDC4" : "rgba(255,255,255,0.3)",
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

        {/* 2x2 Stats section */}
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
                <span className="text-white/30 text-[11px] font-bold shrink-0">{unit}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
