"use client";

import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopBar from "@/components/admin/AdminTopBar";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div
      className="h-screen bg-[#17409A] flex overflow-hidden"
      style={{ fontFamily: "'Nunito', sans-serif" }}
    >
      {/* Sidebar — liền màu với bg ngoài (#17409A) */}
      <AdminSidebar />

      {/* Right panel — chiếm toàn bộ chiều cao, không scroll */}
      <div className="flex-1 ml-18 flex flex-col h-screen overflow-hidden">
        {/* TopBar — cùng nền #17409A, tạo khối thống nhất với sidebar */}
        <AdminTopBar />

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
