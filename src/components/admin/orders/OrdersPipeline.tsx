import { useMemo } from "react";
import {
  MdInbox,
  MdShoppingBag,
  MdLocalShipping,
  MdVerified,
  MdClose,
} from "react-icons/md";
import type { OrderListItem } from "@/types";

const STAGE_ICONS = [
  MdInbox,
  MdShoppingBag,
  MdLocalShipping,
  MdVerified,
  MdClose,
];

interface OrdersPipelineProps {
  orders: OrderListItem[];
  loading?: boolean;
}

export default function OrdersPipeline({ orders, loading }: OrdersPipelineProps) {
  const pipelineData = useMemo(() => {
    const stages = [
      { label: "Chờ xử lý", color: "#FF8C42", count: 0, statuses: ["PENDING", "PAID", "AWAITING_PAYMENT"] },
      { label: "Đóng gói", color: "#7C5CFC", count: 0, statuses: ["PROCESSING", "PRINTING", "READY_FOR_PICKUP"] },
      { label: "Vận chuyển", color: "#14B8A6", count: 0, statuses: ["SHIPPING"] },
      { label: "Hoàn thành", color: "#4ECDC4", count: 0, statuses: ["COMPLETED"] },
      { label: "Đã hủy", color: "#FF6B9D", count: 0, statuses: ["CANCELLED", "REFUNDED"] },
    ];

    orders.forEach((o) => {
      const stage = stages.find((s) => s.statuses.includes(o.status));
      if (stage) stage.count++;
      else if (o.status === "PENDING") stages[0].count++; // Fallback
    });

    const total = orders.length;
    const maxCount = Math.max(...stages.map(s => s.count), 1);

    return { stages, total, maxCount };
  }, [orders]);

  return (
    <div className="relative bg-white rounded-3xl p-6 h-full flex flex-col min-h-[300px]">
      {loading && (
        <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-50 flex items-center justify-center rounded-3xl">
          <div className="text-[#17409A] font-black text-xs tracking-widest animate-pulse flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-[#17409A] rounded-full animate-bounce" />
            ĐANG TẢI...
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-[#9CA3AF] text-[10px] font-black tracking-[0.22em] uppercase mb-0.5">
            Tổng quan
          </p>
          <p className="text-[#1A1A2E] font-black text-lg">Luồng đơn hàng</p>
        </div>
        <span className="text-[10px] font-black text-[#17409A] bg-[#17409A]/8 px-3 py-1.5 rounded-full">
          {pipelineData.total} đơn
        </span>
      </div>

      {/* Pipeline stages */}
      <div className="flex items-stretch flex-1">
        {pipelineData.stages.map((stage, i) => {
          const Icon = STAGE_ICONS[i];
          const pct = pipelineData.total > 0 ? Math.round((stage.count / pipelineData.total) * 100) : 0;
          const barW = Math.max(6, Math.round((stage.count / pipelineData.maxCount) * 100));
          const isLast = i === pipelineData.stages.length - 1;

          return (
            <div key={stage.label} className="flex items-center flex-1 min-w-0">
              {/* Stage column */}
              <div className="flex flex-col items-center flex-1 gap-2.5 min-w-0 px-0.5">
                {/* Icon circle */}
                <div
                  className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 transition-transform duration-200 hover:scale-105"
                  style={{ backgroundColor: stage.color + "18" }}
                >
                  <Icon style={{ color: stage.color, fontSize: 22 }} />
                </div>

                {/* Count */}
                <span
                  className="font-black text-[#1A1A2E] leading-none"
                  style={{ fontSize: stage.count >= 100 ? 24 : 28 }}
                >
                  {stage.count}
                </span>

                {/* Label */}
                <p className="text-[9px] font-black text-[#9CA3AF] tracking-[0.15em] uppercase text-center leading-tight px-0.5 h-6 flex items-center justify-center">
                  {stage.label}
                </p>

                {/* Percentage pill */}
                <span
                  className="text-[9px] font-black px-2 py-0.5 rounded-full"
                  style={{
                    color: stage.color,
                    backgroundColor: stage.color + "18",
                  }}
                >
                  {pct}%
                </span>

                {/* Volume bar */}
                <div className="w-full h-1 bg-[#F4F7FF] rounded-full overflow-hidden mt-0.5">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${barW}%`, backgroundColor: stage.color }}
                  />
                </div>
              </div>

              {/* Arrow connector */}
              {!isLast && (
                <div className="shrink-0 w-5 text-center text-[#D1D5DB] font-black text-base select-none">
                  ›
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer note */}
      <p className="text-[#9CA3AF] text-[10px] font-semibold mt-4 pt-4 border-t border-[#F4F7FF]">
        Cập nhật theo thời gian thực · {new Date().toLocaleDateString("vi-VN", { month: "long", year: "numeric" })}
      </p>
    </div>
  );
}
