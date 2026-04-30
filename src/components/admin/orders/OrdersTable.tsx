"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/utils/currency";
import { useDebounce } from "@/hooks";
import {
  MdSearch,
  MdRemoveRedEye,
  MdFileDownload,
  MdCalendarToday,
} from "react-icons/md";
import { formatShortOrderCode } from "@/utils/order";
import DataTable from "@/components/admin/common/DataTable";
import Pagination from "@/components/admin/common/Pagination";
import type { OrderListItem } from "@/types";

function UserAvatar({ url, name, userId }: { url?: string; name: string; userId: string }) {
  const [error, setError] = useState(false);
  const getInitial = (n: string) => n?.trim().charAt(0).toUpperCase() || "?";
  const AVATAR_COLORS = ["#17409A", "#7C5CFC", "#4ECDC4", "#FF8C42", "#FF6B9D", "#FFD93D"];
  const color = AVATAR_COLORS[userId.charCodeAt(0) % AVATAR_COLORS.length];

  if (url && !error) {
    return (
      <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 border border-white shadow-sm">
        <img 
          src={url} 
          alt={name} 
          className="w-full h-full object-cover"
          onError={() => setError(true)}
        />
      </div>
    );
  }

  return (
    <div 
      className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-xs shrink-0 border border-white shadow-sm"
      style={{ backgroundColor: color }}
    >
      {getInitial(name)}
    </div>
  );
}

export type OrderStatus =
  | "pending"
  | "paid"
  | "processing"
  | "printing"
  | "ready_for_pickup"
  | "shipping"
  | "completed"
  | "cancelled"
  | "refunded";

const STATUS_CFG: Record<OrderStatus, { label: string; color: string; bg: string }> = {
  pending: { label: "Chờ duyệt", color: "#FF8C42", bg: "#FF8C4218" },
  paid: { label: "Đã thanh toán", color: "#1D4ED8", bg: "#1D4ED818" },
  processing: { label: "Chế tác", color: "#7C5CFC", bg: "#7C5CFC18" },
  printing: { label: "Đang in", color: "#06B6D4", bg: "#06B6D418" },
  ready_for_pickup: { label: "Kiểm định", color: "#4ECDC4", bg: "#4ECDC418" },
  shipping: { label: "Đang giao", color: "#14B8A6", bg: "#14B8A618" },
  completed: { label: "Hoàn thành", color: "#4ECDC4", bg: "#4ECDC418" },
  cancelled: { label: "Đã hủy", color: "#FF6B9D", bg: "#FF6B9D18" },
  refunded: { label: "Đã hoàn tiền", color: "#6B7280", bg: "#6B728018" },
};

const API_STATUS_TO_UI: Record<string, OrderStatus> = {
  PENDING: "pending",
  PAID: "paid",
  PROCESSING: "processing",
  PRINTING: "printing",
  READY_FOR_PICKUP: "ready_for_pickup",
  SHIPPING: "shipping",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
  REFUNDED: "refunded",
};

const TABS: { id: OrderStatus | "all"; label: string }[] = [
  { id: "all", label: "Tất cả" },
  { id: "pending", label: "Chờ duyệt" },
  { id: "paid", label: "Đã T.Toán" },
  { id: "processing", label: "Chế tác" },
  { id: "shipping", label: "Giao hàng" },
  { id: "completed", label: "H.Thành" },
];

interface OrdersTableProps {
  orders: OrderListItem[];
  loading: boolean;
  usersMap: Record<string, any>;
  onRefresh: () => void;
}

