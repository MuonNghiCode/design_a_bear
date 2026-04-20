"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { IoArrowForward } from "react-icons/io5";
import ProductCard, { type ProductCardProps } from "../shared/ProductCard";
import ProductCardSkeleton from "../shared/ProductCardSkeleton";
import type { ProductListItem } from "@/types";
import { inventoryService } from "@/services/inventory.service";

gsap.registerPlugin(ScrollTrigger);

const FALLBACK_IMAGE = "/teddy_bear.png";

function mapToCardProps(item: ProductListItem): ProductCardProps {
  return {
    id: item.productId,
    name: item.name,
    description: item.shortDescription || "Gấu bông thông minh tích hợp AI & IoT",
    price: item.minPrice || item.price,
    image: item.imageUrl || item.media[0]?.url || FALLBACK_IMAGE,
    href: `/products/${item.slug}`,
  };
}


/* ────────────────────────────────────────────
   Component
   ──────────────────────────────────────────── */
export default function FeaturedProducts() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const triggersRef = useRef<ReturnType<typeof ScrollTrigger.create>[]>([]);

  const { getProducts, loading } = useProductApi();
  const [products, setProducts] = useState<ProductCardProps[]>([]);
  const [inventoryMap, setInventoryMap] = useState<Record<string, number>>({});

  // Fetch 4 sản phẩm mới nhất
  useEffect(() => {
    getProducts({ pageIndex: 1, pageSize: 4, sortBy: "newest" })
      .then(async (data) => {
        const cardProps = data.items.map(mapToCardProps);
        setProducts(cardProps);
        
        // Fetch inventory for these 4 items
        try {
          const results = await Promise.all(
            data.items.map(async (item) => {
               const res = await inventoryService.getTotalAvailable(item.productId);
               return { id: item.productId, total: res.isSuccess && res.value ? res.value.totalAvailable : 0 };
            })
          );
          const newMap: Record<string, number> = {};
          results.forEach(r => { newMap[r.id] = r.total; });
          setInventoryMap(newMap);
        } catch (err) {
          console.error("Failed to sync featured stock:", err);
        }
      })
      .catch(() => {
        // Giữ mảng rỗng nếu lỗi, không crash trang
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!sectionRef.current) return;
    // Kill only our own previous triggers
    triggersRef.current.forEach((t) => t.kill());
    triggersRef.current = [];

    // Heading animation
    if (headingRef.current) {
      const t = ScrollTrigger.create({
        trigger: headingRef.current,
        start: "top 85%",
        once: true,
        onEnter: () => {
          gsap.fromTo(
            headingRef.current,
            { y: 25, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" },
          );
        },
      });
      triggersRef.current.push(t);
    }

    // Cards stagger
    if (gridRef.current && products.length > 0) {
      const t = ScrollTrigger.create({
        trigger: gridRef.current,
        start: "top 80%",
        once: true,
        onEnter: () => {
          gsap.fromTo(
            gridRef.current!.children,
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power2.out" },
          );
        },
      });
      triggersRef.current.push(t);
    }

    // CTA animation
    if (ctaRef.current) {
      const t = ScrollTrigger.create({
        trigger: ctaRef.current,
        start: "top 90%",
        once: true,
        onEnter: () => {
          gsap.fromTo(
            ctaRef.current,
            { y: 15, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" },
          );
        },
      });
      triggersRef.current.push(t);
    }

    return () => {
      triggersRef.current.forEach((t) => t.kill());
      triggersRef.current = [];
    };
  }, [products]);

  return (
    <section
      ref={sectionRef}
      className="relative py-32 md:py-40"
      style={{
        backgroundColor: "#F4F7FF",
        fontFamily: "'Nunito', sans-serif",
      }}
    >
      {/* ── Subtle decorative background ── */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden opacity-[0.02]">
        <div
          className="absolute top-20 left-10 w-96 h-96 rounded-full"
          style={{ backgroundColor: "#17409A" }}
        />
        <div
          className="absolute bottom-20 right-10 w-96 h-96 rounded-full"
          style={{ backgroundColor: "#4A90E2" }}
        />
      </div>

      {/* ── Decorative paw prints & stars ── */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        {[
          { top: "8%", right: "5%", size: 45, rot: 15, op: 0.04 },
          { top: "55%", left: "4%", size: 38, rot: -20, op: 0.05 },
          { bottom: "12%", right: "12%", size: 32, rot: 25, op: 0.04 },
        ].map((p, i) => (
          <svg
            key={i}
            width={p.size}
            height={p.size}
            viewBox="0 0 64 64"
            fill="#17409A"
            style={{
              position: "absolute",
              top: "top" in p ? p.top : undefined,
              bottom: "bottom" in p ? p.bottom : undefined,
              left: "left" in p ? p.left : undefined,
              right: "right" in p ? p.right : undefined,
              opacity: p.op,
              transform: `rotate(${p.rot}deg)`,
            }}
          >
            <ellipse cx="32" cy="44" rx="16" ry="13" />
            <circle cx="14" cy="28" r="7" />
            <circle cx="50" cy="28" r="7" />
            <circle cx="23" cy="20" r="5.5" />
            <circle cx="41" cy="20" r="5.5" />
          </svg>
        ))}
        {/* Stars */}
        {[
          { top: "15%", left: "8%", size: 24, op: 0.06 },
          { top: "70%", right: "6%", size: 20, op: 0.05 },
        ].map((s, i) => (
          <svg
            key={`star-${i}`}
            width={s.size}
            height={s.size}
            viewBox="0 0 24 24"
            fill="#FFD93D"
            style={{
              position: "absolute",
              top: s.top,
              left: "left" in s ? s.left : undefined,
              right: "right" in s ? s.right : undefined,
              opacity: s.op,
            }}
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        ))}
      </div>

      <div className="max-w-screen-2xl mx-auto px-8 md:px-16 relative z-10">
        {/* ── Heading ── */}
        <div ref={headingRef} className="text-center mb-20 md:mb-24">
          <div className="flex items-center justify-center gap-4 mb-5">
            <div className="w-12 h-px bg-[#17409A]/20"></div>
            <p className="text-[#17409A] font-bold text-sm tracking-[0.2em] uppercase">
              Sản phẩm nổi bật
            </p>
            <div className="w-12 h-px bg-[#17409A]/20"></div>
          </div>

          <h2 className="text-[#1A1A2E] font-black text-4xl sm:text-5xl md:text-6xl leading-tight mb-6">
            Chọn người bạn đồng hành
            <br />
            <span className="text-[#17409A]">cho bé yêu</span>
          </h2>

          <p className="text-[#6B7280] text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            Mỗi chú gấu là một người thầy, một người bạn, được thiết kế riêng để
            phù hợp với từng giai đoạn phát triển của con bạn.
          </p>
        </div>

        {/* ── Product Grid ── */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-16"
        >
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
            : products.map((product) => (
                <ProductCard 
                  key={product.id} 
                  {...product} 
                  availableStock={inventoryMap[product.id]} 
                />
              ))}
        </div>

        {/* ── View all CTA ── */}
        <div ref={ctaRef} className="text-center">
          <div className="inline-flex flex-col items-center gap-8">
            <Link
              href="/products"
              className="group inline-flex items-center gap-3 bg-[#17409A] hover:bg-[#0E2A66] text-white font-bold px-12 py-5 rounded-2xl text-lg shadow-2xl transition-all duration-300 hover:shadow-[0_20px_60px_rgba(23,64,154,0.3)] hover:-translate-y-1"
            >
              Xem tất cả sản phẩm
              <IoArrowForward className="text-xl transition-transform duration-300 group-hover:translate-x-1" />
            </Link>

            <p className="text-[#6B7280] text-sm font-medium">
              Hơn 100+ mẫu gấu bông thông minh đang chờ bạn khám phá
            </p>
          </div>
        </div>
      </div>

      {/* Nunito font */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&subset=vietnamese&display=swap');`}</style>
    </section>
  );
}
