"use client";

import React from "react";
import { MdLayers, MdAdd, MdDelete, MdKeyboardArrowDown } from "react-icons/md";

interface VariantsSectionProps {
  variants: any[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onUpdate: (index: number, field: string, value: any) => void;
}

export const VariantsSection = ({
  variants,
  onAdd,
  onRemove,
  onUpdate
}: VariantsSectionProps) => {
  return (
    <section className="bg-white rounded-[32px] p-8 shadow-sm border border-white/50 space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-[16px] bg-indigo-50 flex items-center justify-center text-indigo-600">
            <MdLayers className="text-2xl" />
          </div>
          <h2 className="text-2xl font-black text-[#1A1A2E]">Biến thể</h2>
        </div>
        <button
          type="button"
          onClick={onAdd}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-50 text-indigo-600 text-[11px] font-black uppercase tracking-widest hover:bg-indigo-100 transition-all shadow-sm"
        >
          <MdAdd className="text-xl" /> Thêm biến thể
        </button>
      </div>

      <div className="space-y-4">
        {variants?.map((v, idx) => (
          <div key={idx} className="p-8 bg-[#F4F7FF] rounded-[24px] border border-white space-y-6 shadow-sm">
            <div className="flex justify-between items-center pb-3 border-b border-white/50">
              <h3 className="text-sm font-black text-[#1A1A2E] uppercase tracking-widest">Biến thể #{idx + 1}</h3>
              <button
                type="button"
                onClick={() => onRemove(idx)}
                className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all"
              >
                <MdDelete className="text-lg" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Mã SKU</label>
                <input
                  value={v.sku}
                  onChange={(e) => onUpdate(idx, "sku", e.target.value)}
                  className="w-full bg-white rounded-xl px-5 py-3 text-sm font-bold text-[#1A1A2E] outline-none shadow-sm"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Giá bán</label>
                <input
                  type="number"
                  value={v.price}
                  onChange={(e) => onUpdate(idx, "price", Number(e.target.value))}
                  className="w-full bg-white rounded-xl px-5 py-3 text-base font-black text-[#17409A] outline-none shadow-sm"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Kích cỡ</label>
                <div className="relative">
                  <select
                    value={v.sizeTag}
                    onChange={(e) => onUpdate(idx, "sizeTag", e.target.value)}
                    className="w-full bg-white rounded-xl px-5 py-3 text-sm font-bold outline-none shadow-sm appearance-none cursor-pointer pr-10"
                  >
                    <option value="XS">XS</option>
                    <option value="S">S</option>
                    <option value="M">M</option>
                    <option value="L">L</option>
                    <option value="XL">XL</option>
                    <option value="OS">OS</option>
                  </select>
                  <MdKeyboardArrowDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl pointer-events-none" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Số lượng</label>
                <input
                  type="number"
                  value={v.stockQuantity}
                  onChange={(e) => onUpdate(idx, "stockQuantity", Number(e.target.value))}
                  className="w-full bg-white rounded-xl px-5 py-3 text-sm font-bold outline-none shadow-sm"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
