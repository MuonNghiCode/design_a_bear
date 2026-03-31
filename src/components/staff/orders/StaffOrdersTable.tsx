"use client";

import { useMemo, useState } from "react";
import {
  MdSearch,
  MdCheckCircle,
  MdLocalShipping,
  MdInventory,
} from "react-icons/md";
import type { OrderListItem, UserDetail } from "@/types";
import { formatShortOrderCode } from "@/utils/order";

type StaffOrderUiStatus =
  | "pending"
  | "packing"
  | "shipping"
  | "done"
  | "cancelled";

interface StaffOrdersTableProps {
  orders: OrderListItem[];
  usersMap: Record<string, UserDetail>;
  loading?: boolean;
  onAdvanceStatus: (order: OrderListItem) => Promise<void> | void;
  pageIndex: number;
  totalPages: number;
  totalCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  onChangePage: (page: number) => void;
}

const STATUS_CFG: Record<
  StaffOrderUiStatus,
  { label: string; color: string; bg: string }
> = {
  pending: { label: "Chờ xử lý", color: "#FF8C42", bg: "#FF8C4218" },
  packing: { label: "Đóng gói", color: "#7C5CFC", bg: "#7C5CFC18" },
  shipping: { label: "Vận chuyển", color: "#17409A", bg: "#17409A18" },
  done: { label: "Hoàn thành", color: "#4ECDC4", bg: "#4ECDC418" },
  cancelled: { label: "Đã hủy", color: "#FF6B9D", bg: "#FF6B9D18" },
};

const TABS: { key: StaffOrderUiStatus | "all"; label: string }[] = [
  { key: "all", label: "Tất cả" },
  { key: "pending", label: "Chờ xử lý" },
  { key: "packing", label: "Đóng gói" },
  { key: "shipping", label: "Vận chuyển" },
  { key: "done", label: "Hoàn thành" },
];

function mapApiStatus(status: string): StaffOrderUiStatus {
  const s = status.toUpperCase();
  if (s === "PENDING") return "pending";
  if (s === "PACKING" || s === "PROCESSING") return "packing";
  if (s === "SHIPPING" || s === "SHIPPED") return "shipping";
  if (s === "DONE" || s === "DELIVERED" || s === "PAID") return "done";
  if (s === "CANCELLED") return "cancelled";
  return "pending";
}

function formatDateTime(dateText: string) {
  const d = new Date(dateText);
  const date = d.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
  });
  const time = d.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return { date, time };
}

