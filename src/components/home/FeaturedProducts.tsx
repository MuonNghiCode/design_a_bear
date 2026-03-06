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
    description: "Chú gấu với nụ cười thân thiện, chất liệu bông tơ tằm siêu nhẹ.",
    price: 450000,
    image: "/teddy_bear.png",
    badge: "Toán",
    badgeColor: "#17409A",
  },
  {
    id: "bear-pink-melody",
    name: "Gấu Hồng Melody Âm Nhạc",
    description: "Dạy bé yêu âm nhạc qua hàng trăm bài hát và giai điệu vui nhộn.",
    price: 520000,
    image: "/teddy_bear.png",
    badge: "Âm nhạc",
    badgeColor: "#FF6B9D",
  },
  {
    id: "bear-blue-einstein",
    name: "Gấu Xanh Einstein Khám Phá",
    description: "Trả lời hàng nghìn câu hỏi khoa học, kích thích trí tò mò của bé.",
    price: 580000,
    image: "/teddy_bear.png",
    badge: "Khoa học",
    badgeColor: "#4ECDC4",
  },
  {
    id: "bear-cream-story",
    name: "Gấu Kem Storyteller Kể Chuyện",
    description: "Kể chuyện cổ tích tương tác, giọng kể ấm áp theo cảm xúc của bé.",
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
          y: 0, opacity: 1,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: headingRef.current,
            start: "top 85%",
            once: true,
          },
        }
      );
    }

    // Cards stagger
    if (gridRef.current) {
      gsap.fromTo(
        gridRef.current.children,
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1,
          duration: 0.5,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 80%",
            once: true,
          },
        }
      );
    }

    // CTA animation
    if (ctaRef.current) {
      gsap.fromTo(
        ctaRef.current,
        { y: 15, opacity: 0 },
        {
          y: 0, opacity: 1,
          duration: 0.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ctaRef.current,
            start: "top 90%",
            once: true,
          },
        }
      );
    }

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-24 md:py-32"
      style={{
        backgroundColor: "#F4F7FF",
        fontFamily: "'Nunito', sans-serif",
      }}
    >
      {/* ── Decorative paw prints ── */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        {[
          { top: "5%", right: "4%", size: 50, rot: 15, op: 0.04 },
          { top: "60%", left: "3%", size: 40, rot: -20, op: 0.05 },
          { bottom: "8%", right: "10%", size: 35, rot: 30, op: 0.04 },
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
      </div>

      <div className="max-w-screen-2xl mx-auto px-8 md:px-16">
        {/* ── Heading ── */}
        <div ref={headingRef} className="text-center mb-16 md:mb-20">
          <p className="text-[#4A90E2] font-bold text-sm tracking-widest uppercase mb-4">
            Sản phẩm nổi bật
          </p>
          <h2 className="text-[#1A1A2E] font-black text-3xl sm:text-4xl md:text-5xl leading-tight mb-5">
            Chọn người bạn đồng hành cho bé
          </h2>
          <p className="text-[#6B7280] text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Mỗi chú gấu là một người thầy, một người bạn, được thiết kế riêng
            để phù hợp với từng giai đoạn phát triển của con bạn.
          </p>
        </div>

        {/* ── Product Grid ── */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
        >
          {PRODUCTS.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>

        {/* ── View all CTA ── */}
        <div ref={ctaRef} className="text-center mt-14 md:mt-20">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-[#17409A] hover:bg-[#0E2A66] text-white font-bold px-10 py-4 rounded-2xl text-base shadow-xl transition-all duration-200 hover:shadow-2xl hover:-translate-y-0.5"
          >
            Xem tất cả sản phẩm
            <IoArrowForward className="text-lg" />
          </Link>
        </div>
      </div>

      {/* Nunito font */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&subset=vietnamese&display=swap');`}</style>
    </section>
  );
}
