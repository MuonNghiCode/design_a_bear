"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import {
  MdGroups,
  MdAssignment,
  MdSchedule,
  MdTaskAlt,
  MdManageAccounts,
} from "react-icons/md";
import StaffManageHero from "./StaffManageHero";
import AdminStaffReports from "./AdminStaffReports";
import ShiftScheduler from "./ShiftScheduler";
import TaskAssigner from "./TaskAssigner";
import StaffAccountManager from "./StaffAccountManager";

type Tab = "reports" | "schedule" | "tasks" | "accounts";

const TABS: { key: Tab; label: string; Icon: typeof MdAssignment }[] = [
  { key: "reports", label: "Báo cáo", Icon: MdAssignment },
  { key: "schedule", label: "Lịch ca", Icon: MdSchedule },
  { key: "tasks", label: "Nhiệm vụ", Icon: MdTaskAlt },
  { key: "accounts", label: "Tài khoản", Icon: MdManageAccounts },
];

export default function StaffManageClient() {
  const ref = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<Tab>("reports");

  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".ac", {
        opacity: 0,
        y: 22,
        duration: 0.5,
        stagger: 0.07,
        ease: "power2.out",
        clearProps: "all",
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className="space-y-5">
      {/* Page title */}
      <div className="ac flex items-end justify-between flex-wrap gap-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <MdGroups style={{ color: "#17409A", fontSize: 26 }} />
            <h1
              className="text-[#1A1A2E] font-black text-2xl leading-tight"
              style={{ fontFamily: "'Nunito', sans-serif" }}
            >
              Nhân viên
            </h1>
          </div>
          <p className="text-[#9CA3AF] text-sm font-semibold">
            Quản lý ca làm việc, nhiệm vụ và xét duyệt báo cáo · Tháng 3 / 2026
          </p>
        </div>
      </div>

      {/* Hero */}
      <div className="ac">
        <StaffManageHero />
      </div>

      {/* Tab navigator */}
      <div className="ac bg-white rounded-3xl shadow-sm border border-[#F4F7FF] p-1.5 flex gap-1.5">
        {TABS.map(({ key, label, Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-2xl text-sm font-black transition-all cursor-pointer ${
              activeTab === key
                ? "bg-[#17409A] text-white shadow-md shadow-[#17409A]/20"
                : "text-[#9CA3AF] hover:text-[#1A1A2E] hover:bg-[#F4F7FF]"
            }`}
          >
            <Icon className="text-base" />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* Active panel */}
      <div className="ac">
        {activeTab === "reports" && <AdminStaffReports />}
        {activeTab === "schedule" && <ShiftScheduler />}
        {activeTab === "tasks" && <TaskAssigner />}
        {activeTab === "accounts" && <StaffAccountManager />}
      </div>
    </div>
  );
}
