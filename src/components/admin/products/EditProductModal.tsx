import React, { useState, useEffect, useMemo, useRef } from "react";
import { MdClose, MdCloudUpload, MdOutlineAddPhotoAlternate, MdAddPhotoAlternate, MdDeleteOutline } from "react-icons/md";
import type { CreateProductComboImageRequest, UpdateProductRequest } from "@/types/requests";
import type { PersonalizationRule } from "@/types/responses";
import { productService } from "@/services/product.service";
import CustomDropdown from "@/components/shared/CustomDropdown";
import { useTaxonomyApi } from "@/hooks";
import { useToast } from "@/contexts/ToastContext";
import { mediaService } from "@/services/media.service";
import { accessoryService } from "@/services/accessory.service";
import { generateSlug } from "@/utils/string";
import { formatDate } from "@/utils/date";
import { MdAttachMoney, MdCheckCircle } from "react-icons/md";
import type { AccessoryResponse, ProductVariantInlineRequest } from "@/types";

const STANDARD_SIZES = ["S", "M", "L", "XL", "XXL", "OS"] as const;
const ROUNDING_BASE = 100000;

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
    description: "",
    model3DUrl: "",
    isPersonalizable: false,
    isActive: true,
    sku: "",
    stockQuantity: 0,
    createdAt: "",
    variants: [] as ProductVariantInlineRequest[],
    media: [] as { url: string; altText: string; sortOrder: number }[],
  });
  
  const [personalizationRules, setPersonalizationRules] = useState<PersonalizationRule[]>([]);
  const [accessoryList, setAccessoryList] = useState<AccessoryResponse[]>([]);
  const [selectedAccessoryIds, setSelectedAccessoryIds] = useState<string[]>([]);
  const [initialAccessoryIds, setInitialAccessoryIds] = useState<string[]>([]);
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
  
  // Helper to ensure key matching is order-independent and case-insensitive
  const normalizeKey = (key: string) => {
    if (!key) return "";
    return key.toLowerCase()
      .split("|")
      .map(id => id.trim())
      .filter(Boolean)
      .sort()
      .join("|");
  };

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
          console.log('[DEBUG] Raw API Product Data:', {
            comboImages: p.comboImages,
            accessories: p.accessories,
            variants: p.variants?.length,
          });
          setFormData({
            name: p.name || "",
            slug: p.slug || "",
            description: p.description || "",
            model3DUrl: p.model3DUrl || "",
            isPersonalizable: p.isPersonalizable || false,
            isActive: p.isActive,
            sku: p.sku || "",
            stockQuantity: p.onHand || 0,
            createdAt: p.createdAt || "",
            variants: (p.variants || []).map(v => ({
              sizeTag: v.sizeTag || "",
              sizeDescription: v.sizeDescription || "",
              baseCost: v.baseCost || 0,
              assemblyCost: v.assemblyCost || 0,
              weightGram: v.weightGram || 500,
              price: v.price || 0,
              stockQuantity: v.onHand || 0,
            })),
            media: p.media || [],
          });

          setSelectedCategoryIds((p.categories || []).map((c) => c.categoryId));
          setSelectedCharacterIds((p.characters || []).map((c) => c.characterId));
          
          // Normalize comboImages from API (handle property casing and key formatting)
          const normalizedCombos = (p.comboImages || []).map((ci: any) => ({
            combinationKey: normalizeKey(ci.combinationKey || ci.CombinationKey || ""),
            imageUrl: ci.imageUrl || ci.ImageUrl || ""
          })).filter(ci => ci.combinationKey);
          
          console.log('[DEBUG] Normalized combo images from API:', normalizedCombos);
          console.log('[DEBUG] Accessories from product:', p.accessories?.map(a => ({ id: a.accessoryId, name: a.name })));
          setComboImages(normalizedCombos);
          
          // Initial selected accessories from rules AND assigned accessories
          if (p.accessories && p.accessories.length > 0) {
             const ids = p.accessories.map(a => a.accessoryId);
             setSelectedAccessoryIds(ids);
             setInitialAccessoryIds(ids);
          } else if (rulesRes && rulesRes.isSuccess && rulesRes.value) {
            setPersonalizationRules(rulesRes.value);
            const ids = rulesRes.value.map(r => r.allowedComponentProductId);
            setSelectedAccessoryIds(ids);
            setInitialAccessoryIds(ids);
          }
        }
      } catch (err) {
        console.error("Failed to load product details", err);
      } finally {
        if (mounted) setIsFetching(false);
      }
    })();
    return () => { mounted = false; };
  }, [productId]);

  // Fetch all accessories for selection
  useEffect(() => {
    (async () => {
      try {
        const res = await accessoryService.getAll();
        if (res.isSuccess && res.value) {
          setAccessoryList(res.value);
        }
      } catch (err) {
        console.error("Failed to fetch accessories", err);
      }
    })();
  }, []); // Always fetch once for the modal

  // ── Combination Matrix Logic ──
  const matrixAccessoryIds = useMemo(() => {
    return selectedAccessoryIds.filter(id => {
      const acc = accessoryList.find(a => a.accessoryId === id);
      if (acc) {
        const sku = (acc.sku || "").toUpperCase();
        return !sku.includes("SMART-CHIP") && !sku.includes("AI-PROCESSOR");
      }
      // Fallback for currently linked but not yet loaded in list
      const rule = personalizationRules.find(r => r.allowedComponentProductId === id);
      if (rule) {
         const type = (rule.addonProduct.productType || "").toUpperCase();
         const name = (rule.addonProduct.name || "").toUpperCase();
         return type !== "AI_PROCESSOR" && !name.includes("AI PROCESSOR");
      }
      return true;
    });
  }, [selectedAccessoryIds, accessoryList, personalizationRules]);

  const allCombinations = useMemo(() => {
    const results: string[][] = [[]];
    for (const accId of matrixAccessoryIds) {
      const currentLength = results.length;
      for (let i = 0; i < currentLength; i++) {
        results.push([...results[i], accId]);
      }
    }
    const combinations = results.filter(combo => combo.length > 0);
    return combinations.map(combo => ({
      key: normalizeKey(combo.join("|")),
      label: combo.map(id => accessoryList.find(a => a.accessoryId === id)?.name || personalizationRules.find(r => r.allowedComponentProductId === id)?.addonProduct.name || "N/A").join(" + ")
    }));
  }, [matrixAccessoryIds, accessoryList, personalizationRules]);

  // Track whether product data has been fully initialized
  const isInitializedRef = useRef(false);

  useEffect(() => {
    // Only merge matrix placeholders AFTER initial product data has loaded
    // and the accessory list is ready (so allCombinations are stable)
    if (allCombinations.length > 0 && !isFetching && accessoryList.length > 0) {
      isInitializedRef.current = true;
      setComboImages(prev => {
        const next = [...prev];
        let changed = false;
        allCombinations.forEach(combo => {
          const comboKey = normalizeKey(combo.key);
          const exists = next.find(ci => normalizeKey(ci.combinationKey) === comboKey);
          if (!exists) {
            next.push({ combinationKey: combo.key, imageUrl: "" });
            changed = true;
          }
        });
        return changed ? next : prev;
      });
    }
  }, [allCombinations, isFetching, accessoryList.length]);

  const handleUploadImage = async () => {
    if (!uploadFile) return;
    setIsUploadingImage(true);
    try {
      const res = await mediaService.uploadMedia(uploadFile, "products");
      if (!res.isSuccess || !res.value?.publicUrl) throw new Error("Upload thất bại");
      const newMedia = {
        url: res.value.publicUrl,
        altText: formData.name,
        sortOrder: formData.media.length + 1
      };
      setFormData(prev => ({ 
        ...prev, 
        media: [...prev.media, newMedia] 
      }));
      setUploadFile(null);
      toast.success("Thêm ảnh thành công");
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
      if (name === "name") {
        next.slug = generateSlug(value);
      }
      return next;
    });
  };

  const calculatePrice = (base: number, assembly: number) => {
    const totalCost = base + assembly;
    const marginPrice = totalCost * 1.2;
    return Math.ceil(marginPrice / ROUNDING_BASE) * ROUNDING_BASE;
  };

  const toggleSize = (size: string) => {
    setFormData(prev => {
      const exists = prev.variants.find(v => v.sizeTag === size);
      if (exists) {
        return { ...prev, variants: prev.variants.filter(v => v.sizeTag !== size) };
      }
      return {
        ...prev,
        variants: [
          ...prev.variants,
          {
            sizeTag: size,
            sizeDescription: size === "OS" ? "One Size" : `Kích thước chuẩn ${size}`,
            baseCost: 0,
            assemblyCost: 0,
            weightGram: 500,
            price: calculatePrice(0, 0),
            stockQuantity: 0
          }
        ]
      };
    });
  };

  const updateVariant = (size: string, fields: Partial<ProductVariantInlineRequest>) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.map(v => {
        if (v.sizeTag === size) {
          const next = { ...v, ...fields };
          next.price = calculatePrice(next.baseCost, next.assemblyCost);
          return next;
        }
        return v;
      })
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validComboImages = comboImages
      .filter(ci => ci.imageUrl && ci.imageUrl.trim() !== "")
      .map(ci => ({
        combinationKey: ci.combinationKey,
        imageUrl: ci.imageUrl.Trim ? ci.imageUrl.trim() : ci.imageUrl
      }));

    const payload: UpdateProductRequest = {
      name: formData.name,
      slug: formData.slug || generateSlug(formData.name),
      description: formData.description,
      model3DUrl: formData.model3DUrl,
      isPersonalizable: formData.isPersonalizable,
      isActive: formData.isActive,
      sku: formData.sku,
      categoryIds: selectedCategoryIds,
      characterIds: selectedCharacterIds,
      variants: formData.variants.map(v => ({
        sizeTag: v.sizeTag,
        sizeDescription: v.sizeDescription,
        baseCost: v.baseCost,
        assemblyCost: v.assemblyCost,
        weightGram: v.weightGram,
        price: v.price,
        stockQuantity: v.stockQuantity
      })),
      media: formData.media.map(m => ({
        url: m.url,
        altText: m.altText,
        sortOrder: m.sortOrder
      })),
      comboImages: validComboImages,
    };

    console.log('[DEBUG] Submitting Edit Product Payload:', payload);

    // Calculate diffs for accessories using initial snapshot
    const added = selectedAccessoryIds.filter(id => !initialAccessoryIds.includes(id));
    const removed = initialAccessoryIds.filter(id => !selectedAccessoryIds.includes(id));

    // Handle accessory syncing
    try {
      for (const id of added) {
        await accessoryService.addToProduct(productId, id);
      }
      for (const id of removed) {
        await accessoryService.removeFromProduct(productId, id);
      }
    } catch (err) {
      console.error("Error syncing accessories", err);
      toast.error("Có lỗi xảy ra khi đồng bộ phụ kiện");
    }
    console.log('[DEBUG] Submitting Edit Product Payload:', payload);
    const ok = await onSubmit(payload);
    if (ok) {
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
            <div className="flex items-center gap-3 mt-0.5">
              <p className="text-xs font-semibold text-[#6B7280]">Mô hình sản phẩm phẳng</p>
              {formData.createdAt && (
                <span className="text-[10px] font-bold bg-[#17409A]/10 text-[#17409A] px-2 py-0.5 rounded-md">
                  Ngày tạo: {formatDate(formData.createdAt)}
                </span>
              )}
            </div>
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
              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                <p className="text-xs font-black text-[#17409A] uppercase tracking-widest">Thông tin cơ bản</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-[#6B7280] tracking-wide uppercase">Tên sản phẩm *</label>
                    <input required name="name" value={formData.name} onChange={handleChange} className="w-full bg-[#F9FAFB] text-sm font-semibold text-[#1A1A2E] rounded-xl px-4 py-3 outline-none border-2 border-transparent focus:border-[#17409A]/20" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-[#6B7280] tracking-wide uppercase">Slug *</label>
                    <input required name="slug" value={formData.slug} onChange={handleChange} className="w-full bg-[#F9FAFB] text-xs font-bold text-[#17409A] rounded-xl px-4 py-3 outline-none border-2 border-transparent focus:border-[#17409A]/20" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-[#6B7280] tracking-wide uppercase">SKU *</label>
                    <input required name="sku" value={formData.sku} onChange={handleChange} placeholder="SKU-XXXXXX" className="w-full bg-[#F9FAFB] text-sm font-semibold text-[#1A1A2E] rounded-xl px-4 py-3 outline-none border-2 border-transparent focus:border-[#17409A]/20" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-[#6B7280] tracking-wide uppercase">Kho hàng & Tồn kho (Cơ bản)</label>
                    <div className="flex gap-2">
                       <div className="flex-1 relative">
                          <select disabled className="w-full bg-[#F1F5F9] text-[#6B7280] text-xs font-bold rounded-xl pl-3 pr-8 py-3 appearance-none cursor-not-allowed">
                             <option>Kho Tổng (Mặc định)</option>
                          </select>
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#9CA3AF]">
                             <MdExpandMore />
                          </div>
                       </div>
                       <div className="w-24">
                          <input type="number" name="stockQuantity" value={formData.stockQuantity} onChange={handleChange} placeholder="Số lượng" className="w-full bg-[#F9FAFB] text-sm font-black text-[#17409A] rounded-xl px-3 py-3 outline-none border-2 border-transparent focus:border-[#17409A]/20" />
                       </div>
                    </div>
                  </div>
                  <div className="space-y-1.5 md:col-span-2 p-5 bg-white/60 rounded-3xl border border-white space-y-5">
                    <div className="flex items-center justify-between px-1">
                      <div className="flex items-center gap-2">
                        <MdAttachMoney className="text-[#17409A] text-lg" />
                        <h3 className="text-xs font-black text-[#1A1A2E] uppercase">Cấu hình Size & Giá (Variant)</h3>
                      </div>
                      <div className="flex gap-1.5">
                        {STANDARD_SIZES.map(s => {
                          const isSelected = formData.variants.some(v => v.sizeTag === s);
                          return (
                            <button key={s} type="button" onClick={() => toggleSize(s)} className={`w-8 h-8 rounded-lg text-[10px] font-black transition-all border-2 ${isSelected ? 'bg-[#17409A] text-white border-[#17409A]' : 'bg-white text-[#6B7280] border-gray-100 hover:border-[#17409A]'}`}>{s}</button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="space-y-3">
                      {formData.variants.length === 0 ? (
                        <div className="py-8 text-center bg-white/40 rounded-2xl border-2 border-dashed border-gray-100 italic text-xs text-[#9CA3AF] font-bold">Vui lòng chọn các size khả dụng của gấu</div>
                      ) : (
                        <div className="grid grid-cols-1 gap-3">
                           {formData.variants.map((variant) => (
                             <div key={variant.sizeTag} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-start md:items-center gap-4 animate-in slide-in-from-left duration-200">
                               <div className="w-10 h-10 rounded-xl bg-[#17409A] text-white flex items-center justify-center font-black text-xs shrink-0">{variant.sizeTag}</div>
                               <div className="flex-1 w-full space-y-3">
                                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1 w-full">
                                    <div className="space-y-1">
                                      <label className="text-[9px] font-black text-[#9CA3AF] uppercase">Giá vốn</label>
                                      <input type="number" value={variant.baseCost} onChange={(e) => updateVariant(variant.sizeTag, { baseCost: Number(e.target.value) })} className="w-full bg-transparent text-sm font-black text-[#1A1A2E] outline-none" />
                                    </div>
                                    <div className="space-y-1">
                                      <label className="text-[9px] font-black text-[#9CA3AF] uppercase">Gia công</label>
                                      <input type="number" value={variant.assemblyCost} onChange={(e) => updateVariant(variant.sizeTag, { assemblyCost: Number(e.target.value) })} className="w-full bg-transparent text-sm font-black text-[#1A1A2E] outline-none" />
                                    </div>
                                    <div className="space-y-1">
                                      <label className="text-[9px] font-black text-[#9CA3AF] uppercase">Cân nặng (g)</label>
                                      <input type="number" value={variant.weightGram} onChange={(e) => updateVariant(variant.sizeTag, { weightGram: Number(e.target.value) })} className="w-full bg-transparent text-sm font-black text-[#1A1A2E] outline-none" />
                                    </div>
                                    <div className="space-y-1">
                                      <label className="text-[9px] font-black text-[#17409A] uppercase">Giá bán (+20%)</label>
                                      <div className="text-sm font-black text-[#17409A]">{variant.price.toLocaleString()} đ</div>
                                    </div>
                                    <div className="space-y-1">
                                      <label className="text-[9px] font-black text-[#EF4444] uppercase">Tồn kho</label>
                                      <input type="number" value={variant.stockQuantity} onChange={(e) => updateVariant(variant.sizeTag, { stockQuantity: Number(e.target.value) })} className="w-full bg-white rounded-lg px-2 py-0.5 border border-[#EF4444]/20 text-sm font-black text-[#EF4444] outline-none focus:border-[#EF4444]" />
                                    </div>
                                 </div>
                                 <div className="pt-2 border-t border-gray-50">
                                    <input 
                                      type="text" 
                                      placeholder="Mô tả size (VD: Cao 30cm, Rộng 20cm...)" 
                                      value={variant.sizeDescription} 
                                      onChange={(e) => updateVariant(variant.sizeTag, { sizeDescription: e.target.value })} 
                                      className="w-full bg-[#F9FAFB]/50 text-xs font-semibold text-[#1A1A2E] rounded-xl px-4 py-2 outline-none border-2 border-transparent focus:border-[#17409A]/10 transition-all placeholder:text-[#9CA3AF]" 
                                    />
                                 </div>
                               </div>
                               <button type="button" onClick={() => toggleSize(variant.sizeTag)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><MdDeleteOutline className="text-lg" /></button>
                             </div>
                           ))}
                        </div>
                      )}
                    </div>

                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-[11px] font-black text-[#6B7280] tracking-wide uppercase">Cấu hình & Hiển thị</label>
                    <div className="flex flex-wrap gap-4 pt-1 pb-2">
                      <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} className="w-4 h-4 rounded text-[#17409A]" /><span className="text-xs font-bold text-[#1A1A2E]">Hiển thị</span></label>
                      <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" name="isPersonalizable" checked={formData.isPersonalizable} onChange={handleChange} className="w-4 h-4 rounded text-[#7C5CFC]" /><span className="text-xs font-bold text-[#1A1A2E]">Hỗ trợ Custom</span></label>
                    </div>
                    <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Mô tả sản phẩm..." rows={3} className="w-full bg-[#F9FAFB] text-sm p-3 rounded-xl border-none outline-none resize-none" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                    <label className="text-[11px] font-black text-[#6B7280] tracking-wide uppercase">Bộ sưu tập Media</label>
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      {formData.media.map((m, idx) => (
                        <div key={idx} className="group relative aspect-square rounded-xl bg-gray-50 border overflow-hidden">
                          <img src={m.url} className="w-full h-full object-cover" />
                          <button type="button" onClick={() => setFormData(p => ({ ...p, media: p.media.filter((_, i) => i !== idx) }))} className="absolute inset-0 bg-red-500/80 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <MdDeleteOutline size={20} />
                          </button>
                        </div>
                      ))}
                      <div className="aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-1 relative hover:bg-gray-50 transition-colors">
                        {isUploadingImage ? <div className="animate-spin w-5 h-5 border-2 border-[#17409A] border-t-transparent rounded-full" /> : <MdAddPhotoAlternate className="text-gray-400" />}
                        <span className="text-[8px] font-bold text-gray-400">Thêm ảnh</span>
                        <input type="file" onChange={(e) => setUploadFile(e.target.files?.[0] ?? null)} className="absolute inset-0 opacity-0 cursor-pointer" />
                      </div>
                    </div>
                    {uploadFile && !isUploadingImage && (
                      <button type="button" onClick={handleUploadImage} className="w-full py-2 bg-[#17409A] text-white rounded-lg text-xs font-bold">Upload "{uploadFile.name}"</button>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                    <label className="text-[11px] font-black text-[#6B7280] tracking-wide uppercase">Phân loại (Categories & Characters)</label>
                    <div className="space-y-3">
                      <CustomDropdown 
                        options={categories.map(c => ({ label: c.name, value: c.categoryId }))} 
                        value={selectedCategoryIds[0] || ""} 
                        onChange={v => setSelectedCategoryIds(v ? [v] : [])} 
                        placeholder="Chọn Category"
                        buttonClassName="w-full bg-[#F9FAFB] text-sm font-semibold p-3 rounded-xl flex justify-between items-center" 
                      />
                      <CustomDropdown 
                        options={characters.map(c => ({ label: c.name, value: c.characterId }))} 
                        value={selectedCharacterIds[0] || ""} 
                        onChange={v => setSelectedCharacterIds(v ? [v] : [])} 
                        placeholder="Chọn Character"
                        buttonClassName="w-full bg-[#F9FAFB] text-sm font-semibold p-3 rounded-xl flex justify-between items-center" 
                      />
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-1.5">
                    <label className="text-[11px] font-black text-[#6B7280] tracking-wide uppercase">Model 3D URL</label>
                    <input name="model3DUrl" value={formData.model3DUrl} onChange={handleChange} placeholder="https://..." className="w-full bg-[#F9FAFB] text-sm font-semibold p-3 rounded-xl border-none outline-none" />
                  </div>
                </div>
              </div>

              {formData.isPersonalizable && (
                <div className="space-y-6">
                  {/* Accessory Selection */}
                  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                    <p className="text-xs font-black text-[#17409A] uppercase tracking-widest">Phụ kiện được gán</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                       {accessoryList.map((acc) => {
                          const isSelected = selectedAccessoryIds.includes(acc.accessoryId);
                          return (
                             <button 
                                key={acc.accessoryId} 
                                type="button"
                                onClick={() => setSelectedAccessoryIds(prev => isSelected ? prev.filter(id => id !== acc.accessoryId) : [...prev, acc.accessoryId])} 
                                className={`flex items-center gap-2 p-2 rounded-xl border-2 transition-all ${isSelected ? 'border-[#17409A] bg-[#F4F7FF]' : 'border-white bg-gray-50 hover:border-gray-200'}`}
                             >
                                <div className="w-8 h-8 rounded-lg overflow-hidden bg-white shrink-0">
                                   <img src={acc.imageUrl || '/teddy_bear.png'} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 text-left min-w-0">
                                   <p className="text-[10px] font-black text-[#1A1A2E] truncate">{acc.name}</p>
                                </div>
                                {isSelected && <MdCheckCircle className="text-[#17409A] text-base shrink-0" />}
                             </button>
                          );
                       })}
                    </div>
                  </div>

                  {/* Matrix */}
                  <div className="bg-white p-6 rounded-2xl border border-[#17409A]/10 shadow-lg space-y-5">
                    <div className="bg-[#17409A]/5 border border-[#17409A]/10 p-4 rounded-xl flex items-start gap-3">
                      <div className="bg-[#17409A] text-white p-1 rounded-lg shrink-0 mt-0.5">
                        <MdOutlineAddPhotoAlternate className="text-sm" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-[11px] font-bold text-[#17409A] leading-tight">Cấu hình ma trận ảnh phụ kiện</p>
                        <p className="text-[10px] font-semibold text-[#17409A]/80 leading-relaxed">
                          Hệ thống tự động tạo ma trận dựa trên các phụ kiện đã chọn ở trên.
                        </p>
                      </div>
                    </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-black text-[#1A1A2E] flex items-center gap-2">Ma trận tổ hợp ảnh <span className="px-2 py-0.5 bg-[#FF6B9D] text-white text-[10px] rounded-full">{allCombinations.length}</span></p>
                    </div>
                  </div>

                  {allCombinations.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {allCombinations.map((combo) => {
                        const comboKey = normalizeKey(combo.key);
                        const ci = comboImages.find(x => normalizeKey(x.combinationKey) === comboKey);
                        const file = matrixUploadFiles[combo.key];
                        return (
                          <div key={combo.key} className={`p-4 rounded-xl border-2 transition-all ${ci?.imageUrl ? 'border-green-100 bg-green-50/30' : 'border-dashed border-gray-200 bg-gray-50/50'}`}>
                            <p className="text-[10px] font-bold text-[#1A1A2E] mb-2 truncate" title={combo.label}>{combo.label}</p>
                            <div className="flex items-center gap-3">
                              <div className="w-14 h-14 rounded-lg bg-white border flex items-center justify-center overflow-hidden shrink-0">
                                {ci?.imageUrl ? <img src={ci.imageUrl} className="w-full h-full object-cover" /> : <MdCloudUpload className="text-gray-300" />}
                              </div>
                              <div className="flex-1 space-y-2">
                                <input type="file" onChange={(e) => setMatrixUploadFiles(p => ({ ...p, [combo.key]: e.target.files?.[0] ?? null }))} className="block w-full text-[9px] text-slate-500 file:mr-2 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-[9px] file:font-semibold file:bg-violet-50 file:text-violet-700" />
                                <button type="button" onClick={() => handleUploadMatrixImage(combo.key)} disabled={!file || isUploadingImage} className="w-full py-1 bg-[#17409A] text-white rounded-lg text-[9px] font-bold">Upload</button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="py-8 border-2 border-dashed border-gray-100 rounded-2xl flex flex-col items-center justify-center text-center px-6">
                       <p className="text-xs font-semibold text-[#9CA3AF]">Gấu chưa có phụ kiện liên kết nên không có ma trận ảnh.</p>
                    </div>
                  )}
                  </div>
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
