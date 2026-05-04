"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import StaffSidebar from "@/components/staff/StaffSidebar";
import StaffTopBar from "@/components/staff/StaffTopBar";
import { useAuth } from "@/contexts/AuthContext";
import { useAdminPrefs } from "@/contexts/AdminPreferencesContext";

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { accent, density } = useAdminPrefs();
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!isAuthenticated || user?.role !== "staff")) {
      router.replace("/auth");
    }
  }, [isAuthenticated, user, loading, router]);

  if (loading || !isAuthenticated || user?.role !== "staff") {
    return null;
  }

  const contentPadding =
    density === "compact"
      ? "p-3 md:p-4"
      : density === "comfortable"
        ? "p-6 md:p-9"
        : "p-5 md:p-7";

  return (
    <div
      className="h-screen flex overflow-hidden"
      style={{ fontFamily: "'Nunito', sans-serif", backgroundColor: accent }}
    >
      {/* Sidebar */}
      <StaffSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Right panel */}
      <div className="flex-1 md:ml-18 flex flex-col h-screen overflow-hidden">
        <StaffTopBar onMenuToggle={() => setSidebarOpen((v) => !v)} />

        <div className="flex-1 p-4 overflow-hidden">
          <div
            className={`bg-[#F4F7FF] rounded-3xl h-full overflow-y-auto ${contentPadding}`}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
