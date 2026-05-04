"use client";

import { useRef, useEffect, useState, useMemo } from "react";
import gsap from "gsap";
import { GiPawPrint } from "react-icons/gi";
import {
  MdShoppingBag,
  MdCheckCircle,
  MdStar,
  MdAccessTime,
  MdTrendingUp,
  MdRefresh,
} from "react-icons/md";
import { orderService } from "@/services/order.service";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import DataTable from "@/components/admin/common/DataTable";
import { formatPrice } from "@/utils/currency";
import { format } from "date-fns";
import type { OrderListItem } from "@/types";

function getCurrentShift() {
  const h = new Date().getHours();
  if (h >= 6 && h < 14) return "morning";
  if (h >= 14 && h < 22) return "afternoon";
  return "evening";
}

const CURRENT_SHIFT = getCurrentShift();

const SHIFT_CFG = {
  morning: { label: "Ca sáng", time: "06:00 - 14:00", color: "#FFD93D" },
  afternoon: { label: "Ca chiều", time: "14:00 - 22:00", color: "#FF8C42" },
  evening: { label: "Ca tối", time: "22:00 - 06:00", color: "#17409A" },
};

const STATUS_CFG: Record<string, { label: string; color: string; bg: string }> = {
  PENDING: { label: "Chờ duyệt", color: "#FF8C42", bg: "#FF8C4218" },
  PAID: { label: "Đã thanh toán", color: "#1D4ED8", bg: "#1D4ED818" },
  PROCESSING: { label: "Chế tác", color: "#7C5CFC", bg: "#7C5CFC18" },
  PRINTING: { label: "Đang in", color: "#06B6D4", bg: "#06B6D418" },
  READY_FOR_PICKUP: { label: "Kiểm định", color: "#4ECDC4", bg: "#4ECDC418" },
  SHIPPING: { label: "Đang giao", color: "#14B8A6", bg: "#14B8A618" },
  COMPLETED: { label: "Hoàn thành", color: "#4ECDC4", bg: "#4ECDC418" },
  CANCELLED: { label: "Đã hủy", color: "#FF6B9D", bg: "#FF6B9D18" },
  REFUNDED: { label: "Hoàn tiền", color: "#6B7280", bg: "#6B728018" },
};

