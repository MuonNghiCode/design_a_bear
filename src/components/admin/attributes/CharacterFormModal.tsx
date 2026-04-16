"use client";

import { MdClose, MdAutorenew } from "react-icons/md";
import type { CharacterItem } from "@/types";
import { generateSlug } from "@/utils/string";

interface CharacterFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingChar: CharacterItem | null;
  formData: {
    name: string;
    slug: string;
    licenseBrand: string;
  };
  onFormDataChange: (data: {
    name: string;
    slug: string;
    licenseBrand: string;
  }) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  isProcessing: boolean;
}

export default function CharacterFormModal({
  isOpen,
  onClose,
  editingChar,
  formData,
  onFormDataChange,
  onSubmit,
  isProcessing,
}: CharacterFormModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#F4F7FF]">
          <h3 className="text-xl font-black text-[#1A1A2E]">
            {editingChar ? "Cập nhật Tính cách" : "Tạo Tính cách mới"}
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F4F7FF] flex items-center justify-center text-[#6B7280] hover:text-[#1A1A2E] hover:bg-[#E5E7EB] transition-colors"
          >
            <MdClose className="text-xl" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="p-6 space-y-5">
          {/* Name Input */}
          <div>
            <label className="block text-xs font-black text-[#9CA3AF] uppercase tracking-wider mb-2">
              Tên Tính cách *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => {
                const newName = e.target.value;
                onFormDataChange({
                  ...formData,
                  name: newName,
                  slug: generateSlug(newName),
                });
              }}
              className="w-full bg-[#F4F7FF] text-[#1A1A2E] font-bold px-4 py-3 rounded-xl border border-transparent focus:border-[#17409A] focus:bg-white focus:outline-none transition-all"
              placeholder="Nhập tên..."
            />
          </div>

          {/* License Brand Input */}
          <div>
            <label className="block text-xs font-black text-[#9CA3AF] uppercase tracking-wider mb-2">
              License Brand (Tùy chọn)
            </label>
            <input
              type="text"
              value={formData.licenseBrand}
              onChange={(e) =>
                onFormDataChange({
                  ...formData,
                  licenseBrand: e.target.value,
                })
              }
              className="w-full bg-[#F4F7FF] text-[#1A1A2E] font-bold px-4 py-3 rounded-xl border border-transparent focus:border-[#17409A] focus:bg-white focus:outline-none transition-all"
              placeholder="Ví dụ: Disney, Sanrio..."
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-4 rounded-xl font-black text-white bg-[#17409A] hover:bg-[#112D6E] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <MdAutorenew className="animate-spin text-xl" />
              ) : null}
              {editingChar ? "LƯU THAY ĐỔI" : "TẠO MỚI"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
