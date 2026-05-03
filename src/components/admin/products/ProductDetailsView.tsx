"use client";

import React from "react";
import { 
  MdArrowBack, 
  MdEdit, 
  MdDelete,
  MdInfo,
  MdAttachMoney,
  MdCategory,
  MdStar,
  MdVisibility,
  MdImage,
  MdLayers,
  MdExtension
} from "react-icons/md";
import PageHeader from "@/components/admin/common/PageHeader";
import type { ProductDetail } from "@/types";
import { formatPrice } from "@/utils/currency";

interface ProductDetailsViewProps {
  product: ProductDetail;
  onBack?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  showActions?: boolean;
}

export default function ProductDetailsView({
  product,
  onBack,
  onEdit,
  onDelete,
  showActions = true,
}: ProductDetailsViewProps) {
  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-10 pb-20">
      <PageHeader
        title={product.name}
        sticky={true}
        actions={
          <div className="flex gap-4">
            {onBack && (
              <button
                onClick={onBack}
                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white border border-gray-100 text-gray-400 font-black text-xs hover:bg-gray-50 transition-all shadow-sm uppercase tracking-widest"
              >
                <MdArrowBack className="text-lg" /> Quay lại
              </button>
            )}
            {showActions && (
              <>
                <div className="w-px h-10 bg-gray-100 mx-1" />
                <button
                  onClick={onDelete}
                  className="p-3 rounded-2xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                  title="Xóa sản phẩm"
                >
                  <MdDelete className="text-2xl" />
                </button>
                <button
                  onClick={onEdit}
                  className="flex items-center gap-2 px-8 py-2.5 rounded-2xl bg-[#17409A] text-white font-black text-xs shadow-lg shadow-[#17409A]/20 hover:bg-[#0E2A66] transition-all uppercase tracking-widest"
                >
                  <MdEdit className="text-lg" /> Chỉnh sửa
                </button>
              </>
            )}
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mt-6">
        {/* Visuals & Overview */}
        <div className="lg:col-span-4 xl:col-span-3 space-y-8">
          <div className="bg-white rounded-[40px] p-10 shadow-sm border border-white/50 flex flex-col items-center text-center">
            <div className="w-full aspect-square rounded-[48px] bg-[#F4F7FF] border border-white p-10 mb-8 flex items-center justify-center shadow-inner group">
              <img 
                src={product.imageUrl || product.media?.[0]?.url || "/teddy_bear.png"} 
                className="w-full h-full object-contain drop-shadow-2xl group-hover:scale-110 transition-transform duration-500" 
                alt={product.name} 
              />
            </div>
            <h2 className="text-2xl font-black text-[#1A1A2E] mb-2">{product.name}</h2>
            <p className="text-[12px] font-black text-gray-400 uppercase tracking-widest mb-6">SKU: {product.sku}</p>
            
            <div className="flex items-center gap-3 mb-8">
              <span className={`text-[11px] font-black px-4 py-2 rounded-full uppercase tracking-wider ${product.isActive ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"}`}>
                {product.isActive ? "Đang bán" : "Bản nháp"}
              </span>
              {product.isPersonalizable && (
                <span className="text-[11px] font-black px-4 py-2 rounded-full uppercase tracking-wider bg-blue-100 text-[#17409A]">
                  Cá nhân hóa
                </span>
              )}
            </div>

            <div className="w-full pt-8 border-t border-gray-50 grid grid-cols-2 gap-6">
              <div className="text-center">
                <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1">Đánh giá</p>
                <p className="text-xl font-black text-[#1A1A2E] flex items-center justify-center gap-1.5">
                  <MdStar className="text-yellow-400 text-2xl" /> {product.averageRating || 0}
                </p>
              </div>
              <div className="text-center">
                <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1">Lượt xem (10p)</p>
                <p className="text-xl font-black text-[#1A1A2E] flex items-center justify-center gap-1.5">
                  <MdVisibility className="text-blue-400 text-2xl" /> {product.viewCountIn10Min || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Details & Specs */}
        <div className="lg:col-span-8 xl:col-span-9 space-y-10">
          <section className="bg-white rounded-[40px] p-12 shadow-sm border border-white/50 space-y-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-[#17409A]">
                <MdInfo className="text-3xl" />
              </div>
              <h2 className="text-2xl font-black text-[#1A1A2E] uppercase tracking-wider">Thông tin chi tiết</h2>
            </div>
            <div className="text-lg text-gray-600 font-medium leading-relaxed max-w-4xl">
              {product.description || "Chưa có mô tả cho sản phẩm này."}
            </div>
          </section>

          <section className="bg-white rounded-[40px] p-12 shadow-sm border border-white/50 space-y-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600">
                <MdAttachMoney className="text-3xl" />
              </div>
              <h2 className="text-2xl font-black text-[#1A1A2E] uppercase tracking-wider">Giá & Thông số</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <div className="flex justify-between items-center py-4 border-b border-gray-50">
                  <span className="text-[11px] font-black text-gray-400 uppercase tracking-wider">Giá bán hiện tại</span>
                  <span className="text-2xl font-black text-[#17409A] font-mono">{formatPrice(product.price)}</span>
                </div>
                <div className="flex justify-between items-center py-4 border-b border-gray-50">
                  <span className="text-[11px] font-black text-gray-400 uppercase tracking-wider">Trọng lượng</span>
                  <span className="text-lg font-bold text-[#1A1A2E] font-mono">{product.weightGram}g</span>
                </div>
              </div>
              <div className="space-y-6">
                <div className="flex justify-between items-center py-4 border-b border-gray-50">
                  <span className="text-[11px] font-black text-gray-400 uppercase tracking-wider">Tồn kho hiện có</span>
                  <span className={`text-xl font-black font-mono ${(product.onHand || 0) <= 10 ? "text-red-500" : "text-green-500"}`}>
                    {product.onHand || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center py-4 border-b border-gray-50">
                  <span className="text-[11px] font-black text-gray-400 uppercase tracking-wider">Tổng đã bán</span>
                  <span className="text-lg font-bold text-[#1A1A2E] font-mono">{product.totalSales}</span>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-[40px] p-12 shadow-sm border border-white/50 space-y-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-600">
                <MdCategory className="text-3xl" />
              </div>
              <h2 className="text-2xl font-black text-[#1A1A2E] uppercase tracking-wider">Phân loại liên quan</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <p className="text-[12px] font-black text-gray-400 uppercase tracking-wider ml-1">Danh mục sản phẩm</p>
                <div className="flex flex-wrap gap-3">
                  {product.categories?.map(cat => (
                    <span key={cat.categoryId} className="px-5 py-2.5 rounded-xl bg-[#F4F7FF] text-[#17409A] text-[11px] font-black uppercase tracking-wider shadow-sm">
                      {cat.name}
                    </span>
                  )) || <span className="text-[11px] font-bold text-gray-400 italic">Trống</span>}
                </div>
              </div>
              <div className="space-y-4">
                <p className="text-[12px] font-black text-gray-400 uppercase tracking-wider ml-1">Nhân vật / Bộ sưu tập</p>
                <div className="flex flex-wrap gap-3">
                  {product.characters?.map(char => (
                    <span key={char.characterId} className="px-5 py-2.5 rounded-xl bg-[#F4F7FF] text-[#17409A] text-[11px] font-black uppercase tracking-wider shadow-sm">
                      {char.name}
                    </span>
                  )) || <span className="text-[11px] font-bold text-gray-400 italic">Trống</span>}
                </div>
              </div>
            </div>
          </section>

          {/* Accessories */}
          {product.accessories && product.accessories.length > 0 && (
            <section className="bg-white rounded-[40px] p-12 shadow-sm border border-white/50 space-y-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <MdExtension className="text-3xl" />
                </div>
                <h2 className="text-2xl font-black text-[#1A1A2E] uppercase tracking-wider">Phụ kiện đi kèm ({product.accessories.length})</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {product.accessories.map((acc) => (
                  <div key={acc.accessoryId} className="flex gap-5 p-5 bg-[#F4F7FF] rounded-[24px] border border-white shadow-sm hover:shadow-md transition-all">
                    <div className="w-20 h-20 rounded-[16px] bg-white p-2 shrink-0 border border-indigo-50 flex items-center justify-center shadow-inner overflow-hidden">
                      <img src={acc.imageUrl || "/teddy_bear.png"} className="w-full h-full object-contain" alt={acc.name} />
                    </div>
                    <div className="flex flex-col justify-center min-w-0">
                      <p className="text-sm font-black text-[#1A1A2E] truncate mb-1">{acc.name}</p>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">SKU: {acc.sku}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-[#17409A] font-mono">{formatPrice(acc.targetPrice)}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-300" />
                        <span className={`text-[10px] font-black ${(acc.onHand || 0) > 0 ? "text-green-500" : "text-red-500"}`}>
                          Kho: {acc.onHand || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Media Gallery */}
          <section className="bg-white rounded-[40px] p-12 shadow-sm border border-white/50 space-y-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-pink-50 flex items-center justify-center text-pink-600">
                <MdImage className="text-3xl" />
              </div>
              <h2 className="text-2xl font-black text-[#1A1A2E] uppercase tracking-wider">Thư viện ảnh gốc ({product.media?.length || 0})</h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {product.media?.map((m, idx) => (
                <div key={idx} className="group relative aspect-square rounded-[32px] bg-[#F4F7FF] border border-white overflow-hidden shadow-sm hover:shadow-md transition-all">
                  <img src={m.url} className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500" alt={m.altText} />
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-white/80 backdrop-blur-sm transform translate-y-full group-hover:translate-y-0 transition-transform">
                    <p className="text-[10px] font-black text-[#1A1A2E] truncate uppercase tracking-tighter">{m.altText || "Product Image"}</p>
                  </div>
                </div>
              )) || (
                <div className="col-span-full py-12 text-center text-gray-300 font-bold uppercase tracking-widest border-2 border-dashed border-[#F4F7FF] rounded-[32px]">
                  Chưa có ảnh thư viện
                </div>
              )}
            </div>
          </section>

          {/* Combo Matrix Gallery */}
          <section className="bg-white rounded-[40px] p-12 shadow-sm border border-white/50 space-y-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600">
                <MdLayers className="text-3xl" />
              </div>
              <h2 className="text-2xl font-black text-[#1A1A2E] uppercase tracking-wider">Ma trận ảnh tổ hợp ({product.comboImages?.length || 0})</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {product.comboImages?.map((ci, idx) => (
                <div key={idx} className="flex gap-6 p-6 bg-[#F4F7FF] rounded-[32px] border border-white shadow-sm hover:border-purple-200 transition-all">
                  <div className="w-32 h-32 rounded-2xl bg-white p-4 shrink-0 border border-purple-50 flex items-center justify-center shadow-inner">
                    <img src={ci.imageUrl} className="w-full h-full object-contain" alt="" />
                  </div>
                  <div className="flex flex-col justify-center min-w-0">
                    <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest mb-2">Tổ hợp #{idx + 1}</p>
                    <div className="flex flex-wrap gap-2">
                      {ci.combinationKey?.split("|").map((accId, i) => (
                        <span key={i} className="px-3 py-1 bg-white border border-purple-50 text-[10px] font-black text-[#17409A] rounded-lg shadow-sm">
                          {accId.slice(0, 8)}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )) || (
                <div className="col-span-full py-12 text-center text-gray-300 font-bold uppercase tracking-widest border-2 border-dashed border-[#F4F7FF] rounded-[32px]">
                  Chưa có ảnh ma trận
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
