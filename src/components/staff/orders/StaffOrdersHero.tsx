"use client";

import { GiPawPrint } from "react-icons/gi";
import {
  MdTrendingUp,
  MdShoppingBag,
  MdCheckCircle,
  MdAccessTime,
  MdInventory,
} from "react-icons/md";
import type { OrderListItem } from "@/types";

interface StaffOrdersHeroProps {
  orders: OrderListItem[];
  loading?: boolean;
}

export default function StaffOrdersHero({
  orders,
  loading = false,
}: StaffOrdersHeroProps) {
  const pending = orders.filter(
    (o) => o.status?.toUpperCase() === "PENDING",
  ).length;
  const paid = orders.filter(
    (o) => o.status?.toUpperCase() === "PAID",
  ).length;
  const processing = orders.filter(
    (o) => o.status?.toUpperCase() === "PROCESSING",
  ).length;
  const completed = orders.filter((o) =>
    ["COMPLETED", "DELIVERED"].includes(o.status?.toUpperCase()),
  ).length;
  const refunded = orders.filter(
    (o) => o.status?.toUpperCase() === "REFUNDED",
  ).length;
  const total = orders.length;

  const pills = [
    {
      icon: MdShoppingBag,
      label: "Tổng đơn",
      value: total,
      color: "bg-white/15",
    },
    {
      icon: MdAccessTime,
      label: "Chờ xử lý",
      value: pending,
      color: "bg-[#FF8C42]/20",
    },
    {
      icon: MdInventory,
      label: "Đã thanh toán",
      value: paid,
      color: "bg-[#7C5CFC]/20",
    },
    {
      icon: MdCheckCircle,
      label: "Hoàn thành",
      value: completed,
      color: "bg-[#4ECDC4]/20",
    },
  ];

  return (
    <div className="relative bg-[#17409A] rounded-3xl overflow-hidden p-6 sm:p-8 flex flex-col gap-5 min-h-56">
      <GiPawPrint
        className="absolute -top-12 -right-10 text-white/4 pointer-events-none select-none"
        style={{ fontSize: 300 }}
      />
      <GiPawPrint
        className="absolute -bottom-14 -left-12 text-white/3 pointer-events-none select-none"
        style={{ fontSize: 250 }}
      />

      <div className="relative flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="text-white/55 text-[10px] font-black tracking-[0.25em] uppercase mb-2">
            Đơn cần xử lý hôm nay
          </p>
          <div className="flex items-end gap-3">
            <span
              className="text-white font-black leading-none"
              style={{ fontSize: "clamp(3.5rem, 6.5vw, 6rem)" }}
            >
              {loading ? "..." : pending + paid + processing}
            </span>
            <div className="pb-1.5 flex items-center gap-1.5 bg-white/15 backdrop-blur-sm rounded-2xl px-3 py-1.5">
              <MdTrendingUp className="text-[#4ECDC4] text-sm" />
              <span className="text-white text-xs font-bold">
                Đơn cần xử lý
              </span>
            </div>
          </div>
        </div>

        <div className="shrink-0 flex flex-col items-center justify-center w-20 h-20 rounded-2xl bg-[#17409A]/40 border border-white/20 backdrop-blur-sm">
          <span className="text-white font-black text-xl leading-tight">
            {loading ? "..." : processing}
          </span>
          <span className="text-white/60 text-[10px] font-semibold">
            xử lý
          </span>
        </div>
      </div>

      <div className="relative grid grid-cols-2 sm:grid-cols-4 gap-2">
        {pills.map(({ icon: Icon, label, value, color }) => (
          <div
            key={label}
            className={`${color} backdrop-blur-sm rounded-2xl px-3 py-2.5 flex flex-col gap-1`}
          >
            <Icon className="text-white/70 text-base" />
            <span className="text-white font-black text-lg leading-none">
              {loading ? "..." : value}
            </span>
            <span className="text-white/60 text-[11px] font-semibold">
              {label}
            </span>
          </div>
        ))}
      </div>

      <div className="relative flex flex-col gap-1.5">
        {[
          { label: "Chờ xử lý", value: pending, max: total, color: "#FF8C42" },
          { label: "Đã thanh toán", value: paid, max: total, color: "#1D4ED8" },
          {
            label: "Đang xử lý",
            value: processing,
            max: total,
            color: "#7C5CFC",
          },
          { label: "Hoàn thành", value: completed, max: total, color: "#4ECDC4" },
          { label: "Hoàn tiền", value: refunded, max: total, color: "#6B7280" },
        ].map(({ label, value, max, color }) => (
          <div key={label} className="flex items-center gap-2">
            <span className="text-white/55 text-[11px] font-semibold w-24 shrink-0">
              {label}
            </span>
            <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${max > 0 ? (value / max) * 100 : 0}%`,
                  backgroundColor: color,
                }}
              />
            </div>
            <span className="text-white/50 text-[11px] font-semibold w-5 text-right">
              {value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
