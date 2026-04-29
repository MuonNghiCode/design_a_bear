"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { 
  MdArrowBack, 
  MdEdit, 
  MdDelete,
  MdInfo,
  MdAttachMoney,
  MdInventory,
  MdLayers
} from "react-icons/md";
import { useToast } from "@/contexts/ToastContext";
import PageHeader from "@/components/admin/common/PageHeader";
import ConfirmDialog from "@/components/admin/common/ConfirmDialog";
import { useAdminAccessoriesApi } from "@/hooks/useAdminAccessoriesApi";
import { formatPrice } from "@/utils/currency";

export default function AccessoryDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const toast = useToast();
  const { getAccessory, deleteAccessory, loading } = useAdminAccessoriesApi();

  const [accessory, setAccessory] = useState<any>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const acc = await getAccessory(id as string);
      if (acc) {
        setAccessory(acc);
      } else {
        toast.error("Không tìm thấy phụ kiện");
        router.push("/admin/accessories");
      }
    };
    fetchData();
  }, [id, router, toast]);

  const handleDelete = async () => {
    const ok = await deleteAccessory(id as string);
    if (ok) {
      toast.success("Đã xóa phụ kiện");
      router.push("/admin/accessories");
    } else {
      toast.error("Xóa thất bại");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 rounded-2xl border-4 border-[#17409A]/20 border-t-[#17409A] animate-spin" />
        <p className="text-sm font-black text-gray-400 uppercase tracking-widest">Đang tải chi tiết phụ kiện...</p>
      </div>
    );
  }

  if (!accessory) return null;

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-10 pb-20">
      <PageHeader
        title={accessory.name}
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
              title="Xóa phụ kiện"
            >
              <MdDelete className="text-2xl" />
            </button>
            <button
              onClick={() => router.push(`/admin/accessories/${id}/edit`)}
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
                src={accessory.imageUrl || "/accessory_placeholder.png"} 
                className="w-full h-full object-contain drop-shadow-2xl group-hover:scale-110 transition-transform duration-500" 
                alt="" 
              />
            </div>
            <h2 className="text-2xl font-black text-[#1A1A2E] mb-2">{accessory.name}</h2>
            <p className="text-[12px] font-black text-gray-400 uppercase tracking-widest mb-6">ID: {accessory.accessoryId?.slice(0, 8)}</p>
            
            <div className="flex items-center gap-3">
              <span className={`text-[11px] font-black px-4 py-2 rounded-full uppercase tracking-wider ${accessory.isActive ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"}`}>
                {accessory.isActive ? "Đang bán" : "Bản nháp"}
              </span>
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
              <h2 className="text-2xl font-black text-[#1A1A2E]">Mô tả phụ kiện</h2>
            </div>
            <div className="text-lg text-gray-600 font-medium leading-relaxed max-w-4xl">
              {accessory.description || "Chưa có mô tả cho phụ kiện này."}
            </div>
          </section>

          <section className="bg-white rounded-[40px] p-12 shadow-sm border border-white/50 space-y-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600">
                <MdAttachMoney className="text-3xl" />
              </div>
              <h2 className="text-2xl font-black text-[#1A1A2E]">Giá & Tồn kho</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <div className="flex justify-between items-center py-4 border-b border-gray-50">
                  <span className="text-sm font-black text-gray-400 uppercase tracking-wider">Giá bán hiện tại</span>
                  <span className="text-2xl font-black text-[#17409A]">{formatPrice(accessory.targetPrice)}</span>
                </div>
                <div className="flex justify-between items-center py-4 border-b border-gray-50">
                  <span className="text-sm font-black text-gray-400 uppercase tracking-wider">Mã SKU</span>
                  <span className="text-lg font-bold text-[#1A1A2E]">{accessory.sku || "N/A"}</span>
                </div>
              </div>
              <div className="space-y-6">
                <div className="flex justify-between items-center py-4 border-b border-gray-50">
                  <span className="text-sm font-black text-gray-400 uppercase tracking-wider">Tồn kho hiện có</span>
                  <span className={`text-xl font-black ${(accessory.available || 0) <= 10 ? "text-red-500" : "text-green-500"}`}>
                    {accessory.available || 0} sản phẩm
                  </span>
                </div>
                <div className="flex justify-between items-center py-4 border-b border-gray-50">
                  <span className="text-sm font-black text-gray-400 uppercase tracking-wider">Chi phí cơ bản</span>
                  <span className="text-lg font-bold text-[#1A1A2E]">{formatPrice(accessory.baseCost)}</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Xác nhận xóa?"
        message={`Bạn có chắc chắn muốn xóa phụ kiện "${accessory.name}"? Thao tác này không thể hoàn tác.`}
        confirmText="Xóa phụ kiện"
        cancelText="Hủy bỏ"
        variant="danger"
      />
    </div>
  );
}
