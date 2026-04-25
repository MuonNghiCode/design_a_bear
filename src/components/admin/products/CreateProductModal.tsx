import { useEffect, useState, useMemo } from "react";
import {
  MdClose,
  MdCloudUpload,
  MdArrowForward,
  MdAddPhotoAlternate,
} from "react-icons/md";
import type {
  CreateProductRequest,
  CreateProductComboImageRequest,
  ProductListItem,
} from "@/types";
import CustomDropdown from "@/components/shared/CustomDropdown";
import { useTaxonomyApi } from "@/hooks";
import { useToast } from "@/contexts/ToastContext";
import { mediaService } from "@/services/media.service";
import { productService } from "@/services/product.service";
import { accessoryService } from "@/services/accessory.service";
import { generateSlug } from "@/utils/string";
import { generateCombinationKey } from "@/utils/combination";

interface Props {
  onClose: () => void;
  onSubmit?: (payload: CreateProductRequest) => Promise<boolean>;
  onSuccess?: () => void;
  isSubmitting: boolean;
}

type Step = 1 | 2;

const SIZE_TAG_OPTIONS = [
  { label: "XS - Rất nhỏ", value: "XS" },
  { label: "S - Nhỏ", value: "S" },
  { label: "M - Vừa", value: "M" },
  { label: "L - Lớn", value: "L" },
  { label: "XL - Rất lớn", value: "XL" },
  { label: "XXL - Cực lớn", value: "XXL" },
  { label: "OS - Một kích cỡ", value: "OS" },
];

