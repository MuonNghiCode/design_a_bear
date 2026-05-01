"use client";

import { GiPawPrint, GiWallet } from "react-icons/gi";
import { MdAssignmentInd } from "react-icons/md";

interface StatCardsProps {
  stats: {
    activeJobs: number;
    completedJobs: number;
    totalCommission: number;
  };
  loading: boolean;
}

export default function StatCards({ stats, loading }: StatCardsProps) {
  const cards = [
    {
      label: "Công việc đang làm",
      value: stats.activeJobs,
      icon: MdAssignmentInd,
      color: "text-[#17409A]",
      bg: "bg-[#F4F7FF]",
    },
    {
      label: "Đã hoàn thành",
      value: stats.completedJobs,
      icon: GiPawPrint,
      color: "text-[#4ECDC4]",
      bg: "bg-[#4ECDC4]/10",
    },
    {
      label: "Tổng thu nhập",
      value: `${stats.totalCommission.toLocaleString()} đ`,
      icon: GiWallet,
      color: "text-[#FF8C42]",
      bg: "bg-[#FF8C42]/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6" style={{ fontFamily: "'Nunito', sans-serif" }}>
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <div
            key={i}
            className="bg-white p-8 rounded-3xl shadow-sm border border-slate-50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between h-44 relative overflow-hidden"
          >
            {/* Background glowing circle for luxurious accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full opacity-40 translate-x-8 -translate-y-8 z-0 pointer-events-none group-hover:scale-110 transition-transform duration-500" />
            
            <div className="relative z-10 flex justify-between items-start">
              <div className="text-slate-400 text-xs font-black uppercase tracking-[0.2em]">
                {card.label}
              </div>
              <div className={`w-12 h-12 rounded-2xl ${card.bg} ${card.color} flex items-center justify-center transition-all group-hover:scale-110 duration-300 shadow-sm`}>
                <Icon className="text-2xl" />
              </div>
            </div>

            <div className="relative z-10">
              <div className={`text-3xl md:text-4xl font-black ${card.color} tracking-tight`}>
                {loading ? "..." : card.value}
              </div>
              <div className="text-[10px] text-slate-400 font-bold tracking-wider mt-1.5 uppercase">
                Cập nhật theo thời gian thực
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
