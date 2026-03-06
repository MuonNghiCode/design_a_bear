"use client";

import Image from "next/image";
import Link from "next/link";
import { IoHeartOutline, IoBagOutline } from "react-icons/io5";

/* ────────────────────────────────────────────
   ProductCard — Shared component
   Based on Design a Bear UI mockup:
   Dark navy card, bear image, badge, price,
   CTA + icon buttons
   ──────────────────────────────────────────── */

export interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  badge?: string;
  badgeColor?: string;
  href?: string;
}

function formatPrice(price: number): string {
  return price.toLocaleString("vi-VN") + " đ";
}

export default function ProductCard({
  id,
  name,
  description,
  price,
  image,
  badge,
  badgeColor = "#17409A",
  href,
}: ProductCardProps) {
  const productLink = href || `/products/${id}`;

  return (
    <div
      className="group relative flex flex-col rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
      style={{
        backgroundColor: "#0E2A66",
        fontFamily: "'Nunito', sans-serif",
      }}
    >
      {/* ── Image area ── */}
      <Link href={productLink} className="relative aspect-[4/5] overflow-hidden">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Badge */}
        {badge && (
          <div
            className="absolute top-4 right-4 px-4 py-1.5 rounded-full text-white text-xs font-bold tracking-wide shadow-lg"
            style={{ backgroundColor: badgeColor }}
          >
            {badge}
          </div>
        )}
      </Link>

      {/* ── Info area ── */}
      <div className="flex flex-col flex-1 px-5 pt-5 pb-5">
        {/* Name */}
        <Link href={productLink}>
          <h3 className="font-black text-white text-lg leading-tight mb-1.5 group-hover:text-[#4A90E2] transition-colors duration-200">
            {name}
          </h3>
        </Link>

        {/* Description */}
        <p className="text-[#F4F7FF]/50 text-sm leading-relaxed mb-4 line-clamp-2">
          {description}
        </p>

        {/* Price */}
        <p className="text-[#4A90E2] font-black text-xl mb-5">
          {formatPrice(price)}
        </p>

        {/* Actions */}
        <div className="flex items-center gap-2 mt-auto">
          {/* CTA Button */}
          <Link
            href={productLink}
            className="flex-1 bg-[#17409A] hover:bg-[#4A90E2] text-white font-bold text-sm text-center py-3 rounded-xl transition-colors duration-200"
          >
            Mua ngay
          </Link>

          {/* Cart Button */}
          <button
            className="w-11 h-11 rounded-xl bg-[#17409A]/40 hover:bg-[#17409A] text-white/70 hover:text-white flex items-center justify-center transition-all duration-200"
            aria-label="Thêm vào giỏ"
          >
            <IoBagOutline className="text-lg" />
          </button>

          {/* Wishlist Button */}
          <button
            className="w-11 h-11 rounded-xl bg-[#17409A]/40 hover:bg-[#FF6B9D] text-white/70 hover:text-white flex items-center justify-center transition-all duration-200"
            aria-label="Yêu thích"
          >
            <IoHeartOutline className="text-lg" />
          </button>
        </div>
      </div>
    </div>
  );
}
