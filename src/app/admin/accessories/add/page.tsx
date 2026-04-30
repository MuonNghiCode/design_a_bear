"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { MdArrowBack, MdSave } from "react-icons/md";
import { useToast } from "@/contexts/ToastContext";
import PageHeader from "@/components/admin/common/PageHeader";
import { useAdminAccessoriesApi } from "@/hooks/useAdminAccessoriesApi";
import { AccessoryBasicInfo, AccessoryInventoryInfo } from "@/components/admin/accessories/form/AccessoryFormSections";
import { AccessorySidebar } from "@/components/admin/accessories/form/AccessorySidebar";
import { mediaService } from "@/services";
import { compressImage } from "@/utils/image";

const generateSKU = (name: string) => {
  return name
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "D")
    .replace(/([^0-9A-Z-\s])/g, "")
    .replace(/(\s+)/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
};

export default function AddAccessoryPage() {
  const router = useRouter();
  const toast = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { createAccessory, isCreating } = useAdminAccessoriesApi();
  
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    description: "",
    imageUrl: "",
    baseCost: 0,
    assemblyCost: 0,
    targetPrice: 0,
    stockQuantity: 0,
    isActive: true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => {
      const newData = { ...prev, [name]: type === "number" ? Number(value) : value };
      if (name === "name") {
        newData.sku = generateSKU(value);
      }
      return newData;
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    setIsUploading(true);
    try {
      const file = e.target.files[0];
      const compressed = await compressImage(file);
      const res = await mediaService.uploadMedia(compressed);
      if (res.isSuccess) {
        setFormData(prev => ({ ...prev, imageUrl: res.value.publicUrl }));
        toast.success("Tải ảnh lên thành công!");
      } else {
        toast.error("Tải ảnh thất bại");
      }
    } catch (err) {
      toast.error("Đã có lỗi xảy ra khi tải ảnh");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, imageUrl: "" }));
  };

  const handleToggleActive = () => {
    setFormData(prev => ({ ...prev, isActive: !prev.isActive }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.sku) {
      toast.error("Vui lòng nhập tên và SKU");
      return;
    }

    const success = await createAccessory(formData as any);
    if (success) {
      toast.success("Thêm phụ kiện thành công!");
      router.push("/admin/accessories");
    } else {
      toast.error("Thêm phụ kiện thất bại");
    }
  };

  return (
    <div className="max-w-[1450px] mx-auto px-4 md:px-10 pb-24">
      <PageHeader
        title="Thêm phụ kiện mới"
        sticky={true}
        actions={
          <div className="flex gap-3">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-gray-100 text-gray-400 font-black text-xs hover:bg-gray-50 transition-all shadow-sm"
            >
              <MdArrowBack className="text-lg" /> Quay lại
            </button>
            <div className="w-px h-10 bg-gray-100 mx-1" />
            <button
              onClick={handleSubmit}
              disabled={isCreating}
              className="flex items-center gap-2 px-8 py-3 rounded-xl bg-[#17409A] text-white font-black text-xs shadow-xl shadow-[#17409A]/20 hover:bg-[#0E2A66] transition-all disabled:opacity-50"
            >
              <MdSave className="text-lg" /> {isCreating ? "Đang lưu..." : "Lưu phụ kiện"}
            </button>
          </div>
        }
      />

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <AccessoryBasicInfo 
            formData={formData} 
            onChange={handleChange} 
            onUpload={handleImageUpload}
            onRemoveImage={handleRemoveImage}
            isUploading={isUploading}
            fileInputRef={fileInputRef}
          />
          <AccessoryInventoryInfo formData={formData} onChange={handleChange} />
        </div>

        <div className="lg:col-span-4">
          <AccessorySidebar isActive={formData.isActive} onToggle={handleToggleActive} />
        </div>
      </form>
    </div>
  );
}
