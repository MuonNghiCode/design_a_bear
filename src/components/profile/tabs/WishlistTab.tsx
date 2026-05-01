"use client";

import Image from "next/image";
import Link from "next/link";
import { IoHeart, IoHeartOutline, IoTrashOutline, IoCartOutline } from "react-icons/io5";
import { useFavorite } from "@/contexts/FavoriteContext";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/contexts/ToastContext";

function formatPrice(price: number | undefined | null) {
  if (price === undefined || price === null) return "0 đ";
  return price.toLocaleString("vi-VN") + " đ";
}

export default function WishlistTab() {
  const { favorites, items, loading, toggleFavorite } = useFavorite();
  const { addItem, openCart } = useCart();
  const toast = useToast();
  const count = items.length;

  const handleAddToCart = async (item: any) => {
    try {
      await addItem(
        {
          id: item.productId,
          name: item.productName,
          description: item.productName || "Sản phẩm yêu thích",
          price: item.productPrice,
          image: item.productImageUrl || "/teddy_bear.png",
          badge: "Gấu bông",
          badgeColor: "#17409A",
        },
        1
      );
      toast.success("Đã thêm gấu bông vào giỏ hàng");
      openCart();
    } catch (err) {
      toast.error("Không thể thêm vào giỏ hàng");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center" style={{ fontFamily: "'Nunito', sans-serif" }}>
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#17409A] border-t-transparent mb-4" />
        <p className="text-[#6B7280] font-semibold">Đang tải danh sách...</p>
      </div>
    );
  }

  if (count === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center" style={{ fontFamily: "'Nunito', sans-serif" }}>
        <div className="w-20 h-20 rounded-[32px] bg-[#FFF1F5] flex items-center justify-center mb-6 shadow-sm border border-[#FF6B9D1A]">
          <IoHeartOutline className="text-[#FF6B9D] text-4xl" />
        </div>
        <p className="text-[#1A1A2E] font-black text-2xl mb-2">
          Bé chưa yêu thích món nào
        </p>
        <p className="text-[#6B7280] text-base font-medium mb-8 max-w-xs mx-auto leading-relaxed">
          Hãy dạo quanh cửa hàng và nhấn icon trái tim để lưu lại những chú gấu bé thích nhé!
        </p>
        <Link
          href="/products"
          className="bg-[#17409A] text-white font-black text-base px-8 py-4 rounded-2xl transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5"
        >
          Khám phá ngay
        </Link>
      </div>
    );
  }

  return (
    <div className="py-6 space-y-6" style={{ fontFamily: "'Nunito', sans-serif" }}>
      {/* Tab Header & Quick summary */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#F4F7FF] p-6 rounded-3xl border border-slate-100">
        <div>
          <h3 className="text-xl font-black text-[#1A1A2E] flex items-center gap-2">
            <IoHeart className="text-[#FF6B9D] text-2xl" />
            Sản phẩm đã thích
          </h3>
          <p className="text-sm font-semibold text-[#6B7280] mt-1">
            Bạn đã lưu {count} sản phẩm vào danh sách yêu thích
          </p>
        </div>
        <Link
          href="/products"
          className="self-start md:self-center font-black text-sm bg-[#17409A] text-white px-6 py-3 rounded-2xl hover:bg-[#0E2A66] hover:shadow-lg transition-all text-center"
        >
          Xem thêm sản phẩm
        </Link>
      </div>

      {/* Grid listing */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div
            key={item.favoriteId}
            className="group flex flex-col justify-between p-4 bg-white rounded-3xl border-2 border-slate-50 hover:border-[#FF6B9D1A] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
          >
            {/* Action buttons on hover overlay */}
            <button
              onClick={() => toggleFavorite(item.productId)}
              className="absolute top-4 right-4 z-10 w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-md text-[#6B7280] hover:text-[#FF6B9D] hover:scale-110 transition-all duration-200 border border-slate-100/50"
              title="Bỏ yêu thích"
            >
              <IoTrashOutline className="text-lg" />
            </button>

            {/* Product Image */}
            <Link
              href={`/products/${item.productId}`}
              className="w-full h-56 bg-[#F4F7FF] rounded-2xl overflow-hidden mb-4 border border-slate-50/50 block relative"
            >
              <Image
                src={item.productImageUrl || "/teddy_bear.png"}
                alt={item.productName}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover group-hover:scale-105 transition-all duration-500"
                unoptimized={!!item.productImageUrl}
              />
            </Link>

            {/* Product details */}
            <div className="flex flex-col gap-2 flex-1">
              <Link href={`/products/${item.productId}`}>
                <h4 className="font-black text-base text-[#1A1A2E] leading-tight hover:text-[#17409A] transition-colors truncate">
                  {item.productName}
                </h4>
              </Link>
              <div className="flex items-center justify-between mt-1">
                <p className="font-black text-lg text-[#17409A]">
                  {formatPrice(item.productPrice)}
                </p>
                <span className="text-[10px] font-black uppercase bg-[#F4F7FF] text-[#17409A] px-2.5 py-1 rounded-lg border border-slate-100">
                  Gấu bông
                </span>
              </div>
            </div>

            {/* Direct cart and view CTAs */}
            <div className="flex gap-2.5 mt-5">
              <Link
                href={`/products/${item.productId}`}
                className="flex-1 text-center bg-[#F4F7FF] hover:bg-[#E5E7EB] text-[#17409A] font-black text-xs py-3.5 rounded-2xl transition-all hover:shadow-md"
              >
                Xem chi tiết
              </Link>
              <button
                onClick={() => handleAddToCart(item)}
                className="w-12 bg-[#17409A] hover:bg-[#0E2A66] text-white flex items-center justify-center rounded-2xl hover:shadow-lg transition-all duration-200"
                title="Thêm vào giỏ hàng"
              >
                <IoCartOutline className="text-xl" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
