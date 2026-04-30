"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { MdRefresh } from "react-icons/md";
import ProductsHero from "@/components/admin/products/ProductsHero";
import ProductsTopSellers from "@/components/admin/products/ProductsTopSellers";
import ProductsGrid from "@/components/admin/products/ProductsGrid";

export default function ProductsClient() {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".ac",
        { opacity: 0, y: 18 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power2.out",
          stagger: 0.07,
          clearProps: "all",
        },
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className="space-y-5">
      <div className="ac flex items-end justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-[#1A1A2E] font-black text-2xl leading-tight">
            Sản phẩm
          </h1>
          <p className="text-[#9CA3AF] text-sm font-semibold">
            Quản lý danh mục và kho hàng · Tháng 3 / 2026
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 bg-white text-[#17409A] text-[11px] font-black px-6 py-3.5 rounded-2xl hover:bg-[#F4F7FF] transition-all border border-[#F4F7FF] shadow-sm active:scale-95 uppercase tracking-widest"
          >
            <MdRefresh className="text-lg" />
            Làm mới dữ liệu
          </button>
        </div>
      </div>

      {/* Hero (left 2/5) + Top sellers (right 3/5) */}
      <div className="ac grid grid-cols-1 lg:grid-cols-5 gap-5">
        <div className="lg:col-span-3">
          <ProductsHero />
        </div>
        <div className="lg:col-span-2">
          <ProductsTopSellers />
        </div>
      </div>

      {/* Full-width products grid/table */}
      <div className="ac">
        <ProductsGrid />
      </div>
    </div>
  );
}
