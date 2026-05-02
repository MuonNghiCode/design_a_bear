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
  MdDashboard,
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

const STATUS_CFG: Record<
  TaskStatus,
  { label: string; color: string; bg: string }
> = {
  pending: { label: "Chờ làm", color: "#FF8C42", bg: "#FF8C4215" },
  in_progress: { label: "Đang làm", color: "#17409A", bg: "#17409A15" },
  done: { label: "Xong", color: "#4ECDC4", bg: "#4ECDC415" },
};

const PRIORITY_DOT: Record<string, string> = {
  urgent: "#FF6B9D",
  normal: "#17409A",
  low: "#9CA3AF",
};

export default function StaffDashboardClient() {
  const ref = useRef<HTMLDivElement>(null);
  const [tasks, setTasks] = useState<StaffTask[]>(STAFF_TASKS);
  const { user } = useAuth();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".dc-reveal",
        { opacity: 0, y: 18 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power2.out",
          stagger: 0.07,
          clearProps: "all",
        },
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  const done = tasks.filter((t) => t.status === "done").length;
  const pending = tasks.filter((t) => t.status === "pending").length;
  const inProg = tasks.filter((t) => t.status === "in_progress").length;
  const urgent = tasks.filter(
    (t) => t.priority === "urgent" && t.status !== "done",
  ).length;
  const total = tasks.length;
  const pct = Math.round((done / total) * 100);

  const shift = SHIFT_CFG[CURRENT_SHIFT as keyof typeof SHIFT_CFG];

  function cycleStatus(id: string) {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const next: TaskStatus =
          t.status === "pending"
            ? "in_progress"
            : t.status === "in_progress"
              ? "done"
              : "pending";
        return { ...t, status: next };
      }),
    );
  }

  return (
    <div ref={ref} className="space-y-5">
      {/* ── Dynamic Hero Header ── */}
      <div className="dc-reveal relative bg-[#17409A] rounded-[40px] p-10 overflow-hidden shadow-2xl shadow-blue-900/20 border border-white/10 min-h-[220px] flex flex-col justify-center">
        {/* Paw Watermark */}
        <GiPawPrint className="absolute -bottom-10 -right-10 text-white/5 text-[300px] rotate-12 pointer-events-none" />
        <GiPawPrint className="absolute top-4 left-1/3 text-white/4 text-[80px] -rotate-12 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-white/10 text-white/70 text-[9px] font-black uppercase tracking-[0.25em] px-3 py-1 rounded-full border border-white/10 backdrop-blur-md">
                Staff Dashboard
              </span>
              <span className="text-white/40 text-[9px] font-black uppercase tracking-widest">•</span>
              <span className="text-white/60 text-[9px] font-bold uppercase tracking-widest">
                {shift.label} {shift.time}
              </span>
            </div>
            <h1 className="text-white font-black text-4xl lg:text-5xl tracking-tight leading-tight mb-2">
              Chào ca làm, <span className="text-blue-200">{user?.name?.split(" ")[0] || "nhân viên"}</span>
            </h1>
            <p className="text-white/60 text-base font-bold max-w-lg leading-relaxed">
              Bạn đã hoàn thành {pct}% tiến độ ca hôm nay ({done}/{total} nhiệm vụ).
            </p>
          </div>
          <div className="flex gap-3">
            <Link 
              href="/staff/reports"
              className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white px-6 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-white hover:text-[#17409A] transition-all group"
            >
              <MdAssignment className="text-xl" />
              Tạo báo cáo
            </Link>
            <Link href="/staff/orders" className="bg-[#4ECDC4] text-[#17409A] px-6 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-white transition-all shadow-lg shadow-[#4ECDC4]/20 flex items-center gap-2">
              <MdShoppingBag className="text-xl" /> Đơn chờ
            </Link>
          </div>
        </div>
      </div>

      {/* ── Key Metrics Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-1">
        {[
          {
            href: "/staff/orders",
            icon: MdShoppingBag,
            label: "Đóng gói",
            value: tasks.filter((t) => t.type === "pack" && t.status !== "done").length.toString(),
            unit: "việc",
            color: "#17409A",
          },
          {
            href: "/staff/orders",
            icon: MdCheckCircle,
            label: "Kiểm tra",
            value: tasks.filter((t) => t.type === "verify" && t.status !== "done").length.toString(),
            unit: "việc",
            color: "#4ECDC4",
          },
          {
            href: "/staff/reviews",
            icon: MdStar,
            label: "Phản hồi",
            value: tasks.filter((t) => t.type === "review_reply" && t.status !== "done").length.toString(),
            unit: "chưa xử lý",
            color: "#FFD93D",
          },
          {
            href: "/staff",
            icon: MdWarning,
            label: "Khẩn cấp",
            value: urgent.toString(),
            unit: "yêu cầu",
            color: "#FF6B9D",
          },
        ].map((k) => (
          <Link
            key={k.label}
            href={k.href}
            className="dc-reveal group rounded-[40px] p-8 flex flex-col justify-between relative overflow-hidden transition-all duration-500 border border-white hover:border-[#17409A]/10 hover:shadow-2xl hover:-translate-y-1 bg-white shadow-sm shadow-gray-100 cursor-pointer"
          >
            <div className="flex items-center justify-between z-10">
              <p className="text-[#9CA3AF] text-[10px] font-black uppercase tracking-[0.25em]">
                {k.label}
              </p>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#F4F7FF] group-hover:scale-110 transition-transform">
                <k.icon className="text-xl" style={{ color: k.color }} />
              </div>
            </div>
            <div className="mt-6 z-10 flex flex-col">
              <div className="flex items-baseline gap-1.5">
                <span className="text-[#1A1A2E] font-black tracking-tighter text-3xl">
                  {k.value}
                </span>
                <span className="text-[11px] font-black text-[#9CA3AF] uppercase tracking-widest">{k.unit}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* ── Main Dashboard Content ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start px-1">
        <div className="dc-reveal lg:col-span-8 space-y-8">
          {/* Task list container */}
          <div className="bg-white rounded-[48px] p-10 shadow-sm border border-white flex flex-col max-h-[700px] group">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-3">
                <MdDashboard className="text-[#17409A] text-xl" />
                <h3 className="text-[#1A1A2E] font-black text-xl tracking-tight">Danh sách nhiệm vụ</h3>
              </div>
              <span className="bg-[#17409A]/10 text-[#17409A] text-sm font-black px-4 py-2 rounded-xl">
                {done}/{total}
              </span>
            </div>

            <div className="flex flex-col gap-5 overflow-y-auto pr-3 custom-scrollbar">
              {tasks.map((task) => {
                const typeCfg = TASK_TYPE_CFG[task.type];
                const statusCfg = STATUS_CFG[task.status];
                return (
                  <div key={task.id} className="flex items-center gap-5 p-5 rounded-[32px] border border-gray-50 hover:border-[#17409A15] hover:bg-[#F8FAFF] hover:shadow-xl hover:-translate-x-1 transition-all duration-300 shrink-0 group/order">
                    <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center font-black text-base shrink-0 shadow-sm border border-gray-100 transition-colors overflow-hidden relative" style={{ color: typeCfg.color }}>
                      <div className="absolute inset-0 opacity-10" style={{ backgroundColor: typeCfg.color }} />
                      {task.product.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-[#1A1A2E] font-black text-sm truncate tracking-tight ${task.status === "done" ? "line-through opacity-50" : ""}`}>{task.product}</p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="text-[7px] font-black px-2 py-0.5 rounded-full uppercase border" style={{ color: statusCfg.color, borderColor: statusCfg.color }}>
                          {statusCfg.label}
                        </span>
                        <span className="text-gray-300 text-[8px] font-black uppercase tracking-widest">• {task.customer || "Chung"}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                       <button
                         onClick={() => cycleStatus(task.id)}
                         className="shrink-0 text-[10px] font-black px-2.5 py-1 rounded-xl transition-all cursor-pointer hover:scale-105"
                         style={{ color: statusCfg.color, backgroundColor: statusCfg.bg }}
                       >
                         {task.status === "pending" ? "Nhận làm" : task.status === "in_progress" ? "Hoàn thành" : "Hoàn tác"}
                       </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Actionable Side Panel */}
        <div className="dc-reveal lg:col-span-4 space-y-8">
           <div className="bg-white rounded-[48px] p-10 shadow-sm border border-white relative overflow-hidden group">
             <h3 className="text-[#1A1A2E] font-black text-xl tracking-tight mb-10 flex items-center gap-3">
               Tiến độ <span className="w-2 h-2 rounded-full bg-[#4ECDC4] animate-pulse" />
             </h3>
             <div className="space-y-6">
                {[
                  { label: "Hoàn thành", count: done, color: "#4ECDC4" },
                  { label: "Đang làm", count: inProg, color: "#17409A" },
                  { label: "Chờ xử lý", count: pending, color: "#FF8C42" },
                ].map(({ label, count, color }) => {
                  const pctStat = Math.round((count / (total || 1)) * 100);
                  return (
                    <div key={label} className="group/item relative overflow-hidden">
                      <div className="flex items-center justify-between mb-2 px-1">
                        <p className="text-[#1A1A2E] font-black text-[11px] uppercase tracking-wider">{label}</p>
                        <span className="text-[#17409A] font-black text-sm">{count}</span>
                      </div>
                      <div className="h-3 w-full bg-[#F4F7FF] rounded-full overflow-hidden border border-gray-50">
                        <div 
                          className="h-full rounded-full transition-all duration-1000 ease-out shadow-sm" 
                          style={{ width: `${pctStat}%`, backgroundColor: color }} 
                        />
                      </div>
                    </div>
                  );
                })}
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}
