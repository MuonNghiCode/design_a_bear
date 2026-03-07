import Image from "next/image";

/* ── Inline paw SVG ────────────────────────── */
function PawSVG({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill={color}>
      <ellipse cx="50" cy="65" rx="30" ry="25" />
      <ellipse cx="22" cy="38" rx="12" ry="10" />
      <ellipse cx="78" cy="38" rx="12" ry="10" />
      <ellipse cx="12" cy="58" rx="9" ry="8" />
      <ellipse cx="88" cy="58" rx="9" ry="8" />
    </svg>
  );
}

type PawPos = {
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  size: number;
  rotate: number;
  opacity: number;
};

const PAW_POSITIONS: PawPos[] = [
  { top: "10%", left: "4%", size: 52, rotate: -22, opacity: 0.13 },
  { top: "6%", right: "8%", size: 38, rotate: 18, opacity: 0.1 },
  { top: "38%", right: "5%", size: 30, rotate: 35, opacity: 0.09 },
  { top: "22%", left: "18%", size: 22, rotate: 55, opacity: 0.08 },
  { bottom: "32%", left: "6%", size: 44, rotate: -30, opacity: 0.11 },
  { bottom: "18%", right: "16%", size: 26, rotate: 12, opacity: 0.08 },
  { top: "60%", left: "30%", size: 18, rotate: 40, opacity: 0.07 },
];

export default function ProductsHero() {
  return (
    <section className="relative w-full h-175 overflow-hidden">
      <Image
        src="/Hero-background.png"
        alt="Products hero"
        fill
        className="object-cover object-center"
        priority
      />

      {/* Bottom gradient → text legibility */}
      <div className="absolute inset-0 bg-linear-to-t from-[#0E2A66]/65 via-[#0E2A66]/15 to-transparent" />

      {/* Paw print decorations */}
      {PAW_POSITIONS.map((p, i) => (
        <div
          key={i}
          className="absolute pointer-events-none select-none"
          style={{
            top: p.top,
            bottom: p.bottom,
            left: p.left,
            right: p.right,
            transform: `rotate(${p.rotate}deg)`,
            opacity: p.opacity,
          }}
        >
          <PawSVG size={p.size} color="#0E2A66" />
        </div>
      ))}

      {/* Hero text — anchored to bottom */}
      <div className="absolute inset-0 flex items-end pb-16 md:pb-20">
        <div className="max-w-screen-2xl w-full mx-auto px-6 md:px-16">
          <p className="text-white/75 font-bold text-xs uppercase tracking-widest mb-3">
            Bộ sưu tập 2026
          </p>
          <h1 className="text-white font-black text-3xl md:text-5xl lg:text-6xl leading-tight mb-4 drop-shadow-md">
            Khám phá
            <br />
            <span className="text-[#93BBFF]">sản phẩm</span>
          </h1>
          <p className="text-white/70 text-sm md:text-base max-w-xs leading-relaxed">
            Hàng trăm gấu bông thông minh —<br />
            mỗi bé một thế giới riêng.
          </p>
        </div>
      </div>
    </section>
  );
}
