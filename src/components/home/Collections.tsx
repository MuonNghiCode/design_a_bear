"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { IoArrowForward } from "react-icons/io5";

gsap.registerPlugin(ScrollTrigger);

/* ────────────────────────────────────────────
   Collections data
   ──────────────────────────────────────────── */
const COLLECTIONS = [
  {
    id: "explorer",
    title: "Bộ sưu tập Nhà Khám Phá",
    description: "Dành cho những bé yêu khoa học và tự nhiên",
    image: "/teddy_bear.png",
    color: "#4ECDC4",
    href: "/collections/explorer",
    large: true,
  },
  {
    id: "storyteller",
    title: "Bộ sưu tập Kể Chuyện",
    description: "Hàng nghìn câu chuyện cổ tích tương tác",
    image: "/teddy_bear.png",
    color: "#7C5CFC",
    href: "/collections/storyteller",
    large: false,
  },
  {
    id: "musician",
    title: "Bộ sưu tập Âm Nhạc",
    description: "Dạy bé yêu âm nhạc từ nhỏ",
    image: "/teddy_bear.png",
    color: "#FF6B9D",
    href: "/collections/musician",
    large: false,
  },
];

/* ────────────────────────────────────────────
   Paw Print SVG Component
   ──────────────────────────────────────────── */
