"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ── Icons ── */
function IconFabric() {
  return (
    <svg
      width="44"
      height="44"
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M8 10C8 10 16 16 24 10C32 4 40 10 40 10V38C40 38 32 32 24 38C16 44 8 38 8 38V10Z"
        fill="currentColor"
        opacity="0.2"
      />
      <path
        d="M8 10C8 10 16 16 24 10C32 4 40 10 40 10V38C40 38 32 32 24 38C16 44 8 38 8 38V10Z"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path
        d="M24 10V38"
        stroke="currentColor"
        strokeWidth="2"
        strokeDasharray="3 3"
        opacity="0.5"
      />
    </svg>
  );
}

function IconRuler() {
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
        y="18"
        width="40"
        height="12"
        rx="3"
        fill="currentColor"
        opacity="0.2"
      />
      <rect
        x="4"
        y="18"
        width="40"
        height="12"
        rx="3"
        stroke="currentColor"
        strokeWidth="2.5"
      />
      <path
        d="M10 18V23M16 18V26M22 18V23M28 18V26M34 18V23M40 18V23"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconWash() {
  return (
    <svg
      width="44"
      height="44"
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="6"
        y="10"
        width="36"
        height="30"
        rx="4"
        fill="currentColor"
        opacity="0.2"
      />
      <rect
        x="6"
        y="10"
        width="36"
        height="30"
        rx="4"
        stroke="currentColor"
        strokeWidth="2.5"
      />
      <circle cx="24" cy="26" r="8" stroke="currentColor" strokeWidth="2.5" />
      <path
        d="M16 26C16 26 18 22 24 22C30 22 32 26 32 26"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.6"
      />
      <path
        d="M8 16h4M12 12l1 4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconBear() {
  return (
    <svg
      width="44"
      height="44"
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="14"
        cy="13"
        r="6"
        fill="currentColor"
        opacity="0.25"
        stroke="currentColor"
        strokeWidth="2.5"
      />
      <circle
        cx="34"
        cy="13"
        r="6"
        fill="currentColor"
        opacity="0.25"
        stroke="currentColor"
        strokeWidth="2.5"
      />
      <ellipse
        cx="24"
        cy="31"
        rx="14"
        ry="13"
        fill="currentColor"
        opacity="0.2"
        stroke="currentColor"
        strokeWidth="2.5"
      />
      <circle cx="19" cy="28" r="2" fill="currentColor" />
      <circle cx="29" cy="28" r="2" fill="currentColor" />
      <ellipse
        cx="24"
        cy="33"
        rx="4"
        ry="2.5"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}

interface SpecCard {
  icon: React.ReactNode;
  title: string;
  value: string;
  sub: string;
}

const SPEC_CARDS: SpecCard[] = [
  {
    icon: <IconFabric />,
    title: "Chất liệu",
    value: "Cotton hữu cơ",
    sub: "Vải cao cấp 100% cotton tự nhiên, an toàn cho da bé nhạy cảm",
  },
  {
    icon: <IconRuler />,
    title: "Kích thước",
    value: "Vừa mọi gấu",
    sub: "Thiết kế co giãn linh hoạt, phù hợp tất cả gấu Design A Bear cỡ tiêu chuẩn",
  },
  {
    icon: <IconWash />,
    title: "Giặt giũ",
    value: "Giặt tay nhẹ",
    sub: "Giặt tay với nước lạnh hoặc máy giặt ở chế độ nhẹ, không sấy khô",
  },
  {
    icon: <IconBear />,
    title: "Tương thích",
    value: "Tất cả gấu",
    sub: "Phù hợp với toàn bộ dòng sản phẩm gấu bông đang bán tại Design A Bear",
  },
];

interface Props {
  accentColor: string;
}

export default function AccessorySpecs({ accentColor }: Props) {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".acc-spec-card",
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
        {/* Heading */}
        <div className="mb-14 flex items-end justify-between gap-6 flex-wrap">
          <div>
            <p
              className="text-xs font-black tracking-[0.35em] uppercase mb-3"
              style={{ color: accentColor }}
            >
              Thông tin sản phẩm
            </p>
            <h2
              className="text-4xl md:text-5xl font-black text-white leading-tight"
              style={{ fontFamily: "'Fredoka', 'Nunito', sans-serif" }}
            >
              Chất lượng trong
              <br />
              từng đường may
            </h2>
          </div>
          <p className="text-white/50 text-sm max-w-xs leading-relaxed">
            Mỗi phụ kiện được làm thủ công từ vật liệu tự nhiên cao cấp, kiểm
            định an toàn trước khi đến tay bé.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SPEC_CARDS.map(({ icon, title, value, sub }, idx) => (
            <div
              key={title}
              className="acc-spec-card group relative p-7 rounded-3xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-300 overflow-hidden"
            >
              {/* Ghost number watermark */}
              <span
                className="absolute -right-2 -bottom-4 text-8xl font-black pointer-events-none select-none leading-none"
                style={{ color: "rgba(255,255,255,0.04)" }}
              >
                {idx + 1}
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

        {/* Care tag strip */}
        <div className="mt-12 flex flex-wrap items-center gap-3">
          {[
            "An toàn cho trẻ em",
            "Không chất độc hại",
            "Thêu tay thủ công",
            "Bền màu lâu dài",
          ].map((tag) => (
            <span
              key={tag}
              className="px-4 py-2 rounded-full text-xs font-black border border-white/20 text-white/60"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
