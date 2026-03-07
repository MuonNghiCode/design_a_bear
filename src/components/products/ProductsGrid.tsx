"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ProductCard, {
  type ProductCardProps,
} from "@/components/shared/ProductCard";

gsap.registerPlugin(ScrollTrigger);

interface ProductsGridProps {
  products: ProductCardProps[];
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="text-7xl mb-4 select-none opacity-30">🐻</div>
      <h3 className="text-[#1A1A2E] font-black text-xl mb-2">
        Không tìm thấy sản phẩm
      </h3>
      <p className="text-[#6B7280] text-sm max-w-xs">
        Thử thay đổi bộ lọc hoặc từ khoá tìm kiếm để xem thêm sản phẩm.
      </p>
    </div>
  );
}

export default function ProductsGrid({ products }: ProductsGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!gridRef.current) return;
    const cards =
      gridRef.current.querySelectorAll<HTMLElement>(".product-card-item");
    if (cards.length === 0) return;

    gsap.fromTo(
      cards,
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.5,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: {
          trigger: gridRef.current,
          start: "top 85%",
          once: true,
        },
      },
    );
  }, [products]);

  return (
    <section className="bg-[#F4F7FF] flex-1 py-10 md:py-14">
      <div className="max-w-screen-2xl mx-auto px-4 md:px-16">
        {/* Mobile product count */}
        <p className="text-[#6B7280] text-sm font-semibold mb-6 lg:hidden">
          {products.length} sản phẩm
        </p>

        {products.length === 0 ? (
          <EmptyState />
        ) : (
          <div
            ref={gridRef}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6"
          >
            {products.map((product) => (
              <div key={product.id} className="product-card-item">
                <ProductCard {...product} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
