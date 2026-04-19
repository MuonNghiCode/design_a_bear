"use client";

import { useState, useEffect } from "react";
import { MdClose, MdEdit, MdStar, MdSettingsInputComponent, MdGridView } from "react-icons/md";
import { productService } from "@/services/product.service";
import { formatPrice } from "@/utils/currency";
import { formatDate } from "@/utils/date";
import type { ProductDetail } from "@/types/responses";

interface Props {
  productId: string;
  onClose: () => void;
  onEdit: (id: string) => void;
}

export default function ProductDetailModal({
  productId,
  onClose,
  onEdit,
}: Props) {
  const [isFetching, setIsFetching] = useState(true);
  const [product, setProduct] = useState<ProductDetail | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setIsFetching(true);
        const res = await productService.getProductById(productId);
        if (mounted && res.isSuccess && res.value) {
          setProduct(res.value);
        }
      } catch (err) {
        console.error("Failed to load product details", err);
      } finally {
        if (mounted) setIsFetching(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [productId]);

  if (isFetching) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/20">
        <div className="bg-white rounded-3xl p-8 flex flex-col items-center gap-4 shadow-2xl">
          <div className="w-10 h-10 border-4 border-[#17409A]/10 border-t-[#17409A] rounded-full animate-spin" />
          <p className="text-sm font-bold text-[#6B7280]">Đang tải chi tiết...</p>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const isAccessory = product.productType === "ACCESSORY";
  const isBaseBear = product.productType === "BASE_BEAR";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div className="relative bg-[#F4F7FF] rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="px-6 py-5 border-b border-white/50 bg-white/50 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-xl font-black text-[#1A1A2E]">
              Chi tiết sản phẩm
            </h2>
            <div className="flex items-center gap-3 mt-0.5">
              <span className="text-[10px] font-bold bg-[#17409A]/10 text-[#17409A] px-2 py-0.5 rounded-md">
                ID: {product.productId.slice(0, 8)}...
              </span>
              <span className="text-[10px] font-bold bg-[#4ECDC4]/10 text-[#4ECDC4] px-2 py-0.5 rounded-md uppercase">
                {isAccessory ? "Phụ kiện" : isBaseBear ? "Gấu nhồi bông (Gốc)" : "Sản phẩm"}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-xl bg-white text-[#9CA3AF] hover:text-[#1A1A2E] shadow-sm hover:shadow-md transition-all"
          >
            <MdClose className="text-xl" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar space-y-8">
          {/* Hero Section: Gallery & Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6">
            <div className="space-y-3">
              <div className="aspect-square rounded-2xl bg-white border border-[#E5E7EB] overflow-hidden shadow-sm flex items-center justify-center p-2 relative">
                <img
                  src={product.media?.[0]?.url || "/teddy_bear.png"}
                  alt={product.name}
                  className="w-full h-full object-contain"
                />
                {!product.isActive && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <span className="bg-white/90 text-[#EF4444] px-3 py-1 rounded-full text-[10px] font-black uppercase shadow-lg">Đã ẩn</span>
                  </div>
                )}
              </div>
              {product.media && product.media.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.media.slice(1, 5).map((m: any, idx: number) => (
                    <div
                      key={idx}
                      className="aspect-square rounded-lg border border-[#E5E7EB] bg-white overflow-hidden p-0.5 shadow-sm"
                    >
                      <img
                        src={m.url}
                        className="w-full h-full object-cover"
                        alt={`gallery-${idx}`}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-5">
              <div>
                <h3 className="text-2xl font-black text-[#1A1A2E] leading-tight">
                  {product.name}
                </h3>
                <div className="flex items-center gap-4 mt-2">
                  <p className="text-[#17409A] font-black text-2xl">
                    {formatPrice(product.price)}
                  </p>
                  <span className="text-[10px] font-black py-1 px-3 rounded-full bg-white border border-[#E5E7EB] text-[#6B7280] shadow-sm uppercase">
                    SKU: {product.sku || "N/A"}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {product.categories?.map((c: any) => (
                  <span key={c.categoryId} className="px-2.5 py-1 rounded-lg bg-[#7C5CFC]/10 text-[#7C5CFC] text-[10px] font-black uppercase tracking-wider">
                    {c.name}
                  </span>
                ))}
                {product.characters?.map((c: any) => (
                  <span key={c.characterId} className="px-2.5 py-1 rounded-lg bg-[#FF8C42]/10 text-[#FF8C42] text-[10px] font-black uppercase tracking-wider">
                    {c.name}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-4 gap-3">
                <div className="bg-white rounded-2xl p-3 border border-[#E5E7EB] shadow-sm">
                  <p className="text-[#9CA3AF] text-[9px] font-black tracking-widest uppercase mb-1">Khối lượng</p>
                  <p className="text-[#1A1A2E] font-black text-sm">{product.weightGram}g</p>
                </div>
                <div className="bg-white rounded-2xl p-3 border border-[#E5E7EB] shadow-sm">
                  <p className="text-[#9CA3AF] text-[9px] font-black tracking-widest uppercase mb-1">Đánh giá</p>
                  <div className="flex items-center gap-1 text-[#FFD93D] font-black text-sm">
                    <MdStar className="text-sm" />
                    {product.reviews && product.reviews.length > 0 ? (
                      (product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length).toFixed(1)
                    ) : "N/A"}
                  </div>
                </div>
                <div className="bg-white rounded-2xl p-3 border border-[#E5E7EB] shadow-sm">
                  <p className="text-[#9CA3AF] text-[9px] font-black tracking-widest uppercase mb-1">Cá nhân hóa</p>
                  <p className={`text-[10px] font-black mt-1 uppercase ${product.isPersonalizable ? "text-[#4ECDC4]" : "text-[#EF4444]"}`}>
                    {product.isPersonalizable ? "Bật" : "Tắt"}
                  </p>
                </div>
                 <div className="bg-white rounded-2xl p-3 border border-[#E5E7EB] shadow-sm">
                  <p className="text-[#9CA3AF] text-[9px] font-black tracking-widest uppercase mb-1">Trạng thái</p>
                  <p className={`text-[10px] font-black mt-1 uppercase ${product.isActive ? "text-[#4ECDC4]" : "text-[#EF4444]"}`}>
                    {product.isActive ? "Công khai" : "Bản nháp"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Combo Images Matrix for Base Bear */}
          {isBaseBear && product.comboImages && product.comboImages.length > 0 && (
            <div className="space-y-4">
               <div className="flex items-center gap-2 pl-1">
                <MdGridView className="text-[#17409A]" />
                <h4 className="text-[11px] font-black text-[#6B7280] tracking-[0.2em] uppercase">
                  Ma trận hình ảnh ({product.comboImages.length})
                </h4>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {product.comboImages.map((ci) => (
                  <div key={ci.comboId} className="bg-white rounded-2xl border border-[#E5E7EB] p-2 space-y-2 group hover:shadow-lg transition-all duration-300">
                    <div className="aspect-square rounded-xl bg-[#F4F7FF] overflow-hidden">
                      <img src={ci.imageUrl} alt={ci.combinationKey} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                    </div>
                    <p className="text-[9px] font-black text-[#1A1A2E] truncate px-1 uppercase tracking-tight" title={ci.combinationKey}>
                      {ci.combinationKey}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          <div className="space-y-3">
             <h4 className="text-[11px] font-black text-[#6B7280] tracking-[0.2em] uppercase pl-1">
                Mô tả sản phẩm
             </h4>
             <div className="bg-white/50 rounded-2xl p-5 border border-white/50 text-sm font-semibold text-[#4B5563] leading-relaxed italic">
                {product.description || "Chưa có mô tả chi tiết."}
             </div>
          </div>

          {/* Technical Details Footer */}
          <div className="grid grid-cols-2 gap-4 pb-4">
             <div className="text-[#9CA3AF] text-[10px] font-bold italic space-y-1">
                <p>Ngày tạo: {formatDate(product.createdAt)}</p>
                <p>Sửa lần cuối: {formatDate(product.updatedAt || product.createdAt)}</p>
             </div>
             <div className="text-right">
                <p className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest">Loại sản phẩm chính</p>
                <p className="text-sm font-black text-[#17409A] mt-1">{product.productType}</p>
             </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-white border-t border-[#F4F7FF] flex items-center justify-end gap-3 shrink-0">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl text-sm font-bold text-[#6B7280] bg-[#F4F7FF] hover:bg-[#E5E7EB] transition-colors"
          >
            Đóng
          </button>
          <button
            onClick={() => onEdit(product.productId)}
            className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-[#17409A] hover:bg-[#0E2A66] shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
          >
            <MdEdit className="text-lg" />
            Chỉnh sửa ngay
          </button>
        </div>
      </div>
    </div>
  );
}
