"use client";

import Link from "next/link";
import { IoHeartOutline } from "react-icons/io5";

export default function WishlistTab() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-16 h-16 rounded-2xl bg-[#FF6B9D]/10 flex items-center justify-center mb-4">
        <IoHeartOutline className="text-[#FF6B9D] text-3xl" />
      </div>
      <p className="text-[#1A1A2E] font-black text-base mb-1">
        7 sản phẩm yêu thích
      </p>
      <p className="text-[#9CA3AF] text-sm font-semibold mb-5">
        Các sản phẩm bạn đã lưu sẽ hiện ở đây
      </p>
      <Link
        href="/products"
        className="bg-[#17409A] text-white font-black text-sm px-6 py-3 rounded-2xl hover:bg-[#0E2A66] transition-colors"
      >
        Khám phá sản phẩm
      </Link>
    </div>
  );
}
