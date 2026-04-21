"use client";

import { useEffect, useState } from "react";
import { MdClose, MdCloudUpload, MdInfo, MdAttachMoney } from "react-icons/md";
import type { AccessoryResponse, CreateAccessoryRequest } from "@/types";
import { useAdminAccessoryApi } from "@/hooks/useAdminAccessoryApi";
import { useToast } from "@/contexts/ToastContext";
import { mediaService } from "@/services/media.service";

interface Props {
  accessory?: AccessoryResponse | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AccessoryModal({ accessory, onClose, onSuccess }: Props) {
  const isEdit = !!accessory;
  const { createAccessory, updateAccessory, isCreating, isUpdating } = useAdminAccessoryApi();
  const { success, error: toastError } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    description: "",
    imageUrl: "",
    baseCost: 0,
    assemblyCost: 0,
    targetPrice: 0,
    isActive: true,
  });

  useEffect(() => {
    if (accessory) {
      setFormData({
        name: accessory.name,
        sku: accessory.sku,
        description: accessory.description || "",
        imageUrl: accessory.imageUrl || "",
        baseCost: accessory.baseCost,
        assemblyCost: accessory.assemblyCost,
        targetPrice: accessory.targetPrice,
        isActive: accessory.isActive,
      });
    }
  }, [accessory]);

  const calculatePrice = (base: number, assembly: number) => {
    const totalCost = base + assembly;
    const marginPrice = totalCost * 1.2;
    return Math.ceil(marginPrice / 100000) * 100000;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => {
      const next = {
        ...prev,
        [name]: type === "number" ? Number(value) : type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
      };

      // Auto calculate price if costs change
      if (name === "baseCost" || name === "assemblyCost") {
        next.targetPrice = calculatePrice(next.baseCost, next.assemblyCost);
      }

      return next;
    });
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const res = await mediaService.uploadMedia(file, "accessories");
      if (res.isSuccess && res.value?.publicUrl) {
        setFormData(prev => ({ ...prev, imageUrl: res.value!.publicUrl! }));
        success("Tải ảnh lên thành công");
      } else {
        toastError("Tải ảnh lên thất bại");
      }
    } catch (err) {
      toastError("Lỗi khi tải ảnh");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.sku) {
      toastError("Vui lòng nhập đầy đủ Tên và SKU");
      return;
    }

    const ok = isEdit 
      ? await updateAccessory(accessory.accessoryId, formData)
      : await createAccessory(formData);

    if (ok) {
      success(isEdit ? "Cập nhật thành công!" : "Thêm phụ kiện mới thành công!");
      onSuccess?.();
      onClose();
    } else {
      toastError("Xử lý thất bại. Kiểm tra lại dữ liệu.");
    }
  };

  const isSubmitting = isCreating || isUpdating;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="relative bg-[#F4F7FF] rounded-[2.5rem] shadow-2xl w-full max-w-xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="px-8 py-6 flex items-center justify-between bg-white/80 backdrop-blur-md border-b border-white/50 shrink-0">
          <div>
            <h2 className="text-xl font-black text-[#1A1A2E]">
              {isEdit ? "Chỉnh sửa Phụ kiện" : "Thêm Phụ kiện Mới"}
            </h2>
            <p className="text-xs font-bold text-[#9CA3AF] mt-0.5">Định danh thông qua SKU & Giá bán 3 lớp</p>
          </div>
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-2xl bg-white text-[#9CA3AF] hover:text-[#EF4444] shadow-sm hover:shadow-md transition-all">
            <MdClose className="text-2xl" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto custom-scrollbar flex-1">
          <form id="accessoryForm" onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload */}
            <div className="flex justify-center mb-8">
              <div className="relative group">
                <div className="w-32 h-32 rounded-3xl bg-white border-2 border-dashed border-[#D7DEEF] overflow-hidden flex items-center justify-center transition-all group-hover:border-[#17409A]/40">
                  {formData.imageUrl ? (
                    <img src={formData.imageUrl} className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center">
                      <MdCloudUpload className="text-3xl text-[#9CA3AF] mx-auto mb-1" />
                      <span className="text-[9px] font-black text-[#9CA3AF] uppercase">Tải ảnh</span>
                    </div>
                  )}
                </div>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleUpload}
                  disabled={isUploading}
                  className="absolute inset-0 opacity-0 cursor-pointer" 
                />
                {isUploading && (
                  <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] rounded-3xl flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#17409A]" />
                  </div>
                )}
              </div>
            </div>

            {/* Basic Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-[#6B7280] tracking-widest uppercase ml-1">Tên phụ kiện *</label>
                <input 
                  required
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange}
                  placeholder="Vd: Áo Hoodie Xanh"
                  className="w-full bg-white text-sm font-semibold text-[#1A1A2E] rounded-2xl px-5 py-3.5 outline-none border-2 border-transparent focus:border-[#17409A]/20 transition-all shadow-sm shadow-[#17409A]/5"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-[#6B7280] tracking-widest uppercase ml-1">SKU (Định danh) *</label>
                <input 
                  required
                  name="sku" 
                  value={formData.sku} 
                  onChange={handleChange}
                  placeholder="ACC-HD-BLUE"
                  className="w-full bg-white text-sm font-black text-[#17409A] rounded-2xl px-5 py-3.5 outline-none border-2 border-transparent focus:border-[#17409A]/20 transition-all shadow-sm shadow-[#17409A]/5 uppercase"
                />
              </div>
            </div>

            {/* 3-Tier Pricing Section */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2 mb-1 px-1">
                <MdAttachMoney className="text-[#17409A] text-lg" />
                <h3 className="text-xs font-black text-[#1A1A2E] uppercase tracking-wider">Cấu trúc giá bán</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/60 p-4 rounded-2xl border border-white space-y-2">
                  <label className="text-[9px] font-black text-[#6B7280] uppercase">Giá vốn</label>
                  <input 
                    type="number"
                    name="baseCost"
                    value={formData.baseCost}
                    onChange={handleChange}
                    className="w-full bg-transparent text-sm font-black text-[#1A1A2E] outline-none"
                  />
                  <div className="h-0.5 w-full bg-[#E5E7EB] rounded-full" />
                </div>
                <div className="bg-white/60 p-4 rounded-2xl border border-white space-y-2">
                  <label className="text-[9px] font-black text-[#6B7280] uppercase">Giá gia công</label>
                  <input 
                    type="number"
                    name="assemblyCost"
                    value={formData.assemblyCost}
                    onChange={handleChange}
                    className="w-full bg-transparent text-sm font-black text-[#1A1A2E] outline-none"
                  />
                  <div className="h-0.5 w-full bg-[#E5E7EB] rounded-full" />
                </div>
                <div className="bg-[#17409A]/5 p-4 rounded-2xl border border-[#17409A]/10 space-y-2">
                  <label className="text-[9px] font-black text-[#17409A] uppercase">Giá bán mục tiêu</label>
                  <input 
                    type="number"
                    name="targetPrice"
                    value={formData.targetPrice}
                    onChange={handleChange}
                    className="w-full bg-transparent text-sm font-black text-[#17409A] outline-none"
                  />
                  <div className="h-0.5 w-full bg-[#17409A]/20 rounded-full" />
                </div>
              </div>
              
              <div className="bg-[#4ECDC4]/5 p-3 rounded-xl flex items-start gap-2 border border-[#4ECDC4]/10">
                <MdInfo className="text-[#4ECDC4] text-base shrink-0 mt-0.5" />
                <p className="text-[10px] font-bold text-[#4B5563] leading-relaxed">
                  Lợi nhuận gộp ước tính: <span className="text-[#17409A] font-black">
                    {(formData.targetPrice - formData.baseCost - formData.assemblyCost).toLocaleString()} VND
                  </span> ({formData.targetPrice > 0 ? Math.round(((formData.targetPrice - formData.baseCost - formData.assemblyCost) / formData.targetPrice) * 100) : 0}%)
                </p>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-[#6B7280] tracking-widest uppercase ml-1">Mô tả</label>
              <textarea 
                name="description" 
                value={formData.description} 
                onChange={handleChange}
                rows={3}
                placeholder="Nhập mô tả chi tiết cho phụ kiện này..."
                className="w-full bg-white text-sm font-semibold text-[#1A1A2E] rounded-2xl px-5 py-3.5 outline-none border-2 border-transparent focus:border-[#17409A]/20 transition-all shadow-sm resize-none"
              />
            </div>

            <div className="flex items-center gap-6 px-1">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input 
                    type="checkbox" 
                    name="isActive" 
                    checked={formData.isActive} 
                    onChange={handleChange}
                    className="sr-only" 
                  />
                  <div className={`w-11 h-6 rounded-full transition-all ${formData.isActive ? 'bg-[#17409A]' : 'bg-[#D1D5DB]'}`} />
                  <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-all ${formData.isActive ? 'translate-x-5' : 'translate-x-0'}`} />
                </div>
                <span className="text-xs font-black text-[#1A1A2E] uppercase tracking-wider">Kích hoạt</span>
              </label>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="px-8 py-6 bg-white border-t border-gray-100 flex items-center justify-end gap-3 shrink-0">
          <button 
            type="button" 
            onClick={onClose}
            className="px-6 py-3.5 rounded-2xl text-xs font-black text-[#6B7280] bg-[#F4F7FF] hover:bg-[#E5E7EB] transition-colors"
          >
            HỦY BỎ
          </button>
          <button 
            type="submit" 
            form="accessoryForm"
            disabled={isSubmitting || isUploading}
            className="px-10 py-3.5 rounded-2xl text-xs font-black text-white bg-[#17409A] hover:bg-[#0E2A66] shadow-lg shadow-[#17409A]/20 transition-all disabled:opacity-50"
          >
            {isSubmitting ? "ĐANG XỬ LÝ..." : isEdit ? "CẬP NHẬT" : "THÊM MỚI"}
          </button>
        </div>
      </div>
    </div>
  );
}
