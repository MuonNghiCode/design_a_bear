"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import gsap from "gsap";
import { useAdminReportsApi, useDashboardData } from "@/hooks";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import RevenueComparison from "@/components/admin/analytics/RevenueComparison";
import { MdBarChart, MdShowChart, MdPieChart, MdTrendingUp, MdPeople, MdGroups } from "react-icons/md";

// -- KPI card -----------------------------------------------------------------
interface KpiCardProps {
  label: string;
  value: string | number;
  unit: string;
  accent: string;
  primary?: boolean;
  subtitle?: string;
}

function KpiCard({ label, value, unit, accent, primary, subtitle }: KpiCardProps) {
  return (
    <div
      className={`ac-card rounded-[32px] p-8 flex flex-col justify-between min-h-[140px] relative overflow-hidden shadow-sm border border-[#F0F0F8] transition-all duration-300 hover:shadow-xl ${primary ? "bg-[#17409A] text-white" : "bg-white text-[#1A1A2E]"}`}
    >
      <div className="relative z-10">
        <p className={`text-[10px] font-black tracking-[0.25em] uppercase ${primary ? "text-white/60" : "text-[#9CA3AF]"}`}>
          {label}
        </p>
      </div>
      <div className="mt-4 relative z-10">
        <div className="flex items-baseline gap-1">
          <span className={`font-black tracking-tight ${primary ? "text-4xl" : "text-3xl"}`}>
            {typeof value === "number" ? value.toLocaleString("vi-VN") : value}
          </span>
          <span className={`text-xs font-bold ${primary ? "text-white/50" : "text-[#9CA3AF]"}`}>
            {unit}
          </span>
        </div>
        {subtitle && (
          <p className={`text-[11px] font-bold mt-1 ${primary ? "text-white/40" : "text-[#9CA3AF]"}`}>
            {subtitle}
          </p>
        )}
      </div>
      {/* Decorative accent */}
      {!primary && (
        <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: accent }} />
      )}
    </div>
  );
}

