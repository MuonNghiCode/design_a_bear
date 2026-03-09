"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { GiPawPrint } from "react-icons/gi";
import {
  MdShoppingBag,
  MdCheckCircle,
  MdStar,
  MdAssignment,
  MdAccessTime,
  MdTrendingUp,
  MdWarning,
} from "react-icons/md";
import {
  STAFF_TASKS,
  TASK_TYPE_CFG,
  SHIFT_CFG,
  type StaffTask,
  type TaskStatus,
} from "@/data/staff";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

// Current shift determination (morning 6-14, afternoon 14-22, evening 22-6)
function getCurrentShift() {
  const h = new Date().getHours();
  if (h >= 6 && h < 14) return "morning";
  if (h >= 14 && h < 22) return "afternoon";
  return "evening";
}
const CURRENT_SHIFT = getCurrentShift();

const STATUS_CFG: Record<TaskStatus, { label: string; color: string; bg: string }> = {
  pending:     { label: "Chờ làm",  color: "#FF8C42", bg: "#FF8C4215" },
  in_progress: { label: "Đang làm", color: "#17409A", bg: "#17409A15" },
  done:        { label: "Xong",     color: "#4ECDC4", bg: "#4ECDC415" },
};

const PRIORITY_DOT: Record<string, string> = {
  urgent: "#FF6B9D",
  normal: "#17409A",
  low:    "#9CA3AF",
};

