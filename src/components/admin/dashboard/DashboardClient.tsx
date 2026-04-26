"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useDashboardData } from "@/hooks";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import Link from "next/link";
import {
  MdTrendingUp,
  MdShoppingBag,
  MdPeople,
  MdGroups,
  MdArrowForward,
  MdRefresh,
  MdStar,
  MdLocalFireDepartment,
  MdTimeline,
} from "react-icons/md";

// -- Status mapping -----------------------------------------------------------
const STATUS_STYLES: Record<string, { label: string; color: string; bg: string }> = {
  PENDING: { label: "Chờ xử lý", color: "#FF8C42", bg: "#FF8C4218" },
  PAID: { label: "Đã thanh toán", color: "#17409A", bg: "#17409A18" },
  PROCESSING: { label: "Đang xử lý", color: "#7C5CFC", bg: "#7C5CFC18" },
  PRODUCTION: { label: "Sản xuất", color: "#FF8C42", bg: "#FF8C4218" },
  SHIPPING: { label: "Giao hàng", color: "#17409A", bg: "#17409A18" },
  READY_FOR_PICKUP: { label: "Chờ lấy hàng", color: "#7C5CFC", bg: "#7C5CFC18" },
  DELIVERED: { label: "Đã giao", color: "#4ECDC4", bg: "#4ECDC418" },
  COMPLETED: { label: "Hoàn tất", color: "#4ECDC4", bg: "#4ECDC418" },
  CANCELLED: { label: "Đã hủy", color: "#FF6B9D", bg: "#FF6B9D18" },
};

function formatVND(n: number) {
  if (n >= 1_000_000_000)
    return (n / 1_000_000_000).toFixed(1).replace(".", ",") + " tỷ";
  if (n >= 1_000_000)
    return (n / 1_000_000).toFixed(1).replace(".", ",") + " triệu";
  if (n >= 1_000) return (n / 1_000).toFixed(0) + "k";
  return n.toLocaleString("vi-VN") + " đ";
}

// -- Charts ------------------------------------------------------------------
function MiniAreaChart({ data }: { data: number[] }) {
  if (!data || data.length < 2) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 400;
  const h = 180; 
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 40) - 20;
    return `${x},${y}`;
  });
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-full overflow-visible">
      <path
        d={`M ${pts[0]} ${pts.slice(1).map(p => `L ${p}`).join(" ")}`}
        fill="none"
        stroke="#17409A"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d={`M ${pts[0]} ${pts.slice(1).map(p => `L ${p}`).join(" ")} L ${w},${h} L 0,${h} Z`}
        fill="url(#area-gradient-dashboard-v2)"
        opacity="0.08"
      />
      <defs>
        <linearGradient id="area-gradient-dashboard-v2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#17409A" />
          <stop offset="100%" stopColor="#17409A" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// -- Main component -----------------------------------------------------------
