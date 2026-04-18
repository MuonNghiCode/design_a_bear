import { useState, useEffect, useMemo } from "react";
import { MdClose, MdCloudUpload, MdOutlineAddPhotoAlternate } from "react-icons/md";
import type { CreateProductComboImageRequest, UpdateProductRequest } from "@/types/requests";
import { productService } from "@/services/product.service";
import CustomDropdown from "@/components/shared/CustomDropdown";
import { useTaxonomyApi } from "@/hooks";
import { useToast } from "@/contexts/ToastContext";
import { mediaService } from "@/services/media.service";
import { generateSlug } from "@/utils/string";
import type { PersonalizationRule, ProductComboImage } from "@/types/responses";

interface Props {
  productId: string;
  onClose: () => void;
  onSubmit: (payload: UpdateProductRequest) => Promise<boolean>;
  isSubmitting: boolean;
}

export default function EditProductModal({
  productId,
  onClose,
  onSubmit,
  isSubmitting,
}: Props) {
  const toast = useToast();
  const [isFetching, setIsFetching] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    productType: "BASE_BEAR",
    description: "",
    model3DUrl: "",
    isPersonalizable: false,
    isActive: true,
    imageUrl: "",
    price: "",
    sku: "",
    weightGram: "",
  });
  
  const [personalizationRules, setPersonalizationRules] = useState<PersonalizationRule[]>([]);
  const [comboImages, setComboImages] = useState<CreateProductComboImageRequest[]>([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [selectedCharacterIds, setSelectedCharacterIds] = useState<string[]>([]);
  
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [matrixUploadFiles, setMatrixUploadFiles] = useState<Record<string, File | null>>({});

  const {
    loading: taxonomyLoading,
    categories,
    characters,
    fetchTaxonomy,
  } = useTaxonomyApi();
  
  const isBaseBear = formData.productType === "BASE_BEAR";

  useEffect(() => {
    fetchTaxonomy();
  }, [fetchTaxonomy]);

  // Fetch product data and rules
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setIsFetching(true);
        const [productRes, rulesRes] = await Promise.all([
          productService.getProductById(productId),
          productService.getPersonalizationRules(productId)
        ]);

        if (mounted && productRes && productRes.isSuccess && productRes.value) {
          const p = productRes.value;
          const defaultMedia = p.media?.[0];

          setFormData({
            name: p.name || "",
            slug: p.slug || "",
            productType: p.productType,
            description: p.description || "",
            model3DUrl: p.model3DUrl || "",
            isPersonalizable: p.isPersonalizable || false,
            isActive: p.isActive,
            imageUrl: defaultMedia?.url || "",
            price: p.price?.toString() || "",
            sku: p.sku || "",
            weightGram: p.weightGram?.toString() || "",
          });

          setSelectedCategoryIds((p.categories || []).map((c) => c.categoryId));
          setSelectedCharacterIds((p.characters || []).map((c) => c.characterId));
          setComboImages(p.comboImages || []);
        }

        if (mounted && rulesRes && rulesRes.isSuccess && rulesRes.value) {
          setPersonalizationRules(rulesRes.value);
        }
      } catch (err) {
        console.error("Failed to load product details", err);
      } finally {
        if (mounted) setIsFetching(false);
      }
    })();
    return () => { mounted = false; };
  }, [productId]);

  // ── Combination Matrix Logic ──
  
  // Get all accessories from rules (strictly excluding AI_PROCESSOR for image matrix as per Backend Docs)
  const availableAccessories = useMemo(() => {
    if (!isBaseBear) return [];
    return personalizationRules
      .filter(rule => {
        const type = (rule.addonProduct.productType || "").toUpperCase();
        const name = (rule.addonProduct.name || "").toUpperCase();
        return type !== "AI_PROCESSOR" && !name.includes("AI PROCESSOR");
      })
      .map(rule => ({
        id: rule.addonProduct.productId,
        name: rule.addonProduct.name
      }));
  }, [personalizationRules, isBaseBear]);

  // Generate Power Set of combinations
  const allCombinations = useMemo(() => {
    const results: string[][] = [[]]; // Start with the empty set
    for (const acc of availableAccessories) {
      const currentLength = results.length;
      for (let i = 0; i < currentLength; i++) {
        results.push([...results[i], acc.id]);
      }
    }
    
    // EXCLUDE the empty set (Base Bear only) as per the 2^n - 1 requirement
    const combinations = results.filter(combo => combo.length > 0);
    
    return combinations.map(combo => ({
      key: combo.sort((a, b) => a.localeCompare(b)).join("|"),
      label: combo.map(id => availableAccessories.find(a => a.id === id)?.name).join(" + ")
    }));
  }, [availableAccessories]);

  // Ensure comboImages state has entries for all combinations
  useEffect(() => {
    if (allCombinations.length > 0) {
      setComboImages(prev => {
        const next = [...prev];
        allCombinations.forEach(combo => {
          if (!next.find(ci => ci.combinationKey === combo.key)) {
            next.push({ combinationKey: combo.key, imageUrl: "" });
          }
        });
        return next;
      });
    }
  }, [allCombinations]);

  const handleUploadImage = async () => {
    if (!uploadFile) return;
    setIsUploadingImage(true);
    try {
      const res = await mediaService.uploadMedia(uploadFile, "products");
      if (!res.isSuccess || !res.value?.publicUrl) throw new Error("Upload thất bại");
      setFormData(prev => ({ ...prev, imageUrl: res.value?.publicUrl || "" }));
      setUploadFile(null);
      toast.success("Upload ảnh thành công");
    } catch (err) {
      toast.error("Lỗi upload: " + (err instanceof Error ? err.message : ""));
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleUploadMatrixImage = async (key: string) => {
    const file = matrixUploadFiles[key];
    if (!file) return;
    setIsUploadingImage(true);
    try {
      const res = await mediaService.uploadMedia(file, "combos");
      if (!res.isSuccess || !res.value?.publicUrl) throw new Error("Upload thất bại");
      const url = res.value.publicUrl;
      setComboImages(prev => {
        const idx = prev.findIndex(ci => ci.combinationKey === key);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = { ...next[idx], imageUrl: url };
          return next;
        }
        return [...prev, { combinationKey: key, imageUrl: url }];
      });
      setMatrixUploadFiles(prev => ({ ...prev, [key]: null }));
      toast.success("Upload ảnh tổ hợp thành công");
    } catch (err) {
      toast.error("Lỗi upload: " + (err instanceof Error ? err.message : ""));
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => {
      const next = {
        ...prev,
        [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
      };
      
      // Auto-generate slug when name changes
      if (name === "name") {
        next.slug = generateSlug(value);
      }
      
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Matrix Validation
    if (isBaseBear && allCombinations.length > 0) {
      const missing = allCombinations.find(combo => {
        const ci = comboImages.find(x => x.combinationKey === combo.key);
        return !ci || !ci.imageUrl;
      });
      if (missing) {
        toast.error(`Thiếu ảnh cho tổ hợp: ${missing.label}. Vui lòng kiểm tra lại các quy tắc phụ kiện.`);
        return;
      }
    }

    const payload: UpdateProductRequest = {
      name: formData.name,
      slug: formData.slug || generateSlug(formData.name),
      productType: formData.productType,
      description: formData.description,
      model3DUrl: formData.model3DUrl,
      isPersonalizable: formData.isPersonalizable,
      isActive: formData.isActive,
      price: Number(formData.price),
      sku: formData.sku,
      weightGram: Number(formData.weightGram),
      categoryIds: selectedCategoryIds,
      characterIds: selectedCharacterIds,
      media: formData.imageUrl ? [{ url: formData.imageUrl, altText: formData.name, sortOrder: 1 }] : [],
      comboImages: isBaseBear ? comboImages.map(ci => ({
        combinationKey: ci.combinationKey,
        imageUrl: ci.imageUrl
      })) : [],
    };

    console.log("DEBUG: Final Update Payload:", JSON.stringify(payload, null, 2));
    const ok = await onSubmit(payload);
    if (ok) {
      toast.success("Cập nhật sản phẩm thành công");
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="relative bg-[#F4F7FF] rounded-3xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300">
        <div className="px-6 py-5 border-b border-white/50 bg-white/50 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-xl font-black text-[#1A1A2E]">Chỉnh sửa sản phẩm</h2>
            <p className="text-xs font-semibold text-[#6B7280] mt-0.5">Mô hình sản phẩm phẳng (Product-Centric)</p>
          </div>
          <button type="button" onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-xl bg-white text-[#9CA3AF] hover:text-[#1A1A2E] shadow-sm hover:shadow-md transition-all">
            <MdClose className="text-xl" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          {isFetching ? (
            <div className="h-64 flex flex-col items-center justify-center gap-3">
              <div className="w-8 h-8 border-4 border-[#17409A]/20 border-t-[#17409A] rounded-full animate-spin" />
              <p className="text-sm font-semibold text-[#6B7280]">Đang tải dữ liệu...</p>
            </div>
          ) : (
            <form id="editProductForm" onSubmit={handleSubmit} className="space-y-6">
              {/* ── Basic Info Section ── */}
              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                <p className="text-xs font-black text-[#17409A] uppercase tracking-widest">Thông tin bản lề</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-[#6B7280] tracking-wide uppercase">Tên sản phẩm *</label>
                    <input required name="name" value={formData.name} onChange={handleChange} className="w-full bg-[#F9FAFB] text-sm font-semibold text-[#1A1A2E] rounded-xl px-4 py-3 outline-none border-2 border-transparent focus:border-[#17409A]/20" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-[#6B7280] tracking-wide uppercase">Slug (Đường dẫn) *</label>
                    <input required name="slug" value={formData.slug} onChange={handleChange} className="w-full bg-[#F9FAFB] text-xs font-bold text-[#17409A] rounded-xl px-4 py-3 outline-none border-2 border-transparent focus:border-[#17409A]/20" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-[#6B7280] tracking-wide uppercase">SKU *</label>
                    <input required name="sku" value={formData.sku} onChange={handleChange} className="w-full bg-[#F9FAFB] text-sm font-semibold text-[#1A1A2E] rounded-xl px-4 py-3 outline-none border-2 border-transparent focus:border-[#17409A]/20" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-[#6B7280] tracking-wide uppercase">Giá bán (VND) *</label>
                    <input required type="number" name="price" value={formData.price} onChange={handleChange} className="w-full bg-[#F9FAFB] text-sm font-semibold text-[#1A1A2E] rounded-xl px-4 py-3 outline-none border-2 border-transparent focus:border-[#17409A]/20" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-[#6B7280] tracking-wide uppercase">Cân nặng (Gram) *</label>
                    <input required type="number" name="weightGram" value={formData.weightGram} onChange={handleChange} className="w-full bg-[#F9FAFB] text-sm font-semibold text-[#1A1A2E] rounded-xl px-4 py-3 outline-none border-2 border-transparent focus:border-[#17409A]/20" />
                  </div>
                </div>
              </div>

              {/* ── Image & Type Section ── */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                    <label className="text-[11px] font-black text-[#6B7280] tracking-wide uppercase">Ảnh chính sản phẩm</label>
                    <div className="flex items-center gap-3">
                      {formData.imageUrl && <div className="w-16 h-16 rounded-xl border overflow-hidden shrink-0 bg-gray-50"><img src={formData.imageUrl} className="w-full h-full object-cover" /></div>}
                      <div className="flex-1 space-y-2">
                        <input type="file" onChange={(e) => setUploadFile(e.target.files?.[0] ?? null)} className="text-xs file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100 cursor-pointer" />
                        <button type="button" onClick={handleUploadImage} disabled={!uploadFile || isUploadingImage} className="w-full py-2 bg-[#17409A] text-white rounded-lg text-xs font-bold disabled:opacity-50">Tải ảnh lên</button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                    <label className="text-[11px] font-black text-[#6B7280] tracking-wide uppercase">Phân loại & Thuế</label>
                    <CustomDropdown options={[{ label: "Gấu Base", value: "BASE_BEAR" }, { label: "Phụ kiện", value: "ACCESSORY" }]} value={formData.productType} onChange={(v) => setFormData(p => ({ ...p, productType: v }))} buttonClassName="w-full bg-[#F9FAFB] text-sm font-semibold p-3 rounded-xl flex justify-between items-center" />
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                   <label className="text-[11px] font-black text-[#6B7280] tracking-wide uppercase">Cấu hình chi tiết</label>
                   <div className="space-y-3">
                     <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Mô tả sản phẩm..." rows={3} className="w-full bg-[#F9FAFB] text-sm p-3 rounded-xl border-none outline-none" />
                     <div className="flex flex-wrap gap-4">
                        <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} className="w-4 h-4 rounded text-[#17409A]" /><span className="text-xs font-bold text-[#1A1A2E]">Active</span></label>
                        <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" name="isPersonalizable" checked={formData.isPersonalizable} onChange={handleChange} className="w-4 h-4 rounded text-[#7C5CFC]" /><span className="text-xs font-bold text-[#1A1A2E]">Hỗ trợ Custom</span></label>
                     </div>
                   </div>
                </div>
              </div>

              {/* ── Combination Matrix Section (BASE_BEAR ONLY) ── */}
              {isBaseBear && formData.isPersonalizable && (
                <div className="bg-white p-6 rounded-2xl border border-[#17409A]/10 shadow-lg space-y-5">
                  {/* Instructional UI for Accessories */}
                  <div className="bg-[#17409A]/5 border border-[#17409A]/10 p-4 rounded-xl flex items-start gap-3">
                    <div className="bg-[#17409A] text-white p-1 rounded-lg shrink-0 mt-0.5">
                      <MdOutlineAddPhotoAlternate className="text-sm" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-[11px] font-bold text-[#17409A] leading-tight">Bạn không thấy đủ phụ kiện?</p>
                      <p className="text-[10px] font-semibold text-[#17409A]/80 leading-relaxed">
                        Hãy vào menu <strong className="underline cursor-pointer">Personalization Rules</strong> để liên kết sản phẩm Phụ kiện với sản phẩm Gấu này. Các tổ hợp ảnh mới sẽ tự động xuất hiện bên dưới.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-black text-[#1A1A2E] flex items-center gap-2">Ma trận tổ hợp ảnh <span className="px-2 py-0.5 bg-[#FF6B9D] text-white text-[10px] rounded-full">Bắt buộc</span></p>
                      {allCombinations.length > 0 ? (
                        <p className="text-[10px] text-[#6B7280] font-medium italic mt-1">* Bạn có {availableAccessories.length} phụ kiện → Phải upload đủ {allCombinations.length} ảnh cho ma trận.</p>
                      ) : (
                        <p className="text-[10px] text-[#EF4444] font-black italic mt-1 uppercase tracking-tight">⚠️ Chưa có phụ kiện nào được liên kết với gấu này.</p>
                      )}
                    </div>
                  </div>

                  {allCombinations.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {allCombinations.map((combo) => {
                        const ci = comboImages.find(x => x.combinationKey === combo.key);
                        const file = matrixUploadFiles[combo.key];
                        return (
                          <div key={combo.key} className={`p-4 rounded-xl border-2 transition-all ${ci?.imageUrl ? 'border-green-100 bg-green-50/30' : 'border-dashed border-gray-200 bg-gray-50/50'}`}>
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-xs font-bold text-[#1A1A2E] truncate pr-2" title={combo.label}>{combo.label}</span>
                              {ci?.imageUrl && <span className="text-[10px] font-black text-green-600 uppercase">Sẵn sàng</span>}
                            </div>
                            
                            <div className="flex items-center gap-3">
                              <div className="w-16 h-16 rounded-lg bg-white border shadow-sm flex items-center justify-center overflow-hidden shrink-0">
                                {ci?.imageUrl ? <img src={ci.imageUrl} className="w-full h-full object-cover" /> : <div className="text-[#9CA3AF]"><MdCloudUpload size={20} /></div>}
                              </div>
                              <div className="flex-1 space-y-2">
                                <input type="file" onChange={(e) => setMatrixUploadFiles(p => ({ ...p, [combo.key]: e.target.files?.[0] ?? null }))} className="block w-full text-[10px] text-slate-500 file:mr-2 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-[10px] file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100" />
                                <button type="button" onClick={() => handleUploadMatrixImage(combo.key)} disabled={!file || isUploadingImage} className="w-full py-1.5 bg-[#17409A] text-white rounded-lg text-[10px] font-bold disabled:opacity-50">Upload</button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="py-10 border-2 border-dashed border-gray-100 rounded-3xl flex flex-col items-center justify-center text-center px-6">
                       <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                          <MdOutlineAddPhotoAlternate className="text-3xl text-gray-300" />
                       </div>
                       <p className="text-sm font-black text-[#1A1A2E] mb-1">Trống trải quá...</p>
                       <p className="text-xs font-semibold text-[#9CA3AF] max-w-xs">Gấu chưa có phụ kiện đi kèm nên không có ma trận ảnh. Hãy thêm phụ kiện để bắt đầu!</p>
                    </div>
                  )}
                </div>
              )}
            </form>
          )}
        </div>

        <div className="px-6 py-4 bg-white shrink-0 flex items-center justify-end gap-3">
          <button type="button" onClick={onClose} disabled={isSubmitting || isFetching} className="px-6 py-3 rounded-2xl text-sm font-bold text-[#6B7280] bg-[#F4F7FF] hover:bg-[#E5E7EB] disabled:opacity-50">Hủy</button>
          <button type="submit" form="editProductForm" disabled={isSubmitting || isFetching} className="px-8 py-3 rounded-2xl text-sm font-bold text-white bg-[#17409A] hover:bg-[#0E2A66] shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center gap-2">
            {isSubmitting ? "Đang xử lý..." : "Lưu thay đổi"}
          </button>
        </div>
      </div>
    </div>
  );
}
