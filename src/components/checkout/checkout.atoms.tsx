"use client";

import type { PaymentOption } from "./checkout.types";

/* ── Formatter ── */
export function fmt(n: number) {
  return n.toLocaleString("vi-VN") + " đ";
}

/* ── PawPrint ── */
export function PawPrint({
  className,
  color,
  size = 18,
}: {
  className?: string;
  color?: string;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={color ?? "currentColor"}
      className={className}
      aria-hidden="true"
    >
      <ellipse cx="9" cy="4" rx="2.5" ry="3" />
      <ellipse cx="15" cy="4" rx="2.5" ry="3" />
      <ellipse cx="5" cy="9" rx="2" ry="2.5" />
      <ellipse cx="19" cy="9" rx="2" ry="2.5" />
      <path d="M12 8c-4.5 0-8 3.5-8 8 0 2 1.5 4 4 4h8c2.5 0 4-2 4-4 0-4.5-3.5-8-8-8z" />
    </svg>
  );
}

/* ── Payment Icons ── */
function IconCOD({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden>
      <rect
        x="4"
        y="10"
        width="32"
        height="22"
        rx="4"
        fill="currentColor"
        opacity="0.15"
      />
      <rect
        x="4"
        y="10"
        width="32"
        height="22"
        rx="4"
        stroke="currentColor"
        strokeWidth="2"
      />
      <rect
        x="4"
        y="16"
        width="32"
        height="6"
        fill="currentColor"
        opacity="0.25"
      />
      <circle cx="12" cy="26" r="3" fill="currentColor" opacity="0.6" />
      <rect
        x="18"
        y="24"
        width="12"
        height="4"
        rx="2"
        fill="currentColor"
        opacity="0.6"
      />
    </svg>
  );
}

function IconBank({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden>
      <path d="M20 4L36 12H4L20 4Z" fill="currentColor" opacity="0.8" />
      <rect
        x="7"
        y="12"
        width="4"
        height="16"
        fill="currentColor"
        opacity="0.5"
      />
      <rect
        x="18"
        y="12"
        width="4"
        height="16"
        fill="currentColor"
        opacity="0.5"
      />
      <rect
        x="29"
        y="12"
        width="4"
        height="16"
        fill="currentColor"
        opacity="0.5"
      />
      <rect
        x="4"
        y="28"
        width="32"
        height="4"
        rx="2"
        fill="currentColor"
        opacity="0.8"
      />
    </svg>
  );
}

function IconMomo({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      aria-label="MoMo"
    >
      <circle cx="20" cy="20" r="20" fill="#AE2070" />
      <path
        d="M9 28 L9 13 L20 23 L31 13 L31 28"
        stroke="white"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

function IconVNPay({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      aria-label="VNPay"
    >
      <rect width="40" height="40" rx="7" fill="#0066CC" />
      <rect
        x="5"
        y="5"
        width="11"
        height="11"
        rx="2"
        stroke="white"
        strokeWidth="1.5"
        fill="none"
      />
      <rect x="7.5" y="7.5" width="5" height="5" rx="0.5" fill="white" />
      <rect
        x="24"
        y="5"
        width="11"
        height="11"
        rx="2"
        stroke="white"
        strokeWidth="1.5"
        fill="none"
      />
      <rect x="26.5" y="7.5" width="5" height="5" rx="0.5" fill="white" />
      <rect
        x="5"
        y="24"
        width="11"
        height="11"
        rx="2"
        stroke="white"
        strokeWidth="1.5"
        fill="none"
      />
      <rect x="7.5" y="26.5" width="5" height="5" rx="0.5" fill="white" />
      <rect
        x="24"
        y="24"
        width="5"
        height="2"
        rx="0.5"
        fill="white"
        opacity="0.85"
      />
      <rect
        x="24"
        y="28"
        width="11"
        height="2"
        rx="0.5"
        fill="white"
        opacity="0.85"
      />
      <rect
        x="24"
        y="32"
        width="7"
        height="2"
        rx="0.5"
        fill="white"
        opacity="0.85"
      />
      <rect
        x="33"
        y="24"
        width="2"
        height="6"
        rx="0.5"
        fill="white"
        opacity="0.85"
      />
    </svg>
  );
}

export const PAYMENT_OPTIONS: PaymentOption[] = [
  {
    id: "cod",
    label: "Tiền mặt khi nhận",
    brief: "Trả tại cửa, không cần thẻ",
    color: "#4ECDC4",
    bg: "rgba(78,205,196,0.08)",
    Icon: IconCOD,
  },
  {
    id: "bank",
    label: "Chuyển khoản",
    brief: "Ngân hàng nội địa / quốc tế",
    color: "#17409A",
    bg: "rgba(23,64,154,0.08)",
    Icon: IconBank,
  },
  {
    id: "momo",
    label: "Ví MoMo",
    brief: "Quét mã, thanh toán nhanh",
    color: "#AE2070",
    bg: "rgba(174,32,112,0.08)",
    Icon: IconMomo,
  },
  {
    id: "vnpay",
    label: "VNPay QR",
    brief: "Mọi ngân hàng, dễ dàng",
    color: "#0066CC",
    bg: "rgba(0,102,204,0.08)",
    Icon: IconVNPay,
  },
];
