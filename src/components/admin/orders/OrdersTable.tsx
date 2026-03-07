"use client";

import { useState, useMemo } from "react";
import { MdSearch, MdRemoveRedEye, MdFileDownload } from "react-icons/md";
import { GiPawPrint } from "react-icons/gi";
import { ORDERS, type OrderRow, type OrderStatus } from "@/data/admin";

const STATUS_CFG: Record<
  OrderStatus,
  { label: string; color: string; bg: string }
> = {
  pending: { label: "Chờ xử lý", color: "#FF8C42", bg: "#FF8C4218" },
  packing: { label: "Đóng gói", color: "#7C5CFC", bg: "#7C5CFC18" },
  shipping: { label: "Vận chuyển", color: "#17409A", bg: "#17409A18" },
  done: { label: "Hoàn thành", color: "#4ECDC4", bg: "#4ECDC418" },
  cancelled: { label: "Đã hủy", color: "#FF6B9D", bg: "#FF6B9D18" },
};

const TABS: { key: OrderStatus | "all"; label: string }[] = [
  { key: "all", label: "Tất cả" },
  { key: "pending", label: "Chờ xử lý" },
  { key: "packing", label: "Đóng gói" },
  { key: "shipping", label: "Vận chuyển" },
  { key: "done", label: "Hoàn thành" },
  { key: "cancelled", label: "Đã hủy" },
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

export default function OrdersTable() {
  const [tab, setTab] = useState<OrderStatus | "all">("all");
  const [search, setSearch] = useState("");

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: ORDERS.length };
    ORDERS.forEach((o: OrderRow) => {
      c[o.status] = (c[o.status] ?? 0) + 1;
    });
    return c;
  }, []);

  const filtered = useMemo(
    () =>
      ORDERS.filter((o: OrderRow) => {
        if (tab !== "all" && o.status !== tab) return false;
        if (search) {
          const q = search.toLowerCase();
          return (
            o.id.toLowerCase().includes(q) ||
            o.customer.toLowerCase().includes(q) ||
            o.product.toLowerCase().includes(q)
          );
        }
        return true;
      }),
    [tab, search],
  );

  return (
    <div className="bg-white rounded-3xl p-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div>
          <p className="text-[#9CA3AF] text-[10px] font-black tracking-[0.22em] uppercase mb-0.5">
            Danh sách
          </p>
          <p className="text-[#1A1A2E] font-black text-xl">Tất cả đơn hàng</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative">
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] text-base pointer-events-none" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm đơn, khách hàng..."
              className="bg-[#F4F7FF] text-[#1A1A2E] text-sm font-semibold placeholder:text-[#9CA3AF] rounded-xl pl-9 pr-4 py-2.5 outline-none border-2 border-transparent focus:border-[#17409A]/20 transition-colors w-52"
            />
          </div>
          {/* Export */}
          <button className="flex items-center gap-1.5 bg-[#17409A] text-white text-xs font-black px-4 py-2.5 rounded-xl hover:bg-[#0f2d70] transition-colors whitespace-nowrap">
            <MdFileDownload className="text-sm" />
            Xuất CSV
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
            {filtered.map((order: OrderRow, i: number) => {
              const st = STATUS_CFG[order.status];
              const avatarColor = AVATAR_COLORS[i % AVATAR_COLORS.length];

              return (
                <tr
                  key={order.id}
                  className="group border-t border-[#F4F7FF] hover:bg-[#F8F9FF] transition-colors duration-150 cursor-pointer"
                >
                  {/* Order ID */}
                  <td className="py-3 pr-4">
                    <span className="text-[11px] font-black text-[#17409A] bg-[#17409A]/8 px-2.5 py-1 rounded-lg tracking-wide font-mono">
                      {order.id}
                    </span>
                  </td>

                  {/* Customer */}
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-white font-black text-xs group-hover:scale-105 transition-transform duration-200"
                        style={{ backgroundColor: avatarColor }}
                      >
                        {order.avatar}
                      </div>
                      <div>
                        <p className="text-[#1A1A2E] font-bold text-sm leading-tight">
                          {order.customer}
                        </p>
                        <p className="text-[#9CA3AF] text-[10px] font-semibold leading-tight">
                          {order.city}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Product */}
                  <td className="py-3 pr-4">
                    <p className="text-[#1A1A2E] font-semibold text-sm leading-tight">
                      {order.product}
                    </p>
                    {order.badge && (
                      <span
                        className="text-[9px] font-black px-2 py-0.5 rounded-full mt-0.5 inline-block"
                        style={{
                          color: order.badgeColor,
                          backgroundColor: order.badgeColor + "18",
                        }}
                      >
                        {order.badge}
                      </span>
                    )}
                  </td>

                  {/* Amount */}
                  <td className="py-3 pr-4 whitespace-nowrap">
                    <span className="text-[#1A1A2E] font-black text-sm">
                      {(order.amount / 1000).toFixed(0)}K
                    </span>
                    <span className="text-[#9CA3AF] text-[10px] font-semibold ml-0.5">
                      đ
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-1.5">
                      <span
                        className="w-1.5 h-1.5 rounded-full shrink-0"
                        style={{ backgroundColor: st.color }}
                      />
                      <span
                        className="text-[10px] font-black px-2.5 py-1 rounded-full whitespace-nowrap"
                        style={{ color: st.color, backgroundColor: st.bg }}
                      >
                        {st.label}
                      </span>
                    </div>
                  </td>

                  {/* Date */}
                  <td className="py-3 pr-4">
                    <p className="text-[#4B5563] font-semibold text-[11px] leading-tight">
                      {order.date}
                    </p>
                    <p className="text-[#9CA3AF] text-[10px] font-semibold leading-tight">
                      {order.time}
                    </p>
                  </td>

                  {/* Action */}
                  <td className="py-3">
                    <button
                      className="w-8 h-8 rounded-xl flex items-center justify-center text-[#9CA3AF] hover:text-[#17409A] hover:bg-[#17409A]/10 transition-all opacity-0 group-hover:opacity-100 duration-150"
                      title="Xem chi tiết"
                    >
                      <MdRemoveRedEye className="text-base" />
                    </button>
                  </td>
                </tr>
              );
            })}
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
            <span className="text-[#1A1A2E] font-black">{filtered.length}</span>{" "}
            / {ORDERS.length} đơn hàng
          </p>
          <div className="flex items-center gap-1">
            {[1, 2, 3].map((p) => (
              <button
                key={p}
                className={`w-7 h-7 rounded-lg text-[11px] font-black transition-colors ${
                  p === 1
                    ? "bg-[#17409A] text-white"
                    : "text-[#9CA3AF] hover:bg-[#F4F7FF]"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
