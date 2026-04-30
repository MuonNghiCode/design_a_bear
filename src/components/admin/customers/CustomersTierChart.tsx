"use client";

import Skeleton from "@/components/shared/Skeleton";
import {
  MdDiamond,
  MdEmojiEvents,
  MdMilitaryTech,
  MdStar,
  MdPeople,
} from "react-icons/md";
import type { UserDetail } from "@/types";

interface CustomersTierChartProps {
  customers: UserDetail[];
  loading: boolean;
}

export default function CustomersTierChart({
  customers,
  loading,
}: CustomersTierChartProps) {
  const total = customers.length;

  const tiers = [
    {
      label: "Kim cương",
      count: customers.filter((c) => (c.roleName || "").toLowerCase().includes("diamond")).length || 0,
      color: "#7C5CFC",
      icon: MdDiamond,
    },
    {
      label: "Vàng",
      count: customers.filter((c) => (c.roleName || "").toLowerCase().includes("gold")).length || 0,
      color: "#FFD93D",
      icon: MdEmojiEvents,
    },
    {
      label: "Bạc",
      count: customers.filter((c) => (c.roleName || "").toLowerCase().includes("silver")).length || 0,
      color: "#9CA3AF",
      icon: MdMilitaryTech,
    },
    {
      label: "Mới",
      count: customers.filter(
        (c) =>
          !c.roleName ||
          ["parent", "user", "customer"].includes(c.roleName.toLowerCase()),
      ).length,
      color: "#FF8C42",
      icon: MdStar,
    },
  ];

  if (loading) {
    return (
      <div className="bg-white rounded-3xl p-6 h-full flex flex-col min-h-[300px] border border-gray-100 shadow-sm">
        <Skeleton className="h-3 w-16 mb-1" />
        <Skeleton className="h-6 w-32 mb-8" />
        <div className="space-y-6 flex-1">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-between"><Skeleton className="h-4 w-24" /><Skeleton className="h-4 w-8" /></div>
              <Skeleton className="h-1.5 w-full rounded-full" />
            </div>
          ))}
        </div>
        <Skeleton className="h-4 w-32 mt-6 pt-4 border-t border-gray-50" />
      </div>
    );
  }

  return (
    <div className="relative bg-white rounded-3xl p-6 h-full flex flex-col min-h-[300px] border border-[#F4F7FF] shadow-sm shadow-[#F4F7FF]/50">
      {/* Header matching OrdersPipeline */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-[#9CA3AF] text-[10px] font-black tracking-[0.22em] uppercase mb-0.5">
            Phân hạng
          </p>
          <p className="text-[#1A1A2E] font-black text-lg">Cơ cấu thành viên</p>
        </div>
        <span className="text-[10px] font-black text-[#17409A] bg-[#17409A]/8 px-3 py-1.5 rounded-full">
          {total} người
        </span>
      </div>

      <div className="flex flex-col gap-5 flex-1">
        {tiers.map((t) => {
          const pct = total > 0 ? Math.round((t.count / total) * 100) : 0;
          return (
            <div key={t.label}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: t.color + "12" }}
                  >
                    <t.icon style={{ color: t.color, fontSize: 18 }} />
                  </div>
                  <span className="text-[#1A1A2E] font-black text-[13px] tracking-tight">
                    {t.label}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#1A1A2E] font-black text-sm">{t.count}</span>
                  <span 
                    className="text-[9px] font-black px-1.5 py-0.5 rounded-md"
                    style={{ color: t.color, backgroundColor: t.color + "12" }}
                  >
                    {pct}%
                  </span>
                </div>
              </div>
              <div className="h-1.5 w-full bg-[#F4F7FF] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${pct}%`, backgroundColor: t.color }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer matching OrdersPipeline */}
      <p className="text-[#9CA3AF] text-[10px] font-semibold mt-4 pt-4 border-t border-[#F4F7FF]">
        Cập nhật theo thời gian thực · {new Date().toLocaleDateString("vi-VN", { month: "long", year: "numeric" })}
      </p>
    </div>
  );
}