export default function DashboardClient() {
  const { loading, stats, error, fetch } = useDashboardData();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch();
  }, [fetch]);

  useEffect(() => {
    if (!ref.current || loading) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".dc-reveal",
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power4.out", clearProps: "all" }
      );
    }, ref);
    return () => ctx.revert();
  }, [loading]);

  const kpis = stats
    ? [
        { label: "Doanh thu", value: formatVND(stats.totalRevenue), icon: MdTrendingUp, accent: "#17409A", big: true },
        { label: "Khách hàng", value: stats.totalCustomers, unit: "người", icon: MdPeople, accent: "#7C5CFC" },
        { label: "Đơn hàng", value: stats.totalOrders, unit: "đơn", icon: MdShoppingBag, accent: "#4ECDC4" },
        { label: "Nhân viên", value: stats.totalStaff, unit: "người", icon: MdGroups, accent: "#FF8C42" },
      ]
    : [];

  return (
    <div ref={ref} className="flex flex-col gap-10 pb-20" style={{ fontFamily: "var(--font-nunito), Nunito, sans-serif" }}>
      {/* ── Top Bar ── */}
      <div className="dc-reveal flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-[#1A1A2E] font-black text-4xl tracking-tight leading-none">
            Bảng Điều Khiển
          </h1>
          <p className="text-[#9CA3AF] text-sm font-bold mt-2">Dữ liệu hợp nhất từ hệ thống Design a Bear</p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={fetch}
            className="w-12 h-12 rounded-2xl bg-white border border-[#F0F0F8] text-[#17409A] flex items-center justify-center hover:bg-[#F4F7FF] transition-all shadow-sm"
          >
            <MdRefresh className={`text-2xl ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {error && (
        <div className="dc-reveal bg-red-50 text-red-600 p-5 rounded-[24px] text-sm font-black border border-red-100 flex items-center gap-3">
          {error}
        </div>
      )}

      {/* ── Key Metrics Strip ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-[40px] h-44 animate-pulse border border-[#F0F0F8]" />
            ))
          : kpis.map((k) => (
              <div
                key={k.label}
                className={`dc-reveal rounded-[40px] p-8 flex flex-col justify-between relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 ${k.big ? "bg-[#17409A] text-white shadow-xl shadow-[#17409A]/20" : "bg-white border border-[#F0F0F8] text-[#1A1A2E] shadow-sm"}`}
              >
                <div className="flex items-center justify-between z-10">
                  <p className={`text-[11px] font-black uppercase tracking-[0.3em] ${k.big ? "text-white/60" : "text-[#9CA3AF]"}`}>
                    {k.label}
                  </p>
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${k.big ? "bg-white/10" : "bg-[#F4F7FF]"}`}>
                    <k.icon className={`text-2xl ${k.big ? "text-white" : ""}`} style={{ color: !k.big ? k.accent : undefined }} />
                  </div>
                </div>
                <div className="mt-6 z-10">
                  <div className="flex items-baseline gap-1.5">
                    <span className={`font-black tracking-tighter ${k.big ? "text-4xl" : "text-3xl"}`}>
                      {typeof k.value === "number" ? k.value.toLocaleString("vi-VN") : k.value}
                    </span>
                    {k.unit && <span className={`text-sm font-bold ${k.big ? "text-white/50" : "text-[#9CA3AF]"}`}>{k.unit}</span>}
                  </div>
                </div>
              </div>
            ))}
      </div>

      {/* ── Main Dashboard Content ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Revenue Trend Area */}
        <div className="dc-reveal lg:col-span-8 space-y-8">
          <div className="bg-white rounded-[48px] p-10 shadow-sm border border-[#F0F0F8] relative overflow-hidden">
            <div className="flex items-start justify-between mb-10">
              <div>
                <p className="text-[#9CA3AF] text-[10px] font-black uppercase tracking-[0.3em] mb-1">Xu hướng</p>
                <h3 className="text-[#1A1A2E] font-black text-2xl tracking-tight">Tăng trưởng kỳ này</h3>
              </div>
              <Link href="/admin/reports" className="group flex items-center gap-3 bg-[#F4F7FF] text-[#17409A] px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-[#17409A] hover:text-white transition-all">
                Chi tiết <MdArrowForward className="text-base group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="h-[320px] flex items-end">
              {loading ? (
                <div className="w-full h-full bg-[#F4F7FF] rounded-3xl animate-pulse" />
              ) : stats?.dailyRevenue && stats.dailyRevenue.length > 1 ? (
                <MiniAreaChart data={stats.dailyRevenue.map(d => d.revenue)} />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-[#9CA3AF] gap-2">
                  <MdTimeline className="text-4xl opacity-20" />
                  <p className="font-bold italic text-sm">Đang cập nhật biểu đồ...</p>
                </div>
              )}
            </div>
          </div>

          {/* Top Selling Products List */}
          <div className="bg-white rounded-[48px] p-10 shadow-sm border border-[#F0F0F8]">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-2xl bg-[#FFD93D15] text-[#FFD93D] flex items-center justify-center">
                <MdLocalFireDepartment className="text-2xl" />
              </div>
              <h3 className="text-[#1A1A2E] font-black text-xl tracking-tight">Sản phẩm tiêu biểu</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-40 bg-[#F4F7FF] rounded-[32px] animate-pulse" />
                ))
              ) : stats?.topProducts?.length ? (
                stats.topProducts.map((p) => (
                  <div key={p.productId} className="group p-5 rounded-[32px] bg-[#F8FAFF] border border-transparent hover:border-[#17409A20] hover:bg-white hover:shadow-xl transition-all">
                    <div className="w-full aspect-square rounded-2xl bg-white overflow-hidden mb-4 border border-[#F0F0F8] relative">
                      <img src={p.imageUrl || "/teddy_bear.png"} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <p className="text-[#1A1A2E] font-black text-sm line-clamp-1">{p.name}</p>
                    <p className="text-[#17409A] font-black text-sm mt-1">{p.price.toLocaleString("vi-VN")}đ</p>
                  </div>
                ))
              ) : (
                <div className="col-span-3 py-10 text-center text-[#9CA3AF] font-bold italic">Không có dữ liệu</div>
              )}
            </div>
          </div>
        </div>

        {/* ── Side Panels ── */}
        <div className="dc-reveal lg:col-span-4 space-y-8">
          
          {/* Order Status Breakdown */}
          <div className="bg-white rounded-[48px] p-10 shadow-sm border border-[#F0F0F8]">
            <h3 className="text-[#1A1A2E] font-black text-xl tracking-tight mb-8">Vận hành</h3>
            <div className="space-y-4">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-14 bg-[#F4F7FF] rounded-2xl animate-pulse" />
                ))
              ) : stats?.orderStatusDistribution ? (
                Object.entries(stats.orderStatusDistribution).map(([status, count]) => {
                  const style = STATUS_STYLES[status.toUpperCase()] || { label: status, color: "#6B7280", bg: "#F3F4F6" };
                  const total = Object.values(stats.orderStatusDistribution).reduce((a, b) => a + b, 0);
                  const pct = Math.round((count / (total || 1)) * 100);
                  return (
                    <div key={status} className="p-4 rounded-3xl border border-[#F0F0F8] hover:bg-[#F8FAFF] transition-all">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-[#1A1A2E] font-bold text-xs uppercase tracking-tight">{style.label}</p>
                        <p className="text-[#1A1A2E] font-black text-sm">{count}</p>
                      </div>
                      <div className="h-1.5 w-full bg-[#F4F7FF] rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${pct}%`, backgroundColor: style.color }} />
                      </div>
                    </div>
                  );
                })
              ) : null}
            </div>
          </div>

          {/* Fixed Recent Orders Height */}
          <div className="bg-white rounded-[48px] p-10 shadow-sm border border-[#F0F0F8] flex flex-col max-h-[700px]">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-[#1A1A2E] font-black text-xl tracking-tight">Đơn mới</h3>
              <Link href="/admin/orders" className="text-[#17409A] text-[10px] font-black uppercase tracking-widest hover:underline">Chi tiết</Link>
            </div>

            <div className="flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-20 bg-[#F4F7FF] rounded-3xl animate-pulse" />
                ))
              ) : stats?.recentOrders?.length ? (
                stats.recentOrders.map((order) => {
                  const style = STATUS_STYLES[order.status?.toUpperCase()] || STATUS_STYLES.PENDING;
                  return (
                    <div key={order.orderId} className="flex items-center gap-4 p-4 rounded-[28px] border border-[#F0F0F8] hover:bg-[#F4F7FF] transition-all shrink-0">
                      <div className="w-10 h-10 rounded-xl bg-[#17409A10] text-[#17409A] flex items-center justify-center font-black text-sm shrink-0">
                        {order.customerName?.[0] || "U"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[#1A1A2E] font-black text-sm truncate tracking-tight">{order.customerName}</p>
                        <p className="text-[#9CA3AF] text-[9px] font-black uppercase tracking-widest">{order.orderNumber}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-[#1A1A2E] font-black text-sm">{order.grandTotal.toLocaleString("vi-VN")}đ</p>
                        <span className="text-[7px] font-black px-1.5 py-0.5 rounded-md inline-block uppercase bg-[#F4F7FF]" style={{ color: style.color }}>
                          {style.label}
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : null}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
