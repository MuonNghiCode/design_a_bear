"use client";

import { useState, useMemo } from "react";
import {
  MdSearch,
  MdRemoveRedEye,
  MdFileDownload,
  MdStar,
  MdEmail,
  MdPhone,
  MdClose,
  MdCalendarToday,
  MdShoppingCart,
  MdAccountBalanceWallet,
} from "react-icons/md";
import { GiPawPrint } from "react-icons/gi";
import {
  CUSTOMERS,
  ORDERS,
  type CustomerRow,
  type CustomerStatus,
  type OrderStatus,
} from "@/data/admin";

const ORDER_STATUS_CFG: Record<OrderStatus, { label: string; color: string }> =
  {
    pending: { label: "Chờ xử lý", color: "#FF8C42" },
    packing: { label: "Đóng gói", color: "#7C5CFC" },
    shipping: { label: "Vận chuyển", color: "#17409A" },
    done: { label: "Hoàn thành", color: "#4ECDC4" },
    cancelled: { label: "Đã hủy", color: "#FF6B9D" },
  };

// ── Config ──────────────────────────────────────────
const STATUS_CFG: Record<
  CustomerStatus,
  { label: string; color: string; bg: string }
> = {
  vip: { label: "VIP", color: "#7C5CFC", bg: "#7C5CFC18" },
  active: { label: "Hoạt động", color: "#4ECDC4", bg: "#4ECDC418" },
  new: { label: "Mới", color: "#17409A", bg: "#17409A18" },
  inactive: { label: "Không HĐ", color: "#9CA3AF", bg: "#9CA3AF18" },
};

const TIER_CFG: Record<string, { label: string; color: string; bg: string }> = {
  diamond: {
    label: "Diamond VIP",
    color: "#7C5CFC",
    bg: "linear-gradient(135deg,#7C5CFC18,#FF6B9D18)",
  },
  gold: {
    label: "Gold",
    color: "#FF8C42",
    bg: "linear-gradient(135deg,#FFD93D18,#FF8C4218)",
  },
  silver: { label: "Silver", color: "#4ECDC4", bg: "#4ECDC418" },
  bronze: { label: "Bronze", color: "#9CA3AF", bg: "#9CA3AF18" },
};

const TABS: { key: CustomerStatus | "all"; label: string }[] = [
  { key: "all", label: "Tất cả" },
  { key: "vip", label: "VIP" },
  { key: "active", label: "Hoạt động" },
  { key: "new", label: "Mới" },
  { key: "inactive", label: "Không HĐ" },
];

const COL_HEADS = [
  "Khách hàng",
  "Liên hệ",
  "Đơn hàng",
  "Chi tiêu",
  "Hạng",
  "Đơn gần nhất",
  "Trạng thái",
  "",
];

