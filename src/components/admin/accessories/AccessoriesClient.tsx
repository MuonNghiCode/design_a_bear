"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { MdAdd } from "react-icons/md";
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
        <button 
          onClick={() => router.push("/admin/accessories/add")}
          className="flex items-center gap-2 bg-[#17409A] text-white text-xs font-black px-4 py-2.5 rounded-xl hover:bg-[#0f2d70] transition-colors shadow-lg shadow-[#17409A]/20"
        >
          + Thêm phụ kiện mới
        </button>
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
