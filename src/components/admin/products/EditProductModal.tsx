import { useState, useEffect } from "react";
import { MdClose } from "react-icons/md";
import type { UpdateProductRequest } from "@/types/requests";
import { productService } from "@/services/product.service";
import CustomDropdown from "@/components/shared/CustomDropdown";
import { useTaxonomyApi } from "@/hooks";
import { useToast } from "@/contexts/ToastContext";
import { mediaService } from "@/services/media.service";
import { generateSlug } from "@/utils/string";

type VariantForm = {
  sku: string;
  variantName: string;
  price: string;
  imageUrl: string;
};

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
  });
  const [variants, setVariants] = useState<VariantForm[]>([
    { sku: "", variantName: "Mặc định", price: "", imageUrl: "" },
  ]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [selectedCharacterIds, setSelectedCharacterIds] = useState<string[]>(
    [],
  );
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [variantUploadFiles, setVariantUploadFiles] = useState<
    Record<number, File | null>
  >({});
  const {
    loading: taxonomyLoading,
    categories,
    characters,
    fetchTaxonomy,
  } = useTaxonomyApi();
  const isAccessory = formData.productType === "ACCESSORY";

  useEffect(() => {
    fetchTaxonomy();
  }, [fetchTaxonomy]);

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
          const productCharacters = Array.isArray(
            (p as { characters?: { characterId: string }[] }).characters,
          )
            ? ((p as { characters?: { characterId: string }[] }).characters ??
              [])
            : [];

          setFormData({
            name: p.name || "",
            slug: p.slug || "",
            productType:
              p.productType === "ACCESSORY" ? "ACCESSORY" : "BASE_BEAR",
            description: p.description || "",
            model3DUrl: p.model3DUrl || "",
            isPersonalizable: p.isPersonalizable || false,
            isActive: p.isActive,
            imageUrl: defaultMedia?.url || "",
          });

          setVariants(
            p.variants?.length
              ? p.variants.map((v) => ({
                  sku: v.sku || "",
                  variantName: v.variantName || "",
                  price: v.price?.toString() || "",
                  imageUrl: v.imageUrl || defaultMedia?.url || "",
                }))
              : [
                  {
                    sku: defaultVariant?.sku || "",
                    variantName: defaultVariant?.variantName || "Mặc định",
                    price: defaultVariant?.price?.toString() || "",
                    imageUrl:
                      defaultVariant?.imageUrl || defaultMedia?.url || "",
                  },
                ],
          );
          setSelectedCategoryIds(
            (p.categories || []).map((c) => c.categoryId).slice(0, 1),
          );
          setSelectedCharacterIds(
            productCharacters
              .map((c) => c.characterId)
              .filter(Boolean)
              .slice(0, 1),
          );
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

  const handleVariantChange = (
    index: number,
    field: keyof VariantForm,
    value: string,
  ) => {
    setVariants((prev) => {
      const next = [...prev];
      next[index] = {
        ...next[index],
        [field]: field === "price" ? value.replace(/\D/g, "") : value,
      };
      return next;
    });
  };

  const handleProductTypeChange = (nextType: string) => {
    setFormData((prev) => ({
      ...prev,
      productType: nextType,
      ...(nextType === "ACCESSORY"
        ? {
            model3DUrl: "",
            isPersonalizable: false,
            isActive: true,
            imageUrl: "",
          }
        : {}),
    }));

    if (nextType === "ACCESSORY") {
      setSelectedCategoryIds([]);
      setSelectedCharacterIds([]);
      setUploadFile(null);
      setVariantUploadFiles({});
      setVariants((prev) => [
        {
          sku: prev[0]?.sku || "",
          variantName: prev[0]?.variantName || "Mặc định",
          price: prev[0]?.price || "",
          imageUrl: prev[0]?.imageUrl || "",
        },
      ]);
    }
  };

  const addVariant = () => {
    setVariants((prev) => [
      ...prev,
      { sku: "", variantName: "", price: "", imageUrl: formData.imageUrl },
    ]);
  };

  const removeVariant = (index: number) => {
    setVariants((prev) => {
      if (prev.length <= 1) return prev;
      return prev.filter((_, i) => i !== index);
    });
  };

  const randomSku = () => {
    const part = Math.random().toString(36).slice(2, 8).toUpperCase();
    return `SKU-${part}`;
  };

  const handleUploadImage = async () => {
    if (!uploadFile) return;
    setIsUploadingImage(true);
    try {
      const res = await mediaService.uploadMedia(uploadFile, "uploads");
      if (!res.isSuccess || !res.value?.publicUrl) {
        throw new Error(res.error?.description || "Upload ảnh thất bại");
      }

      const uploadedUrl = res.value.publicUrl;
      setFormData((prev) => ({ ...prev, imageUrl: uploadedUrl }));
      setVariants((prev) =>
        prev.map((variant) => ({
          ...variant,
          imageUrl: uploadedUrl,
        })),
      );
      setUploadFile(null);
      toast.success("Upload ảnh thành công");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload ảnh thất bại");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleUploadVariantImage = async (index: number) => {
    const file = variantUploadFiles[index];
    if (!file) return;
    setIsUploadingImage(true);
    try {
      const res = await mediaService.uploadMedia(file, "uploads");
      if (!res.isSuccess || !res.value?.publicUrl) {
        throw new Error(res.error?.description || "Upload ảnh thất bại");
      }
      handleVariantChange(index, "imageUrl", res.value.publicUrl);
      setVariantUploadFiles((prev) => ({ ...prev, [index]: null }));
      toast.success("Upload ảnh variant thành công");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload ảnh thất bại");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;

    if (name === "price") {
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
    const slugBase = generateSlug(formData.name);

    const normalizedVariants = variants
      .map((v, idx) => ({
        sku: v.sku.trim() || randomSku(),
        variantName: v.variantName.trim() || `Biến thể ${idx + 1}`,
        price: Number(v.price) || 0,
        currency: "VND",
        imageUrl: v.imageUrl.trim() || formData.imageUrl.trim(),
      }))
      .filter((v) => v.price > 0);

    if (normalizedVariants.length === 0) {
      toast.error("Cần ít nhất 1 biến thể có giá lớn hơn 0.");
      return;
    }

    if (!isAccessory && selectedCategoryIds.length !== 1) {
      toast.error("Vui lòng chọn đúng 1 category cho sản phẩm.");
      return;
    }

    if (!isAccessory && selectedCharacterIds.length !== 1) {
      toast.error("Vui lòng chọn đúng 1 character cho sản phẩm.");
      return;
    }

    const variantsToSubmit = isAccessory
      ? normalizedVariants.slice(0, 1)
      : normalizedVariants;

    const mediaUrl = isAccessory
      ? (variantsToSubmit[0]?.imageUrl || "").trim()
      : formData.imageUrl.trim();

    const payload: UpdateProductRequest = {
      name: formData.name,
      slug: formData.slug || slugBase,
      productType: formData.productType,
      description: formData.description,
      model3DUrl: isAccessory ? "" : formData.model3DUrl,
      isPersonalizable: isAccessory ? false : formData.isPersonalizable,
      isActive: isAccessory ? true : formData.isActive,
      categoryIds: isAccessory ? [] : selectedCategoryIds,
      characterIds: isAccessory ? [] : selectedCharacterIds,
      variants: variantsToSubmit,
      media: mediaUrl
        ? [
            {
              url: mediaUrl,
              altText: formData.name,
              sortOrder: 1,
            },
          ]
        : [],
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
            <h2 className="text-xl font-black text-[#1A1A2E]">
              Chỉnh sửa sản phẩm
            </h2>
            <p className="text-xs font-semibold text-[#6B7280] mt-0.5">
              Cập nhật thông tin chi tiết
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

        <div className="p-6 overflow-y-auto custom-scrollbar relative">
          {isFetching ? (
            <div className="h-64 flex flex-col items-center justify-center gap-3">
              <div className="w-8 h-8 border-4 border-[#17409A]/20 border-t-[#17409A] rounded-full animate-spin" />
              <p className="text-sm font-semibold text-[#6B7280]">
                Đang tải dữ liệu gốc...
              </p>
            </div>
          ) : (
            <form
              id="editProductForm"
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
                    className="w-full bg-white text-sm font-semibold text-[#1A1A2E] rounded-xl px-4 py-3 outline-none border-2 border-transparent focus:border-[#17409A]/20 transition-all shadow-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-[#6B7280] tracking-wide uppercase">
                    Loại sản phẩm *
                  </label>
                  <CustomDropdown
                    options={[
                      { label: "Gấu", value: "BASE_BEAR" },
                      { label: "Phụ kiện", value: "ACCESSORY" },
                    ]}
                    value={formData.productType}
                    onChange={handleProductTypeChange}
                    buttonClassName="w-full bg-white text-sm font-semibold text-[#1A1A2E] rounded-xl px-4 py-3 outline-none border-2 border-transparent focus:border-[#17409A]/20 transition-all shadow-sm flex items-center justify-between"
                    chevronClassName="text-[#9CA3AF] transition-transform"
                    menuClassName="absolute z-30 mt-2 w-full rounded-xl border border-[#E5E7EB] bg-white shadow-xl py-1"
                  />
                </div>

                {!isAccessory && (
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-[#6B7280] tracking-wide uppercase">
                      Ảnh đại diện (media)
                    </label>
                    <div className="space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            setUploadFile(e.target.files?.[0] ?? null)
                          }
                          className="w-full sm:flex-1 bg-white text-sm font-semibold text-[#1A1A2E] rounded-xl px-3 py-2.5 outline-none border border-[#E5E7EB]"
                        />
                        <button
                          type="button"
                          onClick={handleUploadImage}
                          disabled={!uploadFile || isUploadingImage}
                          className="w-full sm:w-auto sm:min-w-23 px-3 py-2.5 rounded-xl text-xs font-bold bg-[#17409A] text-white hover:bg-[#0E2A66] disabled:opacity-50"
                        >
                          {isUploadingImage ? "Đang up..." : "Upload"}
                        </button>
                      </div>
                      <input
                        name="imageUrl"
                        value={formData.imageUrl}
                        onChange={handleChange}
                        placeholder="URL ảnh sau upload"
                        className="w-full bg-white text-sm font-semibold text-[#1A1A2E] rounded-xl px-4 py-3 outline-none border-2 border-transparent focus:border-[#17409A]/20 transition-all shadow-sm"
                      />
                    </div>
                  </div>
                )}

                {!isAccessory && (
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-[#6B7280] tracking-wide uppercase">
                      Model 3D URL
                    </label>
                    <input
                      name="model3DUrl"
                      value={formData.model3DUrl}
                      onChange={handleChange}
                      placeholder="https://..."
                      className="w-full bg-white text-sm font-semibold text-[#1A1A2E] rounded-xl px-4 py-3 outline-none border-2 border-transparent focus:border-[#17409A]/20 transition-all shadow-sm"
                    />
                  </div>
                )}

                {!isAccessory && (
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-[#6B7280] tracking-wide uppercase">
                      Categories *
                    </label>
                    <CustomDropdown
                      options={categories.map((category) => ({
                        label: category.name,
                        value: category.categoryId,
                      }))}
                      value={selectedCategoryIds[0] || ""}
                      onChange={(value) =>
                        setSelectedCategoryIds(value ? [value] : [])
                      }
                      placeholder={
                        taxonomyLoading ? "Đang tải..." : "Chọn 1 category"
                      }
                      disabled={taxonomyLoading || categories.length === 0}
                      buttonClassName="w-full bg-white text-sm font-semibold text-[#1A1A2E] rounded-xl px-4 py-3 outline-none border border-[#E5E7EB] transition-all flex items-center justify-between"
                    />
                  </div>
                )}

                {!isAccessory && (
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-[#6B7280] tracking-wide uppercase">
                      Characters
                    </label>
                    <CustomDropdown
                      options={characters.map((character) => ({
                        label: character.name,
                        value: character.characterId,
                      }))}
                      value={selectedCharacterIds[0] || ""}
                      onChange={(value) =>
                        setSelectedCharacterIds(value ? [value] : [])
                      }
                      placeholder={
                        taxonomyLoading ? "Đang tải..." : "Chọn 1 character"
                      }
                      disabled={taxonomyLoading || characters.length === 0}
                      buttonClassName="w-full bg-white text-sm font-semibold text-[#1A1A2E] rounded-xl px-4 py-3 outline-none border border-[#E5E7EB] transition-all flex items-center justify-between"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-black text-[#6B7280] tracking-wide uppercase">
                    Biến thể (Variants) *
                  </label>
                  {!isAccessory && (
                    <button
                      type="button"
                      onClick={addVariant}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#17409A]/10 text-[#17409A] hover:bg-[#17409A]/20 transition-colors"
                    >
                      + Thêm biến thể
                    </button>
                  )}
                </div>

                {variants.map((variant, index) => (
                  <div
                    key={`${variant.sku || "new"}-${index}`}
                    className="rounded-2xl bg-white/80 border border-[#E5E7EB] p-4 space-y-2"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input
                        value={variant.variantName}
                        onChange={(e) =>
                          handleVariantChange(
                            index,
                            "variantName",
                            e.target.value,
                          )
                        }
                        placeholder="Tên biến thể"
                        className="w-full min-w-0 bg-white text-sm font-semibold text-[#1A1A2E] rounded-xl px-3 py-2.5 outline-none border border-[#E5E7EB] focus:border-[#17409A]/20"
                      />
                      <div className="relative">
                        <input
                          type="text"
                          inputMode="numeric"
                          value={variant.price}
                          onChange={(e) =>
                            handleVariantChange(index, "price", e.target.value)
                          }
                          placeholder="Giá"
                          className="w-full min-w-0 bg-white text-sm font-semibold text-[#1A1A2E] rounded-xl px-3 pr-12 py-2.5 outline-none border border-[#E5E7EB] focus:border-[#17409A]/20"
                        />
                        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-black text-[#6B7280]">
                          VND
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-[minmax(0,1fr)_auto_auto_minmax(0,1fr)] items-center gap-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          setVariantUploadFiles((prev) => ({
                            ...prev,
                            [index]: e.target.files?.[0] ?? null,
                          }))
                        }
                        className="w-full min-w-0 bg-white text-sm font-semibold text-[#1A1A2E] rounded-xl px-3 py-2.5 outline-none border border-[#E5E7EB]"
                      />
                      <button
                        type="button"
                        onClick={() => handleUploadVariantImage(index)}
                        disabled={
                          !variantUploadFiles[index] || isUploadingImage
                        }
                        className="px-2.5 py-2 rounded-xl text-xs font-bold bg-[#17409A] text-white hover:bg-[#0E2A66] disabled:opacity-50 whitespace-nowrap"
                      >
                        {isUploadingImage ? "Đang up..." : "Upload"}
                      </button>
                      {!isAccessory && variants.length > 1 ? (
                        <button
                          type="button"
                          onClick={() => removeVariant(index)}
                          className="px-2.5 py-2 rounded-xl text-xs font-bold bg-[#FF6B9D]/10 text-[#C43D6B] hover:bg-[#FF6B9D]/20 transition-colors whitespace-nowrap"
                        >
                          Xóa
                        </button>
                      ) : (
                        <div />
                      )}
                      <input
                        value={variant.imageUrl}
                        onChange={(e) =>
                          handleVariantChange(index, "imageUrl", e.target.value)
                        }
                        placeholder="Ảnh variant URL (sau upload)"
                        className="w-full min-w-0 bg-white text-sm font-semibold text-[#1A1A2E] rounded-xl px-3 py-2.5 outline-none border border-[#E5E7EB] focus:border-[#17409A]/20"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-[#6B7280] tracking-wide uppercase">
                  Mô tả chi tiết
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full bg-white text-sm font-semibold text-[#1A1A2E] rounded-xl px-4 py-3 outline-none border-2 border-transparent focus:border-[#17409A]/20 transition-all shadow-sm resize-none"
                />
              </div>

              {!isAccessory && (
                <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-2">
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
              )}
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
