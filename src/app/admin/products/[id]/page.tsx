"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { 
  MdArrowBack, 
  MdEdit, 
  MdDelete,
  MdInfo,
  MdAttachMoney,
  MdCategory,
  MdStar,
  MdVisibility,
  MdShoppingCart,
  MdImage,
  MdLayers
} from "react-icons/md";
import { useToast } from "@/contexts/ToastContext";
import { productService } from "@/services";
import PageHeader from "@/components/admin/common/PageHeader";
import ConfirmDialog from "@/components/admin/common/ConfirmDialog";
import type { ProductDetail } from "@/types";
import { formatPrice } from "@/utils/currency";

export default function ProductDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const toast = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await productService.getProductById(id as string);
        if (res.isSuccess && res.value) {
          setProduct(res.value);
        } else {
          toast.error("Không tìm thấy sản phẩm");
          router.push("/admin/products");
        }
      } catch (err) {
        toast.error("Đã có lỗi xảy ra");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id, router, toast]);

  const handleDelete = async () => {
    try {
      const res = await productService.deleteProduct(id as string);
      if (res.isSuccess) {
        toast.success("Đã xóa sản phẩm");
        router.push("/admin/products");
      } else {
        toast.error("Xóa thất bại");
      }
    } catch (err) {
      toast.error("Đã có lỗi xảy ra");
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 rounded-2xl border-4 border-[#17409A]/20 border-t-[#17409A] animate-spin" />
        <p className="text-sm font-black text-gray-400 uppercase tracking-widest">Đang tải chi tiết sản phẩm...</p>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-10 pb-20">
      <PageHeader
        title={product.name}
        sticky={true}
        actions={
          <div className="flex gap-4">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white border border-gray-100 text-gray-400 font-black text-xs hover:bg-gray-50 transition-all shadow-sm"
            >
              <MdArrowBack className="text-lg" /> Quay lại
            </button>
            <div className="w-px h-10 bg-gray-100 mx-1" />
            <button
              onClick={() => setIsDeleteDialogOpen(true)}
              className="p-3 rounded-2xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm"
              title="Xóa sản phẩm"
            >
              <MdDelete className="text-2xl" />
            </button>
            <button
              onClick={() => router.push(`/admin/products/${id}/edit`)}
              className="flex items-center gap-2 px-8 py-2.5 rounded-2xl bg-[#17409A] text-white font-black text-xs shadow-lg shadow-[#17409A]/20 hover:bg-[#0E2A66] transition-all"
            >
              <MdEdit className="text-lg" /> Chỉnh sửa
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
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
              <h2 className="text-2xl font-black text-[#1A1A2E]">Thông tin chi tiết</h2>
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
              <h2 className="text-2xl font-black text-[#1A1A2E]">Giá & Thông số</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <div className="flex justify-between items-center py-4 border-b border-gray-50">
                  <span className="text-sm font-black text-gray-400 uppercase tracking-wider">Giá bán hiện tại</span>
                  <span className="text-2xl font-black text-[#17409A]">{formatPrice(product.price)}</span>
                </div>
                <div className="flex justify-between items-center py-4 border-b border-gray-50">
                  <span className="text-sm font-black text-gray-400 uppercase tracking-wider">Trọng lượng</span>
                  <span className="text-lg font-bold text-[#1A1A2E]">{product.weightGram} gram</span>
                </div>
              </div>
              <div className="space-y-6">
                <div className="flex justify-between items-center py-4 border-b border-gray-50">
                  <span className="text-sm font-black text-gray-400 uppercase tracking-wider">Tồn kho hiện có</span>
                  <span className={`text-xl font-black ${(product.stockQuantity || 0) <= 10 ? "text-red-500" : "text-green-500"}`}>
                    {product.stockQuantity || 0} sản phẩm
                  </span>
                </div>
                <div className="flex justify-between items-center py-4 border-b border-gray-50">
                  <span className="text-sm font-black text-gray-400 uppercase tracking-wider">Tổng đã bán</span>
                  <span className="text-lg font-bold text-[#1A1A2E]">{product.totalSales} sản phẩm</span>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-[40px] p-12 shadow-sm border border-white/50 space-y-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-600">
                <MdCategory className="text-3xl" />
              </div>
              <h2 className="text-2xl font-black text-[#1A1A2E]">Phân loại liên quan</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <p className="text-[12px] font-black text-gray-400 uppercase tracking-wider ml-1">Danh mục sản phẩm</p>
                <div className="flex flex-wrap gap-3">
                  {product.categories?.map(cat => (
                    <span key={cat.categoryId} className="px-5 py-2.5 rounded-xl bg-[#F4F7FF] text-[#17409A] text-[11px] font-black uppercase tracking-wider shadow-sm">
                      {cat.name}
                    </span>
                  )) || <span className="text-sm text-gray-400 italic">Trống</span>}
                </div>
              </div>
              <div className="space-y-4">
                <p className="text-[12px] font-black text-gray-400 uppercase tracking-wider ml-1">Nhân vật / Bộ sưu tập</p>
                <div className="flex flex-wrap gap-3">
                  {product.characters?.map(char => (
                    <span key={char.characterId} className="px-5 py-2.5 rounded-xl bg-[#F4F7FF] text-[#17409A] text-[11px] font-black uppercase tracking-wider shadow-sm">
                      {char.name}
                    </span>
                  )) || <span className="text-sm text-gray-400 italic">Trống</span>}
                </div>
              </div>
            </div>
          </section>

          {/* Media Gallery */}
          <section className="bg-white rounded-[40px] p-12 shadow-sm border border-white/50 space-y-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-pink-50 flex items-center justify-center text-pink-600">
                <MdImage className="text-3xl" />
              </div>
              <h2 className="text-2xl font-black text-[#1A1A2E]">Thư viện ảnh gốc ({product.media?.length || 0})</h2>
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
              <h2 className="text-2xl font-black text-[#1A1A2E]">Ma trận ảnh tổ hợp ({product.comboImages?.length || 0})</h2>
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

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Xác nhận xóa?"
        message={`Bạn có chắc chắn muốn xóa sản phẩm "${product.name}"? Thao tác này không thể hoàn tác.`}
        confirmText="Xóa sản phẩm"
        cancelText="Hủy bỏ"
        variant="danger"
      />
    </div>
  );
}
