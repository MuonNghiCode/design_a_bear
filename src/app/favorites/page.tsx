"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  IoArrowBack,
  IoCartOutline,
  IoTrashOutline,
  IoArrowForward,
  IoHeart,
} from "react-icons/io5";
import gsap from "gsap";
import { favoriteService } from "@/services/favorite.service";
import { FavoriteResponse } from "@/types/responses";
import { useToast } from "@/contexts/ToastContext";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useFavorite } from "@/contexts/FavoriteContext";
import { useRouter } from "next/navigation";

/* Bear paw SVG decoration */
function PawPrint({
  className,
  color,
}: {
  className?: string;
  color?: string;
}) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill={color ?? "currentColor"}
      className={className}
      aria-hidden="true"
    >
      <ellipse cx="9" cy="4" rx="2.5" ry="3" />
      <ellipse cx="15" cy="4" rx="2.5" ry="3" />
      <ellipse cx="5" cy="9" rx="2" ry="2.5" />
      <ellipse cx="19" cy="9" rx="2" ry="2.5" />
      <path d="M12 8c-4.5 0-8 3.5-8 8 0 2 1.5 4 4 4h8c2.5 0 4-2 4-4 0-4.5-3.5-8-8-8z" />
    </svg>
  );
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const { success, error } = useToast();
  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();
  const { toggleFavorite } = useFavorite();
  const router = useRouter();
  const listRef = useRef<HTMLDivElement>(null);

  const fetchFavorites = useCallback(async () => {
    try {
      setLoading(true);
      const res = await favoriteService.getMyFavorites(1, 50);
      if (res.isSuccess) {
        setFavorites(res.value.items);
      }
    } catch (err) {
      error("Không thể tải danh sách yêu thích");
    } finally {
      setLoading(false);
    }
  }, [error]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth");
      return;
    }
    fetchFavorites();
  }, [isAuthenticated, fetchFavorites, router]);

  useEffect(() => {
    if (!loading && listRef.current) {
      const items = listRef.current.querySelectorAll(".fav-item-row");
      if (items.length > 0) {
        gsap.fromTo(
          items,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power2.out" },
        );
      }
    }
  }, [loading, favorites]);

  const handleRemove = async (productId: string) => {
    try {
      await toggleFavorite(productId);
      setFavorites((prev) => prev.filter((f) => f.productId !== productId));
    } catch (err) {
      error("Đã có lỗi xảy ra");
    }
  };

  const handleAddToCart = async (fav: FavoriteResponse) => {
    try {
      await addItem(
        {
          id: fav.productId,
          name: fav.productName,
          price: fav.productPrice,
          image: fav.productImageUrl || "/teddy_bear.png",
          description: "",
          href: `/products/${fav.productId}`,
        },
        1,
        null,
      );
      success(`Đã thêm "${fav.productName}" vào giỏ hàng!`);
    } catch (err) {
      error("Thêm vào giỏ hàng thất bại");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F7FF]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#17409A] border-t-transparent" />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-[#F4F7FF] py-20 px-4 md:px-8"
      style={{ fontFamily: "'Nunito', sans-serif" }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-[#17409A] font-bold text-sm mb-4 hover:translate-x-[-4px] transition-transform"
            >
              <IoArrowBack />
              Quay lại cửa hàng
            </Link>
            <div className="flex items-center gap-3 mb-2">
              <IoHeart className="text-4xl text-[#FF6B9D]" />
              <h1 className="text-4xl font-black text-[#1A1A2E]">
                Danh sách yêu thích
              </h1>
            </div>
            <p className="text-[#6B7280] font-semibold">
              {favorites.length === 0
                ? "Bé chưa chọn được món đồ nào"
                : `Bé có ${favorites.length} món đồ yêu thích`}
            </p>
          </div>

          {favorites.length > 0 && (
            <div className="flex items-center gap-2 opacity-20">
              {[0, 1, 2, 3].map((i) => (
                <PawPrint key={i} color="#17409A" />
              ))}
            </div>
          )}
        </div>

        {/* List Content */}
        {favorites.length === 0 ? (
          <div className="bg-white rounded-[32px] p-12 text-center shadow-xl border-2 border-dashed border-[#E5E7EB]">
            <div className="w-24 h-24 bg-[#F4F7FF] rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <IoHeart className="text-4xl text-[#FF6B9D] opacity-30" />
            </div>
            <h2 className="text-2xl font-black text-[#1A1A2E] mb-3">
              Chưa có gấu yêu thích!
            </h2>
            <p className="text-[#6B7280] mb-8 max-w-sm mx-auto">
              Hãy dạo quanh cửa hàng và nhấn icon trái tim để lưu lại những chú
              gấu bé thích nhất nhé.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-[#17409A] text-white px-8 py-4 rounded-2xl font-black hover:shadow-2xl hover:scale-105 transition-all"
            >
              Khám phá sản phẩm
              <IoArrowForward />
            </Link>
          </div>
        ) : (
          <div ref={listRef} className="space-y-4">
            {favorites.map((fav, i) => (
              <div
                key={fav.favoriteId || `${fav.productId}-${i}`}
                className="fav-item-row group flex flex-col sm:flex-row items-center gap-6 p-6 bg-white rounded-[32px] shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-[#17409A]/10"
              >
                {/* Product Image */}
                <Link
                  href={`/products/${fav.productId}`}
                  onClick={() => {}} // Placeholder if needed
                  className="shrink-0 w-32 h-32 rounded-2xl overflow-hidden shadow-md bg-[#F4F7FF]"
                >
                  <Image
                    src={fav.productImageUrl || "/teddy_bear.png"}
                    alt={fav.productName}
                    width={128}
                    height={128}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </Link>

                {/* Info */}
                <div className="flex-1 text-center sm:text-left min-w-0">
                  <h3 className="text-xl font-black text-[#1A1A2E] mb-1 truncate">
                    {fav.productName}
                  </h3>

                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                    <button
                      onClick={() => handleAddToCart(fav)}
                      className="flex items-center gap-2 bg-[#17409A] text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-[#4A90E2] transition-colors shadow-md"
                    >
                      <IoCartOutline className="text-lg" />
                      Thêm vào giỏ
                    </button>
                    <button
                      onClick={() => handleRemove(fav.productId)}
                      className="flex items-center gap-2 bg-[#FFF0F0] text-[#FF6B6B] px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-[#FF6B6B] hover:text-white transition-all shadow-sm"
                      aria-label="Xóa"
                    >
                      <IoTrashOutline className="text-lg" />
                    </button>
                  </div>
                </div>

                {/* Date Hidden on small */}
                <div className="hidden lg:block text-right shrink-0">
                  <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-widest mb-1">
                    Đã thêm vào
                  </p>
                  <p className="text-sm font-black text-[#1A1A2E]">
                    {new Date(fav.createdAt).toLocaleDateString("vi-VN", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer decoration */}
        {favorites.length > 0 && (
          <div className="mt-12 text-center">
            <div className="flex items-center justify-center gap-6 opacity-30 italic font-bold text-[#17409A] text-sm">
              <span>Được thiết kế với tất cả tình yêu</span>
              <div className="flex gap-2">
                <PawPrint />
                <PawPrint />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
