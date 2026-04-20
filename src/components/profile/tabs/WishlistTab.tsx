"use client";

import Link from "next/link";
import { IoHeart } from "react-icons/io5";
import { useFavorite } from "@/contexts/FavoriteContext";

export default function WishlistTab() {
  const { favorites, loading } = useFavorite();
  const count = favorites.size;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#17409A] border-t-transparent mb-4" />
        <p className="text-[#6B7280] font-semibold">Đang tải danh sách...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-16 h-16 rounded-2xl bg-[#FF6B9D]/10 flex items-center justify-center mb-4">
        <IoHeart className={count > 0 ? "text-[#FF6B9D] text-3xl" : "text-[#FF6B9D]/30 text-3xl"} />
      </div>
      <p className="text-[#1A1A2E] font-black text-xl mb-1">
        {count > 0 ? `${count} sản phẩm yêu thích` : "Bé chưa thích món nào"}
      </p>
      <p className="text-[#9CA3AF] text-sm font-semibold mb-6 max-w-xs mx-auto">
        {count > 0 
          ? "Những chú gấu bé yêu mến nhất đã được lưu lại tại đây." 
          : "Hãy dạo quanh cửa hàng và nhấn icon trái tim để lưu lại những chú gấu bé thích nhé."}
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        {count > 0 && (
          <Link
            href="/favorites"
            className="bg-[#17409A] text-white font-black text-sm px-8 py-3.5 rounded-2xl hover:shadow-xl hover:scale-105 transition-all"
          >
            Xem danh sách ngay
          </Link>
        )}
        <Link
          href="/products"
          className={`font-black text-sm px-8 py-3.5 rounded-2xl transition-all ${
            count > 0 
              ? "bg-[#F4F7FF] text-[#17409A] hover:bg-[#E5E7EB]" 
              : "bg-[#17409A] text-white hover:bg-[#0E2A66]"
          }`}
        >
          Tiếp tục mua sắm
        </Link>
      </div>
    </div>
  );
}
