"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import gsap from "gsap";
import { useDashboardData } from "@/hooks";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import Link from "next/link";
import {
  MdTrendingUp,
  MdShoppingBag,
  MdPeople,
  MdArrowForward,
  MdRefresh,
  MdLocalFireDepartment,
  MdTimeline,
  MdDashboard,
  MdAutoGraph,
  MdInventory,
  MdStars
} from "react-icons/md";
import { GiPawPrint } from "react-icons/gi";

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

// -- Custom Premium Area Chart -----------------------------------------------
function PremiumCustomChart({ data, dates }: { data: number[]; dates: string[] }) {
  if (!data || data.length < 2) return null;
  const maxRaw = Math.max(...data, 100);
  const max = maxRaw * 1.2; // Add some padding
  const min = 0;
  const range = max - min || 1;
  const w = 800;
  const h = 240;
  
  const pts = data.map((v, i) => ({
    x: (i / (data.length - 1)) * w,
    y: h - ((v - min) / range) * (h - 60) - 30,
  }));

  let d = `M ${pts[0].x},${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const cp1x = (pts[i].x + pts[i + 1].x) / 2;
    d += ` C ${cp1x},${pts[i].y} ${cp1x},${pts[i + 1].y} ${pts[i + 1].x},${pts[i + 1].y}`;
  }

  const fillD = `${d} L ${w},${h} L 0,${h} Z`;

  // Filter dates to show only a few
  const labelInterval = Math.ceil(dates.length / 6);

  return (
    <div className="relative w-full h-full group pb-6">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-full overflow-visible" preserveAspectRatio="none">
        <defs>
          <linearGradient id="chart-fill-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#17409A" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#17409A" stopOpacity="0" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Grid lines & Y labels */}
        {[0, 0.5, 1].map((p, i) => {
          const y = h - (p * (h - 60) + 30);
          const val = min + p * range;
          return (
            <g key={i}>
              <line x1="0" y1={y} x2={w} y2={y} stroke="#F0F0F8" strokeWidth="1" strokeDasharray="5,5" />
              <text x="-10" y={y} textAnchor="end" alignmentBaseline="middle" className="fill-gray-300 text-[10px] font-black">{formatVND(val)}</text>
            </g>
          );
        })}

        {/* Area fill */}
        <path d={fillD} fill="url(#chart-fill-grad)" />

        {/* The line */}
        <path
          d={d}
          fill="none"
          stroke="#17409A"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#glow)"
        />

        {/* X Labels */}
        {dates.map((date, i) => {
          if (i % labelInterval !== 0 && i !== dates.length - 1) return null;
          const x = (i / (dates.length - 1)) * w;
          const dObj = new Date(date);
          return (
            <text key={i} x={x} y={h + 20} textAnchor="middle" className="fill-gray-400 text-[9px] font-black uppercase tracking-tighter">
              {dObj.getDate()}/{dObj.getMonth() + 1}
            </text>
          );
        })}

        {/* Data points */}
        {pts.map((p, i) => (
          <g key={i} className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <circle cx={p.x} cy={p.y} r="6" fill="white" stroke="#17409A" strokeWidth="3" />
            {/* Simple tooltip placeholder */}
            <rect x={p.x - 30} y={p.y - 35} width="60" height="25" rx="6" fill="#17409A" className="drop-shadow-md" />
            <text x={p.x} y={p.y - 18} textAnchor="middle" className="fill-white text-[9px] font-black">{formatVND(data[i])}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}

// -- Main Dashboard -----------------------------------------------------------
export default function DashboardClient() {
  const { loading, stats, error, fetch } = useDashboardData();
  const { user } = useAuth();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch();
  }, [fetch]);

  useEffect(() => {
    if (!ref.current || loading) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".dc-reveal",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, stagger: 0.08, ease: "power3.out", clearProps: "all" }
      );
    }, ref);
    return () => ctx.revert();
  }, [loading]);

  const kpis = useMemo(() => {
    if (!stats) return [];
    return [
      { label: "Doanh thu", value: formatVND(stats.totalRevenue), icon: MdTrendingUp, accent: "#17409A", big: true },
      { label: "Đơn hàng", value: stats.totalOrders, unit: "đơn", icon: MdShoppingBag, accent: "#4ECDC4" },
      { label: "Khách hàng", value: stats.totalCustomers, unit: "người", icon: MdPeople, accent: "#7C5CFC" },
      { label: "Sản phẩm", value: stats.topProducts?.length || 0, unit: "mẫu", icon: MdInventory, accent: "#FF8C42" },
    ];
  }, [stats]);

  return (
    <div ref={ref} className="flex flex-col gap-10 pb-20" style={{ fontFamily: "var(--font-nunito), Nunito, sans-serif" }}>
      {/* ── Dynamic Hero Header ── */}
      <div className="dc-reveal relative bg-[#17409A] rounded-[40px] p-10 overflow-hidden shadow-2xl shadow-blue-900/20 border border-white/10 min-h-[220px] flex flex-col justify-center">
        {/* Paw Watermark */}
        <GiPawPrint className="absolute -bottom-10 -right-10 text-white/5 text-[300px] rotate-12 pointer-events-none" />
        <GiPawPrint className="absolute top-4 left-1/3 text-white/4 text-[80px] -rotate-12 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-white/10 text-white/70 text-[9px] font-black uppercase tracking-[0.25em] px-3 py-1 rounded-full border border-white/10 backdrop-blur-md">
                Admin Dashboard
              </span>
              <span className="text-white/40 text-[9px] font-black uppercase tracking-widest">•</span>
              <span className="text-white/60 text-[9px] font-bold uppercase tracking-widest">
                {format(new Date(), "eeee, do MMMM", { locale: undefined })}
              </span>
            </div>
            <h1 className="text-white font-black text-4xl lg:text-5xl tracking-tight leading-tight mb-2">
              Chào buổi chiều, <span className="text-blue-200">{user?.name?.split(" ")[0] || "Admin"}</span>
            </h1>
            <p className="text-white/60 text-base font-bold max-w-lg leading-relaxed">
              Dưới đây là tóm tắt hiệu suất kinh doanh của Design a Bear hôm nay.
            </p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={fetch}
              className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white px-6 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-white hover:text-[#17409A] transition-all group"
            >
              <MdRefresh className={`text-xl ${loading ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-500"}`} />
              Đồng bộ dữ liệu
            </button>
            <Link href="/admin/orders" className="bg-[#4ECDC4] text-[#17409A] px-6 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-white transition-all shadow-lg shadow-[#4ECDC4]/20 flex items-center gap-2">
              <MdShoppingBag className="text-xl" /> Đơn mới
            </Link>
          </div>
        </div>
      </div>

      {error && (
        <div className="dc-reveal bg-red-50 text-red-600 p-5 rounded-3xl text-sm font-black border border-red-100 flex items-center gap-3 mx-4">
          {error}
        </div>
      )}

      {/* ── Key Metrics Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-1">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-[40px] h-40 animate-pulse border border-[#F0F0F8]" />
            ))
          : kpis.map((k) => (
              <div
                key={k.label}
                className={`dc-reveal group rounded-[40px] p-8 flex flex-col justify-between relative overflow-hidden transition-all duration-500 border border-white hover:border-[#17409A]/10 hover:shadow-2xl hover:-translate-y-1 bg-white shadow-sm shadow-gray-100`}
              >
                <div className="flex items-center justify-between z-10">
                  <p className="text-[#9CA3AF] text-[10px] font-black uppercase tracking-[0.25em]">
                    {k.label}
                  </p>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-[#F4F7FF] group-hover:scale-110 transition-transform`}>
                    <k.icon className="text-xl" style={{ color: k.accent }} />
                  </div>
                </div>
                <div className="mt-6 z-10 flex flex-col">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-[#1A1A2E] font-black tracking-tighter text-3xl">
                      {k.value}
                    </span>
                    {k.unit && <span className="text-[11px] font-black text-[#9CA3AF] uppercase tracking-widest">{k.unit}</span>}
                  </div>
                  <div className="flex items-center gap-1.5 mt-2">
                    <MdAutoGraph className="text-[#4ECDC4] text-xs" />
                    <span className="text-[#4ECDC4] text-[10px] font-black">+12.5%</span>
                    <span className="text-gray-300 text-[10px] font-bold">so với tháng trước</span>
                  </div>
                </div>
              </div>
            ))}
      </div>

      {/* ── Main Dashboard Content ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start px-1">
        
        {/* Revenue Analytics (Custom Chart) */}
        <div className="dc-reveal lg:col-span-8 space-y-8">
          <div className="bg-white rounded-[48px] p-10 shadow-sm border border-white relative overflow-hidden group">
            {/* Background Paw */}
            <GiPawPrint className="absolute -top-10 -right-10 text-gray-50 text-[200px] pointer-events-none group-hover:text-blue-50 transition-colors" />

            <div className="relative flex items-start justify-between mb-12">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#17409A]" />
                  <p className="text-[#9CA3AF] text-[10px] font-black uppercase tracking-[0.3em]">Báo cáo doanh thu</p>
                </div>
                <h3 className="text-[#1A1A2E] font-black text-2xl tracking-tight">Tăng trưởng kỳ này</h3>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100">
                  <div className="w-2 h-2 rounded-full bg-[#17409A]" />
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Doanh thu</span>
                </div>
                <Link href="/admin/reports" className="w-10 h-10 rounded-xl bg-[#F4F7FF] text-[#17409A] flex items-center justify-center hover:bg-[#17409A] hover:text-white transition-all shadow-sm">
                  <MdArrowForward className="text-lg" />
                </Link>
              </div>
            </div>

            <div className="relative h-[280px]">
              {loading ? (
                <div className="w-full h-full bg-[#F4F7FF] rounded-[32px] animate-pulse" />
              ) : stats?.dailyRevenue && stats.dailyRevenue.length > 1 ? (
                <PremiumCustomChart 
                  data={stats.dailyRevenue.map(d => d.revenue)} 
                  dates={stats.dailyRevenue.map(d => d.date)} 
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-[#9CA3AF] gap-3 bg-gray-50 rounded-[32px] border border-dashed border-gray-200">
                  <MdTimeline className="text-4xl opacity-20" />
                  <p className="font-black uppercase tracking-widest text-[10px]">Đang cập nhật biểu đồ...</p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-gray-50">
              <div>
                <p className="text-[#9CA3AF] text-[9px] font-black uppercase tracking-widest mb-1">Doanh thu cao nhất</p>
                <p className="text-[#1A1A2E] font-black text-lg">{formatVND(Math.max(...(stats?.dailyRevenue?.map(d => d.revenue) || [0])))}</p>
              </div>
              <div>
                <p className="text-[#9CA3AF] text-[9px] font-black uppercase tracking-widest mb-1">Số lượng đơn bình quân</p>
                <p className="text-[#1A1A2E] font-black text-lg">{(stats?.totalOrders || 0) / 30 | 0} đơn / ngày</p>
              </div>
              <div className="text-right">
                <p className="text-[#9CA3AF] text-[9px] font-black uppercase tracking-widest mb-1">Hiệu suất mục tiêu</p>
                <p className="text-[#4ECDC4] font-black text-lg">94.2%</p>
              </div>
            </div>
          </div>

          {/* Hot Products Strip */}
          <div className="dc-reveal bg-white rounded-[48px] p-10 shadow-sm border border-white">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center shadow-sm border border-amber-100">
                  <MdLocalFireDepartment className="text-2xl" />
                </div>
                <div>
                  <h3 className="text-[#1A1A2E] font-black text-xl tracking-tight leading-tight">Sản phẩm tiêu biểu</h3>
                  <p className="text-gray-300 text-[10px] font-black uppercase tracking-widest mt-1">Xu hướng bán chạy nhất</p>
                </div>
              </div>
              <Link href="/admin/products" className="group flex items-center gap-2 text-[#17409A] text-[10px] font-black uppercase tracking-widest hover:underline">
                Xem kho <MdArrowForward className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-56 bg-[#F4F7FF] rounded-[40px] animate-pulse" />
                ))
              ) : stats?.topProducts?.length ? (
                stats.topProducts.slice(0, 3).map((p) => (
                  <div key={p.productId} className="group relative p-6 rounded-[40px] bg-[#F8FAFF] border border-transparent hover:border-[#17409A10] hover:bg-white hover:shadow-2xl transition-all duration-500">
                    <div className="w-full aspect-[4/5] rounded-[28px] bg-white overflow-hidden mb-5 border border-gray-100 relative shadow-sm">
                      <img src={p.imageUrl || "/teddy_bear.png"} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      <div className="absolute top-3 right-3 bg-white/80 backdrop-blur-md p-2 rounded-xl border border-white/50 opacity-0 group-hover:opacity-100 transition-opacity">
                        <MdStars className="text-amber-500 text-xl" />
                      </div>
                    </div>
                    <p className="text-[#1A1A2E] font-black text-base line-clamp-1 group-hover:text-[#17409A] transition-colors">{p.name}</p>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-[#17409A] font-black text-lg">{p.price.toLocaleString("vi-VN")}đ</p>
                      <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-2.5 py-1 rounded-lg">HOT</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-3 py-16 text-center text-[#9CA3AF] font-black uppercase tracking-widest text-[10px] opacity-40 italic">Không có dữ liệu tiêu biểu</div>
              )}
            </div>
          </div>
        </div>

        {/* ── Actionable Side Panels ── */}
        <div className="dc-reveal lg:col-span-4 space-y-8">
          
          {/* Progress Breakdown */}
          <div className="bg-white rounded-[48px] p-10 shadow-sm border border-white relative overflow-hidden group">
            <h3 className="text-[#1A1A2E] font-black text-xl tracking-tight mb-10 flex items-center gap-3">
              Vận hành <span className="w-2 h-2 rounded-full bg-[#4ECDC4] animate-pulse" />
            </h3>
            <div className="space-y-6">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-16 bg-[#F4F7FF] rounded-2xl animate-pulse" />
                ))
              ) : stats?.orderStatusDistribution ? (
                Object.entries(stats.orderStatusDistribution).map(([status, count]) => {
                  const style = STATUS_STYLES[status.toUpperCase()] || { label: status, color: "#6B7280", bg: "#F3F4F6" };
                  const total = Object.values(stats.orderStatusDistribution).reduce((a, b) => a + b, 0);
                  const pct = Math.round((count / (total || 1)) * 100);
                  return (
                    <div key={status} className="group/item relative overflow-hidden">
                      <div className="flex items-center justify-between mb-2 px-1">
                        <p className="text-[#1A1A2E] font-black text-[11px] uppercase tracking-wider">{style.label}</p>
                        <span className="text-[#17409A] font-black text-sm">{count}</span>
                      </div>
                      <div className="h-3 w-full bg-[#F4F7FF] rounded-full overflow-hidden border border-gray-50">
                        <div 
                          className="h-full rounded-full transition-all duration-1000 ease-out shadow-sm" 
                          style={{ width: `${pct}%`, backgroundColor: style.color }} 
                        />
                      </div>
                    </div>
                  );
                })
              ) : null}
            </div>
          </div>

          {/* Quick List: Recent Activity */}
          <div className="bg-white rounded-[48px] p-10 shadow-sm border border-white flex flex-col max-h-[700px] group">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-3">
                <MdDashboard className="text-[#17409A] text-xl" />
                <h3 className="text-[#1A1A2E] font-black text-xl tracking-tight">Đơn hàng mới</h3>
              </div>
              <Link href="/admin/orders" className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-[#17409A] hover:text-white transition-all shadow-sm">
                <MdArrowForward className="text-base" />
              </Link>
            </div>

            <div className="flex flex-col gap-5 overflow-y-auto pr-3 custom-scrollbar">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-24 bg-[#F4F7FF] rounded-[32px] animate-pulse" />
                ))
              ) : stats?.recentOrders?.length ? (
                stats.recentOrders.map((order) => {
                  const style = STATUS_STYLES[order.status?.toUpperCase()] || STATUS_STYLES.PENDING;
                  return (
                    <div key={order.orderId} className="flex items-center gap-5 p-5 rounded-[32px] border border-gray-50 hover:border-[#17409A15] hover:bg-[#F8FAFF] hover:shadow-xl hover:-translate-x-1 transition-all duration-300 shrink-0 group/order">
                      <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center font-black text-[#17409A] text-base shrink-0 shadow-sm border border-gray-100 group-hover/order:bg-[#17409A] group-hover/order:text-white transition-colors overflow-hidden">
                        {order.customerAvatarUrl ? (
                          <img src={order.customerAvatarUrl} alt={order.customerName} className="w-full h-full object-cover" />
                        ) : (
                          order.customerName?.[0] || "U"
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[#1A1A2E] font-black text-sm truncate tracking-tight">{order.customerName}</p>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="text-[7px] font-black px-2 py-0.5 rounded-full uppercase border border-current" style={{ color: style.color }}>
                            {style.label}
                          </span>
                          <span className="text-gray-300 text-[8px] font-black uppercase tracking-widest">• {order.orderNumber}</span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-[#1A1A2E] font-black text-sm tracking-tighter">{formatVND(order.grandTotal)}</p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-20 text-center opacity-30">
                  <MdShoppingBag className="text-4xl mx-auto mb-4" />
                  <p className="text-[10px] font-black uppercase tracking-widest">Không có đơn hàng mới</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
