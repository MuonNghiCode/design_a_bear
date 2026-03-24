"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { type ProductDetail } from "@/types";
import { type ProductItem } from "@/types/products";
import ProductImageSection from "./ProductImageSection";
import ProductInfoPanel from "./ProductInfoPanel";
import ProductSpecs from "./ProductSpecs";
import ProductReviews from "./ProductReviews";
import ProductRelated from "./ProductRelated";
import ProductCustomize from "@/components/customize/ProductCustomize";
import AccessorySpecs from "./AccessorySpecs";

gsap.registerPlugin(ScrollTrigger);

interface ProductDetailClientProps {
  product: ProductDetail;
  related?: ProductItem[];
}

/* ── Map ProductDetail (API) → ProductItem (UI components) ── */
function mapDetailToItem(p: ProductDetail): ProductItem {
  const images = p.media.map((m) => m.url);
  return {
    id: p.productId,
    name: p.name,
    description: p.description || p.name,
    price: p.variants?.[0]?.price ?? p.price,
    image: images[0] || "/teddy_bear.png",
    images: images.length > 0 ? images : undefined,
    category: p.productType === "ACCESSORY" ? "accessory" : p.productType === "BASE_BEAR" ? "bear" : "complete",
    badgeColor: "#17409A",
    slug: p.slug,
  } as ProductItem;
}

export default function ProductDetailClient({ product, related = [] }: ProductDetailClientProps) {
  const [quantity, setQuantity] = useState(1);
  const heroRef = useRef<HTMLDivElement>(null);
  const productItem = mapDetailToItem(product);

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
            <ProductImageSection product={productItem} />
          </div>
          <div className="pd-info-enter w-full lg:w-[45%] lg:sticky lg:top-28">
            <ProductInfoPanel
              product={productItem}
              quantity={quantity}
              setQuantity={setQuantity}
            />
          </div>
        </div>
      </section>

      {/* ── Customize (bear/base bear only) ── */}
      {(productItem.category === "bear" || product.productType === "BASE_BEAR") && (
        <ProductCustomize accentColor={productItem.badgeColor || "#17409A"} />
      )}

      {/* ── Specs ── */}
      {productItem.category === "accessory" ? (
        <AccessorySpecs accentColor={productItem.badgeColor || "#17409A"} />
      ) : (
        <ProductSpecs accentColor={productItem.badgeColor || "#17409A"} />
      )}

      {/* ── Reviews (dùng data thực từ API) ── */}
      <ProductReviews
        accentColor={productItem.badgeColor || "#17409A"}
        reviews={product.reviews}
      />

      {/* ── Related products ── */}
      {related.length > 0 && <ProductRelated products={related} />}
    </div>
  );
}
