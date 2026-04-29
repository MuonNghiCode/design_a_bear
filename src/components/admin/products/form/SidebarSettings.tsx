"use client";

import React from "react";
import { 
  MdSettings, 
  MdAttachMoney, 
  MdCategory, 
  MdImage, 
  MdCheckCircle 
} from "react-icons/md";

interface SidebarSettingsProps {
  formData: any;
  categories: any[];
  accessoriesList: any[];
  onToggle: (name: string) => void;
  onPriceChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onMultiSelect: (name: string, id: string) => void;
}

export const SidebarSettings = ({
  formData,
  categories,
  accessoriesList,
  onToggle,
  onPriceChange,
  onMultiSelect
}: SidebarSettingsProps) => {
  return (
    <div className="lg:col-span-4 space-y-8">
      {/* Settings Section */}
      <section className="bg-white rounded-[32px] p-8 shadow-sm border border-white/50 space-y-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-[16px] bg-purple-50 flex items-center justify-center text-purple-600">
            <MdSettings className="text-2xl" />
          </div>
          <h2 className="text-2xl font-black text-[#1A1A2E]">Thiết lập</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-6 bg-[#F4F7FF] rounded-[24px] border border-transparent hover:border-blue-100 transition-all shadow-sm">
            <div>
              <p className="text-base font-black text-[#1A1A2E]">Hoạt động</p>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Cửa hàng</p>
            </div>
            <button
              type="button"
              onClick={() => onToggle("isActive")}
              className={`w-12 h-6 rounded-full p-1 transition-all ${formData.isActive ? "bg-green-500 shadow-lg shadow-green-500/20" : "bg-gray-300"}`}
            >
              <div className={`w-4 h-4 bg-white rounded-full transition-all ${formData.isActive ? "translate-x-6" : ""}`} />
            </button>
          </div>

          <div className="flex items-center justify-between p-6 bg-[#F4F7FF] rounded-[24px] border border-transparent hover:border-blue-100 transition-all shadow-sm">
            <div>
              <p className="text-base font-black text-[#1A1A2E]">Cá nhân hóa</p>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Tùy chỉnh</p>
            </div>
            <button
              type="button"
              onClick={() => onToggle("isPersonalizable")}
              className={`w-12 h-6 rounded-full p-1 transition-all ${formData.isPersonalizable ? "bg-[#17409A] shadow-lg shadow-[#17409A]/20" : "bg-gray-300"}`}
            >
              <div className={`w-4 h-4 bg-white rounded-full transition-all ${formData.isPersonalizable ? "translate-x-6" : ""}`} />
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="bg-white rounded-[32px] p-8 shadow-sm border border-white/50 space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-[16px] bg-orange-50 flex items-center justify-center text-orange-600">
            <MdAttachMoney className="text-2xl" />
          </div>
          <h2 className="text-2xl font-black text-[#1A1A2E]">Giá bán</h2>
        </div>
        <div className="space-y-3">
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={onPriceChange}
            className="w-full bg-[#F4F7FF] rounded-[16px] px-6 py-4 text-xl font-black text-[#17409A] outline-none border-2 border-transparent focus:border-[#17409A]/30 transition-all shadow-inner"
          />
        </div>
      </section>

      {/* Classification Section */}
      <section className="bg-white rounded-[32px] p-8 shadow-sm border border-white/50 space-y-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-[16px] bg-teal-50 flex items-center justify-center text-teal-600">
            <MdCategory className="text-2xl" />
          </div>
          <h2 className="text-2xl font-black text-[#1A1A2E]">Phân loại</h2>
        </div>

        <div className="space-y-8">
          <div className="space-y-3">
            <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-2">Danh mục</label>
            <div className="flex flex-wrap gap-3">
              {categories.map(cat => (
                <button
                  key={cat.categoryId}
                  type="button"
                  onClick={() => onMultiSelect("categoryIds", cat.categoryId)}
                  className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all shadow-sm ${
                    formData.categoryIds.includes(cat.categoryId)
                      ? "bg-[#17409A] text-white"
                      : "bg-[#F4F7FF] text-gray-400"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4 pt-6 border-t border-gray-50">
            <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-2">Phụ kiện</label>
            <div className="grid grid-cols-1 gap-3">
              {accessoriesList.map(acc => {
                const isSelected = formData.accessoryIds.includes(acc.accessoryId);
                return (
                  <button
                    key={acc.accessoryId}
                    type="button"
                    onClick={() => onMultiSelect("accessoryIds", acc.accessoryId)}
                    className={`p-3 rounded-[20px] border-2 transition-all flex items-center gap-4 shadow-sm ${
                      isSelected
                        ? "bg-teal-50 border-teal-500 shadow-teal-500/10"
                        : "bg-white border-gray-100 hover:border-teal-200"
                    }`}
                  >
                    <div className="w-12 h-12 rounded-xl bg-[#F4F7FF] overflow-hidden border border-gray-100 flex items-center justify-center shrink-0">
                      {acc.imageUrl ? (
                        <img src={acc.imageUrl} className="w-full h-full object-contain" />
                      ) : (
                        <MdImage className="text-xl text-gray-200" />
                      )}
                    </div>
                    <div className="text-left">
                      <p className={`text-[10px] font-black uppercase tracking-wider ${isSelected ? "text-teal-600" : "text-gray-400"}`}>
                        {acc.name}
                      </p>
                    </div>
                    {isSelected && <MdCheckCircle className="ml-auto text-teal-500 text-xl" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
