"use client";

import {
  MdPeople,
  MdPersonAdd,
  MdTrendingUp,
  MdDiamond,
  MdRepeat,
} from "react-icons/md";
import { GiPawPrint } from "react-icons/gi";
import type { UserDetail } from "@/types";

interface CustomersHeroProps {
  customers: UserDetail[];
  loading: boolean;
}

export default function CustomersHero({ customers, loading }: CustomersHeroProps) {
  const totalCustomers = customers.length;
  
  // Logic to identify "new" users (last 30 days)
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const newCount = customers.filter(c => new Date(c.createdAt) > thirtyDaysAgo).length;

  const stats = [
    {
      label: "Tổng khách hàng",
      value: String(totalCustomers),
      unit: "người",
      color: "#FFFFFF",
      Icon: MdPeople,
    },
    {
      label: "Mới tháng này",
      value: String(newCount),
      unit: "người",
      color: "#4ECDC4",
      Icon: MdPersonAdd,
    },
    {
      label: "Đang hoạt động",
      value: String(customers.filter(c => c.status === "Active").length),
      unit: "người",
      color: "#FFD93D",
      Icon: MdTrendingUp,
    },
    {
      label: "Tỷ lệ quay lại",
      value: "84",
      unit: "%",
      color: "#FF8C42",
      Icon: MdRepeat,
    },
  ];

  if (loading) {
    return <div className="h-64 rounded-3xl bg-gray-100 animate-pulse" />;
  }

  return (
    <div className="relative bg-[#17409A] rounded-[40px] overflow-hidden p-10 flex flex-col min-h-64 shadow-xl shadow-[#17409A]/20">
      <GiPawPrint
        className="absolute -top-12 -right-8 text-white/5 pointer-events-none"
        style={{ fontSize: 300 }}
      />

      <div className="relative flex flex-col gap-10">
        <div>
          <p className="text-white/40 text-[10px] font-black tracking-[0.3em] uppercase mb-4">
            Thống kê cộng đồng
          </p>
          <div className="flex items-end gap-6 flex-wrap">
            <span className="text-white font-black leading-none text-7xl tracking-tighter">
              {totalCustomers}
            </span>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl px-4 py-2 border border-white/10">
              <div className="flex items-center gap-2">
                <MdTrendingUp className="text-[#4ECDC4]" />
                <span className="text-white font-black text-sm">+{Math.floor(newCount / (totalCustomers || 1) * 100)}%</span>
              </div>
              <p className="text-white/40 text-[9px] font-bold uppercase mt-1">Tăng trưởng kỳ này</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map(({ label, value, unit, color, Icon }) => (
            <div key={label} className="bg-white/5 backdrop-blur-sm rounded-3xl p-5 border border-white/5 hover:bg-white/10 transition-all">
              <div className="flex items-center gap-2 mb-2">
                <Icon className="text-sm" style={{ color }} />
                <span className="text-white/40 text-[9px] font-black uppercase tracking-widest">{label}</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-white font-black text-2xl tracking-tight">{value}</span>
                <span className="text-white/30 text-[10px] font-bold">{unit}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
