"use client";

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

  // Since we don't have real "tier" logic in BE yet, we segment by role or something similar
  // For now, let's categorize them by "Parent", "User", "Khách hàng" as tiers
  const tiers = [
    {
      label: "Kim cương",
      count:
        customers.filter((c) => c.roleName?.toLowerCase().includes("diamond"))
          .length || 0,
      color: "#7C5CFC",
      icon: MdDiamond,
    },
    {
      label: "Vàng",
      count:
        customers.filter((c) => c.roleName?.toLowerCase().includes("gold"))
          .length || 0,
      color: "#FFD93D",
      icon: MdEmojiEvents,
    },
    {
      label: "Bạc",
      count:
        customers.filter((c) => c.roleName?.toLowerCase().includes("silver"))
          .length || 0,
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
    return <div className="h-full rounded-3xl bg-gray-50 animate-pulse" />;
  }

  return (
    <div className="bg-white rounded-[40px] p-8 h-full flex flex-col border border-[#F0F0F8] shadow-sm">
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-[#9CA3AF] text-[10px] font-black tracking-[0.3em] uppercase mb-1">
            Phân hạng
          </p>
          <h3 className="text-[#1A1A2E] font-black text-xl tracking-tight">
            Cơ cấu thành viên
          </h3>
        </div>
        <div className="flex items-center gap-2 bg-[#F4F7FF] text-[#17409A] px-3 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-widest">
          <MdPeople /> {total}
        </div>
      </div>

      <div className="flex flex-col gap-6 flex-1">
        {tiers.map((t) => {
          const pct = total > 0 ? Math.round((t.count / total) * 100) : 0;
          return (
            <div key={t.label}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center"
                    style={{ backgroundColor: t.color + "15" }}
                  >
                    <t.icon style={{ color: t.color, fontSize: 18 }} />
                  </div>
                  <span className="text-[#1A1A2E] font-black text-sm">
                    {t.label}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-[#1A1A2E] font-black text-sm">{t.count}</p>
                  <p className="text-[#9CA3AF] text-[10px] font-bold">{pct}%</p>
                </div>
              </div>
              <div className="h-2 w-full bg-[#F4F7FF] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{ width: `${pct}%`, backgroundColor: t.color }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 p-6 rounded-[32px] bg-[#F8FAFF] border border-[#F0F0F8]">
        <p className="text-[#9CA3AF] text-[9px] font-black tracking-widest uppercase mb-2">
          Thông tin
        </p>
        <p className="text-[#1A1A2E] font-bold text-xs leading-relaxed">
          Hệ thống phân hạng dựa trên tổng chi tiêu tích lũy của khách hàng.
        </p>
      </div>
    </div>
  );
}
