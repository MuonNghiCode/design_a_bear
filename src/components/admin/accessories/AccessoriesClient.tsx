"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { MdAdd, MdRefresh } from "react-icons/md";
import AccessoriesGrid from "@/components/admin/accessories/AccessoriesGrid";
import AccessoriesHero from "@/components/admin/accessories/AccessoriesHero";
import AccessoriesTopStats from "@/components/admin/accessories/AccessoriesTopStats";

export default function AccessoriesClient() {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".ac",
        { opacity: 0, y: 18 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power2.out",
          stagger: 0.07,
          clearProps: "all",
        },
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className="space-y-5">
      {/* Page title */}
      <div className="ac flex items-end justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-[#1A1A2E] font-black text-2xl leading-tight">
            Phụ kiện
          </h1>
          <p className="text-[#9CA3AF] text-sm font-semibold">
            Quản lý linh kiện và kho hàng · Tháng 3 / 2026
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 bg-white text-[#17409A] text-[13px] font-black px-6 py-3 rounded-2xl border border-[#F4F7FF] shadow-sm hover:bg-gray-50 transition-all active:scale-95"
          >
            <MdRefresh className="text-xl" />
            Làm mới dữ liệu
          </button>
        </div>
      </div>

      {/* Hero + Stats section */}
      <div className="ac grid grid-cols-1 lg:grid-cols-5 gap-5">
        <div className="lg:col-span-3">
          <AccessoriesHero />
        </div>
        <div className="lg:col-span-2">
          <AccessoriesTopStats />
        </div>
      </div>

      {/* Full-width accessories grid/table */}
      <div className="ac">
        <AccessoriesGrid />
      </div>
    </div>
  );
}
