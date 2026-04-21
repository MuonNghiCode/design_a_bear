"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { type ProductItem } from "@/types/products";
import { useCart } from "@/contexts/CartContext";
import { type PersonalizationRule } from "@/types/responses";
import { buildService } from "@/services/build.service";
import { STORAGE_KEYS } from "@/constants";
import { useToast } from "@/contexts/ToastContext";
import { useFavorite } from "@/contexts/FavoriteContext";
import { type Product, type ProductVariant, type ProductDetail } from "@/types/responses";

/* ── Inline SVG icons (no emoji, no react-icons) ── */
function IconMinus() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden="true"
    >
      <rect x="2" y="7" width="12" height="2" rx="1" />
    </svg>
  );
}

function IconPlus() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden="true"
    >
      <rect x="2" y="7" width="12" height="2" rx="1" />
      <rect x="7" y="2" width="2" height="12" rx="1" />
    </svg>
  );
}

function IconCart() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 001.98 1.61H20a2 2 0 001.98-1.71L23.4 6H6" />
    </svg>
  );
}

function IconHeart({ filled }: { filled?: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
    </svg>
  );
}

function IconTruck() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="1" y="3" width="15" height="13" rx="2" />
      <path d="M16 8h4l3 5v3h-7V8z" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  );
}

function IconShield() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function IconReturn() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="1 4 1 10 7 10" />
      <path d="M3.51 15a9 9 0 102.13-9.36L1 10" />
    </svg>
  );
}

function formatPrice(price: number | null | undefined): string {
  return (price ?? 0).toLocaleString("vi-VN") + " đ";
}

const CATEGORY_LABELS: Record<string, string> = {
  complete: "Gấu thông minh",
  bear: "Gấu bông",
  accessory: "Phụ kiện",
};

const DELIVERY_INFO = [
  { icon: <IconTruck />, label: "Giao hàng", value: "Miễn phí" },
  { icon: <IconShield />, label: "Bảo hành", value: "12 tháng" },
  { icon: <IconReturn />, label: "Đổi trả", value: "30 ngày" },
];

