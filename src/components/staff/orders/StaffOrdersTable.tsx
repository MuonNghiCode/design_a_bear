"use client";

import { useState, useMemo } from "react";
import {
  MdSearch,
  MdCheckCircle,
  MdLocalShipping,
  MdInventory,
} from "react-icons/md";
import { ORDERS, type OrderRow, type OrderStatus } from "@/data/admin";

// Staff can only move: pending→packing, packing→shipping
// Staff CANNOT see: amount/revenue
// Staff CANNOT cancel or mark as done

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
];

export default function StaffOrdersTable() {
  const [tab, setTab] = useState<OrderStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState<OrderRow[]>(ORDERS);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: rows.length };
    rows.forEach((o) => {
      c[o.status] = (c[o.status] ?? 0) + 1;
    });
    return c;
  }, [rows]);

  const filtered = useMemo(
    () =>
      rows.filter((o) => {
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
    [tab, search, rows],
  );

  function advanceStatus(id: string) {
    setRows((prev) =>
      prev.map((o) => {
        if (o.id !== id) return o;
        if (o.status === "pending")
          return { ...o, status: "packing" as OrderStatus };
        if (o.status === "packing")
          return { ...o, status: "shipping" as OrderStatus };
        return o;
      }),
    );
  }

  return (
    <div className="bg-white rounded-3xl overflow-hidden">
      {/* Toolbar */}
      <div className="p-5 border-b border-[#F4F7FF] flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="relative flex-1 w-full sm:max-w-xs">
          <MdSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] text-lg" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm mã đơn, khách hàng…"
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

      {/* Table — desktop */}
      <div className="overflow-x-auto hidden sm:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#F4F7FF]">
              {[
                "Mã đơn",
                "Khách hàng",
                "Sản phẩm",
                "Khu vực",
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
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="text-center text-[#9CA3AF] text-sm py-10"
                >
                  Không có đơn hàng nào
                </td>
              </tr>
            ) : (
              filtered.map((o) => {
                const cfg = STATUS_CFG[o.status];
                const canAdvance =
                  o.status === "pending" || o.status === "packing";
                const nextLabel =
                  o.status === "pending"
                    ? "Bắt đầu đóng gói"
                    : "Gửi vận chuyển";
                return (
                  <tr
                    key={o.id}
                    className="border-b border-[#F4F7FF] last:border-0 hover:bg-[#F4F7FF]/60 transition-colors"
                  >
                    {/* ID */}
                    <td className="px-5 py-4">
                      <span className="font-black text-[#17409A] text-xs">
                        {o.id}
                      </span>
                    </td>

                    {/* Customer */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-white text-sm shrink-0"
                          style={{ backgroundColor: o.badgeColor }}
                        >
                          {o.avatar}
                        </div>
                        <span className="font-semibold text-[#1A1A2E] whitespace-nowrap">
                          {o.customer}
                        </span>
                      </div>
                    </td>

                    {/* Product */}
                    <td className="px-5 py-4">
                      <div>
                        <p className="text-[#374151] font-medium">
                          {o.product}
                        </p>
                        {o.badge && (
                          <span
                            className="text-[10px] font-black px-1.5 py-0.5 rounded-lg"
                            style={{
                              color: o.badgeColor,
                              backgroundColor: `${o.badgeColor}18`,
                            }}
                          >
                            {o.badge}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* City */}
                    <td className="px-5 py-4 text-[#9CA3AF] text-xs">
                      {o.city}
                    </td>

                    {/* Date + time */}
                    <td className="px-5 py-4 whitespace-nowrap text-[#9CA3AF] text-xs">
                      {o.date} {o.time}
                    </td>

                    {/* Status */}
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

                    {/* Action */}
                    <td className="px-5 py-4">
                      {canAdvance ? (
                        <button
                          onClick={() => advanceStatus(o.id)}
                          className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl transition-colors cursor-pointer ${
                            o.status === "pending"
                              ? "bg-[#7C5CFC]/10 text-[#7C5CFC] hover:bg-[#7C5CFC]/20"
                              : "bg-[#17409A]/10 text-[#17409A] hover:bg-[#17409A]/20"
                          }`}
                        >
                          {o.status === "pending" ? (
                            <MdInventory className="text-sm" />
                          ) : (
                            <MdLocalShipping className="text-sm" />
                          )}
                          {nextLabel}
                        </button>
                      ) : (
                        <span className="flex items-center gap-1.5 text-xs text-[#9CA3AF]">
                          <MdCheckCircle className="text-[#4ECDC4]" />
                          {o.status === "done" ? "Hoàn thành" : "Vận chuyển"}
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

      {/* Cards — mobile */}
      <div className="sm:hidden flex flex-col divide-y divide-[#F4F7FF]">
        {filtered.map((o) => {
          const cfg = STATUS_CFG[o.status];
          const canAdvance = o.status === "pending" || o.status === "packing";
          return (
            <div key={o.id} className="p-4 flex flex-col gap-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-white text-sm shrink-0"
                    style={{ backgroundColor: o.badgeColor }}
                  >
                    {o.avatar}
                  </div>
                  <div>
                    <p className="font-bold text-[#1A1A2E] text-sm">
                      {o.customer}
                    </p>
                    <p className="text-[#9CA3AF] text-xs">{o.product}</p>
                    <p className="text-[#17409A] text-xs font-black">{o.id}</p>
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
                  onClick={() => advanceStatus(o.id)}
                  className="flex items-center gap-1.5 bg-[#17409A] text-white text-xs font-bold px-3 py-1.5 rounded-xl cursor-pointer self-start"
                >
                  {o.status === "pending" ? (
                    <MdInventory />
                  ) : (
                    <MdLocalShipping />
                  )}
                  {o.status === "pending"
                    ? "Bắt đầu đóng gói"
                    : "Gửi vận chuyển"}
                </button>
              )}
            </div>
          );
        })}
        {filtered.length === 0 && (
          <p className="text-center text-[#9CA3AF] text-sm py-10">
            Không có đơn hàng
          </p>
        )}
      </div>
    </div>
  );
}
