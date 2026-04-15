import { useEffect, useState } from "react";
import { MdClose } from "react-icons/md";
import type { CreateProductRequest } from "@/types";
import CustomDropdown from "@/components/shared/CustomDropdown";
import { useTaxonomyApi } from "@/hooks";
import { mediaService } from "@/services/media.service";
import { generateSlug } from "@/utils/string";

type VariantForm = {
  variantName: string;
  price: string;
  imageUrl: string;
};

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
    imageUrl: "",
  });
  const [variants, setVariants] = useState<VariantForm[]>([
    { variantName: "Mặc định", price: "", imageUrl: "" },
  ]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [selectedCharacterIds, setSelectedCharacterIds] = useState<string[]>(
    [],
  );
  const [categoryPicker, setCategoryPicker] = useState("");
  const [characterPicker, setCharacterPicker] = useState("");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const {
    loading: taxonomyLoading,
    categories,
    characters,
    fetchTaxonomy,
  } = useTaxonomyApi();

  useEffect(() => {
    fetchTaxonomy();
  }, [fetchTaxonomy]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

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

  const addVariant = () => {
    setVariants((prev) => [
      ...prev,
      { variantName: "", price: "", imageUrl: "" },
    ]);
  };

  const removeVariant = (index: number) => {
    setVariants((prev) => {
      if (prev.length <= 1) return prev;
      return prev.filter((_, i) => i !== index);
    });
  };

  const toggleCategory = (id: string) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const toggleCharacter = (id: string) => {
    setSelectedCharacterIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const randomSku = () => {
    const part = Math.random().toString(36).slice(2, 8).toUpperCase();
    return `SKU-${part}`;
  };

  const addCategoryFromPicker = () => {
    if (!categoryPicker) return;
    setSelectedCategoryIds((prev) =>
      prev.includes(categoryPicker) ? prev : [...prev, categoryPicker],
    );
    setCategoryPicker("");
  };

  const addCharacterFromPicker = () => {
    if (!characterPicker) return;
    setSelectedCharacterIds((prev) =>
      prev.includes(characterPicker) ? prev : [...prev, characterPicker],
    );
    setCharacterPicker("");
  };

  const handleUploadImage = async () => {
    if (!uploadFile) return;
    setIsUploadingImage(true);
    try {
      const res = await mediaService.uploadMedia(uploadFile, "uploads");
      if (!res.isSuccess || !res.value?.publicUrl) {
        throw new Error(res.error?.description || "Upload ảnh thất bại");
      }

      setFormData((prev) => ({ ...prev, imageUrl: res.value.publicUrl }));
      setUploadFile(null);
      window.alert("Upload ảnh thành công");
    } catch (err) {
      window.alert(err instanceof Error ? err.message : "Upload ảnh thất bại");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const slugBase = generateSlug(formData.name);

    const normalizedVariants = variants
      .map((v, idx) => ({
        sku: randomSku(),
        variantName: v.variantName.trim() || `Biến thể ${idx + 1}`,
        price: Number(v.price) || 0,
        currency: "VND",
        imageUrl: v.imageUrl.trim() || formData.imageUrl.trim(),
      }))
      .filter((v) => v.price > 0);

    if (normalizedVariants.length === 0) {
      window.alert("Cần ít nhất 1 biến thể có giá lớn hơn 0.");
      return;
    }

    if (selectedCategoryIds.length === 0) {
      window.alert("Vui lòng chọn ít nhất 1 category cho sản phẩm.");
      return;
    }

    if (selectedCharacterIds.length === 0) {
      window.alert("Vui lòng chọn ít nhất 1 character cho sản phẩm.");
      return;
    }

    const payload: CreateProductRequest = {
      name: formData.name,
      slug: slugBase,
      productType: formData.productType,
      description: formData.description,
      model3DUrl: formData.model3DUrl,
      isPersonalizable: formData.isPersonalizable,
      isActive: formData.isActive,
      categoryIds: selectedCategoryIds,
      characterIds: selectedCharacterIds,
      variants: normalizedVariants,
      media: formData.imageUrl
        ? [
            {
              url: formData.imageUrl.trim(),
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

              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-[#6B7280] tracking-wide uppercase">
                  Categories *
                </label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <CustomDropdown
                        options={categories.map((category) => ({
                          label: category.name,
                          value: category.categoryId,
                        }))}
                        value={categoryPicker}
                        onChange={setCategoryPicker}
                        placeholder={
                          taxonomyLoading ? "Đang tải..." : "Chọn category"
                        }
                        disabled={taxonomyLoading || categories.length === 0}
                        buttonClassName="w-full bg-white text-sm font-semibold text-[#1A1A2E] rounded-xl px-4 py-3 outline-none border border-[#E5E7EB] transition-all flex items-center justify-between"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={addCategoryFromPicker}
                      disabled={!categoryPicker}
                      className="px-3 py-2.5 rounded-xl text-xs font-bold bg-[#17409A]/10 text-[#17409A] hover:bg-[#17409A]/20 disabled:opacity-50"
                    >
                      Thêm
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedCategoryIds.map((id) => {
                      const item = categories.find((c) => c.categoryId === id);
                      return (
                        <button
                          key={id}
                          type="button"
                          onClick={() => toggleCategory(id)}
                          className="px-2.5 py-1 rounded-lg text-xs font-bold bg-[#17409A]/10 text-[#17409A]"
                        >
                          {item?.name || id} ×
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-[#6B7280] tracking-wide uppercase">
                  Characters *
                </label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <CustomDropdown
                        options={characters.map((character) => ({
                          label: character.name,
                          value: character.characterId,
                        }))}
                        value={characterPicker}
                        onChange={setCharacterPicker}
                        placeholder={
                          taxonomyLoading ? "Đang tải..." : "Chọn character"
                        }
                        disabled={taxonomyLoading || characters.length === 0}
                        buttonClassName="w-full bg-white text-sm font-semibold text-[#1A1A2E] rounded-xl px-4 py-3 outline-none border border-[#E5E7EB] transition-all flex items-center justify-between"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={addCharacterFromPicker}
                      disabled={!characterPicker}
                      className="px-3 py-2.5 rounded-xl text-xs font-bold bg-[#17409A]/10 text-[#17409A] hover:bg-[#17409A]/20 disabled:opacity-50"
                    >
                      Thêm
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedCharacterIds.map((id) => {
                      const item = characters.find((c) => c.characterId === id);
                      return (
                        <button
                          key={id}
                          type="button"
                          onClick={() => toggleCharacter(id)}
                          className="px-2.5 py-1 rounded-lg text-xs font-bold bg-[#17409A]/10 text-[#17409A]"
                        >
                          {item?.name || id} ×
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-black text-[#6B7280] tracking-wide uppercase">
                  Biến thể (Variants) *
                </label>
                <button
                  type="button"
                  onClick={addVariant}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#17409A]/10 text-[#17409A] hover:bg-[#17409A]/20 transition-colors"
                >
                  + Thêm biến thể
                </button>
              </div>

              {variants.map((variant, index) => (
                <div
                  key={index}
                  className="rounded-2xl bg-white/80 border border-[#E5E7EB] p-4 grid grid-cols-1 md:grid-cols-3 gap-3"
                >
                  <input
                    value={variant.variantName}
                    onChange={(e) =>
                      handleVariantChange(index, "variantName", e.target.value)
                    }
                    placeholder="Tên biến thể"
                    className="bg-white text-sm font-semibold text-[#1A1A2E] rounded-xl px-3 py-2.5 outline-none border border-[#E5E7EB] focus:border-[#17409A]/20"
                  />
                  <input
                    type="text"
                    value={
                      variant.price
                        ? Number(variant.price).toLocaleString("vi-VN")
                        : ""
                    }
                    onChange={(e) =>
                      handleVariantChange(index, "price", e.target.value)
                    }
                    placeholder="Giá (VNĐ)"
                    className="bg-white text-sm font-semibold text-[#1A1A2E] rounded-xl px-3 py-2.5 outline-none border border-[#E5E7EB] focus:border-[#17409A]/20"
                  />
                  <div className="flex items-center gap-2">
                    <input
                      value={variant.imageUrl}
                      onChange={(e) =>
                        handleVariantChange(index, "imageUrl", e.target.value)
                      }
                      placeholder="Ảnh variant URL"
                      className="flex-1 bg-white text-sm font-semibold text-[#1A1A2E] rounded-xl px-3 py-2.5 outline-none border border-[#E5E7EB] focus:border-[#17409A]/20"
                    />
                    {variants.length > 1 ? (
                      <button
                        type="button"
                        onClick={() => removeVariant(index)}
                        className="px-2.5 py-2 rounded-xl text-xs font-bold bg-[#FF6B9D]/10 text-[#C43D6B] hover:bg-[#FF6B9D]/20 transition-colors"
                      >
                        Xóa
                      </button>
                    ) : null}
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
                placeholder="Nhập mô tả cho sản phẩm này..."
                rows={3}
                className="w-full bg-white text-sm font-semibold text-[#1A1A2E] rounded-xl px-4 py-3 outline-none border-2 border-transparent focus:border-[#17409A]/20 transition-all shadow-sm resize-none"
              />
            </div>

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
