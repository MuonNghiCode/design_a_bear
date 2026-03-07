"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { type ProductItem } from "@/types/products";
import ProductImageSection from "./ProductImageSection";
import ProductInfoPanel from "./ProductInfoPanel";
import ProductSpecs from "./ProductSpecs";
import ProductReviews from "./ProductReviews";
import ProductRelated from "./ProductRelated";

gsap.registerPlugin(ScrollTrigger);

interface ProductDetailClientProps {
  product: ProductItem;
  related: ProductItem[];
}

export default function ProductDetailClient({
  product,
  related,
}: ProductDetailClientProps) {
  const [quantity, setQuantity] = useState(1);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!heroRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".pd-img-enter",
        { opacity: 0, x: -40 },
        { opacity: 1, x: 0, duration: 0.7, ease: "power3.out" },
      );
      gsap.fromTo(
        ".pd-info-enter",
        { opacity: 0, x: 40 },
        { opacity: 1, x: 0, duration: 0.7, ease: "power3.out", delay: 0.15 },
      );
    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <div style={{ fontFamily: "'Nunito', sans-serif" }}>
      {/* ── Hero: Image + Info split ── */}
      <section
        ref={heroRef}
        className="max-w-screen-2xl mx-auto px-8 md:px-16 pt-12 pb-24"
      >
        <div className="flex flex-col lg:flex-row gap-14 lg:gap-20 items-start">
          <div className="pd-img-enter w-full lg:w-[55%]">
            <ProductImageSection product={product} />
          </div>
          <div className="pd-info-enter w-full lg:w-[45%] lg:sticky lg:top-28">
            <ProductInfoPanel
              product={product}
              quantity={quantity}
              setQuantity={setQuantity}
            />
          </div>
        </div>
      </section>

      {/* ── Feature Specs ── */}
      <ProductSpecs accentColor={product.badgeColor || "#17409A"} />

      {/* ── Reviews ── */}
      <ProductReviews accentColor={product.badgeColor || "#17409A"} />

      {/* ── Related products ── */}
      {related.length > 0 && <ProductRelated products={related} />}
    </div>
  );
}
