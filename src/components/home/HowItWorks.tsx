"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  IoSparklesOutline,
  IoColorPaletteOutline,
  IoWifiOutline,
  IoHeartOutline,
} from "react-icons/io5";

gsap.registerPlugin(ScrollTrigger);

/* ────────────────────────────────────────────
   Steps data
   ──────────────────────────────────────────── */
const STEPS = [
  {
    icon: IoSparklesOutline,
    number: "01",
    title: "Chọn gấu bông",
    description: "Chọn mẫu gấu bông yêu thích từ bộ sưu tập đa dạng của chúng tôi với nhiều kích thước và màu sắc.",
    color: "#FF8C42",
  },
  {
    icon: IoColorPaletteOutline,
    number: "02",
    title: "Tùy chỉnh cá nhân",
    description: "Chọn giọng nói, tính cách, và nội dung học tập phù hợp với độ tuổi và sở thích của bé.",
    color: "#7C5CFC",
  },
  {
    icon: IoWifiOutline,
    number: "03",
    title: "Kích hoạt AI & IoT",
    description: "Kết nối qua app, thiết lập nội dung và tính năng thông minh chỉ trong vài bước đơn giản.",
    color: "#4ECDC4",
  },
  {
    icon: IoHeartOutline,
    number: "04",
    title: "Tận hưởng cùng bé",
    description: "Gấu bông sẵn sàng đồng hành, dạy học, kể chuyện và lớn lên cùng con bạn mỗi ngày.",
    color: "#FF6B9D",
  },
];

/* ────────────────────────────────────────────
   Component
   ──────────────────────────────────────────── */
export default function HowItWorks() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);

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

    if (stepsRef.current) {
      gsap.fromTo(
        stepsRef.current.children,
        { y: 25, opacity: 0 },
        {
          y: 0, opacity: 1,
          duration: 0.5,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: { trigger: stepsRef.current, start: "top 80%", once: true },
        }
      );
    }

    return () => { ScrollTrigger.getAll().forEach((t) => t.kill()); };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-24 md:py-32 bg-white overflow-hidden"
      style={{ fontFamily: "'Nunito', sans-serif" }}
    >
      <div className="max-w-screen-2xl mx-auto px-8 md:px-16">
        {/* ── Heading ── */}
        <div ref={headingRef} className="text-center mb-16 md:mb-20">
          <p className="text-[#4ECDC4] font-bold text-sm tracking-widest uppercase mb-4">
            Cách hoạt động
          </p>
          <h2 className="text-[#1A1A2E] font-black text-3xl sm:text-4xl md:text-5xl leading-tight mb-5">
            4 bước để bé có người bạn thông minh
          </h2>
          <p className="text-[#6B7280] text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Quy trình đơn giản, nhanh chóng — từ lúc chọn gấu đến khi bé ôm trong tay
            một người bạn biết nói, biết học, biết yêu thương.
          </p>
        </div>

        {/* ── Steps ── */}
        <div ref={stepsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6 relative">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <div
                key={i}
                className="relative flex flex-col items-center text-center group"
              >
                {/* ── Connector line (desktop only) ── */}
                {i < STEPS.length - 1 && (
                  <div
                    className="hidden lg:block absolute top-10 left-[60%] right-0 h-px"
                    style={{
                      backgroundImage: "repeating-linear-gradient(to right, #E5E7EB, #E5E7EB 6px, transparent 6px, transparent 12px)",
                    }}
                  />
                )}

                {/* ── Icon circle ── */}
                <div
                  className="relative w-20 h-20 rounded-full flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-105"
                  style={{ backgroundColor: `${step.color}15` }}
                >
                  <Icon className="text-3xl" style={{ color: step.color }} />

                  {/* Number badge */}
                  <span
                    className="absolute -top-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-black shadow-md"
                    style={{ backgroundColor: step.color }}
                  >
                    {step.number}
                  </span>
                </div>

                {/* ── Text ── */}
                <h3 className="text-[#1A1A2E] font-black text-lg mb-3">
                  {step.title}
                </h3>
                <p className="text-[#6B7280] text-sm leading-relaxed max-w-[240px]">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
