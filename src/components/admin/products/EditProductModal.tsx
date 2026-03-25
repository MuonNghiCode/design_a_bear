import { useState, useEffect } from "react";
import { MdClose } from "react-icons/md";
import type { UpdateProductRequest } from "@/types/requests";
import { productService } from "@/services/product.service";

interface Props {
  productId: string;
  onClose: () => void;
  onSubmit: (payload: UpdateProductRequest) => Promise<boolean>;
  isSubmitting: boolean;
}

export default function EditProductModal({ productId, onClose, onSubmit, isSubmitting }: Props) {
  const [isFetching, setIsFetching] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    productType: "COMPLETE_BEAR",
    description: "",
    model3DUrl: "",
    isPersonalizable: false,
    isActive: true,
    price: "",
    sku: "",
    imageUrl: "",
  });

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setIsFetching(true);
        const res = await productService.getProductById(productId);
        if (mounted && res && res.isSuccess && res.value) {
          const p = res.value;
          const defaultVariant = p.variants?.[0];
          const defaultMedia = p.media?.[0];

          setFormData({
            name: p.name || "",
            slug: p.slug || "",
            productType: p.productType || "COMPLETE_BEAR",
            description: p.description || "",
            model3DUrl: p.model3DUrl || "",
            isPersonalizable: p.isPersonalizable || false,
            isActive: p.isActive,
            price: defaultVariant?.price?.toString() || "",
            sku: defaultVariant?.sku || "",
            imageUrl: defaultMedia?.url || "",
          });
        }
      } catch (err) {
        console.error("Failed to load product details", err);
      } finally {
        if (mounted) setIsFetching(false);
      }
    })();
    return () => { mounted = false; };
  }, [productId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const target = e.target;
    setFormData((prev) => ({
      ...prev,
      [target.name]: target.type === "checkbox" ? (target as HTMLInputElement).checked : target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: UpdateProductRequest = {
      name: formData.name,
      slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-'),
      productType: formData.productType,
      description: formData.description,
      model3DUrl: formData.model3DUrl,
      isPersonalizable: formData.isPersonalizable,
      isActive: formData.isActive,
      categoryIds: [],
      characterIds: [],
      variants: [
        {
          sku: formData.sku || "SKU-DEFAULT",
          variantName: "Mặc định",
          price: Number(formData.price) || 0,
          currency: "VND",
          imageUrl: formData.imageUrl,
        }
      ],
      media: formData.imageUrl ? [
        {
          url: formData.imageUrl,
          altText: formData.name,
          sortOrder: 1,
        }
      ] : []
    };
    
    const ok = await onSubmit(payload);
    if (ok) {
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
            <h2 className="text-xl font-black text-[#1A1A2E]">Chỉnh sửa sản phẩm</h2>
            <p className="text-xs font-semibold text-[#6B7280] mt-0.5">Cập nhật thông tin chi tiết</p>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-xl bg-white text-[#9CA3AF] hover:text-[#1A1A2E] shadow-sm hover:shadow-md transition-all"
          >
            <MdClose className="text-xl" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar relative">
          {isFetching ? (
            <div className="h-64 flex flex-col items-center justify-center gap-3">
              <div className="w-8 h-8 border-4 border-[#17409A]/20 border-t-[#17409A] rounded-full animate-spin" />
              <p className="text-sm font-semibold text-[#6B7280]">Đang tải dữ liệu gốc...</p>
            </div>
          ) : (
            <form id="editProductForm" onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-[#6B7280] tracking-wide uppercase">Tên sản phẩm *</label>
                  <input 
                    required
                    name="name" value={formData.name} onChange={handleChange}
                    className="w-full bg-white text-sm font-semibold text-[#1A1A2E] rounded-xl px-4 py-3 outline-none border-2 border-transparent focus:border-[#17409A]/20 transition-all shadow-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-[#6B7280] tracking-wide uppercase">Alias (Slug)</label>
                  <input 
                    name="slug" value={formData.slug} onChange={handleChange}
                    className="w-full bg-white text-sm font-semibold text-[#1A1A2E] rounded-xl px-4 py-3 outline-none border-2 border-transparent focus:border-[#17409A]/20 transition-all shadow-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-[#6B7280] tracking-wide uppercase">Loại sản phẩm *</label>
                  <select
                    name="productType" value={formData.productType} onChange={handleChange}
                    className="w-full bg-white text-sm font-semibold text-[#1A1A2E] rounded-xl px-4 py-3 outline-none border-2 border-transparent focus:border-[#17409A]/20 transition-all shadow-sm cursor-pointer"
                  >
                    <option value="COMPLETE_BEAR">Gấu hoàn chỉnh (Complete Bear)</option>
                    <option value="BASE_BEAR">Thân gấu (Base Bear)</option>
                    <option value="ACCESSORY">Phụ kiện (Accessory)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-[#6B7280] tracking-wide uppercase">Giá bán (VNĐ) *</label>
                  <input 
                    required type="number" min="0" step="1000"
                    name="price" value={formData.price} onChange={handleChange}
                    className="w-full bg-white text-sm font-semibold text-[#1A1A2E] rounded-xl px-4 py-3 outline-none border-2 border-transparent focus:border-[#17409A]/20 transition-all shadow-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-[#6B7280] tracking-wide uppercase">Mã SKU</label>
                  <input 
                    name="sku" value={formData.sku} onChange={handleChange}
                    className="w-full bg-white text-sm font-semibold text-[#1A1A2E] rounded-xl px-4 py-3 outline-none border-2 border-transparent focus:border-[#17409A]/20 transition-all shadow-sm"
                  />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-[#6B7280] tracking-wide uppercase">Link Hình ảnh (URL)</label>
                  <input 
                    name="imageUrl" value={formData.imageUrl} onChange={handleChange}
                    className="w-full bg-white text-sm font-semibold text-[#1A1A2E] rounded-xl px-4 py-3 outline-none border-2 border-transparent focus:border-[#17409A]/20 transition-all shadow-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-[#6B7280] tracking-wide uppercase">Mô tả chi tiết</label>
                <textarea 
                  name="description" value={formData.description} onChange={handleChange}
                  rows={3}
                  className="w-full bg-white text-sm font-semibold text-[#1A1A2E] rounded-xl px-4 py-3 outline-none border-2 border-transparent focus:border-[#17409A]/20 transition-all shadow-sm resize-none"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input 
                    type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange}
                    className="w-4 h-4 rounded text-[#17409A] focus:ring-[#17409A]" 
                  />
                  <span className="text-sm font-bold text-[#1A1A2E] group-hover:text-[#17409A] transition-colors">Đang bán (Active)</span>
                </label>
                
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input 
                    type="checkbox" name="isPersonalizable" checked={formData.isPersonalizable} onChange={handleChange}
                    className="w-4 h-4 rounded text-[#7C5CFC] focus:ring-[#7C5CFC]" 
                  />
                  <span className="text-sm font-bold text-[#1A1A2E] group-hover:text-[#7C5CFC] transition-colors">Có thể Gắn Phụ kiện / Voice</span>
                </label>
              </div>
            </form>
          )}
        </div>

        <div className="px-6 py-4 bg-white shrink-0 flex items-center justify-end gap-3 transition-opacity">
          <button 
            type="button" 
            onClick={onClose}
            disabled={isSubmitting || isFetching}
            className="px-6 py-3 rounded-2xl text-sm font-bold text-[#6B7280] bg-[#F4F7FF] hover:bg-[#E5E7EB] transition-colors disabled:opacity-50"
          >
            Hủy bỏ
          </button>
          <button 
            type="submit" 
            form="editProductForm"
            disabled={isSubmitting || isFetching}
            className="px-8 py-3 rounded-2xl text-sm font-bold text-white bg-[#17409A] hover:bg-[#0E2A66] shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        </div>
      </div>
    </div>
  );
}