export default function CreateProductModal({
  onClose,
  onSuccess,
  isSubmitting: externalIsSubmitting,
}: Props) {
  const toast = useToast();
  const [step, setStep] = useState<Step>(1);
  const [internalIsSubmitting, setInternalIsSubmitting] = useState(false);
  const isSubmitting = externalIsSubmitting || internalIsSubmitting;

  // Step 1 Data
  const [formData, setFormData] = useState({
    name: "",
    productType: "Standard",
    description: "",
    isPersonalizable: false,
    isActive: true,
    price: "",
    sku: "",
    weightGram: "500",
    stockQuantity: "0",
    slug: "",
    media: [] as { url: string; altText: string; sortOrder: number }[],
  });
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [selectedCharacterIds, setSelectedCharacterIds] = useState<string[]>(
    [],
  );
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Step 2 Data (Variants)
  const [selectedSizeTags, setSelectedSizeTags] = useState<string[]>([]);
  const [variantsData, setVariantsData] = useState<
    Record<
      string,
      {
        sizeDescription: string;
        price: string;
        weightGram: string;
        sku: string;
        baseCost: string;
        assemblyCost: string;
        stockQuantity: string;
      }
    >
  >({});

  // Accessory & Combo Image Data (Integrated)
  const [accessoryList, setAccessoryList] = useState<ProductListItem[]>([]);
  const [selectedAccessoryIds, setSelectedAccessoryIds] = useState<string[]>(
    [],
  );
  const [comboImages, setComboImages] = useState<
    CreateProductComboImageRequest[]
  >([]);
  const [matrixUploadFiles, setMatrixUploadFiles] = useState<
    Record<string, File | null>
  >({});

  const {
    loading: taxonomyLoading,
    categories,
    characters,
    fetchTaxonomy,
  } = useTaxonomyApi();

  const isBaseBear =
    formData.productType === "BASE_BEAR" || formData.productType === "Standard";
  const isAccessory = formData.productType === "ACCESSORY";

  useEffect(() => {
    fetchTaxonomy();
  }, [fetchTaxonomy]);

  // Fetch accessories
  useEffect(() => {
    (async () => {
      try {
        const accRes = await accessoryService.getAll();
        if (accRes.isSuccess && accRes.value) {
          const mapped = accRes.value.map(
            (a) =>
              ({
                productId: a.accessoryId,
                name: a.name,
                imageUrl: a.imageUrl || null,
                price: a.targetPrice,
                sku: a.sku,
                productType: "ACCESSORY",
              }) as any,
          );
          setAccessoryList(mapped);
        }
      } catch (err) {
        console.error("Failed to fetch accessories", err);
      }
    })();
  }, []);

  // Combination Matrix Logic
  const matrixAccessoryIds = useMemo(() => {
    return selectedAccessoryIds.filter((id) => {
      const acc = accessoryList.find((a) => a.productId === id);
      if (!acc) return false;
      const name = (acc.name || "").toUpperCase();
      return !name.includes("AI PROCESSOR");
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
    const combinations = results.filter((combo) => combo.length > 0);
    return combinations.map((combo) => ({
      key: generateCombinationKey(combo),
      label: combo
        .map(
          (id) => accessoryList.find((a) => a.productId === id)?.name || "N/A",
        )
        .join(" + "),
    }));
  }, [matrixAccessoryIds, isBaseBear, accessoryList]);

  useEffect(() => {
    if (allCombinations.length > 0) {
      setComboImages((prev) => {
        const next = [...prev];
        allCombinations.forEach((combo) => {
          if (!next.find((ci) => ci.combinationKey === combo.key)) {
            next.push({ combinationKey: combo.key, imageUrl: "" });
          }
        });
        return next;
      });
    }
  }, [allCombinations]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => {
      let val = value;
      if (type === "number") {
        val = Math.max(0, parseFloat(value) || 0).toString();
      }
      const next = {
        ...prev,
        [name]:
          type === "checkbox" ? (e.target as HTMLInputElement).checked : val,
      };
      if (name === "name") {
        next.slug = generateSlug(value);
      }
      return next;
    });
  };

  // Sync Variant SKUs and Base Prices when product info changes
  useEffect(() => {
    if (formData.name) {
      setVariantsData((prev) => {
        const next = { ...prev };
        Object.keys(next).forEach((tag) => {
          next[tag] = {
            ...next[tag],
            sku: next[tag].sku || `${formData.name}-${tag}`,
          };
        });
        return next;
      });
    }
  }, [formData.name]);

  const calculatePrice = (base: string, assembly: string) => {
    const b = parseFloat(base) || 0;
    const a = parseFloat(assembly) || 0;
    return Math.ceil((b + a) * 1.2).toString();
  };

  const handleUploadComboImage = async (key: string) => {
    const file = matrixUploadFiles[key];
    if (!file) return;
    setIsUploadingImage(true);
    try {
      const res = await mediaService.uploadMedia(file, "combos");
      if (!res.isSuccess || !res.value?.publicUrl)
        throw new Error("Upload thất bại");
      const url = res.value.publicUrl;
      setComboImages((prev) => {
        const idx = prev.findIndex((ci) => ci.combinationKey === key);
        const next = [...prev];
        if (idx >= 0) {
          next[idx] = { ...next[idx], imageUrl: url };
        } else {
          next.push({ combinationKey: key, imageUrl: url });
        }
        return next;
      });
      setMatrixUploadFiles((prev) => ({ ...prev, [key]: null }));
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
      toast.error("Vui lòng chọn ít nhất 1 category.");
      return;
    }
    if (isAccessory) {
      await handleCreateFinal();
    } else {
      setStep(2);
    }
  };

  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSizeTags.length === 0) {
      toast.error("Vui lòng chọn ít nhất 1 kích cỡ.");
      return;
    }
    handleCreateFinal();
  };

  // Sync Variant SKUs when product name or base SKU changes
  useEffect(() => {
    if (formData.name) {
      setVariantsData((prev) => {
        const next = { ...prev };
        Object.keys(next).forEach((tag) => {
          if (!next[tag]?.sku || next[tag]?.sku.includes("-")) {
            next[tag] = {
              ...next[tag],
              sku: `${formData.name}-${tag}`,
            };
          }
        });
        return next;
      });
    }
  }, [formData.name]);

  const handleCreateFinal = async () => {
    const payload: CreateProductRequest = {
      name: formData.name,
      slug: formData.slug || generateSlug(formData.name),
      productType: formData.productType,
      description: formData.description,
      isPersonalizable: isAccessory ? false : formData.isPersonalizable,
      isActive: isAccessory ? true : formData.isActive,
      price: Number(formData.price) || 0,
      sku: formData.sku || "",
      weightGram: Number(formData.weightGram) || 0,
      stockQuantity: Number(formData.stockQuantity) || 0,
      model3DUrl: "",
      categoryIds: isAccessory ? [] : selectedCategoryIds,
      characterIds: isAccessory ? [] : selectedCharacterIds,
      accessoryIds: selectedAccessoryIds,
      media: formData.media.map((m) => ({
        url: m.url,
        altText: m.altText || formData.name,
        sortOrder: m.sortOrder,
      })),
      variants: isAccessory
        ? []
        : selectedSizeTags.map((tag) => ({
            sizeTag: tag,
            sizeDescription: variantsData[tag]?.sizeDescription || "",
            sku: variantsData[tag]?.sku || `${formData.sku}-${tag}`,
            price: Number(variantsData[tag]?.price || 0),
            weightGram: Number(
              variantsData[tag]?.weightGram || formData.weightGram,
            ),
            baseCost: Number(variantsData[tag]?.baseCost || 0),
            assemblyCost: Number(variantsData[tag]?.assemblyCost || 0),
            stockQuantity: Number(variantsData[tag]?.stockQuantity || 0),
          })),
      comboImages: isBaseBear && formData.isPersonalizable ? comboImages : [],
    };

    setInternalIsSubmitting(true);
    try {
      const res = await productService.createProduct(payload);
      if (res.isSuccess) {
        toast.success("Tạo sản phẩm thành công!");
        onSuccess?.();
        onClose();
      } else {
        throw new Error(res.error?.description || "Tạo sản phẩm thất bại");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Có lỗi xảy ra");
    } finally {
      setInternalIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-[#F4F7FF] rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col scale-in-center animate-in fade-in zoom-in duration-300">
        <div className="px-6 py-5 border-b border-white/50 bg-white/50 flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-[#1A1A2E]">
                Thêm sản phẩm
              </h2>
              <div className="px-2 py-0.5 rounded-full bg-[#17409A]/10 text-[#17409A] text-[9px] font-black uppercase">
                Bước {step}/2
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-2xl bg-white text-[#9CA3AF] hover:text-[#1A1A2E] shadow-sm"
          >
            <MdClose className="text-xl" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          {step === 1 ? (
            <form
              id="createProductForm"
              onSubmit={handleStep1Submit}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-[#6B7280] uppercase">
                    Tên sản phẩm *
                  </label>
                  <input
                    required
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-white text-sm font-semibold rounded-2xl px-4 py-3 outline-none border-2 border-transparent focus:border-[#17409A]/20 shadow-sm"
                  />
                </div>
                {/* Loại sản phẩm field removed as per request to fix it to Standard */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-[#6B7280] uppercase">
                    Slug (Tự động)
                  </label>
                  <input
                    disabled
                    name="slug"
                    value={formData.slug}
                    placeholder="tự-động-tạo-từ-tên"
                    className="w-full bg-gray-50 text-sm font-semibold rounded-2xl px-4 py-3 outline-none border-2 border-transparent text-gray-400 cursor-not-allowed shadow-inner"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-[11px] font-black text-[#6B7280] uppercase tracking-wide">
                    Phân loại (Categories & Characters) *
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <CustomDropdown
                      options={categories.filter(c => c.isActive !== false).map((c) => ({
                        label: c.name,
                        value: c.categoryId,
                      }))}
                      value={selectedCategoryIds[0] || ""}
                      onChange={(v) => setSelectedCategoryIds(v ? [v] : [])}
                      placeholder="Chọn Category"
                      buttonClassName="w-full flex items-center justify-between bg-white text-sm font-semibold rounded-2xl px-4 py-3 shadow-sm hover:border-[#17409A]/40 transition-colors"
                    />
                    <CustomDropdown
                      options={characters.filter(c => c.isActive !== false).map((c) => ({
                        label: c.name,
                        value: c.characterId,
                      }))}
                      value={selectedCharacterIds[0] || ""}
                      onChange={(v) => setSelectedCharacterIds(v ? [v] : [])}
                      placeholder="Chọn Character"
                      buttonClassName="w-full flex items-center justify-between bg-white text-sm font-semibold rounded-2xl px-4 py-3 shadow-sm hover:border-[#17409A]/40 transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-[#6B7280] uppercase">
                  Mô tả sản phẩm
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={2}
                  className="w-full bg-white text-sm font-semibold rounded-2xl px-4 py-3 outline-none border-2 border-transparent focus:border-[#17409A]/20 shadow-sm resize-none"
                  placeholder="Nhập mô tả ngắn về sản phẩm..."
                />
              </div>

              <div className="space-y-3">
                <label className="text-[11px] font-black text-[#6B7280] uppercase tracking-wide">
                  Gallery Hình ảnh *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
                  {formData.media.map((m, idx) => (
                    <div
                      key={idx}
                      className="group relative aspect-square rounded-2xl bg-white border border-[#E5E7EB] overflow-hidden"
                    >
                      <img src={m.url} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() =>
                          setFormData((p) => ({
                            ...p,
                            media: p.media.filter((_, i) => i !== idx),
                          }))
                        }
                        className="absolute top-1 right-1 w-7 h-7 flex items-center justify-center rounded-lg bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity font-bold"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <div className="aspect-square rounded-2xl border-2 border-dashed border-[#D7DEEF] bg-white hover:bg-[#F8F9FF] transition-all flex flex-col items-center justify-center gap-2 relative">
                    <MdAddPhotoAlternate className="text-2xl text-[#6B7280]" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        setIsUploadingImage(true);
                        try {
                          const res = await mediaService.uploadMedia(
                            file,
                            "products",
                          );
                          if (res.isSuccess && res.value?.publicUrl) {
                            setFormData((p) => ({
                              ...p,
                              media: [
                                ...p.media,
                                {
                                  url: res.value!.publicUrl!,
                                  altText: formData.name,
                                  sortOrder: p.media.length + 1,
                                },
                              ],
                            }));
                          }
                        } finally {
                          setIsUploadingImage(false);
                        }
                      }}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex flex-wrap gap-6 pt-2">
                  <label className="flex items-center gap-4 cursor-pointer">
                    <div className="relative">
                      <input
                        type="checkbox"
                        name="isPersonalizable"
                        checked={formData.isPersonalizable}
                        onChange={handleChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#17409A]"></div>
                    </div>
                    <span className="text-sm font-bold text-[#1A1A2E]">
                      Hỗ trợ Custom & Phụ kiện
                    </span>
                  </label>
                </div>
              </div>
            </form>
          ) : (
            <form
              id="variantsForm"
              onSubmit={handleStep2Submit}
              className="space-y-6 animate-in slide-in-from-right duration-300"
            >
              <div className="space-y-4">
                <label className="text-[11px] font-black text-[#6B7280] uppercase">
                  Kích cỡ *
                </label>
                <div className="flex flex-wrap gap-2">
                  {SIZE_TAG_OPTIONS.map((opt) => {
                    const isSelected = selectedSizeTags.includes(opt.value);
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => {
                          if (isSelected)
                            setSelectedSizeTags((p) =>
                              p.filter((t) => t !== opt.value),
                            );
                          else {
                            setSelectedSizeTags((p) => [...p, opt.value]);
                            if (!variantsData[opt.value])
                              setVariantsData((p) => ({
                                ...p,
                                [opt.value]: {
                                  sizeDescription: "",
                                  price: formData.price,
                                  weightGram: formData.weightGram,
                                  sku: `${formData.name || formData.sku}-${opt.value}`,
                                  baseCost: "0",
                                  assemblyCost: "0",
                                  stockQuantity: "0",
                                },
                              }));
                          }
                        }}
                        className={`px-4 py-2 rounded-xl text-xs font-black border-2 ${isSelected ? "bg-[#17409A] border-[#17409A] text-white shadow-lg" : "bg-white border-gray-100 text-[#1A1A2E]"}`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {selectedSizeTags.length > 0 && (
                <div className="grid grid-cols-1 gap-4 mt-6">
                  <p className="text-sm font-black text-[#1A1A2E] flex items-center gap-2">
                    <span className="w-1.5 h-4 bg-[#17409A] rounded-full" />
                    Chi tiết thông số các size ({selectedSizeTags.length})
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedSizeTags.map((tag) => (
                      <div
                        key={tag}
                        className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-4 relative overflow-hidden"
                      >
                        <div className="flex justify-between items-center">
                          <span className="px-3 py-1 rounded-full bg-[#17409A] text-white text-[10px] font-black uppercase">
                            Size {tag}
                          </span>
                          <span className="text-[10px] font-bold text-[#6B7280]">
                            SKU: {formData.name || formData.sku}-{tag}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="col-span-2 space-y-1">
                            <label className="text-[10px] font-black text-[#6B7280] uppercase">
                              Mô tả cụ thể *
                            </label>
                            <input
                              required
                              placeholder="VD: Cao 30cm, Nặng 500g"
                              value={variantsData[tag]?.sizeDescription || ""}
                              onChange={(e) =>
                                setVariantsData((v) => ({
                                  ...v,
                                  [tag]: {
                                    ...v[tag],
                                    sizeDescription: e.target.value,
                                  },
                                }))
                              }
                              className="w-full bg-[#F9FAFB] text-xs font-semibold p-2.5 rounded-xl outline-none focus:ring-1 ring-[#17409A]/20 transition-all"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-black text-[#6B7280] uppercase">
                              Giá vốn (VND)
                            </label>
                            <input
                              type="number"
                              value={variantsData[tag]?.baseCost}
                              onChange={(e) => {
                                const val = Math.max(
                                  0,
                                  parseFloat(e.target.value) || 0,
                                ).toString();
                                setVariantsData((v) => {
                                  const base = val;
                                  const assembly = v[tag]?.assemblyCost || "0";
                                  return {
                                    ...v,
                                    [tag]: {
                                      ...v[tag],
                                      baseCost: base,
                                      price: calculatePrice(base, assembly),
                                    },
                                  };
                                });
                              }}
                              min="0"
                              className="w-full bg-[#F9FAFB] text-xs font-semibold p-2.5 rounded-xl outline-none focus:ring-1 ring-[#17409A]/20"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-black text-[#6B7280] uppercase">
                              Giá gia công (VND)
                            </label>
                            <input
                              type="number"
                              value={variantsData[tag]?.assemblyCost}
                              onChange={(e) => {
                                const val = Math.max(
                                  0,
                                  parseFloat(e.target.value) || 0,
                                ).toString();
                                setVariantsData((v) => {
                                  const base = v[tag]?.baseCost || "0";
                                  const assembly = val;
                                  return {
                                    ...v,
                                    [tag]: {
                                      ...v[tag],
                                      assemblyCost: assembly,
                                      price: calculatePrice(base, assembly),
                                    },
                                  };
                                });
                              }}
                              min="0"
                              className="w-full bg-[#F9FAFB] text-xs font-semibold p-2.5 rounded-xl outline-none focus:ring-1 ring-[#17409A]/20"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-black text-[#17409A] uppercase">
                              Giá bán tổng (Auto)
                            </label>
                            <div className="w-full bg-[#17409A]/5 text-[#17409A] text-xs font-black p-2.5 rounded-xl border border-[#17409A]/10">
                              {new Intl.NumberFormat().format(
                                Number(variantsData[tag]?.price),
                              )}{" "}
                              đ
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-black text-[#6B7280] uppercase">
                              Tồn kho
                            </label>
                            <input
                              type="number"
                              value={variantsData[tag]?.stockQuantity}
                              onChange={(e) => {
                                const val = Math.max(
                                  0,
                                  parseInt(e.target.value) || 0,
                                ).toString();
                                setVariantsData((v) => ({
                                  ...v,
                                  [tag]: {
                                    ...v[tag],
                                    stockQuantity: val,
                                  },
                                }));
                              }}
                              min="0"
                              className="w-full bg-[#F9FAFB] text-xs font-semibold p-2.5 rounded-xl outline-none focus:ring-1 ring-[#17409A]/20"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {isBaseBear && formData.isPersonalizable && (
                <div className="space-y-8 pt-6 border-t border-gray-100">
                  <div className="space-y-4">
                    <p className="text-sm font-black text-[#1A1A2E]">
                      Chọn phụ kiện có thể đi kèm ({selectedAccessoryIds.length}
                      )
                    </p>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                      {accessoryList.map((acc) => {
                        const isSelected = selectedAccessoryIds.includes(
                          acc.productId,
                        );
                        return (
                          <div
                            key={acc.productId}
                            onClick={() =>
                              setSelectedAccessoryIds((p) =>
                                isSelected
                                  ? p.filter((id) => id !== acc.productId)
                                  : [...p, acc.productId],
                              )
                            }
                            className={`cursor-pointer p-2 rounded-2xl border-2 ${isSelected ? "border-[#17409A] bg-[#17409A]/5 ring-4 ring-[#17409A]/5" : "border-gray-100 bg-white"}`}
                          >
                            <div className="aspect-square rounded-xl bg-gray-50 flex items-center justify-center overflow-hidden mb-1">
                              {acc.imageUrl ? (
                                <img
                                  src={acc.imageUrl}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <MdAddPhotoAlternate className="text-gray-300" />
                              )}
                            </div>
                            <p className="text-[8px] font-black truncate">
                              {acc.name}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {selectedAccessoryIds.length > 0 && (
                    <div className="space-y-4 pt-4 border-t border-gray-100">
                      <p className="text-sm font-black text-[#1A1A2E]">
                        Tổ hợp hình ảnh ({allCombinations.length})
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                        {allCombinations.map((combo) => {
                          const ci = comboImages.find(
                            (x) => x.combinationKey === combo.key,
                          );
                          return (
                            <div
                              key={combo.key}
                              className="p-3 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col gap-2"
                            >
                              <p className="text-[10px] font-black truncate">
                                {combo.label}
                              </p>
                              <div className="flex items-center gap-2">
                                <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
                                  {ci?.imageUrl ? (
                                    <img
                                      src={ci.imageUrl}
                                      className="w-full h-full object-cover rounded-lg"
                                    />
                                  ) : (
                                    <MdCloudUpload className="text-gray-300" />
                                  )}
                                </div>
                                <input
                                  type="file"
                                  onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;
                                    setIsUploadingImage(true);
                                    try {
                                      const res =
                                        await mediaService.uploadMedia(
                                          file,
                                          "combos",
                                        );
                                      if (
                                        res.isSuccess &&
                                        res.value?.publicUrl
                                      ) {
                                        setComboImages((p) => {
                                          const idx = p.findIndex(
                                            (x) =>
                                              x.combinationKey === combo.key,
                                          );
                                          const next = [...p];
                                          if (idx >= 0)
                                            next[idx] = {
                                              ...next[idx],
                                              imageUrl: res.value!.publicUrl!,
                                            };
                                          else
                                            next.push({
                                              combinationKey: combo.key,
                                              imageUrl: res.value!.publicUrl!,
                                            });
                                          return next;
                                        });
                                      }
                                    } finally {
                                      setIsUploadingImage(false);
                                    }
                                  }}
                                  className="text-[8px] flex-1"
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </form>
          )}
        </div>

        <div className="px-6 py-5 bg-white border-t border-gray-100 flex items-center justify-end gap-3 shrink-0">
          {step === 1 ? (
            <>
              <button
                onClick={onClose}
                className="px-6 py-3 rounded-2xl text-sm font-bold text-[#6B7280] bg-[#F4F7FF]"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                form="createProductForm"
                className="flex items-center gap-2 px-8 py-3 rounded-2xl text-sm font-bold text-white bg-[#17409A] shadow-lg"
              >
                Tiếp theo <MdArrowForward />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setStep(1)}
                className="px-6 py-3 rounded-2xl text-sm font-bold text-[#6B7280] bg-[#F4F7FF]"
              >
                Quay lại
              </button>
              <button
                type="submit"
                form="variantsForm"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-8 py-3 rounded-2xl text-sm font-bold text-white bg-[#17409A] shadow-lg disabled:opacity-50"
              >
                {isSubmitting ? "Đang tạo..." : "Tạo sản phẩm"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
