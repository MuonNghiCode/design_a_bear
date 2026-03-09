"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  MdDashboard,
  MdShoppingBag,
  MdStar,
  MdAssignment,
  MdClose,
  MdLogout,
} from "react-icons/md";
import { GiPawPrint } from "react-icons/gi";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

const ACCENT = "#17409A";

const NAV = [
  { icon: MdDashboard,  label: "Tổng quan",  href: "/staff" },
  { icon: MdShoppingBag, label: "Đơn hàng",  href: "/staff/orders" },
  { icon: MdStar,       label: "Đánh giá",   href: "/staff/reviews" },
  { icon: MdAssignment, label: "Báo cáo",    href: "/staff/reports" },
];

interface Props {
  open?: boolean;
  onClose?: () => void;
}

export default function StaffSidebar({ open = false, onClose }: Props) {
  const pathname = usePathname();
  const { logout, user } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/auth");
  };

  return (
    <aside
      className={`w-18 min-h-screen flex flex-col items-center py-6 fixed left-0 top-0 z-40 transition-transform duration-300 ease-in-out ${
        open ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0`}
      style={{ backgroundColor: ACCENT }}
    >
      {/* Close — mobile */}
      <button
        onClick={onClose}
        className="absolute top-3 right-2 w-7 h-7 rounded-lg bg-white/15 hover:bg-white/25 flex items-center justify-center text-white/60 hover:text-white transition-colors md:hidden cursor-pointer"
        aria-label="Đóng menu"
      >
        <MdClose className="text-base" />
      </button>

      {/* Logo */}
      <Link
        href="/"
        className="w-11 h-11 rounded-2xl bg-white/15 flex items-center justify-center mb-8 hover:bg-white/25 transition-colors overflow-hidden"
        title="Về trang chủ"
      >
        <Image src="/logo.webp" alt="Design a Bear" width={36} height={36} className="object-contain" />
      </Link>

      {/* Nav */}
      <nav className="flex flex-col gap-2 flex-1 items-center">
        {NAV.map(({ icon: Icon, label, href }) => {
          const active = pathname === href || (href !== "/staff" && pathname.startsWith(href));
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
              <span className="pointer-events-none absolute left-[calc(100%+14px)] top-1/2 -translate-y-1/2 bg-[#0E2A66] text-white text-xs px-3 py-1.5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl z-50">
                {label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Divider */}
      <div className="w-8 h-px bg-white/20 mb-4" />

      {/* Logout */}
      <button
        onClick={handleLogout}
        title="Đăng xuất"
        className="group relative w-11 h-11 rounded-2xl flex items-center justify-center text-white/40 hover:bg-[#FF6B9D]/20 hover:text-[#FF6B9D] transition-all duration-200 cursor-pointer"
      >
        <MdLogout className="text-xl" />
        <span className="pointer-events-none absolute left-[calc(100%+14px)] top-1/2 -translate-y-1/2 bg-[#0E2A66] text-white text-xs px-3 py-1.5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl z-50">
          Đăng xuất
        </span>
      </button>

      {/* Avatar */}
      <div
        className="w-10 h-10 rounded-2xl bg-white/20 border-2 border-white/30 flex items-center justify-center text-white font-black text-sm mt-4 cursor-default"
        title={user?.name ?? "Staff"}
      >
        {user?.name?.[0]?.toUpperCase() ?? "S"}
      </div>
    </aside>
  );
}
