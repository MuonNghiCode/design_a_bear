"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useCallback } from "react";
import {
  IoCloseOutline,
  IoTrashOutline,
  IoArrowForward,
  IoChevronDown,
} from "react-icons/io5";
import gsap from "gsap";
import { useCart } from "@/contexts/CartContext";
import { inventoryService } from "@/services/inventory.service";
import { useState } from "react";

/* ────────────────────────────────────────────
   CartDrawer — Premium right-side drawer
   ──────────────────────────────────────────── */

function formatPrice(price: number) {
  return price.toLocaleString("vi-VN") + " đ";
}

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
      width="20"
      height="20"
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

/* Empty cart illustration */
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 px-8 py-16 text-center">
      <div
        className="w-28 h-28 rounded-3xl flex items-center justify-center shadow-lg"
        style={{ backgroundColor: "#F4F7FF", border: "2px solid #E5E7EB" }}
      >
        <svg
          width="64"
          height="64"
          viewBox="0 0 64 64"
          fill="none"
          aria-hidden="true"
        >
          <ellipse cx="32" cy="38" rx="18" ry="16" fill="#D4A76A" />
          <circle cx="32" cy="22" r="14" fill="#D4A76A" />
          <circle cx="20" cy="11" r="6" fill="#D4A76A" />
          <circle cx="44" cy="11" r="6" fill="#D4A76A" />
          <circle cx="20" cy="11" r="3.5" fill="#C4956A" />
          <circle cx="44" cy="11" r="3.5" fill="#C4956A" />
          <circle cx="27" cy="20" r="2" fill="#4A3728" />
          <circle cx="37" cy="20" r="2" fill="#4A3728" />
          <ellipse cx="32" cy="25" rx="3" ry="2" fill="#4A3728" />
          <ellipse cx="32" cy="40" rx="10" ry="9" fill="#E8C99A" />
          <ellipse
            cx="14"
            cy="40"
            rx="5"
            ry="9"
            fill="#D4A76A"
            transform="rotate(-15 14 40)"
          />
          <ellipse
            cx="50"
            cy="40"
            rx="5"
            ry="9"
            fill="#D4A76A"
            transform="rotate(15 50 40)"
          />
          <rect x="24" y="44" width="16" height="14" rx="3" fill="#17409A" />
          <path
            d="M27 44v-3a5 5 0 0 1 10 0v3"
            stroke="#17409A"
            strokeWidth="2"
            fill="none"
          />
          <circle cx="32" cy="51" r="1.5" fill="white" opacity="0.8" />
        </svg>
      </div>
      <div>
        <p
          className="text-xl font-black mb-2"
          style={{ color: "#1A1A2E", fontFamily: "'Nunito', sans-serif" }}
        >
          Giỏ hàng trống!
        </p>
        <p className="text-sm leading-relaxed" style={{ color: "#6B7280" }}>
          Bé chưa chọn được chú gấu nào cả.
          <br />
          Hãy khám phá bộ sưu tập nhé!
        </p>
      </div>
      <Link
        href="/products"
        className="flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
        style={{
          backgroundColor: "#17409A",
          color: "white",
          fontFamily: "'Nunito', sans-serif",
        }}
      >
        Khám phá ngay
        <IoArrowForward className="text-base" />
      </Link>
    </div>
  );
}

