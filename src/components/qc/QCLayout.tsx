"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import QCSidebar from "./QCSidebar";
import QCTopBar from "./QCTopBar";
import { useAuth } from "@/contexts/AuthContext";

export default function QCLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (
      !loading &&
      (!isAuthenticated || user?.role !== "quality_control")
    ) {
      router.replace("/auth");
    }
  }, [isAuthenticated, user, loading, router]);

  if (
    loading ||
    !isAuthenticated ||
    user?.role !== "quality_control"
  ) {
    return null;
  }

  return (
    <div
      className="h-screen flex overflow-hidden"
      style={{ fontFamily: "'Nunito', sans-serif", backgroundColor: "#17409A" }}
    >
      {/* Sidebar */}
      <QCSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Right panel */}
      <div className="flex-1 md:ml-18 flex flex-col h-screen overflow-hidden">
        <QCTopBar onOpenSidebar={() => setSidebarOpen(true)} />

        <div className="flex-1 p-4 overflow-hidden">
          <div className="bg-[#F4F7FF] rounded-3xl h-full overflow-y-auto p-5 md:p-7">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
