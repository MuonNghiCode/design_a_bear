"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  IoSparklesOutline,
  IoColorPaletteOutline,
  IoWifiOutline,
  IoHeartOutline,
  IoArrowForward,
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
    description:
      "Chọn mẫu gấu bông yêu thích từ bộ sưu tập đa dạng của chúng tôi với nhiều kích thước và màu sắc.",
    color: "#FF8C42",
  },
  {
    icon: IoColorPaletteOutline,
    number: "02",
    title: "Tùy chỉnh cá nhân",
    description:
      "Chọn giọng nói, tính cách, và nội dung học tập phù hợp với độ tuổi và sở thích của bé.",
    color: "#7C5CFC",
  },
  {
    icon: IoWifiOutline,
    number: "03",
    title: "Kích hoạt AI & IoT",
    description:
      "Kết nối qua app, thiết lập nội dung và tính năng thông minh chỉ trong vài bước đơn giản.",
    color: "#4ECDC4",
  },
  {
    icon: IoHeartOutline,
    number: "04",
    title: "Tận hưởng cùng bé",
    description:
      "Gấu bông sẵn sàng đồng hành, dạy học, kể chuyện và lớn lên cùng con bạn mỗi ngày.",
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
  const triggersRef = useRef<ReturnType<typeof ScrollTrigger.create>[]>([]);

  useEffect(() => {
    if (!sectionRef.current) return;

    // Set initial hidden state immediately — prevents visible→hidden flash
    if (headingRef.current) {
      gsap.set(headingRef.current, { y: 20, opacity: 0 });
    }
    if (stepsRef.current) {
      gsap.set(stepsRef.current.children, { y: 30, opacity: 0 });
    }

    if (headingRef.current) {
      const t = ScrollTrigger.create({
        trigger: headingRef.current,
        start: "top 85%",
        once: true,
        onEnter: () => {
          gsap.to(headingRef.current, { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" });
        },
      });
      triggersRef.current.push(t);
    }

    if (stepsRef.current) {
      const steps = gsap.utils.toArray(stepsRef.current.children);
      steps.forEach((step, i) => {
        const t = ScrollTrigger.create({
          trigger: step as Element,
          start: "top 88%",
          once: true,
          onEnter: () => {
            gsap.to(step as Element, {
              y: 0, opacity: 1, duration: 0.5,
              delay: i * 0.05,
              ease: "power2.out",
            });
          },
        });
        triggersRef.current.push(t);
      });
    }

    return () => {
      triggersRef.current.forEach((t) => t.kill());
      triggersRef.current = [];
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-32 md:py-40 bg-white overflow-hidden"
      style={{ fontFamily: "'Nunito', sans-serif" }}
    >
      {/* ── Decorative background elements ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.02]">
        <div
          className="absolute top-20 right-10 w-96 h-96 rounded-full"
          style={{ backgroundColor: "#7C5CFC" }}
        />
        <div
          className="absolute bottom-10 left-20 w-125 h-125 rounded-full"
          style={{ backgroundColor: "#4ECDC4" }}
        />
      </div>

      {/* ── Paw prints decorative ── */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        {[
          {
            top: "10%",
            right: "8%",
            size: 48,
            rot: 25,
            op: 0.04,
            color: "#FF8C42",
          },
          {
            top: "35%",
            left: "5%",
            size: 42,
            rot: -15,
            op: 0.05,
            color: "#7C5CFC",
          },
          {
            top: "60%",
            right: "12%",
            size: 38,
            rot: 20,
            op: 0.04,
            color: "#4ECDC4",
          },
          {
            bottom: "15%",
            left: "8%",
            size: 45,
            rot: -25,
            op: 0.05,
            color: "#FF6B9D",
          },
        ].map((p, i) => (
          <svg
            key={i}
            width={p.size}
            height={p.size}
            viewBox="0 0 64 64"
            fill={p.color}
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

      <div className="max-w-screen-xl mx-auto px-8 md:px-16 relative z-10">
        {/* ── Heading with decorative accent ── */}
        <div ref={headingRef} className="text-center mb-20 md:mb-24">
          <div className="flex items-center justify-center gap-4 mb-5">
            <div className="w-16 h-px bg-[#4ECDC4]"></div>
            <p className="text-[#4ECDC4] font-bold text-sm tracking-[0.2em] uppercase">
              Hành trình tạo nên phép màu
            </p>
            <div className="w-16 h-px bg-[#4ECDC4]"></div>
          </div>

          <h2 className="text-[#1A1A2E] font-black text-4xl sm:text-5xl md:text-6xl leading-tight mb-6">
            Từ ý tưởng đến
            <br />
            <span className="text-[#17409A]">người bạn thông minh</span>
          </h2>

          <p className="text-[#6B7280] text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            Mỗi chú gấu bông là một câu chuyện khởi đầu, một hành trình học tập
            đầy cảm xúc.
            <br />
            Cùng khám phá cách chúng tôi biến ước mơ thành hiện thực.
          </p>
        </div>

        {/* ── Storytelling Timeline ── */}
        <div ref={stepsRef} className="relative max-w-5xl mx-auto">
          {/* Vertical timeline line (desktop) */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 -translate-x-1/2">
            <div
              className="absolute inset-0 rounded-full opacity-10"
              style={{
                background:
                  "linear-gradient(to bottom, #FF8C42, #7C5CFC, #4ECDC4, #FF6B9D)",
              }}
            />
          </div>

          {STEPS.map((step, i) => {
            const Icon = step.icon;
            const isEven = i % 2 === 0;

            return (
              <div
                key={i}
                className={`relative flex flex-col md:flex-row items-center gap-8 mb-16 md:mb-24 last:mb-0 ${
                  isEven ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* Content card */}
                <div
                  className={`flex-1 ${isEven ? "md:text-right md:pr-12" : "md:text-left md:pl-12"}`}
                >
                  <div className="bg-white rounded-3xl p-8 md:p-10 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
                    {/* Number badge */}
                    <div
                      className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-5 font-black text-xl text-white shadow-lg ${
                        isEven
                          ? "md:float-right md:ml-6"
                          : "md:float-left md:mr-6"
                      }`}
                      style={{ backgroundColor: step.color }}
                    >
                      {step.number}
                    </div>

                    {/* Title */}
                    <h3 className="text-[#1A1A2E] font-black text-2xl md:text-3xl mb-4 leading-tight">
                      {step.title}
                    </h3>

                    {/* Description */}
                    <p className="text-[#6B7280] text-base md:text-lg leading-relaxed mb-6">
                      {step.description}
                    </p>

                    {/* Decorative accent line */}
                    <div
                      className={`h-1 w-16 rounded-full ${isEven ? "md:ml-auto" : ""}`}
                      style={{ backgroundColor: step.color }}
                    />
                  </div>
                </div>

                {/* Center icon circle */}
                <div className="relative z-10 shrink-0">
                  <div
                    className="flex items-center justify-center w-24 h-24 md:w-28 md:h-28 rounded-full shadow-2xl transition-transform duration-300 hover:scale-110 border-4 border-white"
                    style={{
                      backgroundColor: step.color,
                    }}
                  >
                    <Icon className="text-5xl md:text-6xl text-white" />
                  </div>

                  {/* Paw print near icon */}
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 64 64"
                    fill={step.color}
                    className={`absolute opacity-30 ${
                      isEven ? "-right-10 top-2" : "-left-10 top-2"
                    }`}
                    style={{ transform: `rotate(${isEven ? 20 : -20}deg)` }}
                  >
                    <ellipse cx="32" cy="44" rx="16" ry="13" />
                    <circle cx="14" cy="28" r="7" />
                    <circle cx="50" cy="28" r="7" />
                    <circle cx="23" cy="20" r="5.5" />
                    <circle cx="41" cy="20" r="5.5" />
                  </svg>
                </div>

                {/* Spacer for alignment (desktop only) */}
                <div className="hidden md:block flex-1"></div>
              </div>
            );
          })}
        </div>

        {/* ── Bottom CTA ── */}
        <div className="text-center mt-20 md:mt-28">
          <div className="inline-flex flex-col items-center gap-6 bg-white rounded-3xl px-10 py-8 shadow-xl border border-gray-100">
            <p className="text-[#1A1A2E] text-xl md:text-2xl font-bold">
              Hàng nghìn gia đình đã tin tưởng và lựa chọn Design a Bear
            </p>
            <div className="flex items-center gap-8 text-[#6B7280] text-sm font-semibold">
              <span>Uy tín</span>
              <div className="w-1 h-1 rounded-full bg-[#6B7280]"></div>
              <span>An toàn</span>
              <div className="w-1 h-1 rounded-full bg-[#6B7280]"></div>
              <span>Chất lượng</span>
            </div>
          </div>
        </div>
      </div>

      {/* Nunito font */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&subset=vietnamese&display=swap');`}</style>
    </section>
  );
}
