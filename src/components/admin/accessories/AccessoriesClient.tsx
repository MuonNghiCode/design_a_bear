"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import AccessoriesGrid from "@/components/admin/accessories/AccessoriesGrid";

export default function AccessoriesClient() {
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
            Quản lý linh kiện và phụ kiện · Tháng 3 / 2026
          </p>
        </div>
      </div>

      {/* Full-width accessories grid/table */}
      <div className="ac">
        <AccessoriesGrid />
      </div>
    </div>
  );
}
