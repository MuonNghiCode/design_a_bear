"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IoHeartOutline, IoBagOutline } from "react-icons/io5";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/contexts/ToastContext";
import { productService } from "@/services/product.service";

type CartPayload = {
  variantId: string;
  unitPriceSnapshot: number;
  variantName?: string;
};

export interface ProductCardProps {
  id: string;
  name: string;
  variantName?: string;
  description: string;
  price: number;
  image: string;
  badge?: string;
  badgeColor?: string;
  href?: string;
}

function formatPrice(price: number): string {
  return price.toLocaleString("vi-VN") + " đ";
}

export default function ProductCard({
  id,
  name,
  description,
  price,
  image,
  badge,
  badgeColor = "#17409A",
  href,
}: ProductCardProps) {
  const productLink = href || `/products/${id}`;
  const { isAuthenticated } = useAuth();
  const { addItem } = useCart();
  const toast = useToast();
  const router = useRouter();
  const [imgSrc, setImgSrc] = useState(image || "/teddy_bear.png");
  const [addingToCart, setAddingToCart] = useState(false);

  const resolveCartPayload = async (): Promise<CartPayload> => {
    const fallbackPrice = price > 0 ? price : 1;

    try {
      const detailRes = await productService.getProductById(id);
      if (detailRes.isSuccess && detailRes.value) {
        const firstAvailableVariant =
          detailRes.value.variants.find((v) => !v.isSoldOut) ??
          detailRes.value.variants[0];

        if (firstAvailableVariant?.variantId) {
          return {
            variantId: firstAvailableVariant.variantId,
            unitPriceSnapshot:
              firstAvailableVariant.price > 0
                ? firstAvailableVariant.price
                : detailRes.value.price > 0
                  ? detailRes.value.price
                  : fallbackPrice,
            variantName: firstAvailableVariant.variantName,
          };
        }

        return {
          variantId: detailRes.value.productId,
          unitPriceSnapshot:
            detailRes.value.price > 0 ? detailRes.value.price : fallbackPrice,
        };
      }
    } catch {
      // fallback below
    }

    return {
      variantId: id,
      unitPriceSnapshot: fallbackPrice,
    };
  };

  const addProductToCart = async () => {
    if (!isAuthenticated) {
      router.push("/auth");
      return false;
    }

    try {
      setAddingToCart(true);
      const resolved = await resolveCartPayload();
      const itemName = resolved.variantName
        ? `${name} (${resolved.variantName})`
        : name;
      await addItem(
        {
          id: resolved.variantId,
          name: itemName,
          variantName: resolved.variantName,
          description,
          price: resolved.unitPriceSnapshot,
          image: imgSrc || "/teddy_bear.png",
          badge,
          badgeColor,
          href: productLink,
        },
        1,
        null,
      );
      return true;
    } catch (err) {
      toast.error(
        "Thêm vào giỏ hàng thất bại: " +
          (err instanceof Error ? err.message : "Vui lòng thử lại"),
      );
      return false;
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const added = await addProductToCart();
    if (added) {
      toast.success(`Đã thêm "${name}" vào giỏ. Đang chuyển đến thanh toán...`);
      router.push("/checkout");
    }
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const added = await addProductToCart();
    if (added) {
      toast.success(`Đã thêm "${name}" vào giỏ hàng!`);
    }
  };

  return (
    <Link
      href={productLink}
      className="group relative block rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]"
      style={{
        fontFamily: "'Nunito', sans-serif",
      }}
    >
      {/* ── Background Image (fills entire card) ── */}
      <div className="relative aspect-3/4 overflow-hidden">
        <Image
          src={imgSrc}
          alt={name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          priority
          unoptimized={imgSrc.startsWith("http")}
          onError={() => setImgSrc("/teddy_bear.png")}
        />

        {/* Badge góc trên phải */}
        {badge && (
          <div
            className="absolute top-4 right-4 px-4 py-2 rounded-full text-white text-xs font-bold tracking-wide shadow-xl z-10"
            style={{ backgroundColor: badgeColor }}
          >
            {badge}
          </div>
        )}

        {/* ── Info Overlay (bottom) - smooth gradient fade ── */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[70%] pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, rgba(26, 26, 46, 0.98) 0%, rgba(26, 26, 46, 0.92) 15%, rgba(26, 26, 46, 0.75) 30%, rgba(26, 26, 46, 0.45) 50%, rgba(26, 26, 46, 0.15) 70%, rgba(26, 26, 46, 0) 100%)",
          }}
        />

        {/* ── Info Content ── */}
        <div
          className="absolute bottom-0 left-0 right-0 p-5 z-10"
          style={{
            backdropFilter: "blur(4px)",
            WebkitBackdropFilter: "blur(4px)",
          }}
        >
          {/* Name */}
          <h3 className="font-black text-white text-lg leading-tight mb-2 drop-shadow-lg">
            {name}
          </h3>

          {/* Description */}
          <p className="text-white/90 text-sm leading-relaxed mb-3 line-clamp-2 drop-shadow-md">
            {description}
          </p>

          {/* Price */}
          <p className="text-[#4A90E2] font-black text-xl mb-4 drop-shadow-lg">
            {formatPrice(price)}
          </p>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* CTA Button */}
            <div
              className="flex-1 bg-[#17409A] hover:bg-[#4A90E2] text-white font-bold text-sm text-center py-3 rounded-xl transition-all duration-200 group-hover:shadow-lg cursor-pointer"
              onClick={handleBuyNow}
            >
              {addingToCart ? "Đang xử lý..." : "Mua ngay"}
            </div>

            {/* Icon Buttons */}
            <button
              className="w-11 h-11 rounded-xl bg-white/20 hover:bg-white text-white hover:text-[#17409A] backdrop-blur-sm flex items-center justify-center transition-all duration-200"
              aria-label="Thêm vào giỏ"
              onClick={handleAddToCart}
              disabled={addingToCart}
            >
              <IoBagOutline className="text-xl" />
            </button>

            <button
              className="w-11 h-11 rounded-xl bg-white/20 hover:bg-[#FF6B9D] text-white backdrop-blur-sm flex items-center justify-center transition-all duration-200"
              aria-label="Yêu thích"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <IoHeartOutline className="text-xl" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
