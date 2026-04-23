"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  IoArrowBack,
  IoNotificationsOutline,
  IoMenuOutline,
} from "react-icons/io5";
import { MdDashboard, MdList, MdAssignmentInd } from "react-icons/md";
import { GiHammerBreak } from "react-icons/gi";
import { useAuth } from "@/contexts/AuthContext";

const ACCENT = "#17409A";

const TABS = [
  { label: "TỔNG QUAN", href: "/craftsman", icon: MdDashboard },
  { label: "SẢNH VIỆC", href: "/craftsman/lobby", icon: MdList },
  { label: "VIỆC CỦA TÔI", href: "/craftsman/jobs", icon: MdAssignmentInd },
];

export default function CraftsmanTopBar({
  onMenuToggle,
}: {
  onMenuToggle?: () => void;
}) {
  const pathname = usePathname();
  const [hasNotif] = useState(false);
  const { user } = useAuth();

  function isActive(href: string) {
    if (href === "/craftsman") return pathname === "/craftsman";
    return pathname.startsWith(href);
  }

  return (
    <header
      className="flex items-center justify-between px-4 md:px-6 py-3.5 sticky top-0 z-30"
      style={{ backgroundColor: ACCENT }}
    >
      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-all md:hidden cursor-pointer"
          aria-label="Mở menu"
        >
          <IoMenuOutline className="text-xl" />
        </button>
        <Link
          href="/"
          className="hidden md:flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm font-bold tracking-wide"
        >
          <IoArrowBack className="text-base" />
          Trang chủ
        </Link>
      </div>

      {/* Center tabs */}
      <div className="flex items-center gap-0.5 bg-white/10 rounded-2xl p-1">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const active = isActive(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 rounded-xl text-xs font-black tracking-[0.12em] transition-all duration-200 ${
                active
                  ? "bg-white text-[#17409A] shadow-sm"
                  : "text-white/55 hover:text-white hover:bg-white/10"
              }`}
            >
              <Icon className="text-sm shrink-0" />
              <span className="hidden sm:inline">{tab.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Right */}
      <div className="flex items-center gap-2.5">
        {/* Craftsman badge */}
        <div className="hidden sm:flex items-center gap-2 bg-white/10 rounded-xl px-3 py-1.5">
          <GiHammerBreak className="text-white/60 text-sm" />
          <span className="text-white/70 text-xs font-bold">
            {user?.name ?? "Thợ thủ công"}
          </span>
        </div>

        <button className="relative w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/60 hover:text-white transition-all cursor-pointer">
          <IoNotificationsOutline className="text-lg" />
          {hasNotif && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#FF6B9D] rounded-full ring-2 ring-[#17409A]" />
          )}
        </button>
      </div>
    </header>
  );
}
