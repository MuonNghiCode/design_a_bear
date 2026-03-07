"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import OrdersHero from "@/components/admin/orders/OrdersHero";
import OrdersPipeline from "@/components/admin/orders/OrdersPipeline";
import OrdersTable from "@/components/admin/orders/OrdersTable";

export default function OrdersClient() {
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
            Đơn hàng
          </h1>
          <p className="text-[#9CA3AF] text-sm font-semibold">
            Quản lý toàn bộ đơn hàng · Tháng 3 / 2026
          </p>
        </div>
        <button className="flex items-center gap-2 bg-[#17409A] text-white text-xs font-black px-4 py-2.5 rounded-xl hover:bg-[#0f2d70] transition-colors">
          + Tạo đơn mới
        </button>
      </div>

      {/* Hero (left 3/5) + Pipeline (right 2/5) */}
      <div className="ac grid grid-cols-1 lg:grid-cols-5 gap-5">
        <div className="lg:col-span-3">
          <OrdersHero />
        </div>
        <div className="lg:col-span-2">
          <OrdersPipeline />
        </div>
      </div>

      {/* Full-width orders table */}
      <div className="ac">
        <OrdersTable />
      </div>
    </div>
  );
}
