"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  IoArrowBack,
  IoNotificationsOutline,
  IoSearchOutline,
  IoMenuOutline,
} from "react-icons/io5";
import { MdDashboard, MdBarChart, MdSettings } from "react-icons/md";

const TABS = [
  { label: "TỔNG QUAN", href: "/admin", icon: MdDashboard },
  { label: "PHÂN TÍCH", href: "/admin/analytics", icon: MdBarChart },
  { label: "CÀI ĐẶT", href: "/admin/settings", icon: MdSettings },
];

export default function AdminTopBar({ onMenuToggle }: { onMenuToggle?: () => void }) {
  const pathname = usePathname();
  const [hasNotif] = useState(true);

  function isActive(href: string) {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  }

  return (
    /* Cùng nền #17409A với sidebar — liên kết trực quan thành một khối */
    <header className="flex items-center justify-between px-4 md:px-6 py-3.5 bg-[#17409A] sticky top-0 z-30">
      {/* Left: hamburger (mobile) + back (desktop) */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-all md:hidden"
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

      {/* Center: tabs — nền hơi sáng hơn để nổi trên navy */}
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
        {/* <div className="w-px h-6 bg-white/15" /> */}

        {/* Avatar stack */}
        {/* <div className="flex items-center">
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
        </div> */}
      </div>
    </header>
  );
}
