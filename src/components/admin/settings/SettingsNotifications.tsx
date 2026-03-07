"use client";

import { useState } from "react";
import { MdNotifications } from "react-icons/md";

const NOTIF_LIST = [
  { key: "newOrder", label: "Đơn hàng mới", desc: "Khi có đơn được đặt" },
  {
    key: "orderUpdate",
    label: "Cập nhật đơn hàng",
    desc: "Trạng thái giao hàng thay đổi",
  },
  {
    key: "newReview",
    label: "Đánh giá mới",
    desc: "Khi khách để lại phản hồi",
  },
  { key: "lowStock", label: "Tồn kho thấp", desc: "Sản phẩm sắp hết hàng" },
  {
    key: "dailyReport",
    label: "Báo cáo hàng ngày",
    desc: "Tổng kết doanh thu mỗi ngày",
  },
  { key: "security", label: "Cảnh báo bảo mật", desc: "Đăng nhập bất thường" },
];

function Toggle({
  on,
  onToggle,
  accent = "#17409A",
}: {
  on: boolean;
  onToggle: () => void;
  accent?: string;
}) {
  return (
    <button
      role="switch"
      aria-checked={on}
      onClick={onToggle}
      className="relative shrink-0 rounded-full transition-colors duration-300 focus:outline-none"
      style={{
        width: 44,
        height: 24,
        backgroundColor: on ? accent : "#E5E7EB",
      }}
    >
      <span
        className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-md transition-all duration-300"
        style={{ left: on ? 24 : 4 }}
      />
    </button>
  );
}

export default function SettingsNotifications() {
  const [states, setStates] = useState<Record<string, boolean>>({
    newOrder: true,
    orderUpdate: true,
    newReview: false,
    lowStock: true,
    dailyReport: false,
    security: true,
  });

  function toggle(key: string) {
    setStates((v) => ({ ...v, [key]: !v[key] }));
  }

  const activeCount = Object.values(states).filter(Boolean).length;

  return (
    <div className="bg-white rounded-3xl p-6 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#7C5CFC]/10 flex items-center justify-center shrink-0">
            <MdNotifications className="text-[#7C5CFC] text-xl" />
          </div>
          <div>
            <p className="text-[#9CA3AF] text-[10px] font-black tracking-[0.22em] uppercase">
              Cài đặt
            </p>
            <p className="text-[#1A1A2E] font-black text-lg">Thông báo</p>
          </div>
        </div>
        <span className="bg-[#7C5CFC]/10 text-[#7C5CFC] font-black text-xs px-3 py-1 rounded-full">
          {activeCount}/{NOTIF_LIST.length} bật
        </span>
      </div>

      {/* Toggle list */}
      <div className="flex flex-col flex-1 justify-between">
        {NOTIF_LIST.map((s) => (
          <div
            key={s.key}
            className="flex items-center justify-between py-3 px-3 rounded-2xl hover:bg-[#F4F7FF] transition-colors cursor-pointer"
            onClick={() => toggle(s.key)}
          >
            <div>
              <p
                className={`text-sm font-bold transition-colors ${
                  states[s.key] ? "text-[#1A1A2E]" : "text-[#9CA3AF]"
                }`}
              >
                {s.label}
              </p>
              <p className="text-[#9CA3AF] text-[11px] font-semibold">
                {s.desc}
              </p>
            </div>
            <Toggle
              on={states[s.key]}
              onToggle={() => toggle(s.key)}
              accent="#7C5CFC"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
