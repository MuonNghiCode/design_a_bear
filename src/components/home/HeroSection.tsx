"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";

const STORY_PHASES = [
  {
    label: "CÂU CHUYỆN KHỞI ĐẦU",
    heading: "Mỗi Chú Gấu Bông Mang Một Sứ Mệnh Yêu Thương",
    subtext: "Không chỉ là một món đồ chơi thông thường, đó là người bạn đầu đời tuyệt vời nhất của bé.",
  },
  {
    label: "HÀNH TRÌNH GẮN KẾT",
    heading: "Sự Kết Hợp Hoàn Hảo Giữa Công Nghệ & Trái Tim",
    subtext: "Trí tuệ nhân tạo hiện đại hòa quyện cùng sự mềm mại ấm áp, biết lắng nghe và sẻ chia.",
  },
  {
    label: "TẠO NÊN KỶ NIỆM",
    heading: "Thiết Kế Người Bạn Tri Kỷ Cho Bé Ngay Hôm Nay",
    subtext: "Cá nhân hóa từ màu sắc, giọng nói đến những bài học kỳ diệu để bé lớn khôn mỗi ngày.",
    cta: { label: "Tạo Gấu Ngay", href: "/products" },
  },
];

export default function HeroSection() {
  const [phaseIndex, setPhaseIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  const current = STORY_PHASES[phaseIndex];
  const headingWords = current.heading.split(/\s+/).filter(Boolean);
  const subWords = current.subtext.split(/\s+/).filter(Boolean);

  useEffect(() => {
    // Clean up previous tweens before animating to avoid conflicts
    gsap.killTweensOf(".reveal-word");

    // Phase entrance animation - Smooth and elegant, NO BOUNCE
    if (textRef.current) {
      gsap.fromTo(
        textRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
      );
    }

    // Elegant word-by-word reveal sequence, NO BLUR, NO GLOW
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".reveal-word",
        {
          opacity: 0,
          y: 15,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.05,
          ease: "power2.out",
        }
      );
    }, textRef);

    // Auto-advance timeline timer
    const nextInterval = phaseIndex === STORY_PHASES.length - 1 ? 10000 : 7500;

    const timer = setTimeout(() => {
      if (textRef.current) {
        gsap.to(textRef.current, {
          opacity: 0,
          y: -15,
          duration: 0.6,
          ease: "power2.in",
          onComplete: () => {
            setPhaseIndex((prev) => (prev + 1) % STORY_PHASES.length);
          },
        });
      }
    }, nextInterval);

    return () => {
      ctx.revert();
      clearTimeout(timer);
    };
  }, [phaseIndex]);

  return (
    <section
      id="hero-section"
      ref={containerRef}
      className="relative w-full h-screen min-h-[700px] flex items-center justify-center overflow-hidden bg-[#1A1A2E] select-none"
    >
      {/* Autoplaying Video Background */}
      <video
        src="/SEP.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ pointerEvents: "none" }}
      />

      {/* Solid Color Overlay for Readability (NO GRADIENTS) */}
      <div className="absolute inset-0 bg-[#1A1A2E]/40 z-10" />

      {/* Main Foreground Story Canvas */}
      <div className="relative z-20 w-full max-w-screen-2xl mx-auto px-8 md:px-16 flex flex-col items-center justify-center text-center mt-12">
        <div ref={textRef} className="max-w-4xl mx-auto flex flex-col items-center">
          
          {/* Label: Solid Warm Orange */}
          <div className="mb-8">
            <span className="inline-block px-6 py-2.5 text-sm font-black text-white tracking-widest bg-[#FF8C42] rounded-full uppercase shadow-lg">
              {current.label}
            </span>
          </div>

          {/* Story Title: Crisp, sharp typography */}
          <h1
            className="font-black tracking-tight leading-[1.2] mb-8 text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl max-w-5xl mx-auto flex flex-wrap items-center justify-center gap-x-3 gap-y-2"
            style={{ 
              fontFamily: "'Nunito', sans-serif",
              // Sharp drop shadow for readability, NO blur/glow
              textShadow: "0 4px 12px rgba(0,0,0,0.5)"
            }}
          >
            {headingWords.map((word, wi) => (
              <span
                key={wi}
                className="reveal-word inline-block"
              >
                {word}
              </span>
            ))}
          </h1>

          {/* Subtext */}
          <p
            className="text-lg sm:text-xl md:text-2xl text-[#F4F7FF] font-bold leading-relaxed max-w-3xl mx-auto mb-12 flex flex-wrap items-center justify-center gap-x-2 gap-y-1"
            style={{ 
              fontFamily: "'Nunito', sans-serif",
              textShadow: "0 2px 8px rgba(0,0,0,0.6)"
            }}
          >
            {subWords.map((word, wi) => (
              <span
                key={wi}
                className="reveal-word inline-block"
              >
                {word}
              </span>
            ))}
          </p>

          {/* CTA Button: Primary Navy */}
          {current.cta && (
            <div className="mt-4">
              <Link
                href={current.cta.href}
                className="inline-flex items-center justify-center gap-3 bg-[#17409A] hover:bg-[#4A90E2] text-white font-black px-10 py-5 rounded-2xl text-lg tracking-wide shadow-xl transition-all duration-300 hover:scale-[1.02]"
                style={{ fontFamily: "'Nunito', sans-serif" }}
              >
                {current.cta.label}
              </Link>
            </div>
          )}

          {/* Solid Progression Dots */}
          <div className="flex items-center justify-center gap-4 mt-16">
            {STORY_PHASES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (textRef.current) {
                    gsap.to(textRef.current, {
                      opacity: 0,
                      y: -15,
                      duration: 0.4,
                      ease: "power2.inOut",
                      onComplete: () => setPhaseIndex(idx),
                    });
                  } else {
                    setPhaseIndex(idx);
                  }
                }}
                className="relative flex items-center justify-center p-2 cursor-pointer group"
                aria-label={`Chuyển tới phần ${idx + 1}`}
              >
                <span 
                  className={`block h-3 rounded-full transition-all duration-300 ${
                    phaseIndex === idx 
                      ? "w-10 bg-[#FF8C42]" 
                      : "w-3 bg-white/40 group-hover:bg-white/60"
                  }`} 
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      <style>{`@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&subset=vietnamese&display=swap');`}</style>
    </section>
  );
}