// ── Component ────────────────────────────────────────
export default function CustomersTable() {
  const [tab, setTab] = useState<CustomerStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<CustomerRow | null>(null);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: CUSTOMERS.length };
    CUSTOMERS.forEach((cust: CustomerRow) => {
      c[cust.status] = (c[cust.status] ?? 0) + 1;
    });
    return c;
  }, []);

  const filtered = useMemo(
    () =>
      CUSTOMERS.filter((cust: CustomerRow) => {
        if (tab !== "all" && cust.status !== tab) return false;
        if (search) {
          const q = search.toLowerCase();
          return (
            cust.name.toLowerCase().includes(q) ||
            cust.email.toLowerCase().includes(q) ||
            cust.id.toLowerCase().includes(q)
          );
        }
        return true;
      }),
    [tab, search],
  );

  return (
    <>
      <div className="bg-white rounded-3xl p-6">
        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div>
            <p className="text-[#9CA3AF] text-[10px] font-black tracking-[0.22em] uppercase mb-0.5">
              Danh sách
            </p>
            <p className="text-[#1A1A2E] font-black text-xl">
              Tất cả khách hàng
              <span className="text-[#9CA3AF] font-semibold text-sm ml-2">
                ({filtered.length})
              </span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="relative">
              <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] text-base pointer-events-none" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm tên, email..."
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

        {/* ── Tabs ── */}
        <div className="flex gap-1 mb-5 overflow-x-auto pb-1">
          {TABS.map(({ key, label }) => {
            const active = tab === key;
            return (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-all duration-150 ${
                  active
                    ? "bg-[#17409A] text-white shadow-sm"
                    : "bg-[#F4F7FF] text-[#9CA3AF] hover:bg-[#E8EEFF] hover:text-[#17409A]"
                }`}
              >
                {label}
                <span
                  className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${
                    active
                      ? "bg-white/20 text-white"
                      : "bg-white text-[#9CA3AF]"
                  }`}
                >
                  {counts[key] ?? 0}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── Table ── */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-[#9CA3AF]">
            <GiPawPrint className="text-[#E5E7EB]" style={{ fontSize: 52 }} />
            <p className="font-black text-sm">Không tìm thấy khách hàng</p>
            <p className="text-xs font-semibold">
              Thử thay đổi bộ lọc hoặc từ khoá tìm kiếm
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-6">
            <table className="w-full min-w-195">
              <thead>
                <tr>
                  {COL_HEADS.map((h) => (
                    <th
                      key={h}
                      className="text-left text-[9px] font-black text-[#9CA3AF] tracking-[0.18em] uppercase px-6 pb-3 first:pl-6 last:pr-6"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((cust: CustomerRow, idx: number) => {
                  const sCfg = STATUS_CFG[cust.status];
                  const tCfg = TIER_CFG[cust.tier];
                  const isLast = idx === filtered.length - 1;

                  return (
                    <tr
                      key={cust.id}
                      className={`group hover:bg-[#F8FAFF] transition-colors duration-150 ${
                        !isLast ? "border-b border-[#F4F7FF]" : ""
                      }`}
                    >
                      {/* Customer */}
                      <td className="px-6 py-3.5 first:pl-6">
                        <div className="flex items-center gap-3">
                          {/* Avatar */}
                          <div
                            className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-black text-sm shrink-0 group-hover:scale-105 transition-transform duration-200"
                            style={{ backgroundColor: cust.avatarColor }}
                          >
                            {cust.avatar}
                          </div>
                          <div className="min-w-0">
                            <p className="text-[#1A1A2E] font-bold text-sm truncate">
                              {cust.name}
                            </p>
                            <p className="text-[#9CA3AF] text-[10px] font-semibold truncate">
                              {cust.id}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="px-6 py-3.5">
                        <div className="flex flex-col gap-0.5">
                          <div className="flex items-center gap-1 text-[#9CA3AF]">
                            <MdEmail className="text-xs shrink-0" />
                            <span className="text-[11px] font-semibold truncate max-w-35">
                              {cust.email}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-[#9CA3AF]">
                            <MdPhone className="text-xs shrink-0" />
                            <span className="text-[11px] font-semibold">
                              {cust.phone}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Orders */}
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-1">
                          <span className="text-[#1A1A2E] font-black text-sm">
                            {cust.totalOrders}
                          </span>
                          <span className="text-[#9CA3AF] text-[10px] font-semibold">
                            đơn
                          </span>
                        </div>
                        <p className="text-[#9CA3AF] text-[9px] font-semibold truncate max-w-27.5 mt-0.5">
                          {cust.favoriteProduct}
                        </p>
                      </td>

                      {/* Spent */}
                      <td className="px-6 py-3.5">
                        <span className="text-[#1A1A2E] font-black text-sm">
                          {(cust.totalSpent / 1_000_000).toFixed(1)}
                          <span className="text-[#9CA3AF] font-semibold text-[10px] ml-0.5">
                            M VND
                          </span>
                        </span>
                        {cust.totalOrders > 0 && (
                          <p className="text-[#9CA3AF] text-[9px] font-semibold mt-0.5">
                            TB{" "}
                            {Math.round(
                              cust.totalSpent / cust.totalOrders / 1000,
                            )}
                            K / đơn
                          </p>
                        )}
                      </td>

                      {/* Tier */}
                      <td className="px-6 py-3.5">
                        <span
                          className="text-[10px] font-black px-2.5 py-1 rounded-xl whitespace-nowrap"
                          style={{
                            color: tCfg.color,
                            background: tCfg.bg,
                          }}
                        >
                          {tCfg.label}
                        </span>
                        {cust.status === "vip" && (
                          <div className="flex items-center gap-0.5 mt-1">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <MdStar
                                key={s}
                                className="text-[8px]"
                                style={{ color: "#FFD93D" }}
                              />
                            ))}
                          </div>
                        )}
                      </td>

                      {/* Last order */}
                      <td className="px-6 py-3.5">
                        <p className="text-[#1A1A2E] font-bold text-xs">
                          {cust.lastOrder}
                        </p>
                        <p className="text-[#9CA3AF] text-[9px] font-semibold mt-0.5">
                          Tham gia {cust.joinDate}
                        </p>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-3.5">
                        <span
                          className="text-[10px] font-black px-2.5 py-1 rounded-full"
                          style={{
                            color: sCfg.color,
                            backgroundColor: sCfg.bg,
                          }}
                        >
                          {sCfg.label}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="px-6 py-3.5 last:pr-6">
                        <button
                          className="w-8 h-8 rounded-xl flex items-center justify-center text-[#9CA3AF] hover:text-[#17409A] hover:bg-[#17409A]/8 transition-all duration-150"
                          title="Xem chi tiết"
                          onClick={() => setSelected(cust)}
                        >
                          <MdRemoveRedEye className="text-base" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Customer Detail Modal ── */}
      {selected &&
        (() => {
          const sCfg = STATUS_CFG[selected.status];
          const tCfg = TIER_CFG[selected.tier];
          const custOrders = ORDERS.filter((o) => o.customer === selected.name);
          return (
            <>
              {/* Backdrop + centering wrapper */}
              <div
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 flex items-center justify-center p-4"
                onClick={() => setSelected(null)}
              >
                {/* Modal card */}
                <div
                  className="bg-white rounded-3xl w-full max-w-2xl max-h-[88vh] flex flex-col overflow-hidden shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* ── HERO BAND ── */}
                  <div
                    className="relative p-6 shrink-0"
                    style={{
                      background: `linear-gradient(135deg, ${selected.avatarColor}, ${selected.avatarColor}bb)`,
                    }}
                  >
                    <button
                      onClick={() => setSelected(null)}
                      className="absolute top-4 right-4 w-8 h-8 rounded-xl bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
                    >
                      <MdClose className="text-base" />
                    </button>

                    {/* Avatar + name */}
                    <div className="flex items-center gap-4 mb-5">
                      <div className="w-16 h-16 rounded-2xl bg-white/25 flex items-center justify-center text-white font-black text-2xl shrink-0">
                        {selected.avatar}
                      </div>
                      <div className="min-w-0">
                        <p className="text-white font-black text-xl leading-tight">
                          {selected.name}
                        </p>
                        <p className="text-white/55 text-xs font-semibold mt-0.5">
                          {selected.id} · Tham gia {selected.joinDate}
                        </p>
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                          <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-white/20 text-white">
                            {sCfg.label}
                          </span>
                          <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-white/20 text-white">
                            {tCfg.label}
                          </span>
                          {selected.status === "vip" && (
                            <div className="flex gap-0.5">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <MdStar
                                  key={s}
                                  className="text-[#FFD93D] text-xs"
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Stats row */}
                    <div className="grid grid-cols-3 gap-2">
                      <div className="bg-white/15 backdrop-blur-sm rounded-2xl px-3 py-2.5 text-center">
                        <p className="text-white font-black text-2xl leading-none">
                          {selected.totalOrders}
                        </p>
                        <p className="text-white/50 text-[9px] font-semibold mt-0.5">
                          đơn hàng
                        </p>
                      </div>
                      <div className="bg-white/15 backdrop-blur-sm rounded-2xl px-3 py-2.5 text-center">
                        <p className="text-white font-black text-2xl leading-none">
                          {(selected.totalSpent / 1_000_000).toFixed(1)}M
                        </p>
                        <p className="text-white/50 text-[9px] font-semibold mt-0.5">
                          tổng chi tiêu
                        </p>
                      </div>
                      <div className="bg-white/15 backdrop-blur-sm rounded-2xl px-3 py-2.5 text-center">
                        <p className="text-white font-black text-2xl leading-none">
                          {selected.totalOrders > 0
                            ? `${Math.round(selected.totalSpent / selected.totalOrders / 1000)}K`
                            : "—"}
                        </p>
                        <p className="text-white/50 text-[9px] font-semibold mt-0.5">
                          TB / đơn
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* ── BODY ── */}
                  <div className="flex-1 overflow-y-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-[#F4F7FF]">
                      {/* LEFT: Contact + Info */}
                      <div className="p-6 space-y-5">
                        {/* Contact */}
                        <div>
                          <p className="text-[#9CA3AF] text-[9px] font-black uppercase tracking-[0.2em] mb-3">
                            Liên hệ
                          </p>
                          <div className="space-y-2.5">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-xl bg-[#17409A]/8 flex items-center justify-center shrink-0">
                                <MdEmail className="text-[#17409A] text-sm" />
                              </div>
                              <div className="min-w-0">
                                <p className="text-[#9CA3AF] text-[9px] font-semibold">
                                  Email
                                </p>
                                <p className="text-[#1A1A2E] text-xs font-bold truncate">
                                  {selected.email}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-xl bg-[#17409A]/8 flex items-center justify-center shrink-0">
                                <MdPhone className="text-[#17409A] text-sm" />
                              </div>
                              <div>
                                <p className="text-[#9CA3AF] text-[9px] font-semibold">
                                  Điện thoại
                                </p>
                                <p className="text-[#1A1A2E] text-xs font-bold">
                                  {selected.phone}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Timeline */}
                        <div>
                          <p className="text-[#9CA3AF] text-[9px] font-black uppercase tracking-[0.2em] mb-3">
                            Thông tin
                          </p>
                          <div className="space-y-2.5">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-xl bg-[#4ECDC4]/10 flex items-center justify-center shrink-0">
                                <MdCalendarToday className="text-[#4ECDC4] text-sm" />
                              </div>
                              <div>
                                <p className="text-[#9CA3AF] text-[9px] font-semibold">
                                  Ngày tham gia
                                </p>
                                <p className="text-[#1A1A2E] text-xs font-bold">
                                  {selected.joinDate}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-xl bg-[#FF8C42]/10 flex items-center justify-center shrink-0">
                                <MdShoppingCart className="text-[#FF8C42] text-sm" />
                              </div>
                              <div>
                                <p className="text-[#9CA3AF] text-[9px] font-semibold">
                                  Đơn gần nhất
                                </p>
                                <p className="text-[#1A1A2E] text-xs font-bold">
                                  {selected.lastOrder}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-xl bg-[#7C5CFC]/10 flex items-center justify-center shrink-0">
                                <MdStar className="text-[#7C5CFC] text-sm" />
                              </div>
                              <div>
                                <p className="text-[#9CA3AF] text-[9px] font-semibold">
                                  Sản phẩm yêu thích
                                </p>
                                <p className="text-[#1A1A2E] text-xs font-bold">
                                  {selected.favoriteProduct}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* RIGHT: Order History */}
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-[#9CA3AF] text-[9px] font-black uppercase tracking-[0.2em]">
                            Lịch sử đơn hàng
                          </p>
                          {selected.totalOrders > 0 && (
                            <span className="text-[9px] font-black text-[#17409A] bg-[#17409A]/8 px-2 py-0.5 rounded-full">
                              {selected.totalOrders} đơn
                            </span>
                          )}
                        </div>

                        {custOrders.length > 0 ? (
                          <div className="space-y-2.5">
                            {custOrders.map((o) => {
                              const oSt = ORDER_STATUS_CFG[o.status];
                              return (
                                <div
                                  key={o.id}
                                  className="border border-[#F4F7FF] hover:border-[#E8EEFF] rounded-2xl p-3.5 transition-colors"
                                >
                                  <div className="flex items-start justify-between gap-2 mb-2">
                                    <div className="min-w-0">
                                      <p className="text-[#1A1A2E] font-bold text-xs truncate">
                                        {o.product}
                                      </p>
                                      <p className="text-[#9CA3AF] text-[9px] font-semibold mt-0.5">
                                        {o.id} · {o.date} {o.time}
                                      </p>
                                    </div>
                                    <span
                                      className="text-[9px] font-black px-2 py-0.5 rounded-full shrink-0"
                                      style={{
                                        color: oSt.color,
                                        backgroundColor: oSt.color + "18",
                                      }}
                                    >
                                      {oSt.label}
                                    </span>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <p className="text-[#1A1A2E] font-black text-sm">
                                      {(o.amount / 1000).toFixed(0)}K
                                      <span className="text-[#9CA3AF] font-semibold text-[9px] ml-1">
                                        VND
                                      </span>
                                    </p>
                                    <span className="text-[#9CA3AF] text-[9px] font-semibold">
                                      {o.city}
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                            {selected.totalOrders > custOrders.length && (
                              <div className="border border-dashed border-[#E5E7EB] rounded-2xl p-3 text-center">
                                <p className="text-[#9CA3AF] text-xs font-semibold">
                                  + {selected.totalOrders - custOrders.length}{" "}
                                  đơn hàng khác
                                </p>
                                <p className="text-[#9CA3AF] text-[9px] mt-0.5">
                                  Xem trong module Đơn hàng
                                </p>
                              </div>
                            )}
                          </div>
                        ) : selected.totalOrders > 0 ? (
                          <div className="space-y-2.5">
                            <div className="border border-[#F4F7FF] rounded-2xl p-3.5">
                              <div className="flex items-start justify-between gap-2 mb-2">
                                <div className="min-w-0">
                                  <p className="text-[#1A1A2E] font-bold text-xs truncate">
                                    {selected.favoriteProduct}
                                  </p>
                                  <p className="text-[#9CA3AF] text-[9px] font-semibold mt-0.5">
                                    {selected.lastOrder}
                                  </p>
                                </div>
                                <span
                                  className="text-[9px] font-black px-2 py-0.5 rounded-full shrink-0"
                                  style={{
                                    color: "#4ECDC4",
                                    backgroundColor: "#4ECDC418",
                                  }}
                                >
                                  Hoàn thành
                                </span>
                              </div>
                              <p className="text-[#1A1A2E] font-black text-sm">
                                {Math.round(
                                  selected.totalSpent /
                                    selected.totalOrders /
                                    1000,
                                )}
                                K
                                <span className="text-[#9CA3AF] font-semibold text-[9px] ml-1">
                                  VND
                                </span>
                              </p>
                            </div>
                            {selected.totalOrders > 1 && (
                              <div className="border border-dashed border-[#E5E7EB] rounded-2xl p-3 text-center">
                                <p className="text-[#9CA3AF] text-xs font-semibold">
                                  + {selected.totalOrders - 1} đơn hàng khác
                                </p>
                                <p className="text-[#9CA3AF] text-[9px] mt-0.5">
                                  Xem trong module Đơn hàng
                                </p>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center py-12 text-center">
                            <MdShoppingCart
                              className="text-[#E5E7EB] mb-2"
                              style={{ fontSize: 36 }}
                            />
                            <p className="text-[#9CA3AF] font-black text-xs">
                              Chưa có đơn hàng
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          );
        })()}
    </>
  );
}
