"use client";

import { useRef, useEffect, useState, useMemo } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { type ProductDetail } from "@/types";
import { type ProductItem } from "@/types/products";
import {
  type PersonalizationRule,
} from "@/types/responses";
import ProductImageSection from "./ProductImageSection";
import ProductInfoPanel from "./ProductInfoPanel";
import ProductSpecs from "./ProductSpecs";
import ProductReviews from "./ProductReviews";
import ProductRelated from "./ProductRelated";
import AccessorySpecs from "./AccessorySpecs";

gsap.registerPlugin(ScrollTrigger);

interface ProductDetailClientProps {
  product: ProductDetail;
  related?: ProductItem[];
  personalizationRules?: PersonalizationRule[];
}

/* ── Map ProductDetail (API) → ProductItem (UI components) ── */
function mapDetailToItem(p: ProductDetail): ProductItem {
  const images = p.media.map((m) => m.url);
  return {
    id: p.productId,
    name: p.name,
    description: p.description || p.name,
    price: p.price,
    image: images[0] || "/teddy_bear.png",
    images: images.length > 0 ? images : undefined,
    category:
      p.productType === "ACCESSORY"
        ? "accessory"
        : p.productType === "BASE_BEAR"
          ? "bear"
          : "complete",
    categories: (p.categories || []).map((c) => c.name).filter(Boolean),
    characters: (p.characters || []).map((c) => c.name).filter(Boolean),
    badgeColor: "#17409A",
    slug: p.slug,
  } as ProductItem;
}

export default function ProductDetailClient({
  product,
  related = [],
  personalizationRules = [],
}: ProductDetailClientProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedAccessories, setSelectedAccessories] = useState<
    PersonalizationRule[]
  >([]);
  const heroRef = useRef<HTMLDivElement>(null);
  const productItem = mapDetailToItem(product);

  // ── Combination Image Logic ──
  const combinationKey = useMemo(() => {
    // Sort IDs alphabetically and join with |
    // EXCLUDING AI_PROCESSOR from image combination key (per requirement)
    // NOTE: ruleType is always "ACCESSORY", so we must check addonProduct.productType
    return selectedAccessories
      .filter((rule) => {
        const type = (rule.addonProduct.productType || "").toUpperCase();
        const name = (rule.addonProduct.name || "").toUpperCase();
        return type !== "AI_PROCESSOR" && !name.includes("AI PROCESSOR");
      })
      .map((rule) => rule.addonProduct.productId)
      .sort((a, b) => a.localeCompare(b))
      .join("|");
  }, [selectedAccessories]);

  const activeComboImage = useMemo(() => {
    if (!product.comboImages || product.comboImages.length === 0) return null;
    return (
      product.comboImages.find((ci) => ci.combinationKey === combinationKey)
        ?.imageUrl || null
    );
  }, [product.comboImages, combinationKey]);

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
            <ProductImageSection
              product={productItem}
              overrideMainImage={activeComboImage}
            />
          </div>
          <div className="pd-info-enter w-full lg:w-[45%] lg:sticky lg:top-28">
            <ProductInfoPanel
              product={productItem}
              personalizationRules={personalizationRules}
              quantity={quantity}
              setQuantity={setQuantity}
              selectedAccessories={selectedAccessories}
              setSelectedAccessories={setSelectedAccessories}
            />
          </div>
        </div>
      </section>

      {/* ── Specs ── */}
      {productItem.category === "accessory" ? (
        <AccessorySpecs accentColor={productItem.badgeColor || "#17409A"} />
      ) : (
        <ProductSpecs accentColor={productItem.badgeColor || "#17409A"} />
      )}

      {/* ── Reviews (dùng data thực từ API) ── */}
      <ProductReviews
        productId={product.productId}
        accentColor={productItem.badgeColor || "#17409A"}
        reviews={product.reviews}
      />

      {/* ── Related products ── */}
      {related.length > 0 && <ProductRelated products={related} />}
    </div>
  );
}
