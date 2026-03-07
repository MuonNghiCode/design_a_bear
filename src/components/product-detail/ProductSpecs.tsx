"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ── Inline SVG icons ── */
function IconAIChip() {
  return (
    <svg
      width="44"
      height="44"
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="10"
        y="10"
        width="28"
        height="28"
        rx="5"
        fill="currentColor"
        opacity="0.2"
      />
      <rect x="14" y="14" width="20" height="20" rx="3" fill="currentColor" />
      <circle cx="20" cy="24" r="2" fill="white" />
      <circle cx="24" cy="24" r="2" fill="white" />
      <circle cx="28" cy="24" r="2" fill="white" />
      <path
        d="M20 10V6M24 10V6M28 10V6"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M20 42v-4M24 42v-4M28 42v-4"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M10 20H6M10 24H6M10 28H6"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M42 20h-4M42 24h-4M42 28h-4"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconLeaf() {
  return (
    <svg
      width="44"
      height="44"
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M8 40C8 40 10 20 24 12C38 4 42 8 42 8C42 8 40 28 26 36C18 40.5 8 40 8 40Z"
        fill="currentColor"
        opacity="0.25"
      />
      <path
        d="M8 40C8 40 10 20 24 12C38 4 42 8 42 8C42 8 40 28 26 36C18 40.5 8 40 8 40Z"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path
        d="M8 40L22 26"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconBattery() {
  return (
    <svg
      width="44"
      height="44"
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="4"
        y="14"
        width="36"
        height="20"
        rx="4"
        fill="currentColor"
        opacity="0.2"
      />
      <rect
        x="4"
        y="14"
        width="36"
        height="20"
        rx="4"
        stroke="currentColor"
        strokeWidth="2.5"
      />
      <rect x="40" y="19" width="4" height="10" rx="2" fill="currentColor" />
      <rect x="8" y="18" width="20" height="12" rx="2" fill="currentColor" />
    </svg>
  );
}

function IconDroplet() {
  return (
    <svg
      width="44"
      height="44"
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M24 6L10 26C10 33.7 16.3 40 24 40C31.7 40 38 33.7 38 26L24 6Z"
        fill="currentColor"
        opacity="0.25"
      />
      <path
        d="M24 6L10 26C10 33.7 16.3 40 24 40C31.7 40 38 33.7 38 26L24 6Z"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path
        d="M18 30C18.5 32.5 21 34 24 34"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

interface SpecCard {
  icon: React.ReactNode;
  title: string;
  value: string;
  sub: string;
  accent: string;
}

interface Props {
  accentColor: string;
}

const SPEC_CARDS: Omit<SpecCard, "accent">[] = [
  {
    icon: <IconAIChip />,
    title: "Chip AI",
    value: "Mạng nơ-ron",
    sub: "Xử lý ngôn ngữ tự nhiên, học thích nghi theo bé",
  },
  {
    icon: <IconLeaf />,
    title: "Vật liệu",
    value: "Bông tơ tằm",
    sub: "An toàn tuyệt đối, chứng nhận OEKO-TEX®",
  },
  {
    icon: <IconBattery />,
    title: "Pin",
    value: "72 giờ",
    sub: "Hoạt động liên tục, sạc nhanh USB-C trong 90 phút",
  },
  {
    icon: <IconDroplet />,
    title: "Kháng nước",
    value: "IPX5",
    sub: "Chịu nước bắn mọi hướng, dễ vệ sinh hàng ngày",
  },
];

export default function ProductSpecs({ accentColor }: Props) {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".spec-card",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            once: true,
          },
        },
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-24"
      style={{ backgroundColor: "#0E2A66" }}
    >
      <div className="max-w-screen-2xl mx-auto px-8 md:px-16">
        {/* Section heading */}
        <div className="mb-14 flex items-end justify-between gap-6 flex-wrap">
          <div>
            <p
              className="text-xs font-black tracking-[0.35em] uppercase mb-3"
              style={{ color: accentColor }}
            >
              Thông số kỹ thuật
            </p>
            <h2
              className="text-4xl md:text-5xl font-black text-white leading-tight"
              style={{ fontFamily: "'Fredoka', 'Nunito', sans-serif" }}
            >
              Công nghệ đằng
              <br />
              sau mỗi chú gấu
            </h2>
          </div>
          <p className="text-white/50 text-sm max-w-xs leading-relaxed">
            Mỗi sản phẩm là sự kết hợp giữa công nghệ tiên tiến và vật liệu cao
            cấp, được kiểm định nghiêm ngặt vì sự an toàn của bé.
          </p>
        </div>

        {/* Spec cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SPEC_CARDS.map(({ icon, title, value, sub }) => (
            <div
              key={title}
              className="spec-card group relative p-7 rounded-3xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-300 overflow-hidden"
            >
              {/* Ghost number watermark */}
              <span
                className="absolute -right-2 -bottom-4 text-8xl font-black pointer-events-none select-none leading-none"
                style={{ color: "rgba(255,255,255,0.04)" }}
              >
                {String(SPEC_CARDS.findIndex((s) => s.title === title) + 1)}
              </span>

              {/* Accent top border */}
              <div
                className="absolute top-0 left-7 right-7 h-0.5 rounded-full"
                style={{ backgroundColor: accentColor }}
              />

              {/* Icon */}
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
                style={{ backgroundColor: accentColor, color: "white" }}
              >
                {icon}
              </div>

              {/* Content */}
              <p className="text-white/60 text-xs font-bold tracking-widest uppercase mb-1">
                {title}
              </p>
              <p className="text-white text-2xl font-black mb-2">{value}</p>
              <p className="text-white/50 text-sm leading-relaxed">{sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
