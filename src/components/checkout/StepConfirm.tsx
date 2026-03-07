"use client";

import {
  IoShieldCheckmarkOutline,
  IoHomeOutline,
  IoCheckmark,
} from "react-icons/io5";
import type { DeliveryForm } from "./checkout.types";
import { PAYMENT_OPTIONS } from "./checkout.atoms";

export function StepConfirm({
  form,
  method,
  agreed,
  setAgreed,
}: {
  form: DeliveryForm;
  method: string;
  agreed: boolean;
  setAgreed: (v: boolean) => void;
}) {
  const payOpt = PAYMENT_OPTIONS.find((p) => p.id === method)!;

  return (
    <div className="space-y-5 relative">
      {/* Watermark */}
      <div
        className="absolute top-0 right-0 text-[150px] font-black leading-none select-none pointer-events-none"
        style={{
          color: "rgba(23,64,154,0.12)",
          fontFamily: "'Nunito', sans-serif",
          lineHeight: 1,
          zIndex: 0,
        }}
        aria-hidden
      >
        03
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center"
            style={{ backgroundColor: "rgba(78,205,196,0.12)" }}
          >
            <IoShieldCheckmarkOutline
              className="text-xl"
              style={{ color: "#4ECDC4" }}
            />
          </div>
          <div>
            <h2
              className="text-xl font-black"
              style={{ color: "#1A1A2E", fontFamily: "'Nunito', sans-serif" }}
            >
              Xác nhận đơn hàng
            </h2>
            <p className="text-xs" style={{ color: "#9CA3AF" }}>
              Kiểm tra lại thông tin trước khi đặt nhé!
            </p>
          </div>
        </div>

        {/* Delivery recap */}
        <div
          className="rounded-3xl p-5 mb-4"
          style={{ backgroundColor: "#F8FAFF", border: "2px solid #E5E7EB" }}
        >
          <div className="flex items-center gap-2 mb-3">
            <IoHomeOutline style={{ color: "#17409A" }} />
            <p
              className="text-sm font-black"
              style={{ color: "#17409A", fontFamily: "'Nunito', sans-serif" }}
            >
              Địa chỉ giao hàng
            </p>
          </div>
          <div className="space-y-1">
            {(
              [
                ["Người nhận", form.name || "—"],
                ["Điện thoại", form.phone || "—"],
                ["Email", form.email || "—"],
                [
                  "Địa chỉ",
                  [
                    form.address,
                    form.wardName,
                    form.districtName,
                    form.provinceName,
                  ]
                    .filter(Boolean)
                    .join(", ") || "—",
                ],
                ...(form.note ? [["Ghi chú", form.note]] : []),
              ] as [string, string][]
            ).map(([k, v]) => (
              <div key={k} className="flex gap-2">
                <span
                  className="text-xs shrink-0 w-24"
                  style={{ color: "#9CA3AF" }}
                >
                  {k}
                </span>
                <span
                  className="text-xs font-semibold"
                  style={{ color: "#1A1A2E" }}
                >
                  {v}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Payment recap */}
        <div
          className="rounded-3xl p-5 mb-6"
          style={{
            backgroundColor: payOpt.bg,
            border: `2px solid ${payOpt.color}30`,
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{
                backgroundColor: `${payOpt.color}20`,
                color: payOpt.color,
              }}
            >
              <payOpt.Icon size={22} />
            </div>
            <div>
              <p
                className="text-sm font-black"
                style={{
                  color: payOpt.color,
                  fontFamily: "'Nunito', sans-serif",
                }}
              >
                {payOpt.label}
              </p>
              <p className="text-xs" style={{ color: "#9CA3AF" }}>
                {payOpt.brief}
              </p>
            </div>
          </div>
        </div>

        {/* Agreement */}
        <label className="flex items-start gap-3 cursor-pointer group">
          <div
            className="mt-0.5 w-5 h-5 rounded-lg shrink-0 flex items-center justify-center transition-all duration-200"
            style={{
              backgroundColor: agreed ? "#17409A" : "transparent",
              border: `2px solid ${agreed ? "#17409A" : "#D1D5DB"}`,
            }}
            onClick={() => setAgreed(!agreed)}
          >
            {agreed && <IoCheckmark className="text-white text-xs" />}
          </div>
          <p className="text-xs leading-relaxed" style={{ color: "#6B7280" }}>
            Tôi đồng ý với{" "}
            <span style={{ color: "#17409A" }} className="font-bold">
              Điều khoản dịch vụ
            </span>{" "}
            và{" "}
            <span style={{ color: "#17409A" }} className="font-bold">
              Chính sách bảo mật
            </span>{" "}
            của Design a Bear.
          </p>
        </label>
      </div>
    </div>
  );
}
