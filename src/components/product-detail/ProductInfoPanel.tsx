"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { type ProductItem } from "@/types/products";

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

function IconHeart() {
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

function formatPrice(price: number): string {
  return price.toLocaleString("vi-VN") + " đ";
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
  product: ProductItem;
  quantity: number;
  setQuantity: (q: number) => void;
}

export default function ProductInfoPanel({
  product,
  quantity,
  setQuantity,
}: Props) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const accent = product.badgeColor || "#17409A";

  const handleBuyNow = () => {
    if (!isAuthenticated) router.push("/auth");
    // TODO: navigate to checkout
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
          className="text-6xl md:text-7xl font-black leading-none"
          style={{ color: accent }}
        >
          {formatPrice(product.price)}
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
          {CATEGORY_LABELS[product.category] || product.category}
        </span>
        <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-[#4ECDC4]/20 text-[#4ECDC4] tracking-wide">
          Còn hàng
        </span>
      </div>

      {/* ── Separator ── */}
      <div className="h-px bg-[#E5E7EB]" />

      {/* ── Quantity selector ── */}
      <div>
        <p className="text-xs font-black tracking-[0.25em] uppercase text-[#1A1A2E] mb-3">
          Số lượng
        </p>
        <div className="flex items-center w-fit border-2 border-[#E5E7EB] rounded-2xl overflow-hidden">
          <button
            type="button"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-12 h-12 flex items-center justify-center text-[#6B7280] hover:bg-[#F4F7FF] transition-colors cursor-pointer"
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
            onClick={() => setQuantity(Math.min(10, quantity + 1))}
            className="w-12 h-12 flex items-center justify-center text-[#6B7280] hover:bg-[#F4F7FF] transition-colors cursor-pointer"
            aria-label="Tăng số lượng"
          >
            <IconPlus />
          </button>
        </div>
      </div>

      {/* ── CTA Buttons ── */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          type="button"
          onClick={handleBuyNow}
          className="flex-1 py-4 px-8 rounded-2xl text-white font-black text-base tracking-wide shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] cursor-pointer"
          style={{ backgroundColor: accent }}
        >
          Mua ngay
        </button>
        <button
          type="button"
          className="flex-1 py-4 px-8 rounded-2xl font-black text-base tracking-wide border-2 border-[#17409A] text-[#17409A] hover:bg-[#17409A] hover:text-white transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2 cursor-pointer"
        >
          <IconCart />
          Thêm vào giỏ
        </button>
        <button
          type="button"
          className="w-14 h-14 rounded-2xl flex items-center justify-center border-2 border-[#E5E7EB] text-[#FF6B9D] hover:bg-[#FF6B9D] hover:text-white hover:border-[#FF6B9D] transition-all duration-300 hover:scale-[1.02] cursor-pointer shrink-0"
          aria-label="Yêu thích"
        >
          <IconHeart />
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
