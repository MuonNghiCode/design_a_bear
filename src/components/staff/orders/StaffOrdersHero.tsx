"use client";

import { GiPawPrint } from "react-icons/gi";
import {
  MdTrendingUp,
  MdShoppingBag,
  MdCheckCircle,
  MdAccessTime,
  MdInventory,
} from "react-icons/md";
import { ORDERS } from "@/data/admin";

const pending = ORDERS.filter((o) => o.status === "pending").length;
const packing = ORDERS.filter((o) => o.status === "packing").length;
const shipping = ORDERS.filter((o) => o.status === "shipping").length;
const done = ORDERS.filter((o) => o.status === "done").length;
const today = ORDERS.length;

const PILLS = [
  {
    icon: MdShoppingBag,
    label: "Tổng đơn",
    value: today,
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
    label: "Đang đóng gói",
    value: packing,
    color: "bg-[#7C5CFC]/20",
  },
  {
    icon: MdCheckCircle,
    label: "Hoàn thành",
    value: done,
    color: "bg-[#4ECDC4]/20",
  },
];

export default function StaffOrdersHero() {
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
              {pending + packing}
            </span>
            <div className="pb-1.5 flex items-center gap-1.5 bg-white/15 backdrop-blur-sm rounded-2xl px-3 py-1.5">
              <MdTrendingUp className="text-[#4ECDC4] text-sm" />
              <span className="text-white text-xs font-bold">+3 đơn mới</span>
            </div>
          </div>
        </div>

        {/* Shipping badge */}
        <div className="shrink-0 flex flex-col items-center justify-center w-20 h-20 rounded-2xl bg-[#17409A]/40 border border-white/20 backdrop-blur-sm">
          <span className="text-white font-black text-xl leading-tight">
            {shipping}
          </span>
          <span className="text-white/60 text-[10px] font-semibold">
            vận chuyển
          </span>
        </div>
      </div>

      {/* Stat pills */}
      <div className="relative grid grid-cols-2 sm:grid-cols-4 gap-2">
        {PILLS.map(({ icon: Icon, label, value, color }) => (
          <div
            key={label}
            className={`${color} backdrop-blur-sm rounded-2xl px-3 py-2.5 flex flex-col gap-1`}
          >
            <Icon className="text-white/70 text-base" />
            <span className="text-white font-black text-lg leading-none">
              {value}
            </span>
            <span className="text-white/60 text-[11px] font-semibold">
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* Mini bar chart */}
      <div className="relative flex flex-col gap-1.5">
        {[
          { label: "Chờ xử lý", value: pending, max: today, color: "#FF8C42" },
          { label: "Đóng gói", value: packing, max: today, color: "#7C5CFC" },
          {
            label: "Vận chuyển",
            value: shipping,
            max: today,
            color: "#17409A",
          },
          { label: "Hoàn thành", value: done, max: today, color: "#4ECDC4" },
        ].map(({ label, value, max, color }) => (
          <div key={label} className="flex items-center gap-2">
            <span className="text-white/55 text-[11px] font-semibold w-24 shrink-0">
              {label}
            </span>
            <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${(value / max) * 100}%`,
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