export default function StaffDashboardClient() {
  const ref = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const [orders, setOrders] = useState<OrderListItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await orderService.getOrders();
      if (res && res.isSuccess && res.value && res.value.items) {
        setOrders(res.value.items);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
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
        }
      );
    }, ref);
    return () => ctx.revert();
  }, [loading]);

  const shift = SHIFT_CFG[CURRENT_SHIFT as keyof typeof SHIFT_CFG];

  const orderStats = useMemo(() => {
    const total = orders.length;
    const completed = orders.filter((o) => o.status === "COMPLETED").length;
    const pending = orders.filter((o) => o.status === "PENDING").length;
    const processing = orders.filter((o) => o.status === "PROCESSING").length;
    const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, pending, processing, pct };
  }, [orders]);

  const columns = useMemo(() => [
    {
      header: "Mã đơn hàng",
      accessor: (item: OrderListItem) => {
        const fullNum = item.orderNumber || item.orderId || "";
        const cleanNum = fullNum.startsWith("ORD-") ? fullNum : `ORD-${fullNum.slice(-6).toUpperCase()}`;
        return (
          <span className="font-black text-[#1A1A2E] text-xs uppercase bg-[#F4F7FF] px-2.5 py-1 rounded-xl">
            {cleanNum}
          </span>
        );
      },
    },
    {
      header: "Khách hàng",
      accessor: (item: OrderListItem) => (
        <span className="font-bold text-gray-700 text-xs">
          {(item as any).customerName || (item.userId ? "Thành viên" : "Khách vãng lai")}
        </span>
      ),
    },
    {
      header: "Tổng tiền",
      accessor: (item: OrderListItem) => (
        <span className="font-black text-[#17409A] text-xs">
          {formatPrice(item.grandTotal || 0)}
        </span>
      ),
    },
    {
      header: "Trạng thái",
      accessor: (item: OrderListItem) => {
        const cfg = STATUS_CFG[item.status] || STATUS_CFG.PENDING;
        return (
          <span
            className="text-[10px] font-black px-3 py-1 rounded-2xl whitespace-nowrap inline-block"
            style={{ color: cfg.color, backgroundColor: cfg.bg }}
          >
            {cfg.label}
          </span>
        );
      },
    },
    {
      header: "Ngày tạo",
      accessor: (item: OrderListItem) => (
        <span className="text-gray-500 text-xs font-medium">
          {item.createdAt ? format(new Date(item.createdAt), "dd/MM/yyyy HH:mm") : "N/A"}
        </span>
      ),
    },
  ], []);

  const dataForTable = useMemo(() => {
    return orders.slice(0, 10).map((o) => ({ ...o, id: o.orderId }));
  }, [orders]);

  return (
    <div ref={ref} className="space-y-5" style={{ fontFamily: "var(--font-nunito), sans-serif" }}>
      {/* ── Title row ── */}
      <div className="ac flex items-end justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <GiPawPrint className="text-[#17409A]" style={{ fontSize: 22 }} />
            <h1 className="font-black text-[#1A1A2E] text-2xl tracking-tight">
              Tổng quan ca làm việc
            </h1>
          </div>
          <p className="text-[#9CA3AF] text-sm">
            Chào {user?.name ?? "nhân viên"} · {shift.label} {shift.time}
          </p>
        </div>

        <button
          onClick={fetchOrders}
          disabled={loading}
          className="flex items-center gap-2 bg-[#17409A] hover:bg-[#1a3a8a] text-white text-sm font-bold px-4 py-2.5 rounded-2xl transition-all cursor-pointer whitespace-nowrap shadow-sm"
        >
          <MdRefresh className={loading ? "animate-spin" : ""} />
          Làm mới
        </button>
      </div>

      {/* ── Hero banner + quick stats ── */}
      <div className="ac grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Hero */}
        <div className="lg:col-span-3 relative bg-[#17409A] rounded-3xl overflow-hidden p-6 sm:p-8 flex flex-col gap-5 min-h-56">
          <GiPawPrint
            className="absolute -top-12 -right-10 text-white/4 pointer-events-none select-none"
            style={{ fontSize: 300 }}
          />

          <div className="relative flex items-start justify-between gap-4 flex-wrap">
            <div>
              <p className="text-white/55 text-[10px] font-black tracking-[0.25em] uppercase mb-2">
                Tiến độ ca hôm nay
              </p>
              <div className="flex items-end gap-3">
                <span
                  className="text-white font-black leading-none"
                  style={{ fontSize: "clamp(3.5rem, 6.5vw, 6rem)" }}
                >
                  {orderStats.pct}%
                </span>
                <div className="pb-1.5 flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm rounded-2xl px-3 py-1.5 self-start">
                    <MdTrendingUp className="text-[#4ECDC4] text-sm" />
                    <span className="text-white text-xs font-bold">
                      {orderStats.completed}/{orderStats.total} đơn hàng
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Shift badge */}
            <div
              className="flex flex-col items-center justify-center w-20 h-20 rounded-2xl border backdrop-blur-sm shrink-0"
              style={{
                backgroundColor: `${shift.color}25`,
                borderColor: `${shift.color}40`,
              }}
            >
              <MdAccessTime style={{ color: shift.color, fontSize: 26 }} />
              <span className="text-white font-black text-xs leading-tight mt-1 text-center px-1">
                {shift.label}
              </span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="relative flex flex-col gap-1.5">
            <div className="h-2.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-linear-to-r from-[#4ECDC4] to-[#17409A] transition-all duration-700"
                style={{ width: `${orderStats.pct}%` }}
              />
            </div>
            <div className="flex justify-between text-white/50 text-xs font-semibold">
              <span>{orderStats.completed} hoàn thành</span>
              <span>{orderStats.total - orderStats.completed} còn lại</span>
            </div>
          </div>
        </div>

        {/* Quick nav cards */}
        <div className="lg:col-span-2 grid grid-cols-2 gap-3 content-start">
          <Link
            href="/staff/orders"
            className="bg-white rounded-3xl p-5 flex flex-col justify-between h-32 hover:shadow-lg transition-all cursor-pointer group border border-white/40 shadow-sm"
          >
            <div className="w-10 h-10 rounded-2xl bg-[#17409A15] flex items-center justify-center">
              <MdShoppingBag className="text-[#17409A] text-xl" />
            </div>
            <div>
              <p className="font-black text-[#1A1A2E] text-base leading-tight">Đơn hàng</p>
              <p className="text-[#9CA3AF] text-xs font-bold mt-0.5">{orderStats.pending} đơn chờ duyệt</p>
            </div>
          </Link>

          <Link
            href="/staff/reviews"
            className="bg-white rounded-3xl p-5 flex flex-col justify-between h-32 hover:shadow-lg transition-all cursor-pointer group border border-white/40 shadow-sm"
          >
            <div className="w-10 h-10 rounded-2xl bg-[#FFD93D15] flex items-center justify-center">
              <MdStar className="text-[#FFD93D] text-xl" />
            </div>
            <div>
              <p className="font-black text-[#1A1A2E] text-base leading-tight">Đánh giá</p>
              <p className="text-[#9CA3AF] text-xs font-bold mt-0.5">Xử lý phản hồi</p>
            </div>
          </Link>

          <Link
            href="/staff/products"
            className="bg-white rounded-3xl p-5 flex flex-col justify-between h-32 hover:shadow-lg transition-all cursor-pointer group border border-white/40 shadow-sm"
          >
            <div className="w-10 h-10 rounded-2xl bg-[#4ECDC415] flex items-center justify-center">
              <MdCheckCircle className="text-[#4ECDC4] text-xl" />
            </div>
            <div>
              <p className="font-black text-[#1A1A2E] text-base leading-tight">Sản phẩm</p>
              <p className="text-[#9CA3AF] text-xs font-bold mt-0.5">Danh sách hàng</p>
            </div>
          </Link>

          <Link
            href="/staff/payroll"
            className="bg-white rounded-3xl p-5 flex flex-col justify-between h-32 hover:shadow-lg transition-all cursor-pointer group border border-white/40 shadow-sm"
          >
            <div className="w-10 h-10 rounded-2xl bg-[#7C5CFC15] flex items-center justify-center">
              <MdAccessTime className="text-[#7C5CFC] text-xl" />
            </div>
            <div>
              <p className="font-black text-[#1A1A2E] text-base leading-tight">Thù lao</p>
              <p className="text-[#9CA3AF] text-xs font-bold mt-0.5">Xem lương ca</p>
            </div>
          </Link>
        </div>
      </div>

      {/* ── Order List ── */}
      <div className="ac">
        <div className="mb-4">
          <h2 className="font-black text-[#1A1A2E] text-xl tracking-tight">
            Đơn hàng gần đây
          </h2>
          <p className="text-[#9CA3AF] text-sm">
            Tất cả đơn hàng thực tế trong kỳ làm việc
          </p>
        </div>
        <DataTable
          columns={columns}
          data={dataForTable}
          isLoading={loading}
          emptyMessage="Chưa ghi nhận đơn hàng nào"
        />
      </div>
    </div>
  );
}