export default function StaffOrdersTable({
  orders,
  usersMap,
  loading = false,
  onAdvanceStatus,
  pageIndex,
  totalPages,
  totalCount,
  hasPreviousPage,
  hasNextPage,
  onChangePage,
}: StaffOrdersTableProps) {
  const [tab, setTab] = useState<StaffOrderUiStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: orders.length };
    orders.forEach((o) => {
      const st = mapApiStatus(o.status);
      c[st] = (c[st] ?? 0) + 1;
    });
    return c;
  }, [orders]);

  const filtered = useMemo(
    () =>
      orders.filter((o) => {
        const st = mapApiStatus(o.status);
        if (tab !== "all" && st !== tab) return false;

        if (search) {
          const firstItem = o.orderItems[0];
          const customerName =
            (o.userId ? usersMap[o.userId]?.fullName : undefined) || "Khách lẻ";
          const productName =
            firstItem?.productName ||
            firstItem?.productNameSnapshot ||
            "Sản phẩm";
          const q = search.toLowerCase();

          return (
            o.orderNumber.toLowerCase().includes(q) ||
            formatShortOrderCode(o.orderNumber).toLowerCase().includes(q) ||
            customerName.toLowerCase().includes(q) ||
            productName.toLowerCase().includes(q)
          );
        }

        return true;
      }),
    [tab, search, orders, usersMap],
  );

  const handleAdvanceStatus = async (order: OrderListItem) => {
    setUpdatingId(order.orderId);
    try {
      await onAdvanceStatus(order);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="bg-white rounded-3xl overflow-hidden">
      <div className="p-5 border-b border-[#F4F7FF] flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="relative flex-1 w-full sm:max-w-xs">
          <MdSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] text-lg" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm mã đơn, khách hàng..."
            className="w-full bg-[#F4F7FF] rounded-2xl pl-10 pr-4 py-2.5 text-sm text-[#1A1A2E] placeholder-[#9CA3AF] outline-none focus:ring-2 focus:ring-[#17409A]/20 transition"
          />
        </div>
        <div className="flex gap-1 flex-wrap">
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                tab === key
                  ? "bg-[#17409A] text-white"
                  : "bg-[#F4F7FF] text-[#9CA3AF] hover:bg-[#EEF1FF] hover:text-[#17409A]"
              }`}
            >
              {label}
              <span
                className={`rounded-lg px-1.5 py-0.5 text-[10px] font-black ${
                  tab === key
                    ? "bg-white/20 text-white"
                    : "bg-white text-[#17409A]"
                }`}
              >
                {counts[key] ?? 0}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto hidden sm:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#F4F7FF]">
              {[
                "Mã đơn",
                "Khách hàng",
                "Sản phẩm",
                "Ngày",
                "Trạng thái",
                "Hành động",
              ].map((h) => (
                <th
                  key={h}
                  className="text-left text-[#9CA3AF] font-semibold text-xs uppercase tracking-wide px-5 py-3"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && filtered.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="text-center text-[#9CA3AF] text-sm py-10"
                >
                  Đang tải đơn hàng...
                </td>
              </tr>
            )}

            {!loading && filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="text-center text-[#9CA3AF] text-sm py-10"
                >
                  Không có đơn hàng nào
                </td>
              </tr>
            ) : (
              filtered.map((o) => {
                const st = mapApiStatus(o.status);
                const cfg = STATUS_CFG[st];
                const canAdvance = st === "pending" || st === "packing";
                const nextLabel =
                  st === "pending" ? "Bắt đầu đóng gói" : "Gửi vận chuyển";
                const firstItem = o.orderItems[0];
                const productName =
                  firstItem?.productName ||
                  firstItem?.productNameSnapshot ||
                  "Sản phẩm";
                const customerName =
                  (o.userId ? usersMap[o.userId]?.fullName : undefined) ||
                  "Khách lẻ";
                const avatar =
                  customerName.trim().charAt(0).toUpperCase() || "?";
                const { date, time } = formatDateTime(o.createdAt);

                return (
                  <tr
                    key={o.orderId}
                    className="border-b border-[#F4F7FF] last:border-0 hover:bg-[#F4F7FF]/60 transition-colors"
                  >
                    <td className="px-5 py-4">
                      <span className="font-black text-[#17409A] text-xs">
                        {formatShortOrderCode(o.orderNumber || o.orderId)}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-white text-sm shrink-0 bg-[#17409A]">
                          {avatar}
                        </div>
                        <span className="font-semibold text-[#1A1A2E] whitespace-nowrap">
                          {customerName}
                        </span>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <p className="text-[#374151] font-medium">
                        {productName}
                      </p>
                    </td>

                    <td className="px-5 py-4 whitespace-nowrap text-[#9CA3AF] text-xs">
                      {date} {time}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-xl"
                        style={{ color: cfg.color, backgroundColor: cfg.bg }}
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full inline-block"
                          style={{ backgroundColor: cfg.color }}
                        />
                        {cfg.label}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      {canAdvance ? (
                        <button
                          onClick={() => handleAdvanceStatus(o)}
                          disabled={updatingId === o.orderId}
                          className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl transition-colors cursor-pointer disabled:opacity-50 ${
                            st === "pending"
                              ? "bg-[#7C5CFC]/10 text-[#7C5CFC] hover:bg-[#7C5CFC]/20"
                              : "bg-[#17409A]/10 text-[#17409A] hover:bg-[#17409A]/20"
                          }`}
                        >
                          {st === "pending" ? (
                            <MdInventory className="text-sm" />
                          ) : (
                            <MdLocalShipping className="text-sm" />
                          )}
                          {updatingId === o.orderId
                            ? "Đang cập nhật..."
                            : nextLabel}
                        </button>
                      ) : (
                        <span className="flex items-center gap-1.5 text-xs text-[#9CA3AF]">
                          <MdCheckCircle className="text-[#4ECDC4]" />
                          {st === "done"
                            ? "Hoàn thành"
                            : st === "cancelled"
                              ? "Đã hủy"
                              : "Vận chuyển"}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="sm:hidden flex flex-col divide-y divide-[#F4F7FF]">
        {filtered.map((o) => {
          const st = mapApiStatus(o.status);
          const cfg = STATUS_CFG[st];
          const canAdvance = st === "pending" || st === "packing";
          const firstItem = o.orderItems[0];
          const productName =
            firstItem?.productName ||
            firstItem?.productNameSnapshot ||
            "Sản phẩm";
          const customerName =
            (o.userId ? usersMap[o.userId]?.fullName : undefined) || "Khách lẻ";
          const avatar = customerName.trim().charAt(0).toUpperCase() || "?";

          return (
            <div key={o.orderId} className="p-4 flex flex-col gap-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-white text-sm shrink-0 bg-[#17409A]">
                    {avatar}
                  </div>
                  <div>
                    <p className="font-bold text-[#1A1A2E] text-sm">
                      {customerName}
                    </p>
                    <p className="text-[#9CA3AF] text-xs">{productName}</p>
                    <p className="text-[#17409A] text-xs font-black">
                      {formatShortOrderCode(o.orderNumber || o.orderId)}
                    </p>
                  </div>
                </div>
                <span
                  className="text-xs font-bold px-2.5 py-1 rounded-xl"
                  style={{ color: cfg.color, backgroundColor: cfg.bg }}
                >
                  {cfg.label}
                </span>
              </div>

              {canAdvance && (
                <button
                  onClick={() => handleAdvanceStatus(o)}
                  disabled={updatingId === o.orderId}
                  className="flex items-center gap-1.5 bg-[#17409A] text-white text-xs font-bold px-3 py-1.5 rounded-xl cursor-pointer self-start disabled:opacity-50"
                >
                  {st === "pending" ? <MdInventory /> : <MdLocalShipping />}
                  {updatingId === o.orderId
                    ? "Đang cập nhật..."
                    : st === "pending"
                      ? "Bắt đầu đóng gói"
                      : "Gửi vận chuyển"}
                </button>
              )}
            </div>
          );
        })}

        {!loading && filtered.length === 0 && (
          <p className="text-center text-[#9CA3AF] text-sm py-10">
            Không có đơn hàng
          </p>
        )}
      </div>

      <div className="px-4 sm:px-5 py-4 border-t border-[#F4F7FF] flex items-center justify-between gap-3 flex-wrap">
        <p className="text-xs text-[#9CA3AF]">
          Trang <span className="font-black text-[#1A1A2E]">{pageIndex}</span> /{" "}
          {Math.max(1, totalPages)} · Tổng {totalCount} đơn
        </p>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onChangePage(Math.max(1, pageIndex - 1))}
            disabled={!hasPreviousPage || loading}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#F4F7FF] text-[#6B7280] hover:bg-[#E9EEFF] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Trang trước
          </button>

          <button
            onClick={() => onChangePage(Math.min(totalPages, pageIndex + 1))}
            disabled={!hasNextPage || loading}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#17409A] text-white hover:bg-[#13357f] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Trang sau
          </button>
        </div>
      </div>
    </div>
  );
}