export default function StaffDashboardClient() {
  const ref = useRef<HTMLDivElement>(null);
  const [tasks, setTasks] = useState<StaffTask[]>(STAFF_TASKS);
  const { user } = useAuth();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".ac",
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", stagger: 0.07, clearProps: "all" },
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  const done    = tasks.filter((t) => t.status === "done").length;
  const pending = tasks.filter((t) => t.status === "pending").length;
  const inProg  = tasks.filter((t) => t.status === "in_progress").length;
  const urgent  = tasks.filter((t) => t.priority === "urgent" && t.status !== "done").length;
  const total   = tasks.length;
  const pct     = Math.round((done / total) * 100);

  const shift = SHIFT_CFG[CURRENT_SHIFT as keyof typeof SHIFT_CFG];

  function cycleStatus(id: string) {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const next: TaskStatus =
          t.status === "pending" ? "in_progress" : t.status === "in_progress" ? "done" : "pending";
        return { ...t, status: next };
      }),
    );
  }

  return (
    <div ref={ref} className="space-y-5">
      {/* ── Title row ── */}
      <div className="ac flex items-end justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <GiPawPrint className="text-[#17409A]" style={{ fontSize: 22 }} />
            <h1 className="font-black text-[#1A1A2E] text-2xl tracking-tight">
              Tổng quan ca làm
            </h1>
          </div>
          <p className="text-[#9CA3AF] text-sm">
            Chào {user?.name ?? "nhân viên"} · {shift.label} {shift.time}
          </p>
        </div>
        <Link
          href="/staff/reports"
          className="flex items-center gap-2 bg-[#17409A] hover:bg-[#1a3a8a] text-white text-sm font-bold px-4 py-2.5 rounded-2xl transition-colors cursor-pointer whitespace-nowrap"
        >
          <MdAssignment className="text-base" />
          Tạo báo cáo
        </Link>
      </div>

      {/* ── Hero banner + quick stats ── */}
      <div className="ac grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Hero */}
        <div className="lg:col-span-3 relative bg-[#17409A] rounded-3xl overflow-hidden p-6 sm:p-8 flex flex-col gap-5 min-h-56">
          <GiPawPrint
            className="absolute -top-12 -right-10 text-white/4 pointer-events-none select-none"
            style={{ fontSize: 300 }}
          />
          <GiPawPrint
            className="absolute -bottom-14 -left-12 text-white/3 pointer-events-none select-none"
            style={{ fontSize: 260 }}
          />

          <div className="relative flex items-start justify-between gap-4 flex-wrap">
            <div>
              <p className="text-white/55 text-[10px] font-black tracking-[0.25em] uppercase mb-2">
                Tiến độ ca hôm nay
              </p>
              <div className="flex items-end gap-3">
                <span
                  className="text-white font-black leading-none"
                  style={{ fontSize: "clamp(3.5rem, 6.5vw, 6rem)" }}
                >
                  {pct}%
                </span>
                <div className="pb-1.5 flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm rounded-2xl px-3 py-1.5 self-start">
                    <MdTrendingUp className="text-[#4ECDC4] text-sm" />
                    <span className="text-white text-xs font-bold">{done}/{total} nhiệm vụ</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Shift badge */}
            <div
              className="flex flex-col items-center justify-center w-20 h-20 rounded-2xl border backdrop-blur-sm shrink-0"
              style={{ backgroundColor: `${shift.color}25`, borderColor: `${shift.color}40` }}
            >
              <MdAccessTime style={{ color: shift.color, fontSize: 26 }} />
              <span className="text-white font-black text-xs leading-tight mt-1 text-center px-1">
                {shift.label}
              </span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="relative flex flex-col gap-1.5">
            <div className="h-2.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-linear-to-r from-[#4ECDC4] to-[#17409A] transition-all duration-700"
                style={{ width: `${pct}%` }}
              />
            </div>
            <div className="flex justify-between text-white/50 text-xs font-semibold">
              <span>{done} hoàn thành</span>
              <span>{pending + inProg} còn lại</span>
            </div>
          </div>

          {/* Pills */}
          <div className="relative grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { icon: MdShoppingBag, label: "Đóng gói",  value: tasks.filter((t) => t.type === "pack" && t.status !== "done").length, color: "bg-white/15" },
              { icon: MdCheckCircle, label: "Kiểm tra",  value: tasks.filter((t) => t.type === "verify" && t.status !== "done").length, color: "bg-[#4ECDC4]/20" },
              { icon: MdStar,        label: "Phản hồi",  value: tasks.filter((t) => t.type === "review_reply" && t.status !== "done").length, color: "bg-[#FFD93D]/20" },
              { icon: MdWarning,     label: "Khẩn cấp",  value: urgent, color: "bg-[#FF6B9D]/20" },
            ].map(({ icon: Icon, label, value, color }) => (
              <div key={label} className={`${color} backdrop-blur-sm rounded-2xl px-3 py-2.5 flex flex-col gap-1`}>
                <Icon className="text-white/70 text-base" />
                <span className="text-white font-black text-lg leading-none">{value}</span>
                <span className="text-white/60 text-[11px] font-semibold">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick nav cards */}
        <div className="lg:col-span-2 grid grid-cols-2 gap-3 content-start">
          {[
            { href: "/staff/orders",  icon: MdShoppingBag, label: "Đơn hàng", sub: `${tasks.filter(t=>t.type==="pack").length} việc chờ`, color: "#17409A" },
            { href: "/staff/reviews", icon: MdStar,         label: "Đánh giá", sub: `${tasks.filter(t=>t.type==="review_reply").length} chưa trả lời`, color: "#FFD93D" },
            { href: "/staff/reports", icon: MdAssignment,   label: "Báo cáo",  sub: "Tạo báo cáo ca", color: "#4ECDC4" },
            { href: "/staff",         icon: MdAccessTime,   label: "Ca tiếp",  sub: shift.time, color: "#7C5CFC" },
          ].map(({ href, icon: Icon, label, sub, color }) => (
            <Link
              key={href + label}
              href={href}
              className="bg-white rounded-2xl p-4 flex flex-col gap-2 hover:shadow-md transition-shadow cursor-pointer group"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${color}15` }}
              >
                <Icon style={{ color, fontSize: 20 }} />
              </div>
              <p className="font-black text-[#1A1A2E] text-sm">{label}</p>
              <p className="text-[#9CA3AF] text-xs">{sub}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Task list ── */}
      <div className="ac bg-white rounded-3xl overflow-hidden">
        <div className="px-6 py-4 border-b border-[#F4F7FF] flex items-center justify-between">
          <div>
            <p className="font-black text-[#1A1A2E] text-base">Danh sách nhiệm vụ</p>
            <p className="text-[#9CA3AF] text-xs mt-0.5">Nhấn để chuyển trạng thái</p>
          </div>
          <span className="bg-[#17409A]/10 text-[#17409A] text-xs font-black px-3 py-1 rounded-xl">
            {done}/{total}
          </span>
        </div>

        <div className="divide-y divide-[#F4F7FF]">
          {tasks.map((task) => {
            const typeCfg   = TASK_TYPE_CFG[task.type];
            const statusCfg = STATUS_CFG[task.status];
            return (
              <div
                key={task.id}
                className={`flex items-center gap-4 px-6 py-3.5 hover:bg-[#F4F7FF]/70 transition-colors ${
                  task.status === "done" ? "opacity-50" : ""
                }`}
              >
                {/* Priority dot */}
                <div
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: PRIORITY_DOT[task.priority] }}
                />

                {/* Type badge */}
                <span
                  className="shrink-0 text-[10px] font-black px-2 py-0.5 rounded-lg"
                  style={{ color: typeCfg.color, backgroundColor: typeCfg.bg }}
                >
                  {typeCfg.label}
                </span>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-bold text-[#1A1A2E] truncate ${task.status === "done" ? "line-through" : ""}`}>
                    {task.product}
                    {task.customer && <span className="text-[#9CA3AF] font-normal"> · {task.customer}</span>}
                  </p>
                  {task.note && <p className="text-[#9CA3AF] text-xs truncate">{task.note}</p>}
                </div>

                {/* Due time */}
                <span className="text-[#9CA3AF] text-xs font-semibold shrink-0">{task.dueBy}</span>

                {/* Status toggle */}
                <button
                  onClick={() => cycleStatus(task.id)}
                  className="shrink-0 text-[10px] font-black px-2.5 py-1 rounded-xl transition-all cursor-pointer hover:scale-105"
                  style={{ color: statusCfg.color, backgroundColor: statusCfg.bg }}
                >
                  {statusCfg.label}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
