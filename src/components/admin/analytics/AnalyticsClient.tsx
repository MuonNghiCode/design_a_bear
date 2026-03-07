"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import AnalyticsKPIs from "@/components/admin/analytics/AnalyticsKPIs";
import RevenueComparison from "@/components/admin/analytics/RevenueComparison";
import ProductMix from "@/components/admin/analytics/ProductMix";
import CustomerSegments from "@/components/admin/analytics/CustomerSegments";
import TrafficChannels from "@/components/admin/analytics/TrafficChannels";
import GeoDistribution from "@/components/admin/analytics/GeoDistribution";
import HourlyHeatmap from "@/components/admin/analytics/HourlyHeatmap";

export default function AnalyticsClient() {
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
      <div className="ac">
        <h1 className="text-[#1A1A2E] font-black text-2xl">Phân tích</h1>
        <p className="text-[#9CA3AF] text-sm font-semibold">
          Tổng quan dữ liệu 6 tháng gần nhất
        </p>
      </div>

      {/* Row 1 — KPI strip */}
      <div className="ac">
        <AnalyticsKPIs />
      </div>

      {/* Row 2 — Revenue chart + Product mix */}
      <div className="ac grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 min-h-72">
          <RevenueComparison />
        </div>
        <div className="min-h-72">
          <ProductMix />
        </div>
      </div>

      {/* Row 3 — Customer segments + Traffic channels + Geo */}
      <div className="ac grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="min-h-64">
          <CustomerSegments />
        </div>
        <div className="min-h-64">
          <TrafficChannels />
        </div>
        <div className="min-h-64">
          <GeoDistribution />
        </div>
      </div>

      {/* Row 4 — Heatmap statement piece */}
      <div className="ac">
        <HourlyHeatmap />
      </div>
    </div>
  );
}
