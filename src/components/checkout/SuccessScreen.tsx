"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import gsap from "gsap";
import { IoCheckmarkCircle, IoArrowBack, IoHomeOutline } from "react-icons/io5";

export function SuccessScreen({ orderId }: { orderId: string }) {
  const confRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!confRef.current) return;
    const dots = confRef.current.querySelectorAll(".conf-dot");
    gsap.fromTo(
      dots,
      { y: 0, opacity: 1, scale: 0 },
      {
        y: () => -80 - Math.random() * 80,
        x: () => (Math.random() - 0.5) * 120,
        opacity: 0,
        scale: () => 0.5 + Math.random() * 1,
        duration: () => 0.8 + Math.random() * 0.6,
        stagger: 0.04,
        ease: "power3.out",
      },
    );
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-16 px-8 text-center relative overflow-hidden">
      {/* Confetti burst */}
      <div
        ref={confRef}
        className="absolute inset-0 pointer-events-none flex items-center justify-center"
      >
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="conf-dot absolute w-3 h-3 rounded-full"
            style={{
              backgroundColor: ["#17409A", "#FF6B9D", "#4ECDC4", "#F7C948"][
                i % 4
              ],
              transform: `rotate(${i * 18}deg)`,
            }}
          />
        ))}
      </div>

      {/* Bear mascot */}
      <div
        className="w-28 h-28 rounded-3xl mb-6 flex items-center justify-center shadow-xl"
        style={{
          background: "linear-gradient(135deg, #17409A 0%, #0E2A66 100%)",
        }}
      >
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none" aria-hidden>
          <ellipse cx="32" cy="38" rx="18" ry="16" fill="#D4A76A" />
          <circle cx="32" cy="22" r="14" fill="#D4A76A" />
          <circle cx="20" cy="11" r="6" fill="#D4A76A" />
          <circle cx="44" cy="11" r="6" fill="#D4A76A" />
          <circle cx="20" cy="11" r="3.5" fill="#C4956A" />
          <circle cx="44" cy="11" r="3.5" fill="#C4956A" />
          <circle cx="27" cy="20" r="2" fill="#4A3728" />
          <circle cx="37" cy="20" r="2" fill="#4A3728" />
          <path
            d="M28 27 Q32 31 36 27"
            stroke="#4A3728"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
          />
          <ellipse cx="32" cy="40" rx="10" ry="9" fill="#E8C99A" />
          <ellipse
            cx="14"
            cy="40"
            rx="5"
            ry="9"
            fill="#D4A76A"
            transform="rotate(-15 14 40)"
          />
          <ellipse
            cx="50"
            cy="40"
            rx="5"
            ry="9"
            fill="#D4A76A"
            transform="rotate(15 50 40)"
          />
          <path d="M6 6l1 3 3 1-3 1-1 3-1-3-3-1 3-1z" fill="#F7C948" />
          <path
            d="M55 8l0.8 2.4 2.4 0.8-2.4 0.8L55 15l-0.8-2.4-2.4-0.8 2.4-0.8z"
            fill="#FF6B9D"
          />
        </svg>
      </div>

      <div
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4 text-xs font-bold"
        style={{ backgroundColor: "rgba(78,205,196,0.1)", color: "#4ECDC4" }}
      >
        <IoCheckmarkCircle />
        Đặt hàng thành công!
      </div>

      <h2
        className="text-2xl font-black mb-2"
        style={{ color: "#1A1A2E", fontFamily: "'Nunito', sans-serif" }}
      >
        Cảm ơn bạn đã tin tưởng!
      </h2>
      <p className="text-sm leading-relaxed mb-2" style={{ color: "#6B7280" }}>
        Đơn hàng{" "}
        <span className="font-bold" style={{ color: "#17409A" }}>
          #{orderId}
        </span>{" "}
        đã được xác nhận.
      </p>
      <p className="text-sm leading-relaxed mb-8" style={{ color: "#6B7280" }}>
        Chú gấu của bạn đang được chuẩn bị và sẽ tới tay bé trong 2–5 ngày làm
        việc.
      </p>

      <div className="flex gap-3">
        <Link
          href="/products"
          className="flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold transition-all duration-200 hover:scale-105"
          style={{
            backgroundColor: "#F4F7FF",
            color: "#17409A",
            border: "2px solid #17409A30",
          }}
        >
          <IoArrowBack className="text-base" />
          Tiếp tục mua sắm
        </Link>
        <Link
          href="/"
          className="flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold text-white transition-all duration-200 hover:scale-105 hover:shadow-lg"
          style={{
            background: "linear-gradient(135deg, #17409A 0%, #0E2A66 100%)",
          }}
        >
          <IoHomeOutline className="text-base" />
          Về trang chủ
        </Link>
      </div>
    </div>
  );
}
