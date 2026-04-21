"use client";

import { useState, useEffect } from "react";
import { MdClose, MdCloudUpload } from "react-icons/md";
import { accessoryService } from "@/services/accessory.service";
import { mediaService } from "@/services/media.service";
import { useTaxonomyApi } from "@/hooks";
import { useToast } from "@/contexts/ToastContext";
import CustomDropdown from "@/components/shared/CustomDropdown";

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
  const { categories, fetchTaxonomy } = useTaxonomyApi();
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    sku: "",
    price: "",
    weightGram: "100",
    imageUrl: "",
    categoryId: "",
  });

  useEffect(() => {
    fetchTaxonomy();
    loadAccessory();
  }, [accessoryId, fetchTaxonomy]);

  const loadAccessory = async () => {
    try {
      const res = await accessoryService.getById(accessoryId);
      if (res.isSuccess && res.value) {
        const a = res.value;
        setFormData({
          name: a.name || "",
          description: a.description || "",
          sku: a.sku || "",
          price: (a.targetPrice || 0).toString(),
          weightGram: (a.weightGram || 0).toString(),
          imageUrl: a.imageUrl || "",
          categoryId: a.categoryIds?.[0] || "",
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
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
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
      const res = await accessoryService.update(accessoryId, {
        ...formData,
        targetPrice: Number(formData.price),
        weightGram: Number(formData.weightGram),
      } as any);

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

          <div className="space-y-1.5">
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-[#6B7280] uppercase">
                Giá (VND) *
              </label>
              <input
                required
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full bg-white text-sm font-semibold rounded-xl px-4 py-3 outline-none border-2 border-transparent focus:border-[#17409A]/20 shadow-sm"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-[#6B7280] uppercase">
                SKU *
              </label>
              <input
                required
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                className="w-full bg-white text-sm font-semibold rounded-xl px-4 py-3 outline-none border-2 border-transparent focus:border-[#17409A]/20 shadow-sm"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-black text-[#6B7280] uppercase">
              Danh mục *
            </label>
            <CustomDropdown
              options={categories.map((c) => ({
                label: c.name,
                value: c.categoryId,
              }))}
              value={formData.categoryId}
              onChange={(v) => setFormData((p) => ({ ...p, categoryId: v }))}
              buttonClassName="w-full bg-white text-sm font-semibold p-3 rounded-xl border-2 border-transparent shadow-sm flex justify-between items-center"
            />
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
            disabled={isSubmitting || !formData.imageUrl}
            className="px-8 py-3 rounded-2xl text-sm font-bold text-white bg-[#17409A] hover:bg-[#0E2A66] shadow-lg disabled:opacity-50"
          >
            {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        </div>
      </div>
    </div>
  );
}
