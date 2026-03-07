"use client";

import { useRef, useEffect } from "react";
import {
  IoSearchOutline,
  IoHeartOutline,
  IoChevronDown,
} from "react-icons/io5";
import gsap from "gsap";

export const CATEGORIES = [
  { id: "all", label: "Tất cả" },
  { id: "complete", label: "Sản phẩm hoàn chỉnh" },
  { id: "bear", label: "Gấu bông" },
  { id: "accessory", label: "Phụ kiện" },
];

export const SORT_OPTIONS = [
  { id: "newest", label: "Mới nhất" },
  { id: "popular", label: "Phổ biến" },
  { id: "price-asc", label: "Giá tăng dần" },
  { id: "price-desc", label: "Giá giảm dần" },
];

interface ProductsFilterProps {
  activeCategory: string;
  onCategoryChange: (cat: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  sortBy: string;
  onSortChange: (s: string) => void;
  productCount: number;
}

export default function ProductsFilter({
  activeCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  productCount,
}: ProductsFilterProps) {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (barRef.current) {
      gsap.fromTo(
        barRef.current,
        { y: -16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: "power2.out", delay: 0.1 },
      );
    }
  }, []);

  return (
    <div
      ref={barRef}
      className="bg-[#F4F7FF]/95 backdrop-blur-md border-b border-[#E5E7EB] py-3 md:py-4"
    >
      <div className="max-w-screen-2xl mx-auto px-4 md:px-16">
        <div className="flex items-center gap-3 md:gap-4 justify-between flex-wrap md:flex-nowrap">
          {/* Category pills — horizontal scroll on mobile */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide shrink-0">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => onCategoryChange(cat.id)}
                className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  activeCategory === cat.id
                    ? "bg-[#17409A] text-white shadow-md"
                    : "bg-white text-[#6B7280] border border-[#E5E7EB] hover:border-[#17409A] hover:text-[#17409A]"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Right: search + sort + count */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Product count */}
            <span className="text-[#6B7280] text-xs font-semibold whitespace-nowrap hidden lg:block">
              {productCount} sản phẩm
            </span>

            {/* Search */}
            <div className="relative flex-1 md:w-56 lg:w-72">
              <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] w-4 h-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Tìm kiếm..."
                className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-white border border-[#E5E7EB] text-sm text-[#1A1A2E] placeholder-[#9CA3AF] focus:outline-none focus:border-[#17409A] focus:ring-2 focus:ring-[#17409A]/10 transition-all"
              />
            </div>

            {/* Sort dropdown */}
            <div className="relative hidden md:block">
              <select
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value)}
                className="appearance-none pl-4 pr-9 py-2.5 rounded-2xl bg-white border border-[#E5E7EB] text-sm text-[#1A1A2E] font-semibold focus:outline-none focus:border-[#17409A] cursor-pointer transition-all"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <IoChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] w-3.5 h-3.5 pointer-events-none" />
            </div>

            {/* Wishlist icon */}
            <button
              className="w-10 h-10 rounded-2xl bg-white border border-[#E5E7EB] text-[#6B7280] hover:border-[#FF6B9D] hover:text-[#FF6B9D] flex items-center justify-center transition-all duration-200 shrink-0"
              aria-label="Yêu thích"
            >
              <IoHeartOutline className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
