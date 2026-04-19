import { useEffect, useState, useMemo } from "react";
import { MdClose, MdCloudUpload, MdArrowForward, MdArrowBack, MdCheckCircle } from "react-icons/md";
import type { CreateProductRequest, CreateProductComboImageRequest, ProductListItem } from "@/types";
import CustomDropdown from "@/components/shared/CustomDropdown";
import { useTaxonomyApi } from "@/hooks";
import { useToast } from "@/contexts/ToastContext";
import { mediaService } from "@/services/media.service";
import { productService } from "@/services/product.service";
import { personalizationGroupService } from "@/services/personalization-group.service";
import { personalizationRuleService } from "@/services/personalization-rule.service";
import { generateSlug } from "@/utils/string";
import { MdAddPhotoAlternate, MdDeleteOutline } from "react-icons/md";

interface Props {
  onClose: () => void;
  onSubmit?: (payload: CreateProductRequest) => Promise<boolean>;
  onSuccess?: () => void;
  isSubmitting: boolean;
}

type Step = 1 | 2;

export default function CreateProductModal({
  onClose,
  onSuccess,
  isSubmitting: externalIsSubmitting,
}: Props) {
  const toast = useToast();
  const [step, setStep] = useState<Step>(1);
  const [internalIsSubmitting, setInternalIsSubmitting] = useState(false);
  const isSubmitting = externalIsSubmitting || internalIsSubmitting;

  const [createdProductId, setCreatedProductId] = useState<string | null>(null);

  // Step 1 Data
  const [formData, setFormData] = useState({
    name: "",
    productType: "BASE_BEAR",
    description: "",
    model3DUrl: "",
    isPersonalizable: false,
    isActive: true,
    price: "",
    sku: "",
    weightGram: "500",
    slug: "",
    media: [] as { url: string; altText: string; sortOrder: number }[],
  });
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [selectedCharacterIds, setSelectedCharacterIds] = useState<string[]>([]);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Step 2 Data
  const [accessoryList, setAccessoryList] = useState<ProductListItem[]>([]);
  const [selectedAccessoryIds, setSelectedAccessoryIds] = useState<string[]>([]);
  const [comboImages, setComboImages] = useState<CreateProductComboImageRequest[]>([]);
  const [matrixUploadFiles, setMatrixUploadFiles] = useState<Record<string, File | null>>({});

  const {
    loading: taxonomyLoading,
    categories,
    characters,
    fetchTaxonomy,
  } = useTaxonomyApi();

  const isBaseBear = formData.productType === "BASE_BEAR";
  const isAccessory = formData.productType === "ACCESSORY";

  useEffect(() => {
    fetchTaxonomy();
  }, [fetchTaxonomy]);

  // Fetch accessories when moving to Step 2
  useEffect(() => {
    if (step === 2 && isBaseBear && accessoryList.length === 0) {
      (async () => {
        try {
          const res = await productService.getProducts({ productType: "ACCESSORY", pageSize: 100 });
          if (res.isSuccess && res.value?.items) {
            setAccessoryList(res.value.items);
          }
        } catch (err) {
          console.error("Failed to fetch accessories", err);
        }
      })();
    }
  }, [step, isBaseBear, accessoryList.length]);

  // ── Combination Matrix Logic (2^n - 1) ──
  const matrixAccessoryIds = useMemo(() => {
    return selectedAccessoryIds.filter(id => {
      const acc = accessoryList.find(a => a.productId === id);
      if (!acc) return false;
      const type = (acc.productType || "").toUpperCase();
      const name = (acc.name || "").toUpperCase();
      return type !== "AI_PROCESSOR" && !name.includes("AI PROCESSOR");
    });
  }, [selectedAccessoryIds, accessoryList]);

  const allCombinations = useMemo(() => {
    if (!isBaseBear || matrixAccessoryIds.length === 0) return [];
    
    const results: string[][] = [[]]; 
    for (const id of matrixAccessoryIds) {
      const currentLength = results.length;
      for (let i = 0; i < currentLength; i++) {
        results.push([...results[i], id]);
      }
    }
    
    const combinations = results.filter(combo => combo.length > 0);
    
    return combinations.map(combo => ({
      key: combo.sort((a, b) => a.localeCompare(b)).join("|"),
      label: combo.map(id => accessoryList.find(a => a.productId === id)?.name || "N/A").join(" + ")
    }));
  }, [matrixAccessoryIds, isBaseBear, accessoryList]);

  // Sync comboImages state with combinations
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => {
      const next = {
        ...prev,
        [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
      };
      if (name === "name") {
        next.slug = generateSlug(value);
      }
      return next;
    });
  };

  const handleUploadComboImage = async (key: string) => {
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

  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAccessory && selectedCategoryIds.length === 0) {
      toast.error("Vui lòng chọn ít nhất 1 category cho sản phẩm.");
      return;
    }

    const payload: CreateProductRequest = {
      name: formData.name,
      slug: formData.slug || generateSlug(formData.name),
      productType: formData.productType,
      description: formData.description,
      model3DUrl: isAccessory ? "" : formData.model3DUrl,
      isPersonalizable: isAccessory ? false : formData.isPersonalizable,
      isActive: isAccessory ? true : formData.isActive,
      price: Number(formData.price) || 0,
      sku: formData.sku || `SKU-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
      weightGram: Number(formData.weightGram) || 0,
      categoryIds: isAccessory ? [] : selectedCategoryIds,
      characterIds: isAccessory ? [] : selectedCharacterIds,
      media: formData.media,
    };

    setInternalIsSubmitting(true);
    try {
      const res = await productService.createProduct(payload);
      if (res.isSuccess && res.value?.productId) {
        setCreatedProductId(res.value.productId);
        if (isBaseBear && formData.isPersonalizable) {
          setStep(2);
          toast.success("Đã tạo sản phẩm cốt lõi. Hãy chọn phụ kiện và tổ hợp ảnh.");
        } else {
          toast.success("Tạo sản phẩm thành công!");
          onSuccess?.();
          onClose();
        }
      } else {
        throw new Error(res.error?.description || "Tạo sản phẩm thất bại");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Có lỗi xảy ra");
    } finally {
      setInternalIsSubmitting(false);
    }
  };

  const handleFinish = async () => {
    if (!createdProductId) return;

    if (selectedAccessoryIds.length > 0) {
      const missing = allCombinations.find(combo => {
        const ci = comboImages.find(x => x.combinationKey === combo.key);
        return !ci || !ci.imageUrl;
      });
      if (missing) {
        toast.error(`Thiếu ảnh cho tổ hợp: ${missing.label}`);
        return;
      }
    }

    setInternalIsSubmitting(true);
    try {
      const groupRes = await personalizationGroupService.createGroup({
        name: "Phụ kiện đi kèm",
        description: `Nhóm linh kiện cho ${formData.name}`
      });
      
      if (!groupRes.isSuccess || !groupRes.value?.groupId) throw new Error("Không thể tạo nhóm phụ kiện");
      const groupId = groupRes.value.groupId;

      for (const accId of selectedAccessoryIds) {
        await personalizationRuleService.createRule({
          baseProductId: createdProductId,
          groupId: groupId,
          allowedComponentProductId: accId,
          isRequired: false,
          maxQuantity: 1,
          ruleType: "ACCESSORY"
        });
      }

      await productService.updateProduct(createdProductId, {
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
        media: formData.media,
        comboImages: comboImages
      });

      toast.success("Hoàn tất cấu hình sản phẩm!");
      onSuccess?.();
      onClose();
    } catch (err) {
      toast.error("Lỗi hoàn tất: " + (err instanceof Error ? err.message : ""));
    } finally {
      setInternalIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="relative bg-[#F4F7FF] rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-white/50 bg-white/50 flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2">
               <h2 className="text-xl font-black text-[#1A1A2E]">Thêm mới sản phẩm</h2>
               <div className="px-2 py-0.5 rounded-full bg-[#17409A]/10 text-[#17409A] text-[9px] font-black uppercase tracking-wider">Bước {step}/2</div>
            </div>
            <p className="text-xs font-semibold text-[#6B7280] mt-0.5">
              {step === 1 ? "Thông tin sản phẩm cốt lõi" : "Thiết lập phụ kiện & tổ hợp hình ảnh"}
            </p>
          </div>
          <button type="button" onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-xl bg-white text-[#9CA3AF] hover:text-[#1A1A2E] shadow-sm hover:shadow-md transition-all">
            <MdClose className="text-xl" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          {step === 1 ? (
             <form id="createProductForm" onSubmit={handleStep1Submit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-[#6B7280] tracking-wide uppercase">Tên sản phẩm *</label>
                    <input required name="name" value={formData.name} onChange={handleChange} placeholder="Vd: Gấu Nâu Dudu" className="w-full bg-white text-sm font-semibold text-[#1A1A2E] rounded-xl px-4 py-3 outline-none border-2 border-transparent focus:border-[#17409A]/20 transition-all shadow-sm" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-[#6B7280] tracking-wide uppercase">Loại sản phẩm *</label>
                    <CustomDropdown options={[{ label: "Gấu", value: "BASE_BEAR" }, { label: "Phụ kiện", value: "ACCESSORY" }]} value={formData.productType} onChange={(v) => setFormData(p => ({ ...p, productType: v }))} buttonClassName="w-full bg-white text-sm font-semibold text-[#1A1A2E] rounded-xl px-4 py-3 outline-none border-2 border-transparent focus:border-[#17409A]/20 shadow-sm flex items-center justify-between" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-[#6B7280] tracking-wide uppercase">Slug (Đường dẫn) *</label>
                    <input required name="slug" value={formData.slug || generateSlug(formData.name)} onChange={handleChange} placeholder="vd: gau-bong-doraemon" className="w-full bg-white text-xs font-bold text-[#17409A] rounded-xl px-4 py-3 outline-none border-2 border-transparent focus:border-[#17409A]/20 transition-all shadow-sm" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-[#6B7280] tracking-wide uppercase">SKU *</label>
                    <input required name="sku" value={formData.sku} onChange={handleChange} placeholder="SKU-XXXXXX" className="w-full bg-white text-sm font-semibold text-[#1A1A2E] rounded-xl px-4 py-3 outline-none border-2 border-transparent focus:border-[#17409A]/20 transition-all shadow-sm" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-[#6B7280] tracking-wide uppercase">Giá bán (VND) *</label>
                    <input required type="number" name="price" value={formData.price} onChange={handleChange} placeholder="500000" className="w-full bg-white text-sm font-semibold text-[#1A1A2E] rounded-xl px-4 py-3 outline-none border-2 border-transparent focus:border-[#17409A]/20 transition-all shadow-sm" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-[#6B7280] tracking-wide uppercase">Cân nặng (Gram) *</label>
                    <input required type="number" name="weightGram" value={formData.weightGram} onChange={handleChange} placeholder="500" className="w-full bg-white text-sm font-semibold text-[#1A1A2E] rounded-xl px-4 py-3 outline-none border-2 border-transparent focus:border-[#17409A]/20 transition-all shadow-sm" />
                  </div>
                </div>

                {/* Media Gallery (Merged from conflict) */}
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-[#6B7280] tracking-wide uppercase">Bộ sưu tập Media (Gallery) *</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
                    {formData.media.map((m, idx) => (
                      <div key={idx} className="group relative aspect-square rounded-2xl bg-white border border-[#E5E7EB] overflow-hidden shadow-sm hover:shadow-md transition-all">
                        <img src={m.url} alt={m.altText} className="w-full h-full object-cover" />
                        <button type="button" onClick={() => setFormData(prev => ({ ...prev, media: prev.media.filter((_, i) => i !== idx) }))} className="absolute top-1 right-1 w-7 h-7 flex items-center justify-center rounded-lg bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                          <MdDeleteOutline className="text-lg" />
                        </button>
                      </div>
                    ))}
                    <div className="aspect-square rounded-2xl border-2 border-dashed border-[#D7DEEF] bg-white hover:bg-[#F8F9FF] transition-all flex flex-col items-center justify-center gap-2 relative">
                      {isUploadingImage ? <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#17409A]" /> : <MdAddPhotoAlternate className="text-2xl text-[#6B7280]" />}
                      <span className="text-[10px] font-bold text-[#6B7280]">Thêm ảnh</span>
                      <input type="file" accept="image/*" disabled={isUploadingImage} onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        setIsUploadingImage(true);
                        try {
                          const res = await mediaService.uploadMedia(file, "products");
                          if (res.isSuccess && res.value?.publicUrl) {
                            setFormData(prev => ({
                              ...prev,
                              media: [...prev.media, { url: res.value!.publicUrl!, altText: formData.name, sortOrder: prev.media.length + 1 }]
                            }));
                            toast.success("Thêm ảnh thành công");
                          }
                        } catch (err) {
                          toast.error("Upload ảnh thất bại");
                        } finally {
                          setIsUploadingImage(false);
                        }
                      }} className="absolute inset-0 opacity-0 cursor-pointer" />
                    </div>
                  </div>
                </div>

                {!isAccessory && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-black text-[#6B7280] tracking-wide uppercase">Categories *</label>
                      <CustomDropdown options={categories.map((c) => ({ label: c.name, value: c.categoryId }))} value={selectedCategoryIds[0] || ""} onChange={(v) => setSelectedCategoryIds(v ? [v] : [])} placeholder="Chọn 1 Category" buttonClassName="w-full bg-white text-sm font-semibold p-3 rounded-xl border border-gray-100 shadow-sm flex justify-between items-center" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-black text-[#6B7280] tracking-wide uppercase">Characters *</label>
                      <CustomDropdown options={characters.map((c) => ({ label: c.name, value: c.characterId }))} value={selectedCharacterIds[0] || ""} onChange={(v) => setSelectedCharacterIds(v ? [v] : [])} placeholder="Chọn 1 Character" buttonClassName="w-full bg-white text-sm font-semibold p-3 rounded-xl border border-gray-100 shadow-sm flex justify-between items-center" />
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-[#6B7280] tracking-wide uppercase">Mô tả sản phẩm</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} rows={3} placeholder="Mô tả ngắn về sản phẩm..." className="w-full bg-white text-sm font-semibold p-4 rounded-xl border border-gray-100 shadow-sm outline-none focus:border-[#17409A]/20 resize-none" />
                  </div>
                  {!isAccessory && (
                    <div className="flex flex-wrap gap-6 pt-2">
                       <label className="flex items-center gap-2 cursor-pointer group"><input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} className="w-5 h-5 rounded border-gray-300 text-[#17409A]" /><span className="text-sm font-bold text-[#1A1A2E]">Hiển thị cửa hàng</span></label>
                       <label className="flex items-center gap-2 cursor-pointer group"><input type="checkbox" name="isPersonalizable" checked={formData.isPersonalizable} onChange={handleChange} className="w-5 h-5 rounded border-gray-300 text-[#7C5CFC]" /><span className="text-sm font-bold text-[#1A1A2E]">Hỗ trợ Custom & Phụ kiện</span></label>
                    </div>
                  )}
                </div>
             </form>
          ) : (
             <div className="space-y-8 animate-in slide-in-from-right duration-300">
                <div className="space-y-3">
                   <p className="text-xs font-black text-[#17409A] uppercase tracking-widest">Bước 2: Chọn phụ kiện khả dụng</p>
                   <div className="grid grid-cols-2 gap-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                      {accessoryList.map((acc) => {
                         const isSelected = selectedAccessoryIds.includes(acc.productId);
                         return (
                            <button key={acc.productId} onClick={() => setSelectedAccessoryIds(prev => isSelected ? prev.filter(id => id !== acc.productId) : [...prev, acc.productId])} className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${isSelected ? 'border-[#17409A] bg-[#F4F7FF]' : 'border-white bg-white hover:border-gray-200'}`}>
                               <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-50 shrink-0"><img src={acc.imageUrl || '/teddy_bear.png'} className="w-full h-full object-cover" /></div>
                               <div className="flex-1 text-left min-w-0">
                                  <p className="text-[11px] font-black text-[#1A1A2E] truncate">{acc.name}</p>
                                  <p className="text-[10px] font-bold text-[#9CA3AF]">{(acc.price || 0).toLocaleString()} đ</p>
                               </div>
                               {isSelected && <MdCheckCircle className="text-[#17409A] text-lg shrink-0" />}
                            </button>
                         );
                      })}
                   </div>
                </div>

                {selectedAccessoryIds.length > 0 && (
                   <div className="space-y-4">
                      <div className="flex items-center justify-between">
                         <p className="text-sm font-black text-[#1A1A2E]">Hình ảnh tổ hợp phụ kiện ({allCombinations.length})</p>
                         <p className="text-[10px] text-[#6B7280] font-medium italic">* Không cần upload ảnh gốc</p>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-4">
                         {allCombinations.map((combo) => {
                            const ci = comboImages.find(x => x.combinationKey === combo.key);
                            const file = matrixUploadFiles[combo.key];
                            return (
                               <div key={combo.key} className={`p-3 rounded-2xl border-2 transition-all ${ci?.imageUrl ? 'border-green-100 bg-green-50/20' : 'border-dashed border-gray-200 bg-white/50'}`}>
                                  <p className="text-[10px] font-black text-[#1A1A2E] mb-2 truncate" title={combo.label}>{combo.label}</p>
                                  <div className="flex items-center gap-3">
                                     <div className="w-14 h-14 rounded-lg bg-white border flex items-center justify-center overflow-hidden shrink-0">
                                        {ci?.imageUrl ? <img src={ci.imageUrl} className="w-full h-full object-cover" /> : <MdCloudUpload className="text-gray-300" />}
                                     </div>
                                     <div className="flex-1 space-y-1.5">
                                        <input type="file" onChange={(e) => setMatrixUploadFiles(p => ({ ...p, [combo.key]: e.target.files?.[0] ?? null }))} className="block w-full text-[9px] text-slate-500 file:mr-2 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-[9px] file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100" />
                                        <button type="button" onClick={() => handleUploadComboImage(combo.key)} disabled={!file || isUploadingImage} className="w-full py-1 bg-[#17409A] text-white rounded-lg text-[9px] font-bold disabled:opacity-50">Tải ảnh lên</button>
                                     </div>
                                  </div>
                                </div>
                            );
                         })}
                      </div>
                   </div>
                )}
             </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-5 bg-white border-t border-gray-100 flex items-center justify-end gap-3 shrink-0">
          {step === 2 ? (
            <>
               <button type="button" onClick={() => setStep(1)} disabled={isSubmitting} className="flex items-center gap-1.5 px-5 py-3 rounded-2xl text-sm font-bold text-[#6B7280] bg-[#F4F7FF] hover:bg-[#E5E7EB] transition-colors"><MdArrowBack /> Trở lại</button>
               <button type="button" onClick={handleFinish} disabled={isSubmitting} className="flex items-center gap-2 px-8 py-3 rounded-2xl text-sm font-bold text-white bg-[#17409A] hover:bg-[#0E2A66] shadow-lg transition-all disabled:opacity-50">{isSubmitting ? "Đang lưu cấu hình..." : "Hoàn tất & Lưu"}</button>
            </>
          ) : (
            <>
               <button type="button" onClick={onClose} disabled={isSubmitting} className="px-6 py-3 rounded-2xl text-sm font-bold text-[#6B7280] bg-[#F4F7FF] hover:bg-[#E5E7EB] transition-colors">Hủy bỏ</button>
               <button type="submit" form="createProductForm" disabled={isSubmitting} className="flex items-center gap-2 px-8 py-3 rounded-2xl text-sm font-bold text-white bg-[#17409A] hover:bg-[#0E2A66] shadow-lg transition-all disabled:opacity-50">
                 {isSubmitting ? "Đang xử lý..." : (isBaseBear && formData.isPersonalizable ? <>Tiếp tục <MdArrowForward /></> : "Tạo sản phẩm") }
               </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