export default function OrdersTable({
  orders,
  loading,
  usersMap,
}: OrdersTableProps) {
  const router = useRouter();
  const [statusFilter, setStatus] = useState<OrderStatus | "all">("all");
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 350);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const filtered = useMemo(
    () =>
      orders
        .map(o => ({ ...o, id: o.orderId }))
        .filter((o) => {
          const uiStatus = API_STATUS_TO_UI[o.status] || "pending";
          if (statusFilter !== "all" && uiStatus !== statusFilter) return false;
          const q = debouncedSearch.toLowerCase();
          return (
            o.orderNumber.toLowerCase().includes(q) ||
            (o.userId || "").toLowerCase().includes(q) ||
            (o.userId ? (usersMap[o.userId]?.fullName || "").toLowerCase().includes(q) : false)
          );
        }),
    [orders, statusFilter, debouncedSearch, usersMap],
  );

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage]);

  // Reset page when filter/search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, debouncedSearch]);

  return (
    <div className="space-y-6">
      {/* Search & Tabs */}
      <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
        <div className="flex items-center gap-2 p-1.5 bg-white rounded-2xl shadow-sm border border-white/50 overflow-x-auto max-w-full no-scrollbar">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatus(tab.id as any)}
              className={`px-5 py-2.5 rounded-xl text-[13px] font-black transition-all uppercase tracking-wider whitespace-nowrap ${
                statusFilter === tab.id
                  ? "bg-[#17409A] text-white shadow-md"
                  : "text-gray-400 hover:text-[#17409A] hover:bg-gray-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-80 group">
            <MdSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 text-2xl group-focus-within:text-[#17409A] transition-colors pointer-events-none" />
            <input
              type="text"
              placeholder="Tìm đơn hàng, khách hàng..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-14 pr-6 py-3.5 bg-white border border-white/50 rounded-2xl shadow-sm text-sm font-bold text-[#1A1A2E] outline-none focus:border-[#17409A]/20 transition-all placeholder:text-gray-300 uppercase tracking-wide"
            />
          </div>
          <button className="flex items-center gap-2 bg-white border border-white/50 text-[#17409A] text-[13px] font-black px-6 py-3.5 rounded-2xl hover:bg-gray-50 transition-all shadow-sm uppercase tracking-widest">
            <MdFileDownload className="text-xl" /> Xuất CSV
          </button>
        </div>
      </div>

      <DataTable
        data={paginatedData}
        isLoading={loading}
        columns={[
          {
            header: "Đơn hàng",
            accessor: (o) => (
              <div className="flex flex-col gap-1">
                <span className="text-[14px] font-black text-[#17409A] tracking-wider font-mono">
                  #{formatShortOrderCode(o.orderNumber || o.orderId)}
                </span>
                <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest italic opacity-60">
                  {new Date(o.createdAt).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            ),
          },
          {
            header: "Khách hàng",
            accessor: (o) => {
              const u = o.userId ? usersMap[o.userId] : null;
              return (
                <div className="flex items-center gap-3">
                  <UserAvatar url={u?.avatarUrl} name={u?.fullName || "Guest"} userId={o.userId || o.orderId} />
                  <div className="min-w-0">
                    <p className="text-sm font-black text-[#1A1A2E] truncate">{u?.fullName || "Khách vãng lai"}</p>
                    <p className="text-[10px] font-bold text-gray-400 truncate opacity-70">
                      {u?.email || (o.userId ? `ID: ${o.userId.slice(0, 8)}` : "Guest")}
                    </p>
                  </div>
                </div>
              );
            },
          },
          {
            header: "Thanh toán",
            accessor: (o) => (
              <span className="text-sm font-black text-[#1A1A2E] tracking-tight">
                {formatPrice(o.grandTotal)}
              </span>
            ),
          },
          {
            header: "Trạng thái",
            align: "center",
            accessor: (o) => {
              const uiStatus = API_STATUS_TO_UI[o.status] || "pending";
              const cfg = STATUS_CFG[uiStatus];
              return (
                <span
                  className="text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-wider"
                  style={{ color: cfg.color, backgroundColor: cfg.bg }}
                >
                  {cfg.label}
                </span>
              );
            },
          },
          {
            header: "Ngày tạo",
            align: "center",
            accessor: (o) => (
              <div className="flex items-center justify-center gap-1.5 text-gray-400">
                <MdCalendarToday className="text-[10px] opacity-30" />
                <span className="text-[11px] font-black uppercase tracking-wider">
                  {new Date(o.createdAt).toLocaleDateString("vi-VN")}
                </span>
              </div>
            ),
          },
          {
            header: "Hành động",
            align: "right",
            accessor: (o) => (
              <div className="flex items-center justify-end gap-2">
                <button
                  onClick={() => router.push(`/admin/orders/${o.orderId}`)}
                  className="p-2.5 rounded-2xl text-gray-400 hover:text-[#17409A] hover:bg-blue-50 transition-all border border-transparent hover:border-blue-100"
                  title="Xem chi tiết"
                >
                  <MdRemoveRedEye className="text-xl" />
                </button>
              </div>
            ),
          },
        ]}
      />

      <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        isLoading={loading}
      />
    </div>
  );
}
