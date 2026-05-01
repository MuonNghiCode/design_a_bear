"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import { type ProductItem } from "@/types/products";


/* ── Inline paw SVG ── */
function PawSVG({
  size = 64,
  opacity = 0.07,
  rotate = 0,
  color = "#0E2A66",
}: {
  size?: number;
  opacity?: number;
  rotate?: number;
  color?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={{ opacity, transform: `rotate(${rotate}deg)` }}
      fill={color}
      aria-hidden="true"
    >
      <ellipse cx="50" cy="68" rx="24" ry="20" />
      <circle cx="20" cy="44" r="11" />
      <circle cx="39" cy="32" r="12" />
      <circle cx="61" cy="32" r="12" />
      <circle cx="80" cy="44" r="11" />
    </svg>
  );
}

interface Props {
  product: ProductItem;
  overrideMainImage?: string | null;
  isAIProcessorSelected?: boolean;
}

export default function ProductImageSection({
  product,
  overrideMainImage,
  isAIProcessorSelected,
}: Props) {
  const accent = product.badgeColor || "#17409A";

  // Build gallery: use overrideMainImage if provided, otherwise standard product images
  const gallery: string[] = useMemo(() => {
    let list: string[] = [];
    if (overrideMainImage) {
      list.push(overrideMainImage);
    }
    if (product.images && product.images.length > 0) {
      list.push(...product.images);
    } else if (product.image) {
      list.push(product.image);
    }
    // De-duplicate if needed
    return Array.from(new Set(list));
  }, [product.images, product.image, overrideMainImage]);

  const [activeIdx, setActiveIdx] = useState(0);
  const activeSrc = gallery[activeIdx] || product.image || "/teddy_bear.png";

  // If overrideMainImage changes, we want to show it immediately (it becomes the first item in gallery)
  useEffect(() => {
    if (overrideMainImage) {
      setActiveIdx(0);
    }
  }, [overrideMainImage]);

  // Auto-advance every 5 seconds; pause on manual selection
  const next = useCallback(
    () => setActiveIdx((i) => (i + 1) % gallery.length),
    [gallery.length],
  );

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <div className="relative select-none">
      {/* ── Decorative accent shelf behind main image ── */}
      <div
        className="absolute -bottom-5 -right-5 w-4/5 h-4/5 rounded-3xl pointer-events-none"
        style={{ backgroundColor: accent, opacity: 0.1 }}
      />

      {/* ── Thin vertical accent bar ── */}
      <div
        className="absolute -right-4 top-1/4 h-1/2 w-1.5 rounded-full z-20 pointer-events-none"
        style={{ backgroundColor: accent }}
      />

      {/* ── Main image ── */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-square bg-white">
        <Image
          src={activeSrc}
          alt={product.name}
          fill
          className="object-cover transition-opacity duration-500"
          priority
        />

        {/* Edition watermark */}
        <div className="absolute bottom-7 left-7 z-10 pointer-events-none">
          <p
            className="text-xs tracking-[0.3em] uppercase font-bold mb-0.5"
            style={{ color: "rgba(255,255,255,0.4)" }}
          >
            Smart Bear
          </p>
          <p
            className="text-6xl font-black leading-none"
            style={{ color: "rgba(255,255,255,0.08)" }}
          >
            00{activeIdx + 1}
          </p>
        </div>

        {/* Top-left brand watermark */}
        <div className="absolute top-7 left-7 z-10 pointer-events-none">
          <p
            className="text-xs tracking-[0.25em] uppercase font-bold"
            style={{ color: "rgba(255,255,255,0.5)" }}
          >
            Design a Bear
          </p>
        </div>

        {/* ── Thumbnail strip overlaid at the bottom ── */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2.5">
          {gallery.map((src, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiveIdx(i)}
              className="relative rounded-xl overflow-hidden border-2 transition-all duration-300 cursor-pointer shrink-0"
              style={{
                width: i === activeIdx ? 56 : 44,
                height: i === activeIdx ? 56 : 44,
                borderColor:
                  i === activeIdx ? "white" : "rgba(255,255,255,0.35)",
                opacity: i === activeIdx ? 1 : 0.6,
                boxShadow:
                  i === activeIdx
                    ? "0 0 0 3px " + accent + ", 0 4px 16px rgba(0,0,0,0.4)"
                    : "0 2px 6px rgba(0,0,0,0.3)",
              }}
              aria-label={`Ảnh ${i + 1}`}
            >
              <Image
                src={src}
                alt={`${product.name} ${i + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>

        {/* ── Ultra Premium AI Overlay ── */}
        {isAIProcessorSelected && (
          <div 
            className="absolute top-6 left-6 z-30 bg-gradient-to-b from-[#1A1A2E]/90 to-[#1A1A2E]/70 backdrop-blur-xl rounded-[20px] shadow-[0_20px_40px_rgba(0,0,0,0.15)] p-5 border border-white/10"
            style={{ animation: "fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards" }}
          >
            <style>{`
              @keyframes fadeInUp {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
              }
            `}</style>
            
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10 shadow-inner shrink-0 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#4ECDC4]/20 to-[#7C5CFC]/20 mix-blend-overlay"></div>
                <svg className="w-5 h-5 text-white z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              
              <div className="flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#4ECDC4] shadow-[0_0_8px_#4ECDC4]"></div>
                  <p className="text-[9px] font-black uppercase tracking-[0.25em] text-[#4ECDC4]">
                    Smart Core Active
                  </p>
                </div>
                <h4 className="text-white font-bold text-sm tracking-wide">
                  Gấu Bông Thông Minh AI
                </h4>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-white/10">
              <ul className="space-y-2.5">
                <li className="flex items-center gap-3 text-[11px] text-white/70 font-medium tracking-wide">
                  <svg className="w-3.5 h-3.5 text-[#4ECDC4]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Giao tiếp 2 chiều tự nhiên
                </li>
                <li className="flex items-center gap-3 text-[11px] text-white/70 font-medium tracking-wide">
                  <svg className="w-3.5 h-3.5 text-[#4ECDC4]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Phát triển tư duy & Ngoại ngữ
                </li>
                <li className="flex items-center gap-3 text-[11px] text-white/70 font-medium tracking-wide">
                  <svg className="w-3.5 h-3.5 text-[#4ECDC4]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Tương tác gia đình từ xa
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* ── Floating badge ── */}
      {product.badge && (
        <div
          className="absolute -top-3 -right-3 z-20 px-5 py-2 rounded-full text-white text-sm font-black shadow-xl tracking-wider"
          style={{ backgroundColor: accent }}
        >
          {product.badge}
        </div>
      )}

      {/* ── Popular ribbon ── */}
      {product.popular && (
        <div className="absolute top-5 -left-2 z-20 bg-[#FFD93D] text-[#1A1A2E] text-xs font-black px-4 py-1.5 shadow-lg tracking-widest uppercase">
          <span>Bán chạy</span>
          <span className="absolute -bottom-2 left-0 border-l-8 border-t-8 border-l-transparent border-t-[#c8a900]" />
        </div>
      )}

      {/* ── Paw decorations ── */}
      <div className="absolute -top-7 -left-4 pointer-events-none z-0">
        <PawSVG size={70} opacity={0.07} rotate={-20} />
      </div>
      <div className="absolute top-1/2 -right-12 pointer-events-none z-0">
        <PawSVG size={56} opacity={0.06} rotate={30} />
      </div>
      <div className="absolute -bottom-10 left-1/3 pointer-events-none z-0">
        <PawSVG size={48} opacity={0.05} rotate={10} />
      </div>
    </div>
  );
}
