"use client";

import { GiPawPrint } from "react-icons/gi";
import {
  MdAssignment,
  MdCheckCircle,
  MdTrendingUp,
  MdAccessTime,
  MdWarning,
} from "react-icons/md";
import { STAFF_REPORTS } from "@/data/staff";

const submitted    = STAFF_REPORTS.filter((r) => r.status !== "draft").length;
const acknowledged = STAFF_REPORTS.filter((r) => r.status === "acknowledged").length;
const withIssues   = STAFF_REPORTS.filter((r) => r.issuesCount > 0).length;
const totalOrders  = STAFF_REPORTS.reduce((s, r) => s + r.ordersProcessed, 0);

export default function StaffReportsHero() {
  return (
    <div className="relative bg-[#17409A] rounded-3xl overflow-hidden p-6 sm:p-8 flex flex-col gap-5 min-h-56">
      <GiPawPrint
        className="absolute -top-12 -right-10 text-white/4 pointer-events-none select-none"
        style={{ fontSize: 300 }}
      />
      <GiPawPrint
        className="absolute -bottom-14 -left-12 text-white/3 pointer-events-none select-none"
        style={{ fontSize: 250 }}
      />

      {/* Header */}
      <div className="relative flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="text-white/55 text-[10px] font-black tracking-[0.25em] uppercase mb-2">
            Tháng 3 · 2026
          </p>
          <div className="flex items-end gap-3">
            <span
              className="text-white font-black leading-none"
              style={{ fontSize: "clamp(3.5rem, 6.5vw, 6rem)" }}
            >
              {submitted}
            </span>
            <div className="pb-1.5 flex flex-col gap-1">
              <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm rounded-2xl px-3 py-1.5 self-start">
                <MdTrendingUp className="text-[#4ECDC4] text-sm" />
                <span className="text-white text-xs font-bold">báo cáo đã nộp</span>
              </div>
            </div>
          </div>
        </div>

        {/* Ack badge */}
        <div className="shrink-0 flex flex-col items-center justify-center w-20 h-20 rounded-2xl bg-[#4ECDC4]/20 border border-[#4ECDC4]/30 backdrop-blur-sm">
          <MdCheckCircle className="text-[#4ECDC4]" style={{ fontSize: 24 }} />
          <span className="text-white font-black text-xl leading-tight">{acknowledged}</span>
          <span className="text-white/60 text-[10px] font-semibold">được duyệt</span>
        </div>
      </div>

      {/* Pills */}
      <div className="relative grid grid-cols-2 sm:grid-cols-4 gap-2">
        {[
          { icon: MdAssignment, label: "Tổng báo cáo",     value: STAFF_REPORTS.length, color: "bg-white/15"     },
          { icon: MdAccessTime, label: "Đang chờ xem xét", value: STAFF_REPORTS.filter(r=>r.status==="submitted").length, color: "bg-[#FFD93D]/20" },
          { icon: MdWarning,    label: "Có sự cố",          value: withIssues,           color: "bg-[#FF8C42]/20" },
          { icon: MdCheckCircle,label: "Đơn đã xử lý",     value: totalOrders,          color: "bg-[#4ECDC4]/20" },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className={`${color} backdrop-blur-sm rounded-2xl px-3 py-2.5 flex flex-col gap-1`}>
            <Icon className="text-white/70 text-base" />
            <span className="text-white font-black text-lg leading-none">{value}</span>
            <span className="text-white/60 text-[11px] font-semibold">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
