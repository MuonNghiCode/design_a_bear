"use client";

import { IoSparklesOutline, IoCheckmark } from "react-icons/io5";
import { PAYMENT_OPTIONS } from "./checkout.atoms";

export function StepPayment({
  method,
  onChange,
}: {
  method: string;
  onChange: (m: string) => void;
}) {
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

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
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
              className="text-xl font-black"
              style={{ color: "#1A1A2E", fontFamily: "'Nunito', sans-serif" }}
            >
              Thanh toán như thế nào?
            </h2>
            <p className="text-xs" style={{ color: "#9CA3AF" }}>
              Chọn phương thức phù hợp với bạn nhất
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {PAYMENT_OPTIONS.map((opt) => {
            const selected = method === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => onChange(opt.id)}
                className="relative text-left rounded-3xl p-5 transition-all duration-300 hover:scale-[1.02]"
                style={{
                  backgroundColor: selected ? opt.bg : "#F8FAFF",
                  border: `2px solid ${selected ? opt.color : "#E5E7EB"}`,
                  boxShadow: selected
                    ? `0 0 0 3px ${opt.color}22, 0 8px 24px ${opt.color}18`
                    : "none",
                  transform: selected ? "translateY(-2px)" : "none",
                }}
              >
                {selected && (
                  <div
                    className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: opt.color }}
                  >
                    <IoCheckmark className="text-white text-xs" />
                  </div>
                )}

                {/* Icon — always on brand-tinted background */}
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3"
                  style={{
                    backgroundColor: `${opt.color}${selected ? "22" : "10"}`,
                    color: `${opt.color}${selected ? "" : "CC"}`,
                  }}
                >
                  <opt.Icon size={28} />
                </div>

                <p
                  className="font-black text-sm mb-1 leading-snug"
                  style={{
                    color: selected ? opt.color : "#1A1A2E",
                    fontFamily: "'Nunito', sans-serif",
                  }}
                >
                  {opt.label}
                </p>
                <p
                  className="text-xs leading-snug"
                  style={{ color: "#9CA3AF" }}
                >
                  {opt.brief}
                </p>
              </button>
            );
          })}
        </div>

        {/* Extra info for bank transfer */}
        {method === "bank" && (
          <div
            className="mt-4 rounded-3xl p-5"
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

        {(method === "momo" || method === "vnpay") && (
          <div
            className="mt-4 rounded-3xl p-5 flex items-center gap-4"
            style={{
              backgroundColor:
                method === "momo"
                  ? "rgba(174,32,112,0.04)"
                  : "rgba(0,102,204,0.04)",
              border: `1.5px dashed ${method === "momo" ? "#AE207040" : "#0066CC40"}`,
            }}
          >
            {/* QR placeholder */}
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center shrink-0"
              style={{
                backgroundColor: method === "momo" ? "#AE207015" : "#0066CC15",
              }}
            >
              <svg
                width="48"
                height="48"
                viewBox="0 0 48 48"
                fill="none"
                aria-hidden
              >
                <rect
                  x="4"
                  y="4"
                  width="16"
                  height="16"
                  rx="2"
                  stroke={method === "momo" ? "#AE2070" : "#0066CC"}
                  strokeWidth="2"
                />
                <rect
                  x="28"
                  y="4"
                  width="16"
                  height="16"
                  rx="2"
                  stroke={method === "momo" ? "#AE2070" : "#0066CC"}
                  strokeWidth="2"
                />
                <rect
                  x="4"
                  y="28"
                  width="16"
                  height="16"
                  rx="2"
                  stroke={method === "momo" ? "#AE2070" : "#0066CC"}
                  strokeWidth="2"
                />
                <rect
                  x="8"
                  y="8"
                  width="8"
                  height="8"
                  rx="1"
                  fill={method === "momo" ? "#AE2070" : "#0066CC"}
                  opacity="0.4"
                />
                <rect
                  x="32"
                  y="8"
                  width="8"
                  height="8"
                  rx="1"
                  fill={method === "momo" ? "#AE2070" : "#0066CC"}
                  opacity="0.4"
                />
                <rect
                  x="8"
                  y="32"
                  width="8"
                  height="8"
                  rx="1"
                  fill={method === "momo" ? "#AE2070" : "#0066CC"}
                  opacity="0.4"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="8"
                  fill={method === "momo" ? "#AE2070" : "#0066CC"}
                  opacity="0.3"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="4"
                  fill={method === "momo" ? "#AE2070" : "#0066CC"}
                />
              </svg>
            </div>
            <div>
              <p
                className="text-xs font-bold mb-1"
                style={{
                  color: method === "momo" ? "#AE2070" : "#0066CC",
                  fontFamily: "'Nunito', sans-serif",
                }}
              >
                Quét mã QR để thanh toán
              </p>
              <p
                className="text-xs leading-relaxed"
                style={{ color: "#9CA3AF" }}
              >
                Mở ứng dụng <b>{method === "momo" ? "MoMo" : "VNPay"}</b>, chọn
                quét mã QR và hoàn tất thanh toán.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
