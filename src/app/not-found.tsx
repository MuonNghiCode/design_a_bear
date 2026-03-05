"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { IoArrowBack, IoHomeOutline, IoBagOutline } from "react-icons/io5";
import gsap from "gsap";

export default function NotFound() {
  const containerRef = useRef<HTMLDivElement>(null);
  const bearRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const num4LeftRef = useRef<HTMLSpanElement>(null);
  const num4RightRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // Numbers slide in from sides
    if (num4LeftRef.current) {
      tl.fromTo(
        num4LeftRef.current,
        { x: -60, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.7 },
        0
      );
    }
    if (num4RightRef.current) {
      tl.fromTo(
        num4RightRef.current,
        { x: 60, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.7 },
        0
      );
    }

    // Bear bounces in from below
    if (bearRef.current) {
      tl.fromTo(
        bearRef.current,
        { y: 40, opacity: 0, scale: 0.85 },
        { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: "back.out(1.2)" },
        0.15
      );
    }

    // Text fades up
    if (textRef.current) {
      tl.fromTo(
        textRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 },
        0.5
      );
    }

    // Bear gentle float loop
    if (bearRef.current) {
      gsap.to(bearRef.current, {
        y: -10,
        duration: 2.5,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        delay: 1,
      });
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-[#F4F7FF] flex flex-col items-center justify-center px-6 relative overflow-hidden -mt-20"
    >
      {/* Decorative paw prints background */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        {[
          { top: "8%",  left: "5%",  size: 48, rot: -20, op: 0.06 },
          { top: "15%", right: "8%", size: 64, rot: 15,  op: 0.05 },
          { top: "55%", left: "3%",  size: 40, rot: 30,  op: 0.07 },
          { top: "70%", right: "5%", size: 56, rot: -10, op: 0.06 },
          { top: "85%", left: "20%", size: 36, rot: 25,  op: 0.05 },
          { top: "25%", left: "40%", size: 30, rot: -5,  op: 0.04 },
        ].map((p, i) => (
          <svg
            key={i}
            width={p.size}
            height={p.size}
            viewBox="0 0 64 64"
            fill="#17409A"
            style={{
              position: "absolute",
              top: p.top,
              left: "left" in p ? p.left : undefined,
              right: "right" in p ? p.right : undefined,
              opacity: p.op,
              transform: `rotate(${p.rot}deg)`,
            }}
          >
            {/* Paw print SVG */}
            <ellipse cx="32" cy="44" rx="16" ry="13" />
            <circle cx="14" cy="28" r="7" />
            <circle cx="50" cy="28" r="7" />
            <circle cx="23" cy="20" r="5.5" />
            <circle cx="41" cy="20" r="5.5" />
          </svg>
        ))}
      </div>

      {/* ── 4 🐻 4 ── */}
      <div className="flex items-center justify-center gap-2 md:gap-6 mb-6">
        {/* Left 4 */}
        <span
          ref={num4LeftRef}
          className="font-black text-[#17409A] select-none leading-none"
          style={{
            fontFamily: "'Nunito', sans-serif",
            fontSize: "clamp(5rem, 14vw, 10rem)",
            lineHeight: 1,
          }}
        >
          4
        </span>

        {/* Bear image replacing "0" */}
        <div
          ref={bearRef}
          className="relative flex-shrink-0"
          style={{ width: "clamp(6rem, 13vw, 11rem)", height: "clamp(6rem, 13vw, 11rem)" }}
        >
          <Image
            src="/teddy_bear.png"
            alt="Gấu bông lạc đường"
            fill
            className="object-contain drop-shadow-2xl"
            priority
          />
        </div>

        {/* Right 4 */}
        <span
          ref={num4RightRef}
          className="font-black text-[#17409A] select-none leading-none"
          style={{
            fontFamily: "'Nunito', sans-serif",
            fontSize: "clamp(5rem, 14vw, 10rem)",
            lineHeight: 1,
          }}
        >
          4
        </span>
      </div>

      {/* ── Text content ── */}
      <div ref={textRef} className="text-center max-w-md">
        <h1
          className="font-black text-[#1A1A2E] mb-3"
          style={{
            fontFamily: "'Nunito', sans-serif",
            fontSize: "clamp(1.6rem, 4vw, 2.4rem)",
          }}
        >
          Ôi! Chú gấu bị lạc rồi...
        </h1>

        <p className="text-[#6B7280] text-base leading-relaxed mb-8">
          Trang bạn đang tìm kiếm không tồn tại hoặc đã được chuyển đi nơi khác.
          Hãy để chú gấu dẫn bạn trở về nhé!
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 bg-[#17409A] text-white font-bold px-8 py-4 rounded-2xl shadow-lg hover:bg-[#0E2A66] transition-colors duration-200"
          >
            <IoHomeOutline className="text-xl" />
            Về trang chủ
          </Link>

          <Link
            href="/products"
            className="flex items-center justify-center gap-2 bg-white text-[#17409A] font-bold px-8 py-4 rounded-2xl border-2 border-[#17409A] hover:bg-[#17409A] hover:text-white transition-colors duration-200 shadow-lg"
          >
            <IoBagOutline className="text-xl" />
            Xem sản phẩm
          </Link>
        </div>

        {/* Back link */}
        <button
          onClick={() => window.history.back()}
          className="mt-6 flex items-center gap-2 text-[#6B7280] hover:text-[#17409A] text-sm font-medium transition-colors mx-auto"
        >
          <IoArrowBack className="text-base" />
          Quay lại trang trước
        </button>
      </div>

      {/* Google Font import — Nunito with Vietnamese subset */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&subset=vietnamese&display=swap');`}</style>
    </div>
  );
}
