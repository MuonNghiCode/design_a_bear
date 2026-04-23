"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { MdTrendingUp, MdVisibility, MdStar } from "react-icons/md";
import { formatPrice } from "@/utils/currency";
import { productService } from "@/services/product.service";
import type { ProductListItem } from "@/types";

export default function ProductsTopSellers() {
  const [topProducts, setTopProducts] = useState<ProductListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTop = async () => {
      try {
        const res = await productService.getTopProducts(3);
        if (res.isSuccess) setTopProducts(res.value);
      } catch (err) {
        console.error("Top Sellers fetch failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTop();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-3xl p-6 border border-[#F4F7FF] animate-pulse">
        <div className="h-6 w-32 bg-gray-100 rounded mb-8" />
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4">
              <div className="w-14 h-14 bg-gray-100 rounded-2xl" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-100 rounded w-3/4" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (topProducts.length === 0) return null;

  return (
    <div className="bg-white rounded-3xl p-6 border border-[#F4F7FF]">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-[#9CA3AF] text-[10px] font-black tracking-[0.2em] uppercase mb-1">
            Thống kê
          </p>
          <h2 className="text-[#1A1A2E] font-black text-lg">Bán chạy nhất</h2>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-[#4ECDC415] text-[#4ECDC4] flex items-center justify-center">
          <MdTrendingUp className="text-xl" />
        </div>
      </div>

      <div className="space-y-6">
        {topProducts.map((p, i) => (
          <div
            key={p.productId}
            className="flex items-center gap-4 group cursor-pointer"
          >
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-[#F4F7FF] flex items-center justify-center overflow-hidden border border-[#F4F7FF] group-hover:border-[#17409A]/50 transition-colors">
                <Image
                  src={p.imageUrl || "/product_placeholder.png"}
                  alt={p.name}
                  width={56}
                  height={56}
                  className="object-contain group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="absolute -top-2 -left-2 w-5 h-5 rounded-lg bg-[#1A1A2E] text-white flex items-center justify-center text-[9px] font-black border-2 border-white">
                {i + 1}
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-[#1A1A2E] font-black text-sm truncate mb-1">
                {p.name}
              </p>
              <div className="flex items-center gap-3">
                <p className="text-[#17409A] font-black text-xs">
                  {formatPrice(p.price)}
                </p>
                <div className="w-1 h-1 rounded-full bg-[#E5E7EB]" />
                <p className="text-[#9CA3AF] text-[10px] font-bold">
                  {p.totalSales} đã bán
                </p>
              </div>
            </div>

            <div className="flex flex-col items-end gap-1">
              <div className="flex items-center gap-1 text-[#FFB800] text-[10px] font-black">
                <MdStar className="text-xs" />{" "}
                {p.averageRating?.toFixed(1) || "5.0"}
              </div>
              <div className="flex items-center gap-1 text-[#9CA3AF] text-[9px] font-bold">
                <MdVisibility className="text-xs opacity-50" />{" "}
                {p.viewCountIn10Min || 0}
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full mt-8 py-3 rounded-2xl text-[10px] font-black text-[#6B7280] bg-[#F4F7FF] hover:bg-[#E2E8F0] transition-colors uppercase tracking-widest">
        Xem báo cáo chi tiết
      </button>
    </div>
  );
}
