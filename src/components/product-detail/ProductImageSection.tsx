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
}

export default function ProductImageSection({
  product,
  overrideMainImage,
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
