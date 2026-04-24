"use client";

import { useState, useEffect } from "react";
import { MdClose, MdCloudUpload } from "react-icons/md";
import { accessoryService } from "@/services/accessory.service";
import { mediaService } from "@/services/media.service";
import { useToast } from "@/contexts/ToastContext";
import type { UpdateAccessoryRequest } from "@/types";
import { generateSku } from "@/utils/string";

interface Props {
  accessoryId: string;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function EditAccessoryModal({
  accessoryId,
  onClose,
  onSuccess,
}: Props) {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    sku: "",
    targetPrice: "0",
    baseCost: "0",
    assemblyCost: "0",
    stockQuantity: "0",
    imageUrl: "",
    isActive: true,
  });

  useEffect(() => {
    loadAccessory();
  }, [accessoryId]);

  const loadAccessory = async () => {
    try {
      const res = await accessoryService.getById(accessoryId);
      if (res.isSuccess && res.value) {
        const a = res.value;
        setFormData({
          name: a.name || "",
          description: a.description || "",
          sku: a.sku || "",
          targetPrice: (a.targetPrice || 0).toString(),
          baseCost: (a.baseCost || 0).toString(),
          assemblyCost: (a.assemblyCost || 0).toString(),
          stockQuantity: (a.available || 0).toString(),
          imageUrl: a.imageUrl || "",
          isActive: a.isActive ?? true,
        });
      }
    } catch (err) {
      toast.error("Không thể tải thông tin phụ kiện");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newData = { ...prev, [name]: value };
      if (name === "name") {
        newData.sku = generateSku(value);
      }
      return newData;
    });
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const res = await mediaService.uploadMedia(file, "accessories");
      if (res.isSuccess && res.value?.publicUrl) {
        setFormData((prev) => ({ ...prev, imageUrl: res.value!.publicUrl! }));
        toast.success("Tải ảnh lên thành công");
      }
    } catch (err) {
      toast.error("Lỗi upload ảnh");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload: UpdateAccessoryRequest = {
        name: formData.name,
        sku: formData.sku,
        description: formData.description,
        imageUrl: formData.imageUrl,
        targetPrice: Number(formData.targetPrice),
        baseCost: Number(formData.baseCost),
        assemblyCost: Number(formData.assemblyCost),
        stockQuantity: Number(formData.stockQuantity),
        isActive: formData.isActive,
      };

      const res = await accessoryService.update(accessoryId, payload);

      if (res.isSuccess) {
        toast.success("Cập nhật phụ kiện thành công!");
        onSuccess?.();
        onClose();
      } else {
        toast.error(res.error?.description || "Cập nhật thất bại");
      }
    } catch (err) {
      toast.error("Có lỗi xảy ra");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-[#F4F7FF] rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300">
        <div className="px-6 py-5 border-b border-white/50 bg-white/50 flex items-center justify-between">
          <h2 className="text-xl font-black text-[#1A1A2E]">
            Chỉnh sửa phụ kiện
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-xl bg-white text-[#9CA3AF] hover:text-[#1A1A2E] shadow-sm transition-all"
          >
            <MdClose className="text-xl" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-5 overflow-y-auto max-h-[70vh] custom-scrollbar"
        >
          <div className="flex justify-center">
            <div className="relative group w-32 h-32 rounded-2xl bg-white border-2 border-dashed border-[#D7DEEF] flex flex-col items-center justify-center overflow-hidden">
              {formData.imageUrl ? (
                <img
                  src={formData.imageUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <>
                  <MdCloudUpload className="text-3xl text-[#6B7280]" />
                  <span className="text-[10px] font-bold text-[#6B7280] mt-1">
                    Ảnh phụ kiện
                  </span>
                </>
              )}
              <input
                type="file"
                onChange={handleUpload}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              {isUploading && (
                <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#17409A]" />
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5 flex-1">
              <label className="text-[11px] font-black text-[#6B7280] uppercase">
                Tên phụ kiện *
              </label>
              <input
                required
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-white text-sm font-semibold rounded-xl px-4 py-3 outline-none border-2 border-transparent focus:border-[#17409A]/20 shadow-sm"
              />
            </div>
            <div className="space-y-1.5 flex-1">
              <label className="text-[11px] font-black text-[#6B7280] uppercase">
                SKU *
              </label>
              <input
                required
                readOnly
                name="sku"
                value={formData.sku}
                className="w-full bg-gray-50 text-gray-500 text-sm font-semibold rounded-xl px-4 py-3 outline-none border-2 border-transparent shadow-sm cursor-not-allowed"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-[#6B7280] uppercase">
                Giá bán (VND) *
              </label>
              <input
                required
                type="number"
                name="targetPrice"
                value={formData.targetPrice}
                onChange={handleChange}
                className="w-full bg-white text-sm font-semibold rounded-xl px-4 py-3 outline-none border-2 border-transparent focus:border-[#17409A]/20 shadow-sm"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-[#6B7280] uppercase">
                Tồn kho hiện tại *
              </label>
              <input
                required
                readOnly
                type="number"
                name="stockQuantity"
                value={formData.stockQuantity}
                className="w-full bg-gray-50 text-gray-500 text-sm font-semibold rounded-xl px-4 py-3 outline-none border-2 border-transparent shadow-sm cursor-not-allowed"
              />
              <p className="text-[9px] text-[#9CA3AF] font-bold italic">
                * Chỉnh sửa tại phần Kho hàng
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-[#6B7280] uppercase">
                Giá vốn (VND)
              </label>
              <input
                type="number"
                name="baseCost"
                value={formData.baseCost}
                onChange={handleChange}
                className="w-full bg-white text-sm font-semibold rounded-xl px-4 py-3 outline-none border-2 border-transparent focus:border-[#17409A]/20 shadow-sm"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-[#6B7280] uppercase">
                Giá lắp ráp (VND)
              </label>
              <input
                type="number"
                name="assemblyCost"
                value={formData.assemblyCost}
                onChange={handleChange}
                className="w-full bg-white text-sm font-semibold rounded-xl px-4 py-3 outline-none border-2 border-transparent focus:border-[#17409A]/20 shadow-sm"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-black text-[#6B7280] uppercase">
              Mô tả
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full bg-white text-sm font-semibold p-4 rounded-xl shadow-sm outline-none focus:border-[#17409A]/20 resize-none"
            />
          </div>

          <div className="flex items-center gap-3 bg-white p-4 rounded-2xl shadow-sm border border-transparent hover:border-[#17409A]/10 transition-all">
            <div className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none bg-gray-200 cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={formData.isActive}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, isActive: e.target.checked }))
                }
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#17409A]"></div>
            </div>
            <span className="text-sm font-bold text-[#1A1A2E]">
              Phụ kiện đang hoạt động
            </span>
          </div>
        </form>

        <div className="p-6 bg-white border-t border-gray-100 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 rounded-2xl text-sm font-bold text-[#6B7280] bg-[#F4F7FF] hover:bg-[#E5E7EB]"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            disabled={
              isSubmitting ||
              !formData.imageUrl ||
              !formData.name ||
              !formData.sku
            }
            className="px-8 py-3 rounded-2xl text-sm font-bold text-white bg-[#17409A] hover:bg-[#0E2A66] shadow-lg disabled:opacity-50"
          >
            {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        </div>
      </div>
    </div>
  );
}
