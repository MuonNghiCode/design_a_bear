"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MdDashboard,
  MdShoppingBag,
  MdPeople,
  MdBarChart,
  MdSettings,
} from "react-icons/md";
import { GiBearFace } from "react-icons/gi";

const NAV = [
  { icon: MdDashboard, label: "Tổng quan", href: "/admin" },
  { icon: MdShoppingBag, label: "Đơn hàng", href: "/admin/orders" },
  { icon: GiBearFace, label: "Sản phẩm", href: "/admin/products" },
  { icon: MdPeople, label: "Khách hàng", href: "/admin/customers" },
  { icon: MdBarChart, label: "Thống kê", href: "/admin/analytics" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-18 min-h-screen bg-[#17409A] flex flex-col items-center py-6 fixed left-0 top-0 z-40">
      {/* Logo */}
      <Link
        href="/"
        className="w-11 h-11 rounded-2xl bg-white/15 flex items-center justify-center mb-8 hover:bg-white/25 transition-colors"
        title="Về trang chủ"
      >
        <GiBearFace className="text-white text-2xl" />
      </Link>

      {/* Nav */}
      <nav className="flex flex-col gap-2 flex-1 items-center">
        {NAV.map(({ icon: Icon, label, href }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              title={label}
              className={`group relative w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-200 ${
                active
                  ? "bg-white shadow-lg shadow-white/20"
                  : "text-white/50 hover:bg-white/15 hover:text-white"
              }`}
            >
              <Icon className={`text-xl ${active ? "text-[#17409A]" : ""}`} />
              {/* Tooltip */}
              <span className="pointer-events-none absolute left-[calc(100%+14px)] top-1/2 -translate-y-1/2 bg-[#0E2A66] text-white text-xs px-3 py-1.5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl z-50">
                {label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Divider */}
      <div className="w-8 h-px bg-white/20 mb-4" />

      {/* Settings */}
      <Link
        href="/admin/settings"
        title="Cài đặt"
        className="group relative w-11 h-11 rounded-2xl text-white/40 hover:bg-white/15 hover:text-white flex items-center justify-center transition-all duration-200"
      >
        <MdSettings className="text-xl" />
        <span className="pointer-events-none absolute left-[calc(100%+14px)] top-1/2 -translate-y-1/2 bg-[#0E2A66] text-white text-xs px-3 py-1.5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl z-50">
          Cài đặt
        </span>
      </Link>

      {/* User avatar (bottom) */}
      <div className="w-10 h-10 rounded-2xl bg-white/20 border-2 border-white/30 flex items-center justify-center text-white font-black text-sm mt-4 cursor-pointer hover:bg-white/30 transition-colors">
        A
      </div>
    </aside>
  );
}
