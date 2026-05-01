"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useCallback } from "react";
import {
  IoCloseOutline,
  IoHeartOutline,
  IoArrowForward,
} from "react-icons/io5";
import gsap from "gsap";
import { useFavorite } from "@/contexts/FavoriteContext";

function formatPrice(price: number | undefined | null) {
  if (price === undefined || price === null) return "0 đ";
  return price.toLocaleString("vi-VN") + " đ";
}

/* Empty wishlist illustration */
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 px-8 py-16 text-center">
      <div
        className="w-28 h-28 rounded-[32px] flex items-center justify-center shadow-lg bg-[#FFF1F5] border-2 border-[#FF6B9D33]"
      >
        <IoHeartOutline className="text-4xl text-[#FF6B9D]" />
      </div>
      <div>
        <p
          className="text-xl font-black mb-2 text-[#1A1A2E]"
          style={{ fontFamily: "'Nunito', sans-serif" }}
        >
          Danh sách trống!
        </p>
        <p className="text-sm text-[#6B7280] leading-relaxed">
          Bé chưa yêu thích sản phẩm nào cả.
          <br />
          Hãy khám phá bộ sưu tập nhé!
        </p>
      </div>
      <Link
        href="/products"
        className="flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 bg-[#FF6B9D] text-white"
        style={{ fontFamily: "'Nunito', sans-serif" }}
      >
        Xem sản phẩm
        <IoArrowForward className="text-base" />
      </Link>
    </div>
  );
}

export default function FavoriteDrawer() {
  const {
    items,
    toggleFavorite,
    isOpen,
    closeFavorites,
  } = useFavorite();

  const drawerRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLDivElement>(null);

  const animateOpen = useCallback(() => {
    const tl = gsap.timeline();
    tl.fromTo(
      backdropRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.3, ease: "power2.out" }
    ).fromTo(
      drawerRef.current,
      { x: "100%" },
      { x: "0%", duration: 0.45, ease: "power3.out" },
      "-=0.2"
    );

    if (itemsRef.current) {
      const rowEls = itemsRef.current.querySelectorAll(".fav-item-row");
      if (rowEls.length) {
        gsap.fromTo(
          rowEls,
          { x: 24, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.35,
            stagger: 0.07,
            ease: "power2.out",
            delay: 0.35,
          }
        );
      }
    }
  }, []);

  const animateClose = useCallback(() => {
    const tl = gsap.timeline({ onComplete: closeFavorites });
    tl.to(drawerRef.current, {
      x: "100%",
      duration: 0.35,
      ease: "power2.in",
    }).to(
      backdropRef.current,
      { opacity: 0, duration: 0.25, ease: "power2.in" },
      "-=0.2"
    );
  }, [closeFavorites]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      animateOpen();
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, animateOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[200]"
      style={{ fontFamily: "'Nunito', sans-serif" }}
    >
      <div
        ref={backdropRef}
        className="absolute inset-0 bg-[#0E2A66]/40 backdrop-blur-[4px]"
        onClick={animateClose}
        aria-label="Đóng danh sách yêu thích"
      />

      <div
        ref={drawerRef}
        className="absolute top-0 right-0 bottom-0 flex flex-col shadow-2xl bg-white transition-transform"
        style={{
          width: "min(440px, 100vw)",
          transform: "translateX(100%)",
        }}
      >
        <div
          className="relative flex items-center justify-between px-6 pt-6 pb-5 shrink-0 border-b border-slate-100"
        >
          <span
            className="absolute right-20 top-1/2 -translate-y-1/2 text-[80px] font-black leading-none select-none pointer-events-none text-[#FFF1F5]"
            aria-hidden="true"
          >
            {items.length}
          </span>

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-0.5">
              <IoHeartOutline className="text-2xl text-[#FF6B9D]" />
              <h2 className="text-xl font-black text-[#1A1A2E]">
                Yêu thích
              </h2>
            </div>
            <p className="text-xs font-bold text-slate-400">
              {items.length === 0
                ? "Chưa có sản phẩm nào"
                : `${items.length} sản phẩm đã thích`}
            </p>
          </div>

          <button
            onClick={animateClose}
            className="relative z-10 w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-200 hover:scale-110 shrink-0 bg-[#F4F7FF] text-[#1A1A2E]"
            aria-label="Đóng danh sách yêu thích"
          >
            <IoCloseOutline className="text-xl" />
          </button>
        </div>

        <div ref={itemsRef} className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="p-4 space-y-3">
              {items.map((item) => (
                <div
                  key={item.favoriteId}
                  className="fav-item-row group flex gap-4 p-4 rounded-3xl transition-all duration-200 border border-slate-100 hover:shadow-md hover:border-[#FF6B9D33]"
                >
                  <Link
                    href={`/products/${item.productId}`}
                    onClick={animateClose}
                    className="shrink-0"
                  >
                    <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-sm transition-transform duration-200 group-hover:scale-105 bg-[#F4F7FF] border border-slate-50">
                      <Image
                        src={item.productImageUrl || "/teddy_bear.png"}
                        alt={item.productName}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                        unoptimized={!!item.productImageUrl}
                      />
                    </div>
                  </Link>

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <Link
                        href={`/products/${item.productId}`}
                        onClick={animateClose}
                      >
                        <p className="font-black text-base text-[#1A1A2E] leading-tight truncate hover:text-[#FF6B9D] transition-colors">
                          {item.productName}
                        </p>
                      </Link>
                      <p className="font-bold text-sm text-[#FF6B9D] mt-1">
                        {formatPrice(item.productPrice)}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <Link
                        href={`/products/${item.productId}`}
                        onClick={animateClose}
                        className="text-xs font-black text-[#17409A] hover:underline flex items-center gap-1 group"
                      >
                        Xem chi tiết
                        <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                      </Link>

                      <button
                        onClick={() => toggleFavorite(item.productId)}
                        className="text-xs font-bold text-[#6B7280] hover:text-[#FF6B9D] transition-colors bg-[#F4F7FF] px-3 py-1.5 rounded-xl hover:bg-[#FFF1F5]"
                      >
                        Bỏ thích
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
