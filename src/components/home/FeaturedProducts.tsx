"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { IoArrowForward } from "react-icons/io5";
import ProductCard, { type ProductCardProps } from "../shared/ProductCard";

gsap.registerPlugin(ScrollTrigger);

/* ────────────────────────────────────────────
   Sample product data
   ──────────────────────────────────────────── */
const PRODUCTS: ProductCardProps[] = [
  {
    id: "bear-brown-happy",
    name: "Gấu Nâu Brownie Hạnh Phúc",
    description:
      "Chú gấu với nụ cười thân thiện, chất liệu bông tơ tằm siêu nhẹ.",
    price: 450000,
    image: "/teddy_bear.png",
    badge: "Toán",
    badgeColor: "#17409A",
  },
  {
    id: "bear-pink-melody",
    name: "Gấu Hồng Melody Âm Nhạc",
    description:
      "Dạy bé yêu âm nhạc qua hàng trăm bài hát và giai điệu vui nhộn.",
    price: 520000,
    image: "/teddy_bear.png",
    badge: "Âm nhạc",
    badgeColor: "#FF6B9D",
  },
  {
    id: "bear-blue-einstein",
    name: "Gấu Xanh Einstein Khám Phá",
    description:
      "Trả lời hàng nghìn câu hỏi khoa học, kích thích trí tò mò của bé.",
    price: 580000,
    image: "/teddy_bear.png",
    badge: "Khoa học",
    badgeColor: "#4ECDC4",
  },
  {
    id: "bear-cream-story",
    name: "Gấu Kem Storyteller Kể Chuyện",
    description:
      "Kể chuyện cổ tích tương tác, giọng kể ấm áp theo cảm xúc của bé.",
    price: 490000,
    image: "/teddy_bear.png",
    badge: "Ngôn ngữ",
    badgeColor: "#7C5CFC",
  },
];

/* ────────────────────────────────────────────
   Component
   ──────────────────────────────────────────── */
export default function FeaturedProducts() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    // Heading animation
    if (headingRef.current) {
      gsap.fromTo(
        headingRef.current,
        { y: 25, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: headingRef.current,
            start: "top 85%",
            once: true,
          },
        },
      );
    }

    // Cards stagger
    if (gridRef.current) {
      gsap.fromTo(
        gridRef.current.children,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 80%",
            once: true,
          },
        },
      );
    }

    // CTA animation
    if (ctaRef.current) {
      gsap.fromTo(
        ctaRef.current,
        { y: 15, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ctaRef.current,
            start: "top 90%",
            once: true,
          },
        },
      );
    }

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-32 md:py-40"
      style={{
        backgroundColor: "#F4F7FF",
        fontFamily: "'Nunito', sans-serif",
      }}
    >
      {/* ── Subtle decorative background ── */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden opacity-[0.02]">
        <div
          className="absolute top-20 left-10 w-96 h-96 rounded-full"
          style={{ backgroundColor: "#17409A" }}
        />
        <div
          className="absolute bottom-20 right-10 w-96 h-96 rounded-full"
          style={{ backgroundColor: "#4A90E2" }}
        />
      </div>

      {/* ── Decorative paw prints & stars ── */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        {[
          { top: "8%", right: "5%", size: 45, rot: 15, op: 0.04 },
          { top: "55%", left: "4%", size: 38, rot: -20, op: 0.05 },
          { bottom: "12%", right: "12%", size: 32, rot: 25, op: 0.04 },
        ].map((p, i) => (
          <svg
            key={i}
            width={p.size}
            height={p.size}
            viewBox="0 0 64 64"
            fill="#17409A"
            style={{
              position: "absolute",
              top: "top" in p ? p.top : undefined,
              bottom: "bottom" in p ? p.bottom : undefined,
              left: "left" in p ? p.left : undefined,
              right: "right" in p ? p.right : undefined,
              opacity: p.op,
              transform: `rotate(${p.rot}deg)`,
            }}
          >
            <ellipse cx="32" cy="44" rx="16" ry="13" />
            <circle cx="14" cy="28" r="7" />
            <circle cx="50" cy="28" r="7" />
            <circle cx="23" cy="20" r="5.5" />
            <circle cx="41" cy="20" r="5.5" />
          </svg>
        ))}
        {/* Stars */}
        {[
          { top: "15%", left: "8%", size: 24, op: 0.06 },
          { top: "70%", right: "6%", size: 20, op: 0.05 },
        ].map((s, i) => (
          <svg
            key={`star-${i}`}
            width={s.size}
            height={s.size}
            viewBox="0 0 24 24"
            fill="#FFD93D"
            style={{
              position: "absolute",
              top: s.top,
              left: "left" in s ? s.left : undefined,
              right: "right" in s ? s.right : undefined,
              opacity: s.op,
            }}
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        ))}
      </div>

      <div className="max-w-screen-2xl mx-auto px-8 md:px-16 relative z-10">
        {/* ── Heading with decorative accent ── */}
        <div ref={headingRef} className="text-center mb-20 md:mb-24">
          <div className="flex items-center justify-center gap-4 mb-5">
            <div className="w-12 h-px bg-[#17409A]/20"></div>
            <p className="text-[#17409A] font-bold text-sm tracking-[0.2em] uppercase">
              Sản phẩm nổi bật
            </p>
            <div className="w-12 h-px bg-[#17409A]/20"></div>
          </div>

          <h2 className="text-[#1A1A2E] font-black text-4xl sm:text-5xl md:text-6xl leading-tight mb-6">
            Chọn người bạn đồng hành
            <br />
            <span className="text-[#17409A]">cho bé yêu</span>
          </h2>

          <p className="text-[#6B7280] text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            Mỗi chú gấu là một người thầy, một người bạn, được thiết kế riêng để
            phù hợp với từng giai đoạn phát triển của con bạn.
          </p>
        </div>

        {/* ── Premium Product Grid ── */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-16"
        >
          {PRODUCTS.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>

        {/* ── View all CTA với decorative elements ── */}
        <div ref={ctaRef} className="text-center">
          <div className="inline-flex flex-col items-center gap-8">
            <Link
              href="/products"
              className="group inline-flex items-center gap-3 bg-[#17409A] hover:bg-[#0E2A66] text-white font-bold px-12 py-5 rounded-2xl text-lg shadow-2xl transition-all duration-300 hover:shadow-[0_20px_60px_rgba(23,64,154,0.3)] hover:-translate-y-1"
            >
              Xem tất cả sản phẩm
              <IoArrowForward className="text-xl transition-transform duration-300 group-hover:translate-x-1" />
            </Link>

            <p className="text-[#6B7280] text-sm font-medium">
              Hơn 100+ mẫu gấu bông thông minh đang chờ bạn khám phá
            </p>
          </div>
        </div>
      </div>

      {/* Nunito font */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&subset=vietnamese&display=swap');`}</style>
    </section>
  );
}
