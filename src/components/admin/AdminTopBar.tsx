"use client";

import Link from "next/link";
import { useState } from "react";
import {
  IoArrowBack,
  IoNotificationsOutline,
  IoSearchOutline,
} from "react-icons/io5";
import { MdDashboard, MdBarChart, MdSettings } from "react-icons/md";

const TABS = [
  { label: "TỔNG QUAN", key: "dashboard", icon: MdDashboard },
  { label: "PHÂN TÍCH", key: "insights", icon: MdBarChart },
  { label: "CÀI ĐẶT", key: "settings", icon: MdSettings },
];

const ADMINS = [
  { initial: "H", color: "#4ECDC4" },
  { initial: "M", color: "#7C5CFC" },
  { initial: "A", color: "#FF8C42" },
];

interface AdminTopBarProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export default function AdminTopBar({
  activeTab = "dashboard",
  onTabChange,
}: AdminTopBarProps) {
  const [hasNotif] = useState(true);

  return (
    /* Cùng nền #17409A với sidebar — liên kết trực quan thành một khối */
    <header className="flex items-center justify-between px-6 py-3.5 bg-[#17409A] sticky top-0 z-30">
      {/* Left: back */}
      <Link
        href="/"
        className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm font-bold tracking-wide"
      >
        <IoArrowBack className="text-base" />
        Trang chủ
      </Link>

      {/* Center: tabs — nền hơi sáng hơn để nổi trên navy */}
      <div className="flex items-center gap-0.5 bg-white/10 rounded-2xl p-1">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => onTabChange?.(tab.key)}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-black tracking-[0.12em] transition-all duration-200 ${
                activeTab === tab.key
                  ? "bg-white text-[#17409A] shadow-sm"
                  : "text-white/55 hover:text-white hover:bg-white/10"
              }`}
            >
              <Icon className="text-sm" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Right: search + notif + avatars */}
      <div className="flex items-center gap-2.5">
        <button className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/60 hover:text-white transition-all">
          <IoSearchOutline className="text-lg" />
        </button>

        <button className="relative w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/60 hover:text-white transition-all">
          <IoNotificationsOutline className="text-lg" />
          {hasNotif && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#FF6B9D] rounded-full ring-2 ring-[#17409A]" />
          )}
        </button>

        {/* Divider */}
        <div className="w-px h-6 bg-white/15" />

        {/* Avatar stack */}
        <div className="flex items-center">
          {ADMINS.map((a, i) => (
            <div
              key={i}
              className="w-8 h-8 rounded-full border-2 border-[#17409A] flex items-center justify-center text-white text-xs font-black"
              style={{
                backgroundColor: a.color,
                marginLeft: i === 0 ? 0 : -8,
                zIndex: ADMINS.length - i,
              }}
            >
              {a.initial}
            </div>
          ))}
          <span className="ml-2.5 text-xs text-white/50 font-bold">
            3 admins
          </span>
        </div>
      </div>
    </header>
  );
}
