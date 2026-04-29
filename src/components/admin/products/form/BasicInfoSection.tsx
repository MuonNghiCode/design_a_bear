"use client";

import React from "react";
import { MdInfo, MdLink, MdKeyboardArrowDown } from "react-icons/md";

interface BasicInfoSectionProps {
  formData: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  isEdit?: boolean;
}

export const BasicInfoSection = ({ formData, onChange, isEdit }: BasicInfoSectionProps) => {
  return (
    <section className="bg-white rounded-[32px] p-8 shadow-sm border border-white/50 space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-[16px] bg-blue-50 flex items-center justify-center text-[#17409A]">
          <MdInfo className="text-2xl" />
        </div>
        <h2 className="text-2xl font-black text-[#1A1A2E]">Thông tin cơ bản</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2 md:col-span-2">
          <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-2">Tên sản phẩm</label>
          <input
            name="name"
            value={formData.name}
            onChange={onChange}
            placeholder="Vd: Gấu bông Teddy Classic"
            className="w-full bg-[#F4F7FF] rounded-[16px] px-8 py-5 text-lg font-bold text-[#1A1A2E] outline-none border-2 border-transparent focus:border-[#17409A]/30 transition-all placeholder:text-gray-300 shadow-inner"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-2">Loại sản phẩm</label>
          <div className="relative">
            <select
              name="productType"
              value={formData.productType}
              onChange={onChange}
              className="w-full bg-[#F4F7FF] rounded-[16px] px-8 py-5 text-base font-bold text-[#1A1A2E] outline-none border-2 border-transparent focus:border-[#17409A]/30 transition-all appearance-none shadow-inner pr-14 cursor-pointer"
            >
              <option value="BASE_BEAR">Gấu cơ bản (Base Bear)</option>
              <option value="ACCESSORY">Phụ kiện (Accessory)</option>
              <option value="COMPLETE_BEAR">Gấu hoàn chỉnh (Complete Bear)</option>
              <option value="Standard">Sản phẩm tiêu chuẩn (Standard)</option>
            </select>
            <MdKeyboardArrowDown className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 text-2xl pointer-events-none" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-2">Mã SKU</label>
          <div className="relative">
            <MdInfo className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
            <input
              name="sku"
              value={formData.sku}
              onChange={onChange}
              disabled={isEdit}
              placeholder="Vd: GAU-TEDDY-001"
              className={`w-full bg-[#F4F7FF] rounded-[16px] pl-14 pr-8 py-5 text-base font-bold text-[#1A1A2E] outline-none border-2 border-transparent focus:border-[#17409A]/30 transition-all placeholder:text-gray-300 shadow-inner ${isEdit ? "opacity-50 cursor-not-allowed" : ""}`}
            />
          </div>
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-2">Mô tả chi tiết</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={onChange}
            rows={6}
            placeholder="Mô tả về chất liệu, kích thước, đặc điểm nổi bật..."
            className="w-full bg-[#F4F7FF] rounded-[24px] px-8 py-5 text-base font-bold text-[#1A1A2E] outline-none border-2 border-transparent focus:border-[#17409A]/30 transition-all resize-none placeholder:text-gray-300 shadow-inner"
          />
        </div>
      </div>
    </section>
  );
};
