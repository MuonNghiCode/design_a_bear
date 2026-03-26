import { useState } from "react";
import { MdClose } from "react-icons/md";
import type { CreateProductRequest } from "@/types";
import CustomDropdown from "@/components/shared/CustomDropdown";

interface Props {
  onClose: () => void;
  onSubmit: (payload: CreateProductRequest) => Promise<boolean>;
  isSubmitting: boolean;
}

export default function CreateProductModal({
  onClose,
  onSubmit,
  isSubmitting,
}: Props) {
  const [formData, setFormData] = useState({
    name: "",
    productType: "COMPLETE_BEAR",
    description: "",
    model3DUrl: "",
    isPersonalizable: false,
    isActive: true,
    price: "",
    variantName: "Mặc định",
    imageUrl: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;

    if (name === "price") {
      // Remove non-digit characters to get raw number
      const rawValue = value.replace(/\D/g, "");
      setFormData((prev) => ({ ...prev, [name]: rawValue }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const autoSku = `SKU-${Date.now()}`;
    const payload: CreateProductRequest = {
      name: formData.name,
      slug: formData.name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, ""),
      productType: formData.productType,
      description: formData.description,
      model3DUrl: formData.model3DUrl,
      isPersonalizable: formData.isPersonalizable,
      isActive: formData.isActive,
      categoryIds: [],
      characterIds: [],
      variants: [
        {
          sku: autoSku,
          variantName: formData.variantName || "Mặc định",
          price: Number(formData.price) || 0,
          currency: "VND",
          imageUrl: formData.imageUrl,
        },
      ],
      media: formData.imageUrl
        ? [
            {
              url: formData.imageUrl,
              altText: formData.name,
              sortOrder: 1,
            },
          ]
        : [],
    };

    const success = await onSubmit(payload);
    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div className="relative bg-[#F4F7FF] rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300">
        <div className="px-6 py-5 border-b border-white/50 bg-white/50 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-xl font-black text-[#1A1A2E]">
              Thêm mới sản phẩm
            </h2>
            <p className="text-xs font-semibold text-[#6B7280] mt-0.5">
              Nhập thông tin cơ bản cho sản phẩm mới
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-xl bg-white text-[#9CA3AF] hover:text-[#1A1A2E] shadow-sm hover:shadow-md transition-all"
          >
            <MdClose className="text-xl" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar">
          <form
            id="createProductForm"
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-[#6B7280] tracking-wide uppercase">
                  Tên sản phẩm *
                </label>
                <input
                  required
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Vd: Gấu Nâu Dudu"
                  className="w-full bg-white text-sm font-semibold text-[#1A1A2E] rounded-xl px-4 py-3 outline-none border-2 border-transparent focus:border-[#17409A]/20 transition-all shadow-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-[#6B7280] tracking-wide uppercase">
                  Loại sản phẩm *
                </label>
                <CustomDropdown
                  options={[
                    {
                      label: "Gấu hoàn chỉnh (Complete Bear)",
                      value: "COMPLETE_BEAR",
                    },
                    { label: "Thân gấu (Base Bear)", value: "BASE_BEAR" },
                    { label: "Phụ kiện (Accessory)", value: "ACCESSORY" },
                  ]}
                  value={formData.productType}
                  onChange={(nextType) =>
                    setFormData((prev) => ({ ...prev, productType: nextType }))
                  }
                  buttonClassName="w-full bg-white text-sm font-semibold text-[#1A1A2E] rounded-xl px-4 py-3 outline-none border-2 border-transparent focus:border-[#17409A]/20 transition-all shadow-sm flex items-center justify-between"
                  chevronClassName="text-[#9CA3AF] transition-transform"
                  menuClassName="absolute z-30 mt-2 w-full rounded-xl border border-[#E5E7EB] bg-white shadow-xl py-1"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-[#6B7280] tracking-wide uppercase">
                  Giá bán (VNĐ) *
                </label>
                <input
                  required
                  type="text"
                  name="price"
                  value={
                    formData.price
                      ? Number(formData.price).toLocaleString("vi-VN")
                      : ""
                  }
                  onChange={handleChange}
                  placeholder="Vd: 450.000"
                  className="w-full bg-white text-sm font-semibold text-[#1A1A2E] rounded-xl px-4 py-3 outline-none border-2 border-transparent focus:border-[#17409A]/20 transition-all shadow-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-[#6B7280] tracking-wide uppercase">
                  Tên phiên bản
                </label>
                <input
                  name="variantName"
                  value={formData.variantName}
                  onChange={handleChange}
                  placeholder="Vd: Mặc định, Phiên bản đặc biệt..."
                  className="w-full bg-white text-sm font-semibold text-[#1A1A2E] rounded-xl px-4 py-3 outline-none border-2 border-transparent focus:border-[#17409A]/20 transition-all shadow-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-[#6B7280] tracking-wide uppercase">
                  Link Hình ảnh (URL)
                </label>
                <input
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="w-full bg-white text-sm font-semibold text-[#1A1A2E] rounded-xl px-4 py-3 outline-none border-2 border-transparent focus:border-[#17409A]/20 transition-all shadow-sm"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-[#6B7280] tracking-wide uppercase">
                Mô tả chi tiết
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Nhập mô tả cho sản phẩm này..."
                rows={3}
                className="w-full bg-white text-sm font-semibold text-[#1A1A2E] rounded-xl px-4 py-3 outline-none border-2 border-transparent focus:border-[#17409A]/20 transition-all shadow-sm resize-none"
              />
            </div>

            <div className="flex items-center gap-6 pt-2">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="w-4 h-4 rounded text-[#17409A] focus:ring-[#17409A]"
                />
                <span className="text-sm font-bold text-[#1A1A2E] group-hover:text-[#17409A] transition-colors">
                  Đang bán (Active)
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  name="isPersonalizable"
                  checked={formData.isPersonalizable}
                  onChange={handleChange}
                  className="w-4 h-4 rounded text-[#7C5CFC] focus:ring-[#7C5CFC]"
                />
                <span className="text-sm font-bold text-[#1A1A2E] group-hover:text-[#7C5CFC] transition-colors">
                  Có thể Gắn Phụ kiện / Voice
                </span>
              </label>
            </div>
          </form>
        </div>

        <div className="px-6 py-4 bg-white shrink-0 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-6 py-3 rounded-2xl text-sm font-bold text-[#6B7280] bg-[#F4F7FF] hover:bg-[#E5E7EB] transition-colors disabled:opacity-50"
          >
            Hủy bỏ
          </button>
          <button
            type="submit"
            form="createProductForm"
            disabled={isSubmitting}
            className="px-8 py-3 rounded-2xl text-sm font-bold text-white bg-[#17409A] hover:bg-[#0E2A66] shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {isSubmitting ? "Đang lưu..." : "Lưu sản phẩm"}
          </button>
        </div>
      </div>
    </div>
  );
}
