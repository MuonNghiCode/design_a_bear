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
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      label: "Đã hoàn thành",
      value: stats.completedJobs,
      icon: GiPawPrint,
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      label: "Tổng thu nhập (đ)",
      value: stats.totalCommission.toLocaleString(),
      icon: GiWallet,
      color: "text-amber-600",
      bg: "bg-amber-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <div
            key={i}
            className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center justify-between">
              <div className={`w-14 h-14 rounded-2xl ${card.bg} ${card.color} flex items-center justify-center transition-transform group-hover:scale-110 duration-300`}>
                <Icon className="text-3xl" />
              </div>
              <div className="text-right">
                <div className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">
                  {card.label}
                </div>
                <div className={`text-2xl font-black ${card.color}`}>
                  {loading ? "..." : card.value}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
