"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { type ProductItem } from "@/types/products";
import ProductCard from "@/components/shared/ProductCard";

gsap.registerPlugin(ScrollTrigger);

interface Props {
  products: ProductItem[];
}

export default function ProductRelated({ products }: Props) {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".related-card",
        { opacity: 0, y: 25 },
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          ease: "power3.out",
          stagger: 0.09,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 82%",
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
      style={{ backgroundColor: "#F4F7FF" }}
    >
      <div className="max-w-screen-2xl mx-auto px-8 md:px-16">
        {/* Section heading */}
        <div className="flex items-end justify-between gap-6 mb-12 flex-wrap">
          <div>
            <p className="text-xs font-black tracking-[0.35em] uppercase text-[#17409A] mb-3">
              Khám phá thêm
            </p>
            <h2
              className="text-4xl font-black text-[#1A1A2E]"
              style={{ fontFamily: "'Fredoka', 'Nunito', sans-serif" }}
            >
              Có thể bạn thích
            </h2>
          </div>
          <a
            href="/products"
            className="text-sm font-black text-[#17409A] hover:text-[#0E2A66] transition-colors tracking-wide uppercase"
          >
            Xem tất cả →
          </a>
        </div>

        {/* Cards grid — or horizontal scroll on small screens */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id} className="related-card">
              <ProductCard
                id={product.id}
                name={product.name}
                description={product.description}
                price={product.price}
                image={product.image}
                badge={product.badge}
                badgeColor={product.badgeColor}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