interface Props {
  product: ProductDetail;
  variants: ProductVariant[];
  personalizationRules?: PersonalizationRule[];
  quantity: number;
  setQuantity: (q: number) => void;
  selectedAccessories: PersonalizationRule[];
  setSelectedAccessories: React.Dispatch<
    React.SetStateAction<PersonalizationRule[]>
  >;
  availableStock?: number | null;
}
export default function ProductInfoPanel({
  product,
  variants = [],
  personalizationRules = [],
  quantity,
  setQuantity,
  selectedAccessories,
  setSelectedAccessories,
  availableStock: propAvailableStock,
}: Props) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const { addItem } = useCart();
  const { warning, success, error } = useToast();
  const {
    isFavorited,
    toggleFavorite,
    loading: favoriteLoading,
  } = useFavorite();
  const [addingToCart, setAddingToCart] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const accent = product.badgeColor || "#17409A";

  const favorited = isFavorited(product.productId);

  const handleToggleFavorite = async () => {
    await toggleFavorite(product.productId);
  };

  // Calculate prices and stock
  const variantPrice = selectedVariant?.price || product.price || 0;
  const accessoriesPrice = selectedAccessories.reduce(
    (acc, rule) => acc + (rule.addonProduct.price || 0),
    0,
  );
  const currentTotalPrice = variantPrice + accessoriesPrice;
  
  // Use actual variant stock from our new architecture (supporting both camelCase and PascalCase)
  const currentStock = selectedVariant 
    ? (Number(selectedVariant.onHand ?? (selectedVariant as any).OnHand ?? 0) - 
       Number(selectedVariant.reserved ?? (selectedVariant as any).Reserved ?? 0))
    : propAvailableStock;

  const handleBuyNow = async () => {
    await addToCartInternal(true);
  };

  const handleToggleAccessory = (rule: PersonalizationRule) => {
    // Check stock for the accessory (support both camelCase and PascalCase)
    const variants = rule.addonProduct.variants || (rule.addonProduct as any).Variants || [];
    const accessoryStock = variants.reduce(
      (acc: number, v: any) => acc + (Number(v.onHand ?? v.OnHand ?? 0) - Number(v.reserved ?? v.Reserved ?? 0)),
      0
    );

    if (accessoryStock <= 0) {
      warning(`Sản phẩm "${rule.addonProduct.name}" hiện đang hết hàng.`);
      return;
    }

    setSelectedAccessories((prev) => {
      const exists = prev.find((r) => r.ruleId === rule.ruleId);
      if (exists) {
        return prev.filter((r) => r.ruleId !== rule.ruleId);
      }
      return [...prev, rule];
    });
  };

  const addToCartInternal = async (goCheckout: boolean) => {
    if (!selectedVariant) {
      warning("Vui lòng chọn kích thước sản phẩm.");
      return;
    }

    if (!isAuthenticated) {
      warning("Vui lòng đăng nhập để thực hiện chức năng này");
      setTimeout(() => {
        router.push("/auth");
      }, 1500);
      return;
    }

    try {
      setAddingToCart(true);

      const productId = product.productId;
      const variantId = selectedVariant.variantId;
      const itemName = product.name;
      let targetBuildId: string | null = null;

      // 1. If user selected accessories, CREATE A BUILD FIRST
      if (selectedAccessories.length > 0) {
        let customerId = null;
        try {
          const userObj = localStorage.getItem(STORAGE_KEYS.USER);
          if (userObj) {
            const user = JSON.parse(userObj);
            customerId = user.id || null;
          }
        } catch {}

        const buildRes = await buildService.createBuild({
          customerId,
          baseProductId: productId,
          buildName: `Thiết kế ${product.name}`,
          personalizationNote: "Mua kèm phụ kiện",
          buildComponents: selectedAccessories.map((acc) => ({
            optionProductId: acc.addonProduct.productId,
          })),
        });

        if (buildRes && buildRes.value?.buildId) {
          targetBuildId = buildRes.value.buildId;
        }
      }

      await addItem(
        {
          id: productId,
          variantId: variantId,
          name: itemName,
          variantName: selectedVariant.sizeDescription || selectedVariant.name,
          description:
            selectedAccessories.length > 0
              ? `Combo Gấu + ${selectedAccessories.length} Phụ kiện`
              : product.description || product.name,
          price: currentTotalPrice,
          image: product.media?.[0]?.url || product.imageUrl || "/teddy_bear.png",
          badge: product.badge,
          badgeColor: product.badgeColor,
        },
        quantity,
        targetBuildId,
      );

      if (goCheckout) {
        success(
          `Đã thêm "${product.name}" vào giỏ. Đang chuyển đến thanh toán...`,
        );
        router.push("/checkout");
      } else {
        success(`Đã thêm "${product.name}" vào giỏ hàng!`);
      }
    } catch (err) {
      error(
        "Thêm vào giỏ hàng thất bại: " +
          (err instanceof Error ? err.message : "Vui lòng thử lại"),
      );
    } finally {
      setAddingToCart(false);
    }
  };

  const onAddToCart = async () => {
    await addToCartInternal(false);
  };

  return (
    <div className="space-y-8" style={{ fontFamily: "'Nunito', sans-serif" }}>
      {/* ── Breadcrumb ── */}
      <nav className="flex items-center gap-2 text-sm text-[#6B7280]">
        <Link href="/" className="hover:text-[#17409A] transition-colors">
          Trang chủ
        </Link>
        <span>/</span>
        <Link
          href="/products"
          className="hover:text-[#17409A] transition-colors"
        >
          Sản phẩm
        </Link>
        <span>/</span>
        <span className="text-[#1A1A2E] font-medium truncate max-w-40">
          {product.name}
        </span>
      </nav>

      {/* ── Price (FIRST — unconventional luxury placement) ── */}
      <div>
        <p className="text-xs font-bold tracking-[0.3em] uppercase text-[#9CA3AF] mb-2">
          Giá bán lẻ
        </p>
        <p
          className="text-6xl md:text-7xl font-black leading-none transition-all duration-300"
          style={{ color: accent }}
        >
          {formatPrice(currentTotalPrice)}
        </p>
        <p className="mt-2 text-[10px] font-bold italic text-[#9CA3AF]">
          {selectedVariant 
            ? `* Giá cho size ${selectedVariant.sizeTag}` 
            : "* Vui lòng chọn size để thấy giá chính xác"}
        </p>
      </div>

      {/* ── Name + accent divider ── */}
      <div>
        <div
          className="w-14 h-1.5 rounded-full mb-4"
          style={{ backgroundColor: accent }}
        />
        <h1
          className="text-3xl md:text-4xl font-black text-[#1A1A2E] leading-snug"
          style={{ fontFamily: "'Fredoka', 'Nunito', sans-serif" }}
        >
          {product.name}
        </h1>
      </div>

      {/* ── Premium Size Selector ── */}
      {variants.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-black tracking-[0.3em] uppercase text-[#1A1A2E] opacity-50">
              Chọn kích cỡ
            </p>
            {selectedVariant && (
              <span className="text-[10px] font-bold text-[#17409A] animate-pulse">
                Đã chọn: {selectedVariant.sizeTag}
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-2.5">
            {variants.sort((a, b) => (a.sizeTag || "").localeCompare(b.sizeTag || "")).map((variant) => {
              const isCurrent = selectedVariant?.variantId === variant.variantId;
              return (
                <button
                  key={variant.variantId}
                  onClick={() => setSelectedVariant(variant)}
                  className={`relative group px-4 py-2.5 rounded-xl text-sm font-black border-2 transition-all duration-300 text-center flex items-center gap-3 min-w-[70px] active:scale-95 ${
                    isCurrent
                      ? "bg-[#17409A] border-[#17409A] text-white shadow-lg shadow-[#17409A]/20"
                      : "bg-white border-[#F1F5F9] text-[#64748B] hover:border-[#17409A]/40 hover:bg-[#F8FAFC] cursor-pointer"
                  }`}
                >
                  <div className={`flex items-center justify-center w-8 h-8 rounded-lg text-xs font-black transition-colors ${
                    isCurrent ? "bg-white/20 text-white" : "bg-slate-100 text-[#17409A]"
                  }`}>
                    {variant.sizeTag || "OS"}
                  </div>
                  <div className="text-left">
                    <p className={`text-[11px] leading-none ${isCurrent ? "text-white" : "text-[#1A1A2E]"}`}>
                      {variant.sizeDescription || "Standard"}
                    </p>
                    {variant.price && (
                       <p className={`text-[9px] mt-0.5 font-bold ${isCurrent ? "text-white/60" : "text-[#94A3B8]"}`}>
                         {formatPrice(variant.price)}
                       </p>
                    )}
                  </div>
                  {isCurrent && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#4ECDC4] border-2 border-white rounded-full shadow-sm animate-bounce" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Accessories Rules Checklist ── */}
      {personalizationRules.length > 0 && (
        <div className="space-y-3">
          <p className="font-bold text-[#1A1A2E]">
            Phụ kiện mua kèm (Tùy chọn):
          </p>
          <div className="space-y-2">
            {personalizationRules.map((rule) => {
              const isSelected = selectedAccessories.some(
                (r) => r.ruleId === rule.ruleId,
              );
              
              const variants = rule.addonProduct.variants || (rule.addonProduct as any).Variants || [];
              const accessoryStock = variants.reduce(
                (acc: number, v: any) => acc + (Number(v.onHand ?? v.OnHand ?? 0) - Number(v.reserved ?? v.Reserved ?? 0)),
                0
              );
              const hasStock = accessoryStock > 0;

              return (
                <button
                  key={rule.ruleId}
                  onClick={() => handleToggleAccessory(rule)}
                  disabled={!hasStock}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all group ${
                    isSelected
                      ? "border-[#17409A] bg-[#F4F7FF]"
                      : !hasStock
                        ? "border-gray-50 bg-gray-50/50 cursor-not-allowed opacity-60"
                        : "border-gray-100 hover:border-[#17409A]/30 cursor-pointer"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                        isSelected
                          ? "border-[#17409A] bg-[#17409A] text-white"
                          : !hasStock
                            ? "border-gray-200 bg-gray-100"
                            : "border-gray-300 bg-white group-hover:border-[#17409A]/50"
                      }`}
                    >
                      {isSelected && (
                        <svg
                          className="w-3.5 h-3.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </div>
                    <div className="flex flex-col items-start translate-y-[-1px]">
                      <span
                        className={`font-semibold text-sm ${isSelected ? "text-[#17409A]" : !hasStock ? "text-gray-400" : "text-gray-700"}`}
                      >
                        {rule.addonProduct.name}
                      </span>
                      {!hasStock && (
                        <span className="text-[10px] font-bold text-[#FF6B9D] uppercase tracking-wider">
                          Tạm hết hàng
                        </span>
                      )}
                    </div>
                  </div>
                  <span className={`font-bold text-sm ${!hasStock ? "text-gray-400" : "text-[#1A1A2E]"}`}>
                    {hasStock ? `+ ${formatPrice(rule.addonProduct.price)}` : "---"}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Description ── */}
      <p className="text-[#6B7280] text-base leading-relaxed">
        {product.description}
      </p>

      {/* ── Tags row ── */}
      <div className="flex items-center gap-3 flex-wrap">
        {product.badge && (
          <span
            className="px-4 py-1.5 rounded-full text-white text-xs font-black shadow-lg tracking-wider"
            style={{ backgroundColor: accent }}
          >
            {product.badge}
          </span>
        )}
        <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-[#17409A]/10 text-[#17409A] tracking-wide">
          {product.productType ? (CATEGORY_LABELS[product.productType as keyof typeof CATEGORY_LABELS] || product.productType) : "Sản phẩm"}
        </span>
        {currentStock === null || currentStock === undefined ? (
          <span className="px-4 py-1.5 rounded-full text-[10px] font-black bg-gray-100 text-[#9CA3AF] tracking-[0.1em] animate-pulse">
            Đang kiểm tra kho...
          </span>
        ) : currentStock > 0 ? (
          <div className="flex items-center gap-2">
             <span className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-[0.1em] border transition-all duration-500 ${
                currentStock < 5 
                  ? "bg-[#FF8C42]/10 text-[#FF8C42] border-[#FF8C42]/30 animate-[pulse_2s_infinite]" 
                  : "bg-[#4ECDC4]/10 text-[#059669] border-[#4ECDC4]/30"
             }`}>
               {currentStock < 5 ? `🔥 CHỈ CÒN ${currentStock} SẢN PHẨM` : `SẴN CÓ: ${currentStock} SẢN PHẨM`}
             </span>
             {currentStock < 3 && (
                <span className="text-[10px] font-black text-[#FF6B9D] animate-bounce">Sắp hết!</span>
             )}
          </div>
        ) : (
          <span className="px-4 py-1.5 rounded-full text-[10px] font-black bg-[#FF6B9D]/10 text-[#FF6B9D] tracking-[0.1em] border border-[#FF6B9D]/30">
            HẾT HÀNG
          </span>
        )}
      </div>

      {(product.categories?.length || product.characters?.length) && (
        <div className="space-y-3">
          {product.categories && product.categories.length > 0 && (
            <div>
              <p className="text-xs font-black tracking-[0.2em] uppercase text-[#9CA3AF] mb-2">
                Danh mục
              </p>
              <div className="flex flex-wrap gap-2">
                {product.categories.map((cat) => (
                  <span
                    key={cat.categoryId}
                    className="px-3 py-1.5 rounded-full text-xs font-bold bg-[#17409A]/10 text-[#17409A]"
                  >
                    {cat.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {product.characters && product.characters.length > 0 && (
            <div>
              <p className="text-xs font-black tracking-[0.2em] uppercase text-[#9CA3AF] mb-2">
                Nhân vật
              </p>
              <div className="flex flex-wrap gap-2">
                {product.characters.map((char) => (
                  <span
                    key={char.characterId}
                    className="px-3 py-1.5 rounded-full text-xs font-bold bg-[#FF8C42]/15 text-[#FF8C42]"
                  >
                    {char.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Separator ── */}
      <div className="h-px bg-[#E5E7EB]" />

      {/* ── Quantity selector ── */}
      <div className={currentStock !== null && currentStock !== undefined && currentStock <= 0 ? "opacity-40 grayscale pointer-events-none" : ""}>
        <p className="text-xs font-black tracking-[0.25em] uppercase text-[#1A1A2E] mb-3">
          Số lượng
        </p>
        <div className="flex items-center w-fit border-2 border-[#E5E7EB] rounded-2xl overflow-hidden">
          <button
            type="button"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={quantity <= 1 || (currentStock !== null && currentStock !== undefined && currentStock <= 0)}
            className={`w-12 h-12 flex items-center justify-center text-[#6B7280] hover:bg-[#F4F7FF] transition-colors cursor-pointer ${
              (quantity <= 1 || (currentStock !== null && currentStock !== undefined && currentStock <= 0)) ? "opacity-30 cursor-not-allowed" : ""
            }`}
            aria-label="Giảm số lượng"
          >
            <IconMinus />
          </button>
          <div
            className="w-16 h-12 flex items-center justify-center font-black text-xl border-x-2 border-[#E5E7EB]"
            style={{ color: accent }}
          >
            {quantity}
          </div>
          <button
            type="button"
            onClick={() => setQuantity(Math.min(currentStock || 1, quantity + 1))}
            disabled={currentStock !== null && currentStock !== undefined && (quantity >= currentStock || currentStock <= 0)}
            className={`w-12 h-12 flex items-center justify-center text-[#6B7280] hover:bg-[#F4F7FF] transition-colors cursor-pointer ${
              (currentStock !== null && currentStock !== undefined && (quantity >= currentStock || currentStock <= 0)) ? "opacity-30 cursor-not-allowed" : ""
            }`}
            aria-label="Tăng số lượng"
          >
            <IconPlus />
          </button>
        </div>
        {currentStock !== null && currentStock !== undefined && currentStock > 0 && currentStock < 5 && (
          <p className="mt-2 text-xs font-bold" style={{ color: "#FF8C42" }}>
            Chỉ còn {currentStock} sản phẩm cuối cùng!
          </p>
        )}
        {currentStock === 0 && (
          <p className="mt-2 text-xs font-bold text-[#FF6B9D]">
            Sản phẩm hiện đang tạm hết hàng.
          </p>
        )}
      </div>

      {/* ── CTA Buttons ── */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          type="button"
          onClick={handleBuyNow}
          disabled={addingToCart || (currentStock !== null && currentStock !== undefined && currentStock <= 0)}
          className={`flex-1 py-4 px-8 rounded-2xl text-white font-black text-base tracking-wide shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 ${
            currentStock !== null && currentStock !== undefined && currentStock <= 0 ? "bg-gray-400" : ""
          }`}
          style={{ backgroundColor: (currentStock !== null && currentStock !== undefined && currentStock <= 0) ? "#9CA3AF" : accent }}
        >
          {addingToCart ? "Đang xử lý..." : (currentStock !== null && currentStock !== undefined && currentStock <= 0) ? "Hết hàng" : "Mua ngay"}
        </button>
        <button
          type="button"
          onClick={onAddToCart}
          disabled={addingToCart || (currentStock !== null && currentStock !== undefined && currentStock <= 0)}
          className="flex-1 py-4 px-8 rounded-2xl font-black text-base tracking-wide border-2 border-[#17409A] text-[#17409A] hover:bg-[#17409A] hover:text-white transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          <IconCart />
          {addingToCart ? "Đang thêm..." : (currentStock !== null && currentStock !== undefined && currentStock <= 0) ? "Tạm hết hàng" : "Thêm vào giỏ"}
        </button>
        <button
          type="button"
          onClick={handleToggleFavorite}
          disabled={favoriteLoading}
          className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all duration-300 hover:scale-[1.02] cursor-pointer shrink-0 ${
            favorited
              ? "bg-[#FF6B9D] text-white border-[#FF6B9D]"
              : "border-[#E5E7EB] text-[#FF6B9D] hover:bg-[#FF6B9D] hover:text-white hover:border-[#FF6B9D]"
          } ${favoriteLoading ? "opacity-50 cursor-not-allowed" : ""}`}
          aria-label="Yêu thích"
        >
          <IconHeart filled={favorited} />
        </button>
      </div>

      {/* ── Delivery / Warranty info ── */}
      <div className="grid grid-cols-3 gap-3 pt-1">
        {DELIVERY_INFO.map(({ icon, label, value }) => (
          <div
            key={label}
            className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-white border border-[#E5E7EB] text-center shadow-sm"
          >
            <span className="text-[#17409A]">{icon}</span>
            <span className="text-xs text-[#6B7280]">{label}</span>
            <span className="text-xs font-black text-[#1A1A2E]">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
