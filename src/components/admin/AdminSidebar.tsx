"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  MdDashboard,
  MdPeople,
  MdBarChart,
  MdSettings,
  MdClose,
  MdLogout,
  MdStar,
  MdInventory2,
  MdGroups,
  MdShoppingBag,
  MdReceipt,
} from "react-icons/md";
import { useAdminPrefs } from "@/contexts/AdminPreferencesContext";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import ExpandableTab from "./ExpandableTab";

const STANDALONE_NAV = [
  { icon: MdDashboard, label: "Tổng quan", href: "/admin" },
];

const EXPANDABLE_SECTIONS = [
  {
    icon: MdShoppingBag,
    label: "Quản lý bán hàng",
    children: [
      { label: "Đơn hàng", href: "/admin/orders" },
      { label: "Khách hàng", href: "/admin/customers" },
      { label: "Mã giảm giá", href: "/admin/promotions" },
      { label: "Nhân viên", href: "/admin/staff" },
    ],
  },
  {
    icon: MdInventory2,
    label: "Danh mục sản phẩm",
    children: [
      { label: "Sản phẩm", href: "/admin/products" },
      { label: "Phụ kiện", href: "/admin/accessories" },
      { label: "Kho hàng", href: "/admin/inventory" },
      { label: "Thuộc tính", href: "/admin/attributes" },
      // { label: "Nhóm tùy chỉnh", href: "/admin/personalization-groups" },
    ],
  },
  {
    icon: MdBarChart,
    label: "Phân tích & Báo cáo",
    children: [
      { label: "Báo cáo doanh thu", href: "/admin/reports" },
      { label: "Bảng lương", href: "/admin/payroll" },
      { label: "Thống kê", href: "/admin/analytics" },
      { label: "Đánh giá", href: "/admin/reviews" },
    ],
  },
];

interface AdminSidebarProps {
  open?: boolean;
  onClose?: () => void;
}

export default function AdminSidebar({
  open = false,
  onClose,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const { accent } = useAdminPrefs();
  const { logout, user } = useAuth();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  // Close dropdowns when pathname changes (user navigated)
  useEffect(() => {
    setExpandedSection(null);
  }, [pathname]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setExpandedSection(null);
      }
    };

    if (expandedSection) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [expandedSection]);

  const handleLogout = () => {
    logout();
    router.push("/auth");
  };

  const handleTabClick = () => {
    onClose?.();
  };

  return (
    <aside
      ref={dropdownRef}
      className={`w-18 min-h-screen flex flex-col items-center py-6 fixed left-0 top-0 z-40 transition-transform duration-300 ease-in-out ${
        open ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0`}
      style={{ backgroundColor: accent }}
    >
      {/* Close button — mobile only */}
      <button
        onClick={onClose}
        className="absolute top-3 right-2 w-7 h-7 rounded-lg bg-white/15 hover:bg-white/25 flex items-center justify-center text-white/60 hover:text-white transition-colors md:hidden"
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
        <Image
          src="/logo.webp"
          alt="Design a Bear"
          width={36}
          height={36}
          className="object-contain"
        />
      </Link>

      {/* Nav */}
      <nav className="flex flex-col gap-2 flex-1 items-center">
        {/* Standalone nav items */}
        {STANDALONE_NAV.map(({ icon: Icon, label, href }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              title={label}
              onClick={handleTabClick}
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

        {/* Expandable sections */}
        {EXPANDABLE_SECTIONS.map((section) => (
          <ExpandableTab
            key={section.label}
            icon={section.icon}
            label={section.label}
            children={section.children}
            isOpen={expandedSection === section.label}
            onToggle={(open) => {
              setExpandedSection(open ? section.label : null);
            }}
            onItemClick={handleTabClick}
          />
        ))}
      </nav>

      {/* Divider */}
      <div className="w-8 h-px bg-white/20 mb-4" />

      {/* Settings */}
      <Link
        href="/admin/settings"
        title="Cài đặt"
        onClick={handleTabClick}
        className={`group relative w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-200 ${
          pathname === "/admin/settings"
            ? "bg-white shadow-lg shadow-white/20"
            : "text-white/40 hover:bg-white/15 hover:text-white"
        }`}
      >
        <MdSettings
          className={`text-xl ${pathname === "/admin/settings" ? "text-[#17409A]" : ""}`}
        />
        <span className="pointer-events-none absolute left-[calc(100%+14px)] top-1/2 -translate-y-1/2 bg-[#0E2A66] text-white text-xs px-3 py-1.5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl z-50">
          Cài đặt
        </span>
      </Link>

      {/* Logout */}
      <button
        onClick={handleLogout}
        title="Đăng xuất"
        className="group relative w-11 h-11 rounded-2xl flex items-center justify-center text-white/40 hover:bg-[#FF6B9D]/20 hover:text-[#FF6B9D] transition-all duration-200 mt-2"
      >
        <MdLogout className="text-xl" />
        <span className="pointer-events-none absolute left-[calc(100%+14px)] top-1/2 -translate-y-1/2 bg-[#0E2A66] text-white text-xs px-3 py-1.5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl z-50">
          Đăng xuất
        </span>
      </button>

      {/* User avatar (bottom) */}
      <div className="w-10 h-10 rounded-2xl bg-white/20 border-2 border-white/30 flex items-center justify-center text-white font-black text-sm mt-4 cursor-pointer hover:bg-white/30 transition-colors">
        {user?.name?.[0]?.toUpperCase() ?? "A"}
      </div>
    </aside>
  );
}
