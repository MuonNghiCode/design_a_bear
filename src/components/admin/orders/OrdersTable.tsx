"use client";

import { useState, useMemo, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { formatPrice } from "@/utils/currency";
import { useDebounce } from "@/hooks";
import {
  MdSearch,
  MdRemoveRedEye,
  MdFileDownload,
  MdClose,
  MdAutorenew,
  MdLocalShipping,
  MdPrint
} from "react-icons/md";
import { GiPawPrint } from "react-icons/gi";
import { orderService } from "@/services/order.service";
import { addressService } from "@/services/address.service";
import { fulfillmentService } from "@/services/fulfillment.service";
import { shippingService } from "@/services/shipping.service";
import { useToast } from "@/contexts/ToastContext";
import CustomDropdown from "@/components/shared/CustomDropdown";
import type { OrderListItem, AddressDetail, Order } from "@/types";
import type { FulfillmentResponse } from "@/types/responses";
import { formatShortOrderCode } from "@/utils/order";
import { useRouter } from "next/navigation";

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

const BACKEND_STATUSES: { value: string; label: string }[] = [
  { value: "PENDING", label: "Chờ duyệt" },
  { value: "PAID", label: "Đã thanh toán" },
  { value: "PROCESSING", label: "Chế tác" },
  { value: "PRINTING", label: "Đang in" },
  { value: "READY_FOR_PICKUP", label: "Kiểm định" },
  { value: "SHIPPING", label: "Đang giao" },
  { value: "COMPLETED", label: "Hoàn thành" },
  { value: "CANCELLED", label: "Đã hủy" },
  { value: "REFUNDED", label: "Đã hoàn tiền" },
];

const STATUS_CFG: Record<
  OrderStatus,
  { label: string; color: string; bg: string }
> = {
  pending: { label: "Chờ duyệt", color: "#FF8C42", bg: "#FF8C4218" },
  paid: { label: "Đã thanh toán", color: "#1D4ED8", bg: "#1D4ED818" },
  processing: { label: "Chế tác", color: "#7C5CFC", bg: "#7C5CFC18" },
  printing: { label: "Đang in", color: "#06B6D4", bg: "#06B6D418" },
  ready_for_pickup: {
    label: "Kiểm định",
    color: "#4ECDC4",
    bg: "#4ECDC418",
  },
  shipping: { label: "Đang giao", color: "#14B8A6", bg: "#14B8A618" },
  completed: { label: "Hoàn thành", color: "#4ECDC4", bg: "#4ECDC418" },
  cancelled: { label: "Đã hủy", color: "#FF6B9D", bg: "#FF6B9D18" },
  refunded: { label: "Đã hoàn tiền", color: "#6B7280", bg: "#6B728018" },
};

const TABS: { key: OrderStatus | "all"; label: string }[] = [
  { key: "all", label: "Tất cả" },
  { key: "pending", label: "Chờ duyệt" },
  { key: "paid", label: "Đã thanh toán" },
  { key: "processing", label: "Chế tác" },
  { key: "printing", label: "Đang in" },
  { key: "ready_for_pickup", label: "Kiểm định" },
  { key: "shipping", label: "Đang giao" },
  { key: "completed", label: "Hoàn thành" },
  { key: "cancelled", label: "Đã hủy" },
  { key: "refunded", label: "Đã hoàn tiền" },
];

const AVATAR_COLORS = [
  "#17409A",
  "#7C5CFC",
  "#4ECDC4",
  "#FF8C42",
  "#FF6B9D",
  "#FFD93D",
];

const COL_HEADS = [
  "Mã đơn",
  "Khách hàng",
  "Sản phẩm",
  "Thành tiền",
  "Trạng thái",
  "Ngày",
  "",
];

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

interface OrdersTableProps {
  orders: OrderListItem[];
  loading: boolean;
  usersMap: Record<string, any>;
  onRefresh: () => void;
}

const UserAvatar = ({ url, name, char, color }: { url?: string | null, name: string, char: string, color: string }) => {
  const [error, setError] = useState(false);
  
  if (url && !error) {
    return (
      <img
        src={url}
        alt={name}
        className="w-full h-full object-cover"
        onError={() => setError(true)}
      />
    );
  }
  
  return (
    <div
      className="w-full h-full flex items-center justify-center text-white font-black text-sm"
      style={{ backgroundColor: color }}
    >
      {char}
    </div>
  );
};

export default function OrdersTable({
  orders,
  loading,
  usersMap,
  onRefresh,
}: OrdersTableProps) {
  const { user } = useAuth();
  const [tab, setTab] = useState<OrderStatus | "all">("all");
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 350);
  const [pageIndex, setPageIndex] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();
  const pageSize = 10;

  const handleViewDetails = (orderId: string) => {
    router.push(`/admin/orders/${orderId}`);
  };


  const counts = useMemo(() => {
    const c: Record<string, number> = { all: orders.length };
    orders.forEach((o) => {
      const st = API_STATUS_TO_UI[o.status] || "pending";
      c[st] = (c[st] ?? 0) + 1;
    });
    return c;
  }, [orders]);

  const filtered = useMemo(
    () =>
      orders.filter((o) => {
        const st = API_STATUS_TO_UI[o.status] || "pending";
        if (tab !== "all" && st !== tab) return false;
        const q = debouncedSearch.toLowerCase();
        return (
          o.orderNumber.toLowerCase().includes(q) ||
          (o.userId || "").toLowerCase().includes(q) ||
          (o.userId
            ? (usersMap[o.userId]?.fullName || "").toLowerCase().includes(q)
            : false)
        );
      }),
    [tab, debouncedSearch, orders, usersMap],
  );

  const localTotalCount = filtered.length;
  const localTotalPages = Math.max(1, Math.ceil(localTotalCount / pageSize));
  const pagedOrders = useMemo(() => {
    const start = (pageIndex - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, pageIndex, pageSize]);

  useEffect(() => {
    if (pageIndex > localTotalPages) {
      setPageIndex(localTotalPages);
    }
  }, [localTotalPages, pageIndex]);

  useEffect(() => {
    setPageIndex(1);
  }, [tab, debouncedSearch]);

  return (
    <>
      <div className="bg-white rounded-3xl p-6">
        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div>
            <p className="text-[#9CA3AF] text-[10px] font-black tracking-[0.22em] uppercase mb-0.5">
              Danh sách
            </p>
            <p className="text-[#17409A] font-black text-xl">Tất cả đơn hàng</p>
          </div>
          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="relative">
              <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] text-base pointer-events-none" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm đơn, khách hàng..."
                className="bg-[#F4F7FF] text-[#17409A] text-sm font-semibold placeholder:text-[#9CA3AF] rounded-xl pl-9 pr-4 py-2.5 outline-none border-2 border-transparent focus:border-[#17409A]/20 transition-colors w-52"
              />
            </div>
            {/* Export */}
            <button className="flex items-center gap-1.5 bg-[#17409A] text-white text-xs font-black px-4 py-2.5 rounded-xl hover:bg-[#0f2d70] transition-colors whitespace-nowrap">
              <MdFileDownload className="text-sm" />
              Xuất CSV
            </button>
            {/* Refresh */}
            <button
              onClick={() => onRefresh()}
              disabled={refreshing || loading}
              className="bg-[#17409A] hover:bg-[#17409A]/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-sm rounded-xl px-4 py-2.5 flex items-center gap-2 transition-all duration-200 shadow-sm hover:shadow-md"
              title="Làm mới dữ liệu"
            >
              <MdAutorenew
                className={`text-base ${refreshing ? "animate-spin" : ""}`}
              />
              <span className="hidden sm:inline">Làm mới</span>
            </button>
          </div>
        </div>

        {/* ── Status filter tabs ── */}
        <div className="flex gap-1.5 flex-wrap mb-5 pb-1">
          {TABS.map(({ key, label }) => {
            const active = tab === key;
            const cfg = key !== "all" ? STATUS_CFG[key as OrderStatus] : null;
            return (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black transition-all duration-200 ${
                  active
                    ? "bg-[#17409A] text-white shadow-sm"
                    : "bg-[#F4F7FF] text-[#6B7280] hover:bg-[#E8EEF9]"
                }`}
              >
                {label}
                <span
                  className={`text-[9px] font-black px-1.5 py-0.5 rounded-full min-w-4.5 text-center transition-all ${
                    active ? "bg-white/20 text-white" : ""
                  }`}
                  style={
                    !active && cfg
                      ? { color: cfg.color, backgroundColor: cfg.bg }
                      : !active
                        ? { color: "#9CA3AF", backgroundColor: "#F4F7FF" }
                        : undefined
                  }
                >
                  {counts[key] ?? 0}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── Table ── */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-170">
            <thead>
              <tr>
                {COL_HEADS.map((h, i) => (
                  <th
                    key={i}
                    className="text-left text-[9px] font-black text-[#9CA3AF] tracking-[0.2em] uppercase pb-3 pr-4 whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading && filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-6 text-sm text-[#9CA3AF]"
                  >
                    Đang tải...
                  </td>
                </tr>
              ) : (
                pagedOrders.map((order, i: number) => {
                  const uiStatus = API_STATUS_TO_UI[order.status] || "pending";
                  const st = STATUS_CFG[uiStatus];

                  const userDetail = order.userId
                    ? usersMap[order.userId]
                    : null;

                  const customerName = userDetail
                    ? userDetail.fullName
                    : order.userId
                      ? "Thành viên (Id đang tải)"
                      : "Khách vãng lai";

                  const avatarColor =
                    AVATAR_COLORS[
                      (userDetail ? userDetail.email.charCodeAt(0) : i) %
                        AVATAR_COLORS.length
                    ];
                  const avatarChar = customerName.charAt(0).toUpperCase();

                  const firstItem = order.orderItems?.[0];

                  const dateObj = new Date(order.createdAt);
                  const dateStr = dateObj.toLocaleDateString("vi-VN");
                  const timeStr = dateObj.toLocaleTimeString("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  });

                  return (
                    <tr
                      key={order.orderId}
                      className="group border-t border-[#F4F7FF] hover:bg-[#F8F9FF] transition-colors duration-150 cursor-pointer"
                    >
                      {/* Order ID */}
                      <td className="py-7 pr-6">
                        <span className="text-[14px] font-black text-[#17409A] bg-[#17409A]/8 px-4 py-2.5 rounded-xl tracking-wide font-mono">
                          {formatShortOrderCode(
                            order.orderNumber || order.orderId,
                          )}
                        </span>
                      </td>

                      {/* Customer */}
                      <td className="py-7 pr-6">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200 shadow-sm overflow-hidden">
                            <UserAvatar 
                              url={userDetail?.avatarUrl} 
                              name={customerName} 
                              char={avatarChar} 
                              color={avatarColor} 
                            />
                          </div>
                          <div>
                            <p className="text-[#1A1A2E] font-black text-[16px] leading-tight">
                              {customerName}
                            </p>
                            <p className="text-[#9CA3AF] text-[12px] font-black uppercase tracking-wider mt-1 opacity-60">
                              {order.userId ? "Thành viên" : "Khách mới"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Product */}
                      <td className="py-7 pr-6">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-[#F8F9FF] flex items-center justify-center border border-[#E5E7EB] shrink-0">
                            <img
                              src={
                                firstItem?.productImageUrl ||
                                "/images/placeholder.png"
                              }
                              alt={firstItem?.productName || "Sản phẩm"}
                              className="w-8 h-8 object-cover"
                            />
                          </div>
                          <div>
                            <p className="text-[#1A1A2E] font-bold text-[14px] leading-snug max-w-[200px] truncate">
                              {firstItem?.productName || "Sản phẩm"}
                            </p>
                            {order.orderItems.length > 1 && (
                              <p className="text-[#17409A] text-[11px] font-black uppercase tracking-widest mt-0.5">
                                + {order.orderItems.length - 1} sản phẩm khác
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Amount */}
                      <td className="py-7 pr-6">
                        <p className="text-[#17409A] font-black text-[16px] tracking-tight">
                          {formatPrice(order.grandTotal)}
                        </p>
                      </td>

                      {/* Status */}
                      <td className="py-7 pr-6">
                        <div className="flex">
                          <span
                            className="px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider"
                            style={{ color: st.color, backgroundColor: st.bg }}
                          >
                            {st.label}
                          </span>
                        </div>
                      </td>

                      {/* Date */}
                      <td className="py-7 pr-6">
                        <p className="text-[#4B5563] font-black text-[13px] leading-tight uppercase tracking-tight">
                          {dateStr}
                        </p>
                        <p className="text-[#9CA3AF] text-[11px] font-bold leading-tight mt-1">
                          {timeStr}
                        </p>
                      </td>

                      {/* Action */}
                      <td className="py-6">
                        <button
                          onClick={() => handleViewDetails(order.orderId)}
                          className="w-10 h-10 rounded-2xl flex items-center justify-center text-[#9CA3AF] hover:text-[#17409A] hover:bg-[#17409A]/10 transition-all duration-150 border border-transparent hover:border-[#17409A]/10"
                          title="Xem chi tiết"
                        >
                          <MdRemoveRedEye className="text-xl" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>

          {/* Empty state */}
          {filtered.length === 0 && (
            <div className="flex flex-col items-center py-12 text-center">
              <GiPawPrint
                className="text-[#E5E7EB] mb-3"
                style={{ fontSize: 52 }}
              />
              <p className="text-[#9CA3AF] font-black text-sm">
                Không có đơn hàng phù hợp
              </p>
              <p className="text-[#9CA3AF] text-[11px] font-semibold mt-1">
                Thử thay đổi bộ lọc hoặc từ khoá tìm kiếm
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        {filtered.length > 0 && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#F4F7FF]">
            <p className="text-[#9CA3AF] text-[11px] font-semibold">
              Hiển thị{" "}
              <span className="text-[#17409A] font-black">
                {pagedOrders.length}
              </span>{" "}
              / {localTotalCount} đơn hàng
            </p>
            <div className="flex items-center gap-1">
              {Array.from({ length: localTotalPages }, (_, i) => i + 1).map(
                (p) => (
                  <button
                    key={p}
                    onClick={() => setPageIndex(p)}
                    className={`w-7 h-7 rounded-lg text-[11px] font-black transition-colors ${
                      p === pageIndex
                        ? "bg-[#17409A] text-white"
                        : "text-[#9CA3AF] hover:bg-[#F4F7FF]"
                    }`}
                  >
                    {p}
                  </button>
                ),
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
