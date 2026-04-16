"use client";

import Image from "next/image";
import {
  IoGiftOutline,
  IoShieldCheckmarkOutline,
  IoLockClosedOutline,
} from "react-icons/io5";
import { useCart } from "@/contexts/CartContext";
import { PawPrint, fmt } from "./checkout.atoms";
import { FREE_SHIP } from "./checkout.config";

interface OrderSummaryProps {
  shippingFee: number;
  discount: number;
  finalTotal: number;
  coupon: string;
  onCouponChange: (v: string) => void;
  onApplyCoupon: () => void;
  couponApplied: boolean;
  step: number;
  isCalculatingShipping?: boolean;
}

export function OrderSummary({
  shippingFee,
  discount,
  finalTotal,
  coupon,
  onCouponChange,
  onApplyCoupon,
  couponApplied,
  isCalculatingShipping = false,
}: OrderSummaryProps) {
  const { items, totalItems, totalPrice } = useCart();
  const freeShip = totalPrice >= FREE_SHIP;
  const barWidth = Math.min((totalPrice / FREE_SHIP) * 100, 100);

  return (
    <div
      className="h-full flex flex-col overflow-y-auto"
      style={{
        fontFamily: "'Nunito', sans-serif",
        backgroundColor: "#FFFFFF",
        borderLeft: "1px solid #E5E7EB",
      }}
    >
      {/* Header */}
      <div
        className="px-7 pt-8 pb-6 shrink-0"
        style={{ borderBottom: "1px solid #E5E7EB" }}
      >
        <div className="flex items-center gap-2.5 mb-1">
          <PawPrint color="#17409A" size={18} />
          <h3 className="text-lg font-black" style={{ color: "#1A1A2E" }}>
            Đơn hàng của bạn
          </h3>
        </div>
        <p className="text-xs" style={{ color: "#9CA3AF" }}>
          {totalItems} sản phẩm · {fmt(totalPrice)}
        </p>
      </div>

      {/* Free-ship progress */}
      <div
        className="mx-7 mt-5 mb-4 p-4 rounded-2xl shrink-0"
        style={{ backgroundColor: "#F4F7FF" }}
      >
        {freeShip ? (
          <div className="flex items-center gap-2">
            <IoGiftOutline style={{ color: "#4ECDC4" }} className="text-base" />
            <p className="text-xs font-bold" style={{ color: "#4ECDC4" }}>
              Miễn phí vận chuyển rồi!
            </p>
          </div>
        ) : (
          <>
            <div className="flex justify-between mb-2">
              <p className="text-xs" style={{ color: "#6B7280" }}>
                Còn thiếu để freeship
              </p>
              <p className="text-xs font-bold" style={{ color: "#17409A" }}>
                {fmt(FREE_SHIP - totalPrice)}
              </p>
            </div>
          </>
        )}
        <div
          className="h-1.5 rounded-full overflow-hidden"
          style={{ backgroundColor: "#E5E7EB" }}
        >
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${barWidth}%`,
              background: "linear-gradient(90deg, #4ECDC4, #45B7D1)",
            }}
          />
        </div>
      </div>

      {/* Items list */}
      <div className="flex-1 overflow-y-auto px-7 space-y-3 pb-4">
        {items.map((item) => (
          <div
            key={item.product.id}
            className="flex gap-3.5 items-center py-3"
            style={{ borderBottom: "1px solid #F3F4F6" }}
          >
            <div
              className="w-14 h-14 rounded-2xl overflow-hidden shrink-0 relative"
              style={{ backgroundColor: "#F0F4FF" }}
            >
              <Image
                src={item.product.image}
                alt={item.product.name}
                fill
                className="object-cover"
              />
              <div
                className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-white text-[10px] font-black flex items-center justify-center"
                style={{ backgroundColor: "#FF6B9D" }}
              >
                {item.quantity}
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <p
                className="text-sm font-bold leading-snug truncate"
                style={{ color: "#1A1A2E" }}
              >
                {item.product.name}
              </p>
              {item.product.badge && (
                <span
                  className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mt-0.5"
                  style={{
                    backgroundColor: `${item.product.badgeColor ?? "#17409A"}20`,
                    color: item.product.badgeColor ?? "#17409A",
                  }}
                >
                  {item.product.badge}
                </span>
              )}
            </div>

            <p
              className="text-sm font-black shrink-0"
              style={{ color: "#17409A" }}
            >
              {fmt(item.product.price * item.quantity)}
            </p>
          </div>
        ))}
      </div>

      {/* Coupon input */}
      {!couponApplied && (
        <div className="px-7 mb-4 shrink-0">
          <div
            className="flex gap-2 items-center rounded-2xl px-4 py-3"
            style={{
              backgroundColor: "#F4F7FF",
              border: "1.5px dashed #17409A40",
            }}
          >
            <IoGiftOutline
              className="text-base shrink-0"
              style={{ color: "#9CA3AF" }}
            />
            <input
              value={coupon}
              onChange={(e) => onCouponChange(e.target.value.toUpperCase())}
              placeholder="Mã giảm giá"
              className="flex-1 text-sm bg-transparent outline-none"
              style={{ color: "#1A1A2E", fontFamily: "'Nunito', sans-serif" }}
            />
            {coupon.length > 0 && (
              <button
                onClick={onApplyCoupon}
                className="text-xs font-bold px-3 py-1.5 rounded-xl transition-all duration-200 hover:scale-105 shrink-0"
                style={{ backgroundColor: "#17409A", color: "white" }}
              >
                Áp dụng
              </button>
            )}
          </div>
        </div>
      )}

      {couponApplied && (
        <div
          className="mx-7 mb-4 px-4 py-2.5 rounded-2xl flex items-center gap-2 shrink-0"
          style={{ backgroundColor: "rgba(78,205,196,0.12)" }}
        >
          <IoGiftOutline style={{ color: "#4ECDC4" }} />
          <p className="text-xs font-bold" style={{ color: "#4ECDC4" }}>
            Mã <b>{coupon}</b> — Giảm {fmt(50_000)}
          </p>
        </div>
      )}

      {/* Price breakdown */}
      <div
        className="px-7 pt-4 pb-6 shrink-0"
        style={{ borderTop: "1px solid #E5E7EB" }}
      >
        <div className="space-y-2.5 mb-4">
          {[
            ["Tạm tính", fmt(totalPrice)],
            [
              "Phí vận chuyển",
              isCalculatingShipping
                ? "Đang tính..."
                : shippingFee === 0
                  ? "Miễn phí"
                  : fmt(shippingFee),
            ],
            ...(discount > 0 ? [["Giảm giá", `−${fmt(discount)}`]] : []),
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between">
              <span className="text-xs" style={{ color: "#6B7280" }}>
                {k}
              </span>
              <span
                className="text-xs font-bold"
                style={{ color: k === "Giảm giá" ? "#4ECDC4" : "#374151" }}
              >
                {v}
              </span>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex-1 h-px" style={{ backgroundColor: "#E5E7EB" }} />
          <PawPrint color="#C4CAD9" size={14} />
          <div className="flex-1 h-px" style={{ backgroundColor: "#E5E7EB" }} />
        </div>

        <div className="flex justify-between items-end mb-1">
          <span className="text-sm font-bold" style={{ color: "#6B7280" }}>
            Tổng cộng
          </span>
          <span className="text-2xl font-black" style={{ color: "#17409A" }}>
            {fmt(finalTotal)}
          </span>
        </div>
        <p className="text-xs text-right" style={{ color: "#9CA3AF" }}>
          Đã bao gồm VAT
        </p>

        {/* Trust badges */}
        <div
          className="flex items-center gap-3 mt-5 pt-4"
          style={{ borderTop: "1px solid #F3F4F6" }}
        >
          {[
            { icon: IoShieldCheckmarkOutline, label: "An toàn" },
            { icon: IoLockClosedOutline, label: "Bảo mật" },
            { icon: IoGiftOutline, label: "Đổi trả 30 ngày" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-1">
              <Icon className="text-[11px]" style={{ color: "#9CA3AF" }} />
              <span className="text-[10px]" style={{ color: "#9CA3AF" }}>
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
