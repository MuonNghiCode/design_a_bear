"use client";

import { useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopBar from "@/components/admin/AdminTopBar";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div
      className="h-screen bg-[#17409A] flex overflow-hidden"
      style={{ fontFamily: "'Nunito', sans-serif" }}
    >
      {/* Sidebar */}
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Right panel — chiếm toàn bộ chiều cao, không scroll */}
      <div className="flex-1 md:ml-18 flex flex-col h-screen overflow-hidden">
        {/* TopBar — cùng nền #17409A, tạo khối thống nhất với sidebar */}
        <AdminTopBar onMenuToggle={() => setSidebarOpen((v) => !v)} />

        {/* Content frame — sát phải, bo tròn trái, không có padding phải */}
        <div className="flex-1 p-4 overflow-hidden">
          <div className="bg-[#F4F7FF] rounded-3xl h-full overflow-y-auto p-5 md:p-7">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