const PawPrint = ({
  className = "",
  size = 40,
  color = "#17409A",
}: {
  className?: string;
  size?: number;
  color?: string;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={color}
    className={className}
  >
    <ellipse cx="8.5" cy="8" rx="2.5" ry="3" />
    <ellipse cx="15.5" cy="8" rx="2.5" ry="3" />
    <ellipse cx="6" cy="13" rx="2" ry="2.5" />
    <ellipse cx="18" cy="13" rx="2" ry="2.5" />
    <ellipse cx="12" cy="16" rx="4" ry="5" />
  </svg>
);

/* ────────────────────────────────────────────
   Component
   ──────────────────────────────────────────── */
export default function Collections() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    if (headingRef.current) {
      gsap.fromTo(
        headingRef.current,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: headingRef.current,
            start: "top 85%",
            once: true,
          },
        },
      );
    }

    if (cardsRef.current) {
      gsap.fromTo(
        cardsRef.current.children,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.08,
          ease: "power2.out",
          scrollTrigger: {
            trigger: cardsRef.current,
            start: "top 80%",
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
      className="relative py-32 md:py-40 overflow-hidden"
      style={{
        backgroundColor: "#F4F7FF",
        fontFamily: "'Nunito', sans-serif",
      }}
    >
      {/* ── Background decorative orbs ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-20 left-10 w-96 h-96 rounded-full"
          style={{
            background: "radial-gradient(circle, #4ECDC4 0%, transparent 70%)",
            opacity: 0.02,
          }}
        />
        <div
          className="absolute bottom-32 right-16 w-lg h-128 rounded-full"
          style={{
            background: "radial-gradient(circle, #7C5CFC 0%, transparent 70%)",
            opacity: 0.02,
          }}
        />
      </div>

      {/* ── Decorative paw prints ── */}
      <PawPrint
        size={42}
        color="#4ECDC4"
        className="absolute top-24 right-32 opacity-[0.04] rotate-12"
      />
      <PawPrint
        size={38}
        color="#7C5CFC"
        className="absolute top-1/3 left-24 opacity-[0.05] -rotate-20"
      />
      <PawPrint
        size={45}
        color="#FF6B9D"
        className="absolute bottom-40 left-1/4 opacity-[0.04] rotate-25"
      />
      <PawPrint
        size={40}
        color="#FF8C42"
        className="absolute bottom-32 right-1/4 opacity-[0.05] -rotate-15"
      />

      <div className="max-w-screen-2xl mx-auto px-8 md:px-16 relative z-10">
        {/* ── Premium Heading with decorative lines ── */}
        <div ref={headingRef} className="text-center mb-20 md:mb-24">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-16 h-px bg-[#17409A]/20" />
            <p className="text-[#17409A] font-bold text-sm tracking-widest uppercase">
              Bộ sưu tập đặc biệt
            </p>
            <div className="w-16 h-px bg-[#17409A]/20" />
          </div>
          <h2 className="text-[#1A1A2E] font-black text-5xl sm:text-6xl md:text-7xl leading-tight mb-6">
            Khám phá thế giới của{" "}
            <span className="text-[#17409A]">gấu bông thông minh</span>
          </h2>
          <p className="text-[#6B7280] text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            Mỗi bộ sưu tập được thiết kế với chủ đề riêng biệt, phù hợp với sở
            thích và nhu cầu phát triển của từng bé
          </p>
        </div>

        {/* ── Premium asymmetric grid ── */}
        <div ref={cardsRef} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Large card */}
          {COLLECTIONS.filter((c) => c.large).map((col) => (
            <Link
              key={col.id}
              href={col.href}
              className="group relative row-span-2 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 min-h-100 lg:min-h-150"
            >
              {/* Image */}
              <div className="absolute inset-0">
                <Image
                  src={col.image}
                  alt={col.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>

              {/* Smooth gradient overlay (6 stops for natural fade) */}
              <div
                className="absolute bottom-0 w-full h-[75%] pointer-events-none"
                style={{
                  background: `linear-gradient(to top, 
                    ${col.color}FA 0%, 
                    ${col.color}EB 15%, 
                    ${col.color}C0 30%, 
                    ${col.color}70 50%, 
                    ${col.color}26 70%, 
                    transparent 100%)`,
                }}
              />

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-10 md:p-12 z-10">
                <div className="mb-4">
                  <div
                    className="inline-block px-4 py-1.5 rounded-full text-white text-xs font-bold tracking-wider uppercase mb-3"
                    style={{
                      backgroundColor: col.color,
                      boxShadow: `0 4px 12px ${col.color}40`,
                    }}
                  >
                    Đặc biệt
                  </div>
                </div>
                <h3
                  className="text-white font-black text-3xl md:text-4xl mb-3 leading-tight"
                  style={{ textShadow: "0 2px 8px rgba(0,0,0,0.2)" }}
                >
                  {col.title}
                </h3>
                <p
                  className="text-white/90 text-base md:text-lg mb-6 leading-relaxed"
                  style={{ textShadow: "0 1px 4px rgba(0,0,0,0.1)" }}
                >
                  {col.description}
                </p>
                <span
                  className="inline-flex items-center gap-2 bg-white text-[#1A1A2E] font-bold px-8 py-4 rounded-2xl text-base transition-all duration-300 group-hover:-translate-y-1"
                  style={{
                    boxShadow:
                      "0 8px 24px rgba(0,0,0,0.15), 0 4px 8px rgba(0,0,0,0.1)",
                  }}
                >
                  Khám phá ngay
                  <IoArrowForward className="text-lg transition-transform duration-200 group-hover:translate-x-1" />
                </span>
              </div>

              {/* Mini paw print decoration */}
              <PawPrint
                size={28}
                color="rgba(255,255,255,0.2)"
                className="absolute top-8 right-8 rotate-12"
              />
            </Link>
          ))}

          {/* Small cards */}
          {COLLECTIONS.filter((c) => !c.large).map((col) => (
            <Link
              key={col.id}
              href={col.href}
              className="group relative rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 min-h-70"
            >
              {/* Image */}
              <div className="absolute inset-0">
                <Image
                  src={col.image}
                  alt={col.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>

              {/* Smooth gradient overlay (6 stops) */}
              <div
                className="absolute bottom-0 w-full h-[80%] pointer-events-none"
                style={{
                  background: `linear-gradient(to top, 
                    ${col.color}FA 0%, 
                    ${col.color}EB 15%, 
                    ${col.color}C0 30%, 
                    ${col.color}70 50%, 
                    ${col.color}26 70%, 
                    transparent 100%)`,
                }}
              />

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-7 md:p-8 z-10">
                <div className="mb-3">
                  <div
                    className="inline-block px-3 py-1 rounded-full text-white text-xs font-bold tracking-wider uppercase mb-2"
                    style={{
                      backgroundColor: col.color,
                      boxShadow: `0 4px 12px ${col.color}40`,
                    }}
                  >
                    Mới
                  </div>
                </div>
                <h3
                  className="text-white font-black text-2xl md:text-3xl mb-2 leading-tight"
                  style={{ textShadow: "0 2px 8px rgba(0,0,0,0.2)" }}
                >
                  {col.title}
                </h3>
                <p
                  className="text-white/90 text-sm md:text-base mb-5 leading-relaxed"
                  style={{ textShadow: "0 1px 4px rgba(0,0,0,0.1)" }}
                >
                  {col.description}
                </p>
                <span
                  className="inline-flex items-center gap-2 bg-white text-[#1A1A2E] font-bold px-6 py-3 rounded-xl text-sm transition-all duration-300 group-hover:-translate-y-1"
                  style={{
                    boxShadow:
                      "0 6px 20px rgba(0,0,0,0.15), 0 3px 6px rgba(0,0,0,0.1)",
                  }}
                >
                  Khám phá
                  <IoArrowForward className="text-base transition-transform duration-200 group-hover:translate-x-1" />
                </span>
              </div>

              {/* Mini paw print decoration */}
              <PawPrint
                size={24}
                color="rgba(255,255,255,0.2)"
                className="absolute top-6 right-6 -rotate-12"
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
