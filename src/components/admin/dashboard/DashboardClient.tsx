"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import StatsHeroCard from "@/components/admin/dashboard/StatsHeroCard";
import ConversionCard from "@/components/admin/dashboard/ConversionCard";
import SalesChart from "@/components/admin/dashboard/SalesChart";
import TopProductsList from "@/components/admin/dashboard/TopProductsList";
import RecentOrders from "@/components/admin/dashboard/RecentOrders";
import { QUICK_STATS } from "@/data/admin";

export default function DashboardClient() {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current) return;
    const cards = contentRef.current.querySelectorAll<HTMLElement>(".ac");
    gsap.fromTo(
      cards,
      { y: 24, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, stagger: 0.07, ease: "power2.out" },
    );
  }, []);

  return (
    <div ref={contentRef}>
      {/* Quick stats strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {QUICK_STATS.map((s) => (
          <div
            key={s.label}
            className="ac bg-white rounded-2xl px-5 py-4 flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow cursor-default"
          >
            <div
              className="w-2.5 h-10 rounded-full shrink-0"
              style={{ backgroundColor: s.accent }}
            />
            <div className="min-w-0">
              <p className="text-[#9CA3AF] text-[10px] font-black tracking-wider uppercase truncate">
                {s.label}
              </p>
              <div className="flex items-baseline gap-1">
                <span className="text-[#1A1A2E] font-black text-xl leading-tight">
                  {s.value}
                </span>
                <span className="text-[#9CA3AF] text-[11px] font-semibold">
                  {s.unit}
                </span>
              </div>
              <span
                className="text-[11px] font-black"
                style={{ color: s.up ? "#4ECDC4" : "#FF6B9D" }}
              >
                {s.up ? "↑" : "↓"} {s.trend}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Main row: hero (2/3) + conversion (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
        <div className="ac lg:col-span-2">
          <StatsHeroCard />
        </div>
        <div className="ac">
          <ConversionCard />
        </div>
      </div>

      {/* Bottom row: chart + products + orders */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <div className="ac">
          <SalesChart />
        </div>
        <div className="ac">
          <TopProductsList />
        </div>
        <div className="ac">
          <RecentOrders />
        </div>
      </div>
    </div>
  );
}
