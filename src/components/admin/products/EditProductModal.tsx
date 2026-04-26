import { useState, useEffect, useMemo } from "react";
import {
  MdAddPhotoAlternate,
  MdDeleteOutline,
  MdCheckCircle,
  MdClose,
  MdOutlineAddPhotoAlternate,
  MdCloudUpload,
} from "react-icons/md";
import type {
  CreateProductComboImageRequest,
  UpdateProductRequest,
} from "@/types/requests";
import type { PersonalizationRule } from "@/types/responses";
import { productService } from "@/services/product.service";
import CustomDropdown from "@/components/shared/CustomDropdown";
import { useTaxonomyApi } from "@/hooks";
import { useToast } from "@/contexts/ToastContext";
import { mediaService } from "@/services/media.service";
import { generateSlug } from "@/utils/string";
import { generateCombinationKey } from "@/utils/combination";
import { accessoryService } from "@/services/accessory.service";
import { formatDate } from "@/utils/date";

const SIZE_TAG_OPTIONS = [
  { label: "XS - Rất nhỏ", value: "XS" },
  { label: "S - Nhỏ", value: "S" },
  { label: "M - Vừa", value: "M" },
  { label: "L - Lớn", value: "L" },
  { label: "XL - Rất lớn", value: "XL" },
  { label: "XXL - Cực lớn", value: "XXL" },
  { label: "OS - Một kích cỡ", value: "OS" },
];

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
    isPersonalizable: false,
    isActive: true,
    price: "",
    sku: "",
    weightGram: "0",
    stockQuantity: "0",
    createdAt: "",
    media: [] as { url: string; altText: string; sortOrder: number }[],
    variants: [] as any[],
  });

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

  const [personalizationRules, setPersonalizationRules] = useState<
    PersonalizationRule[]
  >([]);
  const [comboImages, setComboImages] = useState<
    CreateProductComboImageRequest[]
  >([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [selectedCharacterIds, setSelectedCharacterIds] = useState<string[]>(
    [],
  );

  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [matrixUploadFiles, setMatrixUploadFiles] = useState<
    Record<string, File | null>
  >({});

  const [accessoryList, setAccessoryList] = useState<any[]>([]);
  const [selectedAccessoryIds, setSelectedAccessoryIds] = useState<string[]>(
    [],
  );
  const [initialSelectedAccessoryIds, setInitialSelectedAccessoryIds] =
    useState<string[]>([]);
  const [internalIsSubmitting, setInternalIsSubmitting] = useState(false);
  const [linkedAccessories, setLinkedAccessories] = useState<any[]>([]);

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

  // Fetch product data and rules
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setIsFetching(true);
        const [productRes, rulesRes] = await Promise.all([
          productService.getProductById(productId),
          productService.getPersonalizationRules(productId),
        ]);

        if (mounted && productRes && productRes.isSuccess && productRes.value) {
          const p = productRes.value;

          // Collect all accessory data available initially
          let currentLinkedAcc: any[] = p.accessories || [];
          let currentRules = [] as any[];
          let currentSelectedIds = [] as string[];

          if (rulesRes && rulesRes.isSuccess && rulesRes.value) {
            currentRules = rulesRes.value;
            const ruleIds = currentRules.map(
              (r: any) => r.addonProduct.productId,
            );
            currentSelectedIds = [
              ...new Set([...currentSelectedIds, ...ruleIds]),
            ];
          }

          // Fetch dedicated linked accessories to ensure we have images/details
          try {
            const linkedAccRes =
              await accessoryService.getByProductId(productId);
            if (linkedAccRes.isSuccess && linkedAccRes.value) {
              const mapped = linkedAccRes.value.map((a: any) => ({
                productId: a.accessoryId,
                name: a.name,
                imageUrl: a.imageUrl || null,
                price: a.targetPrice,
                sku: a.sku,
                productType: "ACCESSORY",
              }));
              currentLinkedAcc = [...currentLinkedAcc, ...mapped];
              const linkedIds = mapped.map((a: any) => a.productId);
              currentSelectedIds = [
                ...new Set([...currentSelectedIds, ...linkedIds]),
              ];
            }
          } catch (e) {
            console.error("Failed to load linked accessories", e);
          }

          // Set basic form data
          setFormData({
            name: p.name || "",
            slug: p.slug || "",
            productType: p.productType,
            description: p.description || "",
            isPersonalizable: p.isPersonalizable || false,
            isActive: p.isActive,
            price: p.price?.toString() || "",
            sku: p.sku || "",
            weightGram: p.weightGram?.toString() || "0",
            stockQuantity: p.stockQuantity?.toString() || "0",
            createdAt: p.createdAt || "",
            media: p.media || [],
            variants: p.variants || [],
          });

          // Set all accessory/metadata states at once
          setSelectedCategoryIds((p.categories || []).map((c) => c.categoryId));
          setSelectedCharacterIds(
            (p.characters || []).map((c) => c.characterId),
          );
          setLinkedAccessories(currentLinkedAcc);
          setPersonalizationRules(currentRules);
          setSelectedAccessoryIds(currentSelectedIds);
          setInitialSelectedAccessoryIds(currentSelectedIds);

          // CRITICAL: Preserve image URLs from BE
          setComboImages(p.comboImages || []);

          if (p.variants && p.variants.length > 0) {
            setSelectedSizeTags(
              p.variants
                .map((v) => v.sizeTag)
                .filter((tag): tag is string => !!tag),
            );
            const vData: any = {};
            p.variants.forEach((v) => {
              if (v.sizeTag) {
                vData[v.sizeTag] = {
                  sizeDescription: v.sizeDescription || "",
                  price: v.price?.toString() || "",
                  weightGram: v.weightGram?.toString() || "",
                  sku: v.sku || "",
                  baseCost: v.baseCost?.toString() || "0",
                  assemblyCost: v.assemblyCost?.toString() || "0",
                  stockQuantity: v.onHand?.toString() || "0",
                };
              }
            });
            setVariantsData(vData);
          }
        }
      } catch (err) {
        console.error("Failed to load product details", err);
      } finally {
        if (mounted) setIsFetching(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [productId]);

  // Fetch all accessories for selection (independent of product fetch)
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const accRes = await accessoryService.getAll();
        if (mounted && accRes.isSuccess && accRes.value) {
          const mapped = accRes.value.map((a) => ({
            productId: a.accessoryId,
            name: a.name,
            imageUrl: a.imageUrl || null,
            price: a.targetPrice,
            sku: a.sku,
            productType: "ACCESSORY",
          }));
          setAccessoryList(mapped);
        }
      } catch (err) {
        console.error("Failed to load accessory list", err);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // ── Combination Matrix Logic ──
  const availableAccessories = useMemo(() => {
    if (!isBaseBear) return [];
    return selectedAccessoryIds
      .map((id) => {
        const linkedAcc = linkedAccessories.find(
          (a) => (a.productId || a.accessoryId) === id,
        );
        if (linkedAcc)
          return {
            id: linkedAcc.productId || linkedAcc.accessoryId,
            name: linkedAcc.name,
            imageUrl: linkedAcc.imageUrl, // Preserve image!
            productType: linkedAcc.productType || "ACCESSORY",
          };

        const rule = personalizationRules.find(
          (r) => r.addonProduct.productId === id,
        );
        if (rule)
          return {
            id: rule.addonProduct.productId,
            name: rule.addonProduct.name,
            imageUrl: rule.addonProduct.imageUrl,
            productType: rule.addonProduct.productType,
          };

        const accFromList = accessoryList.find((a) => a.productId === id);
        if (accFromList)
          return {
            id: accFromList.productId,
            name: accFromList.name,
            imageUrl: accFromList.imageUrl,
            productType: accFromList.productType,
          };

        // Fallback for ID matching even if names/images aren't loaded yet
        return {
          id: id,
          name: "Phụ kiện",
          imageUrl: null,
          productType: "ACCESSORY",
        };
      })
      .filter((acc): acc is any => {
        if (!acc) return false;
        // Don't filter out by type if it might exclude valid accessories saved as Standard
        const nameUpper = (acc.name || "").toUpperCase();
        const isAI = nameUpper.includes("AI PROCESSOR");
        // Only exclude the main product if it's accidentally in the current ID list
        return acc.id !== productId && !isAI;
      });
  }, [
    selectedAccessoryIds,
    accessoryList,
    linkedAccessories,
    personalizationRules,
    isBaseBear,
  ]);

  const allCombinations = useMemo(() => {
    const results: string[][] = [[]];
    for (const acc of availableAccessories) {
      const currentLength = results.length;
      for (let i = 0; i < currentLength; i++) {
        results.push([...results[i], acc.id]);
      }
    }
    const combinations = results.filter((combo) => combo.length > 0);
    return combinations.map((combo) => {
      // Very important: Use the utility that already sorts and joins with |
      const key = generateCombinationKey(combo);
      return {
        key,
        label: combo
          .map(
            (id) =>
              availableAccessories.find((a) => a.id === id)?.name || "Phụ kiện",
          )
          .join(" + "),
      };
    });
  }, [availableAccessories]);

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

  const calculatePrice = (base: string, assembly: string) => {
    const b = parseFloat(base) || 0;
    const a = parseFloat(assembly) || 0;
    return Math.ceil((b + a) * 1.2).toString();
  };

  // Sync Variant SKUs when product info changes
  useEffect(() => {
    if (formData.name || formData.sku) {
      setVariantsData((prev) => {
        const next = { ...prev };
        Object.keys(next).forEach((tag) => {
          // Update SKU based on current name if SKU is empty or follows the pattern
          // In Edit mode, we only update if it was following the pattern or is new
          if (!next[tag]?.sku || next[tag]?.sku.includes("-")) {
            next[tag] = {
              ...next[tag],
              sku: `${formData.name || formData.sku}-${tag}`,
            };
          }
        });
        return next;
      });
    }
  }, [formData.name, formData.sku]);

  const handleUploadImage = async () => {
    if (!uploadFile) return;
    setIsUploadingImage(true);
    try {
      const res = await mediaService.uploadMedia(uploadFile, "products");
      if (!res.isSuccess || !res.value?.publicUrl)
        throw new Error("Upload thất bại");
      const newMedia = {
        url: res.value.publicUrl,
        altText: formData.name,
        sortOrder: formData.media.length + 1,
      };
      setFormData((prev) => ({
        ...prev,
        media: [...prev.media, newMedia],
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
      if (!res.isSuccess || !res.value?.publicUrl)
        throw new Error("Upload thất bại");
      const url = res.value.publicUrl;
      setComboImages((prev) => {
        const idx = prev.findIndex((ci) => ci.combinationKey === key);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = { ...next[idx], imageUrl: url };
          return next;
        }
        return [...prev, { combinationKey: key, imageUrl: url }];
      });
      setMatrixUploadFiles((prev) => ({ ...prev, [key]: null }));
      toast.success("Upload ảnh tổ hợp thành công");
    } catch (err) {
      toast.error("Lỗi upload: " + (err instanceof Error ? err.message : ""));
    } finally {
      setIsUploadingImage(false);
    }
  };

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

  // Sync Variant SKUs when product name or base SKU changes
  useEffect(() => {
    if (formData.name || formData.sku) {
      setVariantsData((prev) => {
        const next = { ...prev };
        Object.keys(next).forEach((tag) => {
          // Only update if current SKU is empty or follows the name/sku pattern
          if (!next[tag]?.sku || next[tag]?.sku.includes("-")) {
            next[tag] = {
              ...next[tag],
              sku: `${formData.name || formData.sku}-${tag}`,
            };
          }
        });
        return next;
      });
    }
  }, [formData.name, formData.sku]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isBaseBear && allCombinations.length > 0) {
      const missing = allCombinations.find((combo) => {
        const ci = comboImages.find((x) => x.combinationKey === combo.key);
        return !ci || !ci.imageUrl;
      });
      if (missing) {
        toast.error(
          `Thiếu ảnh cho tổ hợp: ${missing.label}. Vui lòng kiểm tra lại các quy tắc phụ kiện.`,
        );
        return;
      }
    }

    setInternalIsSubmitting(true);
    try {
      // Updated: Product update no longer syncs personalization rules directly.
      // Rules are managed in the dedicated Personalization Rules tab.

      const payload: UpdateProductRequest = {
        name: formData.name,
        slug: formData.slug || generateSlug(formData.name),
        productType: formData.productType,
        description: formData.description,
        isPersonalizable: formData.isPersonalizable,
        isActive: formData.isActive,
        price: Number(variantsData[selectedSizeTags[0]]?.price || 0),
        sku: variantsData[selectedSizeTags[0]]?.sku || formData.name,
        weightGram: Number(variantsData[selectedSizeTags[0]]?.weightGram || 0),
        stockQuantity: 0,
        model3DUrl: "",
        categoryIds: selectedCategoryIds,
        characterIds: selectedCharacterIds,
        accessoryIds: selectedAccessoryIds,
        media: formData.media.map((m) => ({
          url: m.url,
          altText: m.altText || formData.name,
          sortOrder: m.sortOrder,
        })),
        variants: isBaseBear
          ? selectedSizeTags.map((tag) => ({
              sizeTag: tag,
              sizeDescription: variantsData[tag]?.sizeDescription || "",
              sku: variantsData[tag]?.sku || `${formData.name}-${tag}`,
              price: Number(variantsData[tag]?.price || 0),
              weightGram: Number(variantsData[tag]?.weightGram || 0),
              baseCost: Number(variantsData[tag]?.baseCost || 0),
              assemblyCost: Number(variantsData[tag]?.assemblyCost || 0),
              stockQuantity: Number(variantsData[tag]?.stockQuantity || 0),
            }))
          : [],
        comboImages: isBaseBear
          ? comboImages.map((ci) => ({
              combinationKey: ci.combinationKey,
              imageUrl: ci.imageUrl,
            }))
          : [],
      };

      const ok = await onSubmit(payload);
      if (ok) {
        onClose();
      }
    } catch (err) {
      console.error("Failed to update product:", err);
      toast.error("Lỗi cập nhật sản phẩm. Vui lòng thử lại.");
    } finally {
      setInternalIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div className="relative bg-[#F4F7FF] rounded-3xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300">
        <div className="px-6 py-5 border-b border-white/50 bg-white/50 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-xl font-black text-[#1A1A2E]">
              Chỉnh sửa sản phẩm
            </h2>
            <div className="flex items-center gap-3 mt-0.5">
              <p className="text-xs font-semibold text-[#6B7280]">
                Mô hình sản phẩm phẳng
              </p>
              {formData.createdAt && (
                <span className="text-[10px] font-bold bg-[#17409A]/10 text-[#17409A] px-2 py-0.5 rounded-md">
                  Ngày tạo: {formatDate(formData.createdAt)}
                </span>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-2xl bg-white text-[#9CA3AF] hover:text-[#1A1A2E] shadow-sm hover:shadow-md transition-all"
          >
            <MdClose className="text-xl" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          {isFetching ? (
            <div className="h-64 flex flex-col items-center justify-center gap-3">
              <div className="w-8 h-8 border-4 border-[#17409A]/20 border-t-[#17409A] rounded-full animate-spin" />
              <p className="text-sm font-semibold text-[#6B7280]">
                Đang tải dữ liệu...
              </p>
            </div>
          ) : (
            <form
              id="editProductForm"
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                <p className="text-xs font-black text-[#17409A] uppercase tracking-widest">
                  Thông tin cơ bản
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-[#6B7280] tracking-wide uppercase">
                      Tên sản phẩm *
                    </label>
                    <input
                      required
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-[#F9FAFB] text-sm font-semibold text-[#1A1A2E] rounded-2xl px-4 py-3 outline-none border-2 border-transparent focus:border-[#17409A]/20"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-[#6B7280] tracking-wide uppercase">
                      Slug (Tự động)
                    </label>
                    <input
                      disabled
                      name="slug"
                      value={formData.slug}
                      placeholder="tự-động-tạo-từ-tên"
                      className="w-full bg-gray-100 text-sm font-semibold rounded-2xl px-4 py-3 outline-none border-2 border-transparent text-gray-400 cursor-not-allowed shadow-inner"
                    />
                  </div>
                  {/* Loại sản phẩm field hidden to keep it fixed */}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                    <label className="text-[11px] font-black text-[#6B7280] tracking-wide uppercase">
                      Bộ sưu tập Media
                    </label>
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      {formData.media.map((m, idx) => (
                        <div
                          key={idx}
                          className="group relative aspect-square rounded-xl bg-gray-50 border overflow-hidden"
                        >
                          <img
                            src={m.url}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setFormData((p) => ({
                                ...p,
                                media: p.media.filter((_, i) => i !== idx),
                              }))
                            }
                            className="absolute inset-0 bg-red-500/80 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                          >
                            <MdDeleteOutline size={20} />
                          </button>
                        </div>
                      ))}
                      <div className="aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-1 relative hover:bg-gray-50 transition-colors">
                        {isUploadingImage ? (
                          <div className="animate-spin w-5 h-5 border-2 border-[#17409A] border-t-transparent rounded-full" />
                        ) : (
                          <MdAddPhotoAlternate className="text-gray-400" />
                        )}
                        <span className="text-[8px] font-bold text-gray-400">
                          Thêm ảnh
                        </span>
                        <input
                          type="file"
                          onChange={(e) =>
                            setUploadFile(e.target.files?.[0] ?? null)
                          }
                          className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                      </div>
                    </div>
                    {uploadFile && !isUploadingImage && (
                      <button
                        type="button"
                        onClick={handleUploadImage}
                        className="w-full py-2 bg-[#17409A] text-white rounded-lg text-xs font-bold"
                      >
                        Upload "{uploadFile.name}"
                      </button>
                    )}
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                    <label className="text-[11px] font-black text-[#6B7280] tracking-wide uppercase">
                      Cấu hình & Hiển thị
                    </label>
                    <div className="space-y-3">
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Mô tả sản phẩm..."
                        rows={4}
                        className="w-full bg-[#F9FAFB] text-sm p-3 rounded-xl border-none outline-none resize-none"
                      />
                      <div className="flex flex-wrap gap-4 pt-1">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            name="isActive"
                            checked={formData.isActive}
                            onChange={handleChange}
                            className="w-4 h-4 rounded text-[#17409A]"
                          />
                          <span className="text-xs font-bold text-[#1A1A2E]">
                            Hiển thị
                          </span>
                        </label>
                        <label className="flex items-center gap-4 cursor-pointer group">
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
                          <span className="text-xs font-bold text-[#1A1A2E]">
                            Hỗ trợ Custom
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-white/30 p-5 rounded-2xl border border-white/50 space-y-4">
                    <label className="text-[11px] font-black text-[#6B7280] tracking-wide uppercase">
                      Phân loại (Categories & Characters) *
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <CustomDropdown
                        options={categories
                          .filter((c) => c.isActive !== false)
                          .map((c) => ({
                            label: c.name,
                            value: c.categoryId,
                          }))}
                        value={selectedCategoryIds[0] || ""}
                        onChange={(v) => setSelectedCategoryIds(v ? [v] : [])}
                        placeholder="Chọn Category"
                        buttonClassName="w-full flex items-center justify-between bg-white text-sm font-semibold rounded-2xl px-4 py-3 shadow-sm hover:border-[#17409A]/40 transition-colors"
                      />
                      <CustomDropdown
                        options={characters
                          .filter((c) => c.isActive !== false)
                          .map((c) => ({
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
              </div>

              {isBaseBear && (
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-black text-[#17409A] uppercase tracking-widest">
                      Biến thể & Kích cỡ
                    </p>
                    <p className="text-[10px] font-bold text-[#6B7280] italic">
                      * Gấu bông cần ít nhất 1 kích cỡ
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {SIZE_TAG_OPTIONS.map((opt) => {
                      const isSelected = selectedSizeTags.includes(opt.value);
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => {
                            if (isSelected) {
                              setSelectedSizeTags((prev) =>
                                prev.filter((t) => t !== opt.value),
                              );
                            } else {
                              setSelectedSizeTags((prev) => [
                                ...prev,
                                opt.value,
                              ]);
                              if (!variantsData[opt.value]) {
                                setVariantsData((prev) => ({
                                  ...prev,
                                  [opt.value]: {
                                    sizeDescription: "",
                                    price: "0",
                                    weightGram: "0",
                                    sku: `${formData.name}-${opt.value}`,
                                    baseCost: "0",
                                    assemblyCost: "0",
                                    stockQuantity: "0",
                                  },
                                }));
                              }
                            }
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                            isSelected
                              ? "bg-[#17409A] border-[#17409A] text-white"
                              : "bg-white border-gray-200 text-[#1A1A2E] hover:border-[#17409A]/30"
                          }`}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>

                  {selectedSizeTags.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                      {selectedSizeTags.map((tag) => (
                        <div
                          key={tag}
                          className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-4 relative overflow-hidden"
                        >
                          <div className="flex justify-between items-center">
                            <span className="px-3 py-1 rounded-full bg-[#17409A] text-white text-[10px] font-black uppercase">
                              Size {tag}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                setSelectedSizeTags((p) =>
                                  p.filter((t) => t !== tag),
                                )
                              }
                              className="text-red-500 hover:text-red-700 text-[10px] font-bold"
                            >
                              Gỡ bỏ
                            </button>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div className="col-span-2 space-y-1">
                              <label className="text-[10px] font-black text-[#6B7280] uppercase">
                                SKU Phiên bản *
                              </label>
                              <input
                                required
                                value={variantsData[tag]?.sku || ""}
                                onChange={(e) =>
                                  setVariantsData((v) => ({
                                    ...v,
                                    [tag]: {
                                      ...v[tag],
                                      sku: e.target.value,
                                    },
                                  }))
                                }
                                placeholder="VD: GAUNAU-M"
                                className="w-full bg-[#F9FAFB] text-xs font-semibold p-2.5 rounded-xl outline-none focus:ring-1 ring-[#17409A]/20"
                              />
                            </div>

                            <div className="col-span-1 space-y-1">
                              <label className="text-[10px] font-black text-[#6B7280] uppercase">
                                Cân nặng (Gram) *
                              </label>
                              <input
                                required
                                type="number"
                                min="0"
                                value={variantsData[tag]?.weightGram || "0"}
                                onChange={(e) =>
                                  setVariantsData((v) => ({
                                    ...v,
                                    [tag]: {
                                      ...v[tag],
                                      weightGram: Math.max(
                                        0,
                                        parseInt(e.target.value) || 0,
                                      ).toString(),
                                    },
                                  }))
                                }
                                className="w-full bg-[#F9FAFB] text-xs font-semibold p-2.5 rounded-xl outline-none focus:ring-1 ring-[#17409A]/20"
                              />
                            </div>

                            <div className="col-span-1 space-y-1">
                              <label className="text-[10px] font-black text-[#6B7280] uppercase">
                                Mô tả cụ thể *
                              </label>
                              <input
                                required
                                placeholder="VD: Cao 30cm"
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
                                value={variantsData[tag]?.baseCost || "0"}
                                onChange={(e) => {
                                  const val = Math.max(
                                    0,
                                    parseFloat(e.target.value) || 0,
                                  ).toString();
                                  setVariantsData((v) => {
                                    const base = val;
                                    const assembly =
                                      v[tag]?.assemblyCost || "0";
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
                                value={variantsData[tag]?.assemblyCost || "0"}
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
                                  Number(variantsData[tag]?.price || 0),
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
                                value={variantsData[tag]?.stockQuantity || "0"}
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
                  )}
                </div>
              )}

              {isBaseBear && formData.isPersonalizable && (
                <div className="bg-white p-6 rounded-2xl border border-[#17409A]/10 shadow-lg space-y-6">
                  <div className="bg-[#17409A]/5 border border-[#17409A]/10 p-4 rounded-xl flex items-start gap-3">
                    <div className="bg-[#17409A] text-white p-1 rounded-lg shrink-0 mt-0.5">
                      <MdOutlineAddPhotoAlternate className="text-sm" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-[11px] font-bold text-[#17409A] leading-tight">
                        Cấu hình Phụ kiện & Ma trận Ảnh
                      </p>
                      <p className="text-[10px] font-semibold text-[#17409A]/80 leading-relaxed">
                        Chọn các phụ kiện đi kèm để hệ thống tự động tạo ma trận
                        tổ hợp ảnh.
                      </p>
                    </div>
                  </div>

                  {/* Accessory Selection Grid */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-[11px] font-black text-[#6B7280] uppercase tracking-wider">
                        Danh sách phụ kiện ({selectedAccessoryIds.length})
                      </p>
                      <span className="text-[10px] text-[#9CA3AF] font-medium">
                        Nhấn để chọn/bỏ chọn
                      </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                      {accessoryList.map((acc) => {
                        const isSelected = selectedAccessoryIds.includes(
                          acc.productId,
                        );
                        return (
                          <div
                            key={acc.productId}
                            onClick={() => {
                              setSelectedAccessoryIds((prev) =>
                                isSelected
                                  ? prev.filter((id) => id !== acc.productId)
                                  : [...prev, acc.productId],
                              );
                            }}
                            className={`relative group cursor-pointer p-2 rounded-2xl border-2 transition-all duration-300 ${
                              isSelected
                                ? "border-[#17409A] bg-[#17409A]/5 shadow-md ring-4 ring-[#17409A]/5"
                                : "border-gray-100 bg-white hover:border-[#17409A]/30"
                            }`}
                          >
                            <div className="aspect-square rounded-xl overflow-hidden bg-gray-50 mb-1.5 flex items-center justify-center border border-gray-50">
                              {acc.imageUrl ? (
                                <img
                                  src={acc.imageUrl}
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-50">
                                  <MdAddPhotoAlternate />
                                </div>
                              )}
                            </div>
                            <p
                              className="text-[9px] font-black text-[#1A1A2E] truncate"
                              title={acc.name}
                            >
                              {acc.name}
                            </p>
                            {isSelected && (
                              <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#17409A] text-white rounded-full flex items-center justify-center shadow-lg transform transition-transform group-hover:scale-110">
                                <MdCheckCircle className="text-sm" />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-gray-100 space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-black text-[#1A1A2E] flex items-center gap-2">
                        Ma trận tổ hợp ảnh{" "}
                        <span className="px-2 py-0.5 bg-[#FF6B9D] text-white text-[10px] rounded-full">
                          {allCombinations.length}
                        </span>
                      </p>
                    </div>

                    {allCombinations.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {allCombinations.map((combo) => {
                          const ci = comboImages.find(
                            (x) => x.combinationKey === combo.key,
                          );
                          const file = matrixUploadFiles[combo.key];
                          return (
                            <div
                              key={combo.key}
                              className={`p-4 rounded-xl border-2 transition-all ${ci?.imageUrl ? "border-green-100 bg-green-50/30" : "border-dashed border-gray-200 bg-gray-50/50"}`}
                            >
                              <p
                                className="text-[10px] font-bold text-[#1A1A2E] mb-2 truncate"
                                title={combo.label}
                              >
                                {combo.label}
                              </p>
                              <div className="flex items-center gap-3">
                                <div className="w-14 h-14 rounded-lg bg-white border flex items-center justify-center overflow-hidden shrink-0">
                                  {ci?.imageUrl ? (
                                    <img
                                      src={ci.imageUrl}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <MdCloudUpload className="text-gray-300" />
                                  )}
                                </div>
                                <div className="flex-1 space-y-2">
                                  <input
                                    type="file"
                                    onChange={(e) =>
                                      setMatrixUploadFiles((p) => ({
                                        ...p,
                                        [combo.key]:
                                          e.target.files?.[0] ?? null,
                                      }))
                                    }
                                    className="block w-full text-[9px] text-slate-500 file:mr-2 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-[9px] file:font-semibold file:bg-violet-50 file:text-violet-700"
                                  />
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleUploadMatrixImage(combo.key)
                                    }
                                    disabled={!file || isUploadingImage}
                                    className="w-full py-1 bg-[#17409A] text-white rounded-lg text-[9px] font-bold"
                                  >
                                    {isUploadingImage ? "..." : "Upload"}
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="py-12 border-2 border-dashed border-gray-100 rounded-2xl flex flex-col items-center justify-center text-center px-6 gap-2">
                        <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center">
                          <MdAddPhotoAlternate className="text-gray-300" />
                        </div>
                        <p className="text-[10px] font-bold text-[#9CA3AF] italic">
                          Chọn ít nhất một phụ kiện để kích hoạt ma trận ảnh.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </form>
          )}
        </div>

        <div className="px-6 py-4 bg-white shrink-0 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting || isFetching}
            className="px-6 py-3 rounded-2xl text-sm font-bold text-[#6B7280] bg-[#F4F7FF] hover:bg-[#E5E7EB] disabled:opacity-50"
          >
            Hủy
          </button>
          <button
            type="submit"
            form="editProductForm"
            disabled={isSubmitting || isFetching}
            className="px-8 py-3 rounded-2xl text-sm font-bold text-white bg-[#17409A] hover:bg-[#0E2A66] shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center gap-2"
          >
            {isSubmitting ? "Đang xử lý..." : "Lưu thay đổi"}
          </button>
        </div>
      </div>
    </div>
  );
}