// -- Main Component -----------------------------------------------------------
export default function AnalyticsClient() {
  const ref = useRef<HTMLDivElement>(null);
  const { loading: revLoading, revenueData, fetchRevenueReport } = useAdminReportsApi();
  const { loading: dashLoading, stats, fetch: fetchDash } = useDashboardData();

  const [dateRange] = useState({
    startDate: format(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), "yyyy-MM-dd"),
    endDate: format(new Date(), "yyyy-MM-dd"),
  });

  useEffect(() => {
    fetchRevenueReport({
      startDate: new Date(dateRange.startDate + "T00:00:00Z").toISOString(),
      endDate: new Date(dateRange.endDate + "T23:59:59Z").toISOString(),
    });
    fetchDash();
  }, [fetchRevenueReport, fetchDash, dateRange]);

  useEffect(() => {
    if (!ref.current || revLoading) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".ac-card",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power2.out", clearProps: "all" }
      );
    }, ref);
    return () => ctx.revert();
  }, [revLoading]);

  const loading = revLoading || dashLoading;

  const chartData = useMemo(() => {
    if (!revenueData?.dailyBreakdown?.length) return [];
    return revenueData.dailyBreakdown.map((d) => d.revenue);
  }, [revenueData]);

  const chartLabels = useMemo(() => {
    if (!revenueData?.dailyBreakdown?.length) return [];
    return revenueData.dailyBreakdown.map((d) =>
      format(new Date(d.date), "dd/MM", { locale: vi })
    );
  }, [revenueData]);

  const avgOrderValue =
    (revenueData?.totalOrders ?? 0) > 0
      ? Math.round((revenueData?.totalRevenue ?? 0) / (revenueData?.totalOrders ?? 1))
      : 0;

  const kpis: KpiCardProps[] = [
    {
      label: "Doanh thu tổng",
      value: (revenueData?.totalRevenue ?? 0).toLocaleString("vi-VN"),
      unit: "VND",
      accent: "#17409A",
      primary: true,
      subtitle: "Trong 30 ngày qua",
    },
    {
      label: "Lượng đơn hàng",
      value: revenueData?.totalOrders ?? 0,
      unit: "đơn",
      accent: "#7C5CFC",
    },
    {
      label: "Giá trị đơn TB",
      value: avgOrderValue.toLocaleString("vi-VN"),
      unit: "VND",
      accent: "#4ECDC4",
    },
    {
      label: "Lợi nhuận ước tính",
      value: (revenueData?.totalProfit ?? 0).toLocaleString("vi-VN"),
      unit: "VND",
      accent: "#FF8C42",
      subtitle: "Biên lợi nhuận 30%",
    },
  ];

  return (
    <div ref={ref} className="flex flex-col gap-8 pb-12" style={{ fontFamily: "var(--font-nunito), Nunito, sans-serif" }}>
      {/* Header */}
      <div className="ac-card">
        <h1 className="text-[#1A1A2E] font-black text-3xl tracking-tight">Phân Tích Dữ Liệu</h1>
        <p className="text-[#9CA3AF] text-sm font-bold mt-1">
          Báo cáo hiệu suất kinh doanh và hành vi người dùng thực tế
        </p>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-[32px] min-h-[140px] animate-pulse bg-[#F4F7FF] border border-[#F0F0F8]" />
            ))
          : kpis.map((k) => <KpiCard key={k.label} {...k} />)}
      </div>

      {/* Main Chart Card */}
      <div className="ac-card bg-white rounded-[40px] p-10 shadow-sm border border-[#F0F0F8]">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-2xl bg-[#17409A10] text-[#17409A] flex items-center justify-center">
            <MdShowChart className="text-xl" />
          </div>
          <div>
            <h3 className="text-[#1A1A2E] font-black text-xl tracking-tight">Biểu đồ tăng trưởng</h3>
            <p className="text-[#9CA3AF] text-[10px] font-black uppercase tracking-widest">Biến động doanh thu hàng ngày</p>
          </div>
        </div>
        
        <div className="h-[500px]">
          {loading ? (
            <div className="h-full rounded-3xl bg-[#F4F7FF] animate-pulse" />
          ) : (
            <RevenueComparison
              data={chartData}
              labels={chartLabels}
              title=""
              subtitle=""
              thisYearLabel="Doanh thu thực tế"
            />
          )}
        </div>
      </div>

      {/* Grid for distribution tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Days by Revenue */}
        <div className="ac-card bg-white rounded-[40px] p-10 shadow-sm border border-[#F0F0F8]">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-2xl bg-[#7C5CFC10] text-[#7C5CFC] flex items-center justify-center">
              <MdBarChart className="text-xl" />
            </div>
            <h3 className="text-[#1A1A2E] font-black text-xl tracking-tight">Ngày cao điểm</h3>
          </div>
          
          <div className="space-y-4">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-10 bg-[#F4F7FF] rounded-2xl animate-pulse" />
              ))
            ) : !revenueData?.dailyBreakdown?.length ? (
              <p className="text-center text-[#9CA3AF] font-bold italic py-10">Không có dữ liệu</p>
            ) : (
              [...revenueData.dailyBreakdown]
                .sort((a, b) => b.revenue - a.revenue)
                .slice(0, 6)
                .map((d) => {
                  const maxRev = Math.max(...revenueData.dailyBreakdown.map((x) => x.revenue));
                  const pct = maxRev > 0 ? (d.revenue / maxRev) * 100 : 0;
                  return (
                    <div key={d.date} className="group">
                      <div className="flex items-center justify-between mb-1.5 px-1">
                        <span className="text-[#6B7280] text-xs font-black uppercase tracking-widest">
                          {format(new Date(d.date), "dd MMMM", { locale: vi })}
                        </span>
                        <span className="text-[#1A1A2E] font-black text-sm">
                          {d.revenue.toLocaleString("vi-VN")}đ
                        </span>
                      </div>
                      <div className="h-2 w-full bg-[#F4F7FF] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[#17409A] transition-all duration-1000 ease-out"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })
            )}
          </div>
        </div>

        {/* User Base Breakdown */}
        <div className="ac-card bg-white rounded-[40px] p-10 shadow-sm border border-[#F0F0F8]">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-2xl bg-[#4ECDC410] text-[#4ECDC4] flex items-center justify-center">
              <MdPieChart className="text-xl" />
            </div>
            <h3 className="text-[#1A1A2E] font-black text-xl tracking-tight">Cơ cấu người dùng</h3>
          </div>
          
          <div className="grid gap-6">
            {[
              { label: "Khách hàng", value: stats?.totalCustomers ?? 0, color: "#17409A", icon: MdPeople },
              { label: "Nhân viên", value: stats?.totalStaff ?? 0, color: "#7C5CFC", icon: MdGroups },
              { label: "Tăng trưởng", value: "+12%", color: "#4ECDC4", icon: MdTrendingUp },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between p-6 rounded-3xl bg-[#F8FAFF] border border-[#F0F0F8] hover:shadow-md transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-white shadow-sm" style={{ color: item.color }}>
                    <item.icon className="text-xl" />
                  </div>
                  <div>
                    <p className="text-[#9CA3AF] text-[10px] font-black uppercase tracking-widest">{item.label}</p>
                    <p className="text-[#1A1A2E] font-black text-2xl mt-0.5">{item.value}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-[#9CA3AF] uppercase mb-1">Trạng thái</p>
                  <span className="px-3 py-1 rounded-full bg-white text-[10px] font-black text-[#4ECDC4] border border-[#F0F0F8]">ỔN ĐỊNH</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