export default function CartDrawer() {
  const {
    items,
    removeItem,
    updateQuantity,
    totalItems,
    totalPrice,
    isOpen,
    closeCart,
  } = useCart();

  const [inventoryMap, setInventoryMap] = useState<Record<string, number>>({});
  const [loadingStock, setLoadingStock] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  const drawerRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLDivElement>(null);

  const animateOpen = useCallback(() => {
    const tl = gsap.timeline();
    tl.fromTo(
      backdropRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.3, ease: "power2.out" },
    ).fromTo(
      drawerRef.current,
      { x: "100%" },
      { x: "0%", duration: 0.45, ease: "power3.out" },
      "-=0.2",
    );

    if (itemsRef.current && items.length > 0) {
      const rowEls = itemsRef.current.querySelectorAll(".cart-item-row");
      if (rowEls && rowEls.length > 0) {
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
          },
        );
      }
    }
  }, []);

  const animateClose = useCallback(() => {
    const tl = gsap.timeline({ onComplete: closeCart });
    tl.to(drawerRef.current, {
      x: "100%",
      duration: 0.35,
      ease: "power2.in",
    }).to(
      backdropRef.current,
      { opacity: 0, duration: 0.25, ease: "power2.in" },
      "-=0.2",
    );
  }, [closeCart]);

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

  // Fetch stock when drawer opens
  useEffect(() => {
    if (isOpen && items.length > 0) {
      (async () => {
        setLoadingStock(true);
        try {
          const results = await Promise.all(
            items.map(async (item) => {
              // skip if product id is null to avoid backend error
              if (!item.product.id) return { id: item.variantId, total: 0 };

              const res = await inventoryService.getByProductId(item.product.id);
              // Find the specific variant stock if variantId is available
              const variantInventory = res.isSuccess && res.value && item.variantId
                ? res.value.find(v => v.variantId === item.variantId)
                : null;
                
              const total = variantInventory
                ? (Number(variantInventory.onHand ?? (variantInventory as any).OnHand ?? 0) - Number(variantInventory.reserved ?? (variantInventory as any).Reserved ?? 0))
                : (res.isSuccess && res.value 
                    ? res.value.reduce((acc, inv) => acc + (Number(inv.onHand ?? (inv as any).OnHand ?? 0) - Number(inv.reserved ?? (inv as any).Reserved ?? 0)), 0)
                    : 0);
              
              return { id: item.variantId || item.product.id, total };
            })
          );
          const newMap: Record<string, number> = {};
          results.forEach(r => { 
            if (r.id) newMap[r.id] = r.total; 
          });
          setInventoryMap(newMap);
        } catch (err) {
          console.error("Failed to fetch cart stock:", err);
        } finally {
          setLoadingStock(false);
        }
      })();
    }
  }, [isOpen, items]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[200]"
      style={{ fontFamily: "'Nunito', sans-serif" }}
    >
      <div
        ref={backdropRef}
        className="absolute inset-0"
        style={{
          backgroundColor: "rgba(14, 42, 102, 0.4)",
          backdropFilter: "blur(4px)",
        }}
        onClick={animateClose}
        aria-label="Đóng giỏ hàng"
      />

      <div
        ref={drawerRef}
        className="absolute top-0 right-0 bottom-0 flex flex-col shadow-2xl"
        style={{
          width: "min(440px, 100vw)",
          backgroundColor: "#FFFFFF",
          transform: "translateX(100%)",
        }}
      >
        <div
          className="relative flex items-center justify-between px-6 pt-6 pb-5 shrink-0"
          style={{ borderBottom: "1px solid #E5E7EB" }}
        >
          <span
            className="absolute right-20 top-1/2 -translate-y-1/2 text-[80px] font-black leading-none select-none pointer-events-none"
            style={{ color: "#F4F7FF", fontFamily: "'Nunito', sans-serif" }}
            aria-hidden="true"
          >
            {totalItems}
          </span>

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-0.5">
              <PawPrint className="text-[#17409A]" />
              <h2
                className="text-xl font-black"
                style={{ color: "#1A1A2E", fontFamily: "'Nunito', sans-serif" }}
              >
                Giỏ hàng
              </h2>
            </div>
            <p className="text-xs font-bold" style={{ color: "#6B7280" }}>
              {totalItems === 0
                ? "Chưa có sản phẩm nào"
                : `${totalItems} sản phẩm trong giỏ`}
            </p>
          </div>

          <button
            onClick={animateClose}
            className="relative z-10 w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-200 hover:scale-110 shrink-0"
            style={{ backgroundColor: "#F4F7FF", color: "#1A1A2E" }}
            aria-label="Đóng giỏ hàng"
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
                  key={item.cartItemId}
                  className="cart-item-row group flex gap-4 p-4 rounded-2xl transition-all duration-200"
                  style={{
                    border: "1.5px solid #E5E7EB",
                    backgroundColor: "white",
                  }}
                >
                  <Link
                    href={`/products/${item.product.id}`}
                    onClick={animateClose}
                  >
                    <div
                      className="w-24 h-24 rounded-[2rem] overflow-hidden shrink-0 shadow-[0_8px_30px_rgb(0,0,0,0.08)] border-2 border-white transition-transform duration-300 group-hover:scale-105 relative"
                      style={{ backgroundColor: "#F4F7FF" }}
                    >
                      <Image
                        src={item.product.image || "/teddy_bear.png"}
                        alt={item.product.name}
                        fill
                        sizes="(max-width: 440px) 96px, 96px"
                        className="object-contain p-2"
                        priority
                      />
                    </div>
                  </Link>

                  <div className="flex-1 min-w-0 flex flex-col gap-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        {item.product.badge && (
                          <span
                            className="inline-block text-[10px] font-black px-2 py-0.5 rounded-lg mb-1"
                            style={{
                              backgroundColor: `${item.product.badgeColor ?? "#17409A"}15`,
                              color: item.product.badgeColor ?? "#17409A",
                            }}
                          >
                            {item.product.badge}
                          </span>
                        )}
                        <Link
                          href={`/products/${item.product.id}`}
                          onClick={animateClose}
                        >
                          <p
                            className="font-black text-xl tracking-tight group-hover:text-[#17409A] transition-colors leading-[1.1]"
                            style={{ 
                              color: "#1A1A2E", 
                              fontFamily: "'Fredoka', 'Nunito', sans-serif" 
                            }}
                          >
                            {item.buildDetails?.baseProductName ? `Gấu ${item.buildDetails.baseProductName}` : item.product.name}
                          </p>
                        </Link>

                        {/* Details Section */}
                        <div className="flex flex-col gap-1 mt-1.5">
                          {item.product.size && (
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-black px-2 py-0.5 bg-[#FFF0F3] text-[#FF4D6D] rounded-md border border-[#FF4D6D]/20 uppercase">
                                Kích thước: {item.product.size} {item.product.sizeTag ? `(${item.product.sizeTag})` : ""}
                              </span>
                            </div>
                          )}
                          
                          {item.buildDetails?.buildComponents && item.buildDetails.buildComponents.length > 0 ? (
                            <p className="text-[11px] font-bold text-slate-600 leading-tight mt-1 bg-slate-50 p-2 rounded-xl border border-slate-100/50">
                              <span className="text-[#17409A]">Phụ kiện: </span>
                              {item.buildDetails.buildComponents.map((c: any) => c.productName).join(", ")}
                            </p>
                          ) : item.buildId ? (
                            <p className="text-[10px] text-amber-500 font-bold animate-pulse mt-1">
                              ⚠️ Đang tải danh sách phụ kiện...
                            </p>
                          ) : null}
                        </div>

                        <div className="flex flex-wrap gap-1.5 mt-2.5">
                          {item.product.sizeTag && !item.product.size && (
                            <span className="text-[9px] font-bold px-2 py-1 bg-slate-100 text-slate-500 rounded-full">
                              {item.product.sizeTag}
                            </span>
                          )}
                        </div>

                        {item.buildDetails?.buildComponents && item.buildDetails.buildComponents.length > 0 && (
                          <div className="mt-4">
                            <button 
                              onClick={() => setExpandedItems(prev => ({ ...prev, [item.cartItemId!]: !prev[item.cartItemId!] }))}
                              className={`flex items-center justify-between w-full px-4 py-2.5 rounded-2xl border-2 transition-all duration-300 group/btn ${
                                expandedItems[item.cartItemId!] 
                                  ? 'bg-[#17409A] border-[#17409A] text-white shadow-lg shadow-[#17409A]/20' 
                                  : 'bg-slate-50 border-slate-100 text-slate-500 hover:border-[#17409A]/30 hover:bg-white'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${
                                  expandedItems[item.cartItemId!] 
                                    ? 'bg-white/20' 
                                    : 'bg-white shadow-sm border border-slate-100 group-hover/btn:rotate-180'
                                }`}>
                                  <IoChevronDown 
                                    className={`text-xs transition-transform duration-500 ${expandedItems[item.cartItemId!] ? 'rotate-180' : ''}`}
                                  />
                                </div>
                                <span className={`text-[11px] font-black uppercase tracking-[0.15em] ${expandedItems[item.cartItemId!] ? 'text-white' : 'text-slate-600'}`}>
                                  Phụ kiện ({item.buildDetails.buildComponents.length})
                                </span>
                              </div>
                              {!expandedItems[item.cartItemId!] && (
                                <div className="flex -space-x-2">
                                  {item.buildDetails.buildComponents.slice(0, 3).map((c: any, i: number) => (
                                    <div key={i} className="w-5 h-5 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                                      <img src={c.imageUrl || "/teddy_bear.png"} alt="" className="w-full h-full object-contain" />
                                    </div>
                                  ))}
                                </div>
                              )}
                            </button>
                            
                            {expandedItems[item.cartItemId!] && (
                              <div className="grid grid-cols-1 gap-2 mt-3 animate-in fade-in slide-in-from-top-3 duration-500">
                                {item.buildDetails.buildComponents.map((comp: any, idx: number) => (
                                  <div key={idx} className="flex items-center justify-between gap-3 p-2.5 bg-white rounded-2xl border border-slate-100 shadow-sm hover:border-[#17409A]/20 transition-all group/item">
                                    <div className="flex items-center gap-3 min-w-0">
                                      <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border-2 border-slate-50 bg-[#F8FAFF] p-1.5 shadow-inner transition-transform group-hover/item:scale-110">
                                        <img 
                                          src={comp.imageUrl || "/teddy_bear.png"} 
                                          alt={comp.productName} 
                                          className="w-full h-full object-contain" 
                                        />
                                      </div>
                                      <div className="flex flex-col">
                                        <span className="text-[11px] font-black text-[#1A1A2E] leading-tight">
                                          {comp.productName}
                                        </span>
                                        <div className="flex items-center gap-2 mt-1">
                                          <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-1.5 py-0.5 rounded-md">
                                            Phụ kiện
                                          </span>
                                          {comp.size && (
                                            <span className="text-[8px] font-bold text-[#17409A] uppercase bg-[#17409A]/5 px-1.5 py-0.5 rounded-md">
                                              {comp.size}
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="bg-[#4ECDC4]/10 text-[#059669] px-2.5 py-1 rounded-xl text-[9px] font-black border border-[#4ECDC4]/20 flex items-center gap-1">
                                      <div className="w-1 h-1 rounded-full bg-[#059669] animate-pulse" />
                                      Đã gắn
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                        
                        {/* Stock Status */}
                        {!loadingStock && inventoryMap[item.variantId || item.product.id] !== undefined && (
                          <div className="mt-1">
                            {inventoryMap[item.variantId || item.product.id] <= 0 ? (
                              <p className="text-[10px] font-bold text-[#FF6B9D] animate-pulse">
                                Biến thể này hiện đã hết hàng
                              </p>
                            ) : item.quantity > inventoryMap[item.variantId || item.product.id] ? (
                              <p className="text-[10px] font-bold text-[#FF8C42]">
                                Chỉ còn {inventoryMap[item.variantId || item.product.id]} sản phẩm sẵn có
                              </p>
                            ) : inventoryMap[item.variantId || item.product.id] < 5 ? (
                               <p className="text-[10px] font-bold text-[#FF8C42]">
                                Sắp hết hàng: Chỉ còn {inventoryMap[item.variantId || item.product.id]} chiếc
                              </p>
                            ) : null}
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => item.cartItemId && removeItem(item.cartItemId)}
                        className="shrink-0 w-7 h-7 rounded-xl flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-110"
                        style={{ backgroundColor: "#FFF0F0", color: "#FF6B6B" }}
                        aria-label="Xóa sản phẩm"
                      >
                        <IoTrashOutline className="text-sm" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <span
                        className="font-black text-sm"
                        style={{ color: "#17409A" }}
                      >
                        {formatPrice(item.product.price * item.quantity)}
                      </span>

                      <div
                        className="flex items-center gap-1 rounded-2xl px-1 py-1"
                        style={{
                          backgroundColor: "#F4F7FF",
                          border: "1.5px solid #E5E7EB",
                        }}
                      >
                        <button
                          onClick={() =>
                            item.cartItemId && updateQuantity(item.cartItemId, item.quantity - 1)
                          }
                          className="w-7 h-7 rounded-xl flex items-center justify-center font-black text-base transition-all duration-150 hover:scale-110"
                          style={{
                            backgroundColor: "white",
                            color: "#17409A",
                            boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                          }}
                          aria-label="Giảm số lượng"
                        >
                          −
                        </button>
                        <span
                          className="w-7 text-center font-black text-sm select-none"
                          style={{ color: "#1A1A2E" }}
                        >
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            item.cartItemId && updateQuantity(item.cartItemId, item.quantity + 1)
                          }
                          disabled={!loadingStock && inventoryMap[item.variantId || item.product.id] !== undefined && item.quantity >= inventoryMap[item.variantId || item.product.id]}
                          className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-base transition-all duration-150 hover:scale-110 ${
                            !loadingStock && inventoryMap[item.variantId || item.product.id] !== undefined && item.quantity >= inventoryMap[item.variantId || item.product.id]
                              ? "opacity-30 cursor-not-allowed"
                              : ""
                          }`}
                          style={{ backgroundColor: "#17409A", color: "white" }}
                          aria-label="Tăng số lượng"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div
            className="shrink-0 px-6 pt-4 pb-6 space-y-4"
            style={{
              borderTop: "1.5px solid #E5E7EB",
              backgroundColor: "white",
            }}
          >
            <div className="flex items-center gap-2">
              {[0, 1, 2, 3, 4].map((i) => (
                <PawPrint key={i} className="opacity-10" color="#17409A" />
              ))}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span style={{ color: "#6B7280" }} className="font-semibold">
                  Tạm tính
                </span>
                <span className="font-bold" style={{ color: "#1A1A2E" }}>
                  {formatPrice(totalPrice)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span style={{ color: "#6B7280" }} className="font-semibold">
                  Vận chuyển
                </span>
                <span className="font-bold" style={{ color: "#1A1A2E" }}>
                  Tính khi thanh toán
                </span>
              </div>
            </div>

            <div
              className="flex items-center justify-between py-3 px-4 rounded-2xl"
              style={{ backgroundColor: "#F4F7FF" }}
            >
              <span
                className="font-black text-base"
                style={{ color: "#1A1A2E", fontFamily: "'Nunito', sans-serif" }}
              >
                Tổng cộng
              </span>
              <span
                className="font-black text-xl"
                style={{ color: "#17409A", fontFamily: "'Nunito', sans-serif" }}
              >
                {formatPrice(totalPrice)}
              </span>
            </div>

            <Link
              href="/checkout"
              onClick={animateClose}
              className={`w-full py-4 rounded-2xl font-black text-base flex items-center justify-center gap-2 transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5 ${
                items.some(item => !loadingStock && inventoryMap[item.variantId || item.product.id] !== undefined && inventoryMap[item.variantId || item.product.id] < item.quantity)
                ? "opacity-50 cursor-not-allowed pointer-events-none"
                : ""
              }`}
              style={{
                backgroundColor: "#17409A",
                color: "white",
                fontFamily: "'Nunito', sans-serif",
              }}
            >
              Thanh toán ngay
              <IoArrowForward className="text-lg" />
            </Link>

            <button
              onClick={animateClose}
              className="w-full py-2.5 rounded-2xl font-bold text-sm transition-all duration-200 hover:bg-[#F4F7FF]"
              style={{ color: "#6B7280", border: "1.5px solid #E5E7EB" }}
            >
              Tiếp tục mua sắm
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
