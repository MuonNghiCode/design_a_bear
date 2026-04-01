"use client";

import { useState } from "react";
import { IoSparklesOutline, IoCheckmark, IoLockClosed } from "react-icons/io5";
import { PAYMENT_OPTIONS } from "./checkout.atoms";
import { paymentService } from "@/services/payment.service";

export function StepPayment({
  method,
  onChange,
  coupon,
  onCouponChange,
  couponApplied,
  onCouponApplied,
  discount,
  isLoading,
}: {
  method: string;
  onChange: (m: string) => void;
  coupon: string;
  onCouponChange: (c: string) => void;
  couponApplied: boolean;
  onCouponApplied: (v: boolean) => void;
  discount: number;
  isLoading?: boolean;
}) {
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  const handleApplyCoupon = async () => {
    if (!coupon.trim()) {
      alert("Vui lòng nhập mã khuyến mãi");
      return;
    }

    setValidatingCoupon(true);
    try {
      const res = await paymentService.validatePromotion({ code: coupon });
      if (res.isSuccess) {
        onCouponApplied(true);
        alert("Áp dụng khuyến mãi thành công!");
      } else {
        alert(res.error?.description || "Mã khuyến mãi không hợp lệ");
      }
    } catch (error: any) {
      alert(error.message || "Lỗi xác thực mã khuyến mãi");
    } finally {
      setValidatingCoupon(false);
    }
  };

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
        02
      </div>

      <div className="relative z-10 space-y-6">
        {/* SECTION 1: PROMOTION INPUT */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center"
              style={{ backgroundColor: "rgba(78,205,196,0.08)" }}
            >
              <span className="text-xl font-black" style={{ color: "#4ECDC4" }}>
                🎟️
              </span>
            </div>
            <div>
              <h3
                className="text-lg font-black"
                style={{ color: "#1A1A2E", fontFamily: "'Nunito', sans-serif" }}
              >
                Mã khuyến mãi
              </h3>
              <p className="text-xs" style={{ color: "#9CA3AF" }}>
                Có mã? Nhập vào để nhận ưu đãi
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={coupon}
              onChange={(e) => onCouponChange(e.target.value.toUpperCase())}
              disabled={couponApplied || validatingCoupon || isLoading}
              placeholder="VD: SUMMER2024"
              className="flex-1 px-4 py-3 rounded-2xl text-sm outline-none transition-all disabled:opacity-50"
              style={{
                border: "1.5px solid #E5E7EB",
                backgroundColor: couponApplied ? "#F8FAFF" : "#FFFFFF",
              }}
              onKeyPress={(e) => {
                if (e.key === "Enter" && !couponApplied) {
                  handleApplyCoupon();
                }
              }}
            />
            <button
              onClick={handleApplyCoupon}
              disabled={couponApplied || validatingCoupon || isLoading}
              className="px-6 py-3 rounded-2xl font-bold text-sm transition-all disabled:opacity-50"
              style={{
                backgroundColor: couponApplied ? "#4ECDC4" : "#17409A",
                color: "white",
              }}
            >
              {validatingCoupon ? "..." : couponApplied ? "✓" : "Áp dụng"}
            </button>
          </div>

          {couponApplied && discount > 0 && (
            <div
              className="mt-2 rounded-2xl p-3 flex items-center justify-between"
              style={{
                backgroundColor: "rgba(78,205,196,0.08)",
                border: "1px solid #4ECDC4",
              }}
            >
              <span className="text-xs font-bold" style={{ color: "#4ECDC4" }}>
                Giảm giá
              </span>
              <span className="text-sm font-black" style={{ color: "#4ECDC4" }}>
                -{discount.toLocaleString("vi-VN")} đ
              </span>
            </div>
          )}
        </div>

        {/* SECTION 2: PAYMENT METHOD */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center"
              style={{ backgroundColor: "rgba(23,64,154,0.08)" }}
            >
              <IoSparklesOutline
                className="text-xl"
                style={{ color: "#17409A" }}
              />
            </div>
            <div>
              <h2
                className="text-lg font-black"
                style={{ color: "#1A1A2E", fontFamily: "'Nunito', sans-serif" }}
              >
                Thanh toán như thế nào?
              </h2>
              <p className="text-xs" style={{ color: "#9CA3AF" }}>
                Hiện tại chỉ hỗ trợ Chuyển khoản
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {PAYMENT_OPTIONS.map((opt) => {
              const isLocked = opt.id !== "bank";
              const selected = method === opt.id;

              return (
                <button
                  key={opt.id}
                  onClick={() => !isLocked && onChange(opt.id)}
                  disabled={isLocked || isLoading}
                  className="relative text-left rounded-3xl p-5 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: isLocked
                      ? "#F8FAFF"
                      : selected
                        ? opt.bg
                        : "#F8FAFF",
                    border: `2px solid ${isLocked ? "#E5E7EB" : selected ? opt.color : "#E5E7EB"}`,
                    boxShadow: selected
                      ? `0 0 0 3px ${opt.color}22, 0 8px 24px ${opt.color}18`
                      : "none",
                    transform: selected ? "translateY(-2px)" : "none",
                  }}
                >
                  {selected && !isLocked && (
                    <div
                      className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: opt.color }}
                    >
                      <IoCheckmark className="text-white text-xs" />
                    </div>
                  )}

                  {isLocked && (
                    <div
                      className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center"
                      style={{
                        backgroundColor: "#9CA3AF",
                      }}
                    >
                      <IoLockClosed className="text-white text-xs" />
                    </div>
                  )}

                  {/* Icon */}
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3"
                    style={{
                      backgroundColor: `${opt.color}${isLocked ? "08" : selected ? "22" : "10"}`,
                      color: `${opt.color}${
                        isLocked ? "80" : selected ? "" : "CC"
                      }`,
                    }}
                  >
                    <opt.Icon size={28} />
                  </div>

                  <p
                    className="font-black text-sm mb-1 leading-snug"
                    style={{
                      color: isLocked
                        ? "#9CA3AF"
                        : selected
                          ? opt.color
                          : "#1A1A2E",
                      fontFamily: "'Nunito', sans-serif",
                    }}
                  >
                    {opt.label}
                  </p>
                  <p
                    className="text-xs leading-snug"
                    style={{
                      color: isLocked ? "#B4B8BE" : "#9CA3AF",
                    }}
                  >
                    {isLocked ? "Đang phát triển" : opt.brief}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* SECTION 3: BANK TRANSFER INFO */}
        {method === "bank" && (
          <div
            className="rounded-3xl p-5"
            style={{
              backgroundColor: "rgba(23,64,154,0.04)",
              border: "1.5px dashed #17409A40",
            }}
          >
            <p className="text-xs font-bold mb-3" style={{ color: "#17409A" }}>
              Thông tin chuyển khoản
            </p>
            <div className="space-y-1.5">
              {[
                ["Ngân hàng", "Vietcombank"],
                ["Số tài khoản", "1023 4567 8910"],
                ["Chủ tài khoản", "DESIGN A BEAR CO., LTD"],
                ["Nội dung", "DAB — [Tên của bạn]"],
              ].map(([k, v]) => (
                <div key={k} className="flex items-center justify-between">
                  <span className="text-xs" style={{ color: "#9CA3AF" }}>
                    {k}
                  </span>
                  <span
                    className="text-xs font-bold"
                    style={{ color: "#1A1A2E" }}
                  >
                    {v}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
