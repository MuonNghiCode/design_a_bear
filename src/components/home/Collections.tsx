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
        { y: 25, opacity: 0 },
        {
          y: 0, opacity: 1,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: { trigger: headingRef.current, start: "top 85%", once: true },
        }
      );
    }

    if (cardsRef.current) {
      gsap.fromTo(
        cardsRef.current.children,
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1,
          duration: 0.5,
          stagger: 0.12,
          ease: "power2.out",
          scrollTrigger: { trigger: cardsRef.current, start: "top 80%", once: true },
        }
      );
    }

    return () => { ScrollTrigger.getAll().forEach((t) => t.kill()); };
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
      <div className="max-w-screen-2xl mx-auto px-8 md:px-16">
        {/* ── Heading ── */}
        <div ref={headingRef} className="text-center mb-16 md:mb-20">
          <p className="text-[#7C5CFC] font-bold text-sm tracking-widest uppercase mb-4">
            Bộ sưu tập
          </p>
          <h2 className="text-[#1A1A2E] font-black text-3xl sm:text-4xl md:text-5xl leading-tight mb-5">
            Khám phá thế giới của gấu bông thông minh
          </h2>
          <p className="text-[#6B7280] text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Mỗi bộ sưu tập được thiết kế với chủ đề riêng biệt, phù hợp với
            sở thích và nhu cầu phát triển của từng bé.
          </p>
        </div>

        {/* ── Asymmetric grid ── */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8"
        >
          {/* Large card */}
          {COLLECTIONS.filter((c) => c.large).map((col) => (
            <Link
              key={col.id}
              href={col.href}
              className="group relative row-span-2 rounded-3xl overflow-hidden min-h-[400px] lg:min-h-[520px]"
            >
              <Image
                src={col.image}
                alt={col.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* Overlay */}
              <div
                className="absolute inset-0 transition-opacity duration-300"
                style={{
                  background: `linear-gradient(to top, ${col.color}CC 0%, ${col.color}40 40%, transparent 70%)`,
                }}
              />
              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10">
                <h3 className="text-white font-black text-2xl md:text-3xl mb-2 leading-tight">
                  {col.title}
                </h3>
                <p className="text-white/80 text-base mb-5">
                  {col.description}
                </p>
                <span className="inline-flex items-center gap-2 bg-white text-[#1A1A2E] font-bold px-6 py-3 rounded-2xl text-sm shadow-lg group-hover:shadow-xl transition-all duration-200 group-hover:-translate-y-0.5">
                  Khám phá
                  <IoArrowForward className="text-base transition-transform duration-200 group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}

          {/* Small cards */}
          {COLLECTIONS.filter((c) => !c.large).map((col) => (
            <Link
              key={col.id}
              href={col.href}
              className="group relative rounded-3xl overflow-hidden min-h-[240px]"
            >
              <Image
                src={col.image}
                alt={col.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div
                className="absolute inset-0 transition-opacity duration-300"
                style={{
                  background: `linear-gradient(to top, ${col.color}CC 0%, ${col.color}40 50%, transparent 80%)`,
                }}
              />
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                <h3 className="text-white font-black text-xl md:text-2xl mb-1.5 leading-tight">
                  {col.title}
                </h3>
                <p className="text-white/80 text-sm mb-4">
                  {col.description}
                </p>
                <span className="inline-flex items-center gap-2 bg-white text-[#1A1A2E] font-bold px-5 py-2.5 rounded-xl text-sm shadow-lg group-hover:shadow-xl transition-all duration-200 group-hover:-translate-y-0.5">
                  Khám phá
                  <IoArrowForward className="text-sm transition-transform duration-200 group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
