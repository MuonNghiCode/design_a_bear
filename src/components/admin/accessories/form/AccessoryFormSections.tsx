"use client";

import { MdInventory, MdLink, MdTextFields, MdAttachMoney, MdCloudUpload, MdImage, MdDelete } from "react-icons/md";

interface AccessoryFormData {
  name: string;
  sku: string;
  description: string;
  imageUrl: string;
  baseCost: number;
  assemblyCost: number;
  targetPrice: number;
  stockQuantity: number;
  isActive: boolean;
}

interface AccessoryBasicInfoProps {
  formData: AccessoryFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: () => void;
  isUploading: boolean;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  isEdit?: boolean;
}

export function AccessoryBasicInfo({ 
  formData, 
  onChange, 
  onUpload, 
  onRemoveImage, 
  isUploading, 
  fileInputRef, 
  isEdit 
}: AccessoryBasicInfoProps) {
  return (
    <div className="bg-white rounded-[32px] p-8 border border-[#F4F7FF] shadow-sm space-y-8">
      <div className="flex items-center gap-3 pb-2 border-b border-[#F4F7FF]">
        <div className="w-10 h-10 rounded-2xl bg-[#17409A]/10 flex items-center justify-center text-[#17409A]">
          <MdTextFields className="text-xl" />
        </div>
        <h2 className="text-lg font-black text-[#1A1A2E] font-fredoka uppercase tracking-wider">Thông tin cơ bản</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-[11px] font-black text-[#9CA3AF] uppercase tracking-widest ml-1">Tên phụ kiện</label>
          <input
            name="name"
            value={formData.name}
            onChange={onChange}
            placeholder="VD: Nón bảo hiểm mini"
            className="w-full px-6 py-4 bg-[#F4F7FF] border-2 border-transparent rounded-2xl focus:bg-white focus:border-[#17409A]/20 transition-all outline-none font-bold text-[#1A1A2E]"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-[11px] font-black text-[#9CA3AF] uppercase tracking-widest ml-1">Mã SKU</label>
          <input
            name="sku"
            value={formData.sku}
            onChange={onChange}
            placeholder="VD: ACC-HELMET-01"
            readOnly={isEdit}
            className={`w-full px-6 py-4 bg-[#F4F7FF] border-2 border-transparent rounded-2xl focus:bg-white focus:border-[#17409A]/20 transition-all outline-none font-bold text-[#1A1A2E] ${isEdit ? "opacity-50 cursor-not-allowed" : ""}`}
            required
          />
        </div>

        <div className="md:col-span-2 space-y-2">
          <label className="text-[11px] font-black text-[#9CA3AF] uppercase tracking-widest ml-1">Mô tả</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={onChange}
            rows={4}
            placeholder="Mô tả chi tiết về phụ kiện..."
            className="w-full px-6 py-4 bg-[#F4F7FF] border-2 border-transparent rounded-2xl focus:bg-white focus:border-[#17409A]/20 transition-all outline-none font-bold text-[#1A1A2E] resize-none"
          />
        </div>
      </div>

      {/* Image Upload Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-black text-[#9CA3AF] uppercase tracking-widest ml-1">Hình ảnh phụ kiện</label>
          <div className="flex gap-2">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={onUpload}
            />
            <button
              type="button"
              disabled={isUploading}
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#17409A]/10 text-[#17409A] text-[11px] font-black uppercase tracking-widest hover:bg-[#17409A]/20 transition-all disabled:opacity-50"
            >
              <MdCloudUpload className="text-xl" /> {isUploading ? "Đang tải..." : "Tải ảnh lên"}
            </button>
          </div>
        </div>

        {formData.imageUrl ? (
          <div className="relative w-full aspect-video md:aspect-[21/9] rounded-[24px] overflow-hidden bg-[#F4F7FF] border-2 border-dashed border-[#F4F7FF] flex items-center justify-center group">
            <img src={formData.imageUrl} className="max-w-full max-h-full object-contain p-4" alt="Accessory Preview" />
            <button
              type="button"
              onClick={onRemoveImage}
              className="absolute top-4 right-4 p-3 rounded-2xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100 shadow-lg"
            >
              <MdDelete className="text-xl" />
            </button>
          </div>
        ) : (
          <div className="w-full aspect-video md:aspect-[21/9] rounded-[32px] border-2 border-dashed border-[#F4F7FF] flex flex-col items-center justify-center gap-4 text-gray-300">
            <MdImage className="text-6xl opacity-20" />
            <p className="text-sm font-black uppercase tracking-widest">Chưa có ảnh</p>
          </div>
        )}

        <div className="space-y-2">
          <label className="text-[10px] font-black text-gray-300 uppercase tracking-widest ml-1">Hoặc nhập URL trực tiếp</label>
          <div className="relative group">
            <MdLink className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 text-xl group-focus-within:text-[#17409A] transition-colors" />
            <input
              name="imageUrl"
              value={formData.imageUrl}
              onChange={onChange}
              placeholder="https://example.com/image.jpg"
              className="w-full pl-14 pr-6 py-4 bg-[#F4F7FF]/50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-[#17409A]/20 transition-all outline-none font-bold text-[#1A1A2E] text-xs"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export function AccessoryInventoryInfo({ formData, onChange }: { formData: AccessoryFormData, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
  return (
    <div className="bg-white rounded-[32px] p-8 border border-[#F4F7FF] shadow-sm space-y-8">
      <div className="flex items-center gap-3 pb-2 border-b border-[#F4F7FF]">
        <div className="w-10 h-10 rounded-2xl bg-[#FF8C42]/10 flex items-center justify-center text-[#FF8C42]">
          <MdInventory className="text-xl" />
        </div>
        <h2 className="text-lg font-black text-[#1A1A2E] font-fredoka uppercase tracking-wider">Kho & Giá</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-[11px] font-black text-[#9CA3AF] uppercase tracking-widest ml-1">Số lượng tồn kho</label>
          <input
            type="number"
            name="stockQuantity"
            value={formData.stockQuantity}
            onChange={onChange}
            className="w-full px-6 py-4 bg-[#F4F7FF] border-2 border-transparent rounded-2xl focus:bg-white focus:border-[#17409A]/20 transition-all outline-none font-bold text-[#1A1A2E]"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[11px] font-black text-[#9CA3AF] uppercase tracking-widest ml-1">Giá bán dự kiến</label>
          <div className="relative group">
            <MdAttachMoney className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 text-xl group-focus-within:text-[#17409A] transition-colors" />
            <input
              type="number"
              name="targetPrice"
              value={formData.targetPrice}
              onChange={onChange}
              className="w-full pl-14 pr-6 py-4 bg-[#F4F7FF] border-2 border-transparent rounded-2xl focus:bg-white focus:border-[#17409A]/20 transition-all outline-none font-bold text-[#1A1A2E]"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[11px] font-black text-[#9CA3AF] uppercase tracking-widest ml-1">Chi phí cơ bản (Base Cost)</label>
          <input
            type="number"
            name="baseCost"
            value={formData.baseCost}
            onChange={onChange}
            className="w-full px-6 py-4 bg-[#F4F7FF] border-2 border-transparent rounded-2xl focus:bg-white focus:border-[#17409A]/20 transition-all outline-none font-bold text-[#1A1A2E]"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[11px] font-black text-[#9CA3AF] uppercase tracking-widest ml-1">Chi phí lắp ráp (Assembly Cost)</label>
          <input
            type="number"
            name="assemblyCost"
            value={formData.assemblyCost}
            onChange={onChange}
            className="w-full px-6 py-4 bg-[#F4F7FF] border-2 border-transparent rounded-2xl focus:bg-white focus:border-[#17409A]/20 transition-all outline-none font-bold text-[#1A1A2E]"
          />
        </div>
      </div>
    </div>
  );
}
