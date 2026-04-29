"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { 
  MdArrowBack, 
  MdSave
} from "react-icons/md";
import { useToast } from "@/contexts/ToastContext";
import { 
  productService, 
  categoryService, 
  characterService, 
  accessoryService,
  mediaService,
  aiService
} from "@/services";
import PageHeader from "@/components/admin/common/PageHeader";
import { generateCombinationKey } from "@/utils/combination";

// Modular Components
import { BasicInfoSection } from "@/components/admin/products/form/BasicInfoSection";
import { MediaSection } from "@/components/admin/products/form/MediaSection";
import { ComboMatrixSection } from "@/components/admin/products/form/ComboMatrixSection";
import { VariantsSection } from "@/components/admin/products/form/VariantsSection";
import { SidebarSettings } from "@/components/admin/products/form/SidebarSettings";

// Helpers
const generateSlug = (text: string) => {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d")
    .replace(/([^0-9a-z-\s])/g, "")
    .replace(/(\s+)/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
};

const generateSKU = (name: string) => {
  return name
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "D")
    .replace(/([^0-9A-Z-\s])/g, "")
    .replace(/(\s+)/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
};

const compressImage = async (file: File): Promise<File> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 1200;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: "image/jpeg",
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              resolve(file);
            }
          },
          "image/jpeg",
          0.8
        );
      };
    };
  });
};

import type { 
  ProductCategory, 
  ProductCharacter, 
  AccessoryResponse,
  CreateProductRequest,
  CreateProductMediaRequest,
  CreateProductVariantRequest,
  CreateProductComboImageRequest
} from "@/types";

export default function AddProductPage() {
  const router = useRouter();
  const toast = useToast();
  const mediaInputRef = useRef<HTMLInputElement>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState<number | null>(null);
  
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [characters, setCharacters] = useState<ProductCharacter[]>([]);
  const [accessoriesList, setAccessoriesList] = useState<AccessoryResponse[]>([]);

  // Form State
  const [formData, setFormData] = useState<CreateProductRequest>({
    name: "",
    slug: "",
    productType: "BASE_BEAR",
    description: "",
    isPersonalizable: true,
    isActive: true,
    price: 0,
    sku: "",
    weightGram: 0,
    stockQuantity: 0,
    model3DUrl: "",
    categoryIds: [],
    characterIds: [],
    accessoryIds: [],
    media: [],
    variants: [],
    comboImages: []
  });

  useEffect(() => {
    const fetchData = async () => {
      const [catRes, charRes, accRes] = await Promise.all([
        categoryService.getCategories(),
        characterService.getCharacters(),
        accessoryService.getAll()
      ]);
      if (catRes.isSuccess) setCategories(catRes.value || []);
      if (charRes.isSuccess) setCharacters(charRes.value || []);
      if (accRes.isSuccess) setAccessoriesList(accRes.value || []);
    };
    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = { ...prev, [name]: e.target.type === "number" ? Number(value) : value };
      
      // Tự động tạo Slug và SKU khi nhập Tên
      if (name === "name") {
        newData.slug = generateSlug(value);
        newData.sku = generateSKU(value);
      }
      
      return newData;
    });
  };

  const handleToggle = (name: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: !prev[name as keyof CreateProductRequest]
    }));
  };

  const handleMultiSelect = (name: string, id: string) => {
    setFormData(prev => {
      const current = prev[name as keyof CreateProductRequest] as string[];
      if (current.includes(id)) {
        return { ...prev, [name]: current.filter(i => i !== id) };
      }
      return { ...prev, [name]: [...current, id] };
    });
  };

  const selectedAccessories = useMemo(() => {
    return accessoriesList.filter(a => formData.accessoryIds.includes(a.accessoryId));
  }, [accessoriesList, formData.accessoryIds]);

  // Handlers for Sections
  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setIsUploading(true);
    try {
      const files = Array.from(e.target.files);
      // Nén ảnh trước khi gửi
      const compressedFiles = await Promise.all(files.map(f => compressImage(f)));
      
      const results = await Promise.allSettled(compressedFiles.map(f => mediaService.uploadMedia(f)));
      
      const newMedia = results
        .filter((r): r is PromiseFulfilledResult<any> => r.status === "fulfilled" && r.value.isSuccess)
        .map((r, idx) => ({
          url: r.value.value.publicUrl,
          altText: formData.name || "Product Image",
          sortOrder: formData.media.length + idx
        }));
      setFormData(prev => ({ ...prev, media: [...prev.media, ...newMedia] }));
      toast.success(`Đã tải lên ${newMedia.length} ảnh`);
    } catch (err) {
      toast.error("Lỗi khi tải ảnh lên");
    } finally {
      setIsUploading(false);
      if (mediaInputRef.current) mediaInputRef.current.value = "";
    }
  };

  const handleUpdateMedia = (index: number, field: string, value: any) => {
    setFormData(prev => {
      const newMedia = [...prev.media];
      newMedia[index] = { ...newMedia[index], [field]: value };
      return { ...prev, media: newMedia };
    });
  };

  const handleRemoveMedia = (index: number) => {
    setFormData(prev => ({ ...prev, media: prev.media.filter((_, i) => i !== index) }));
  };

  const handleAddCombo = () => {
    setFormData(prev => ({ ...prev, comboImages: [...(prev.comboImages || []), { combinationKey: "", imageUrl: "" }] }));
  };

  const handleUpdateCombo = (index: number, field: keyof CreateProductComboImageRequest, value: string) => {
    setFormData(prev => {
      const newCombos = [...(prev.comboImages || [])];
      newCombos[index] = { ...newCombos[index], [field]: value };
      return { ...prev, comboImages: newCombos };
    });
  };

  const handleUploadComboImage = async (index: number, file: File) => {
    setIsUploading(true);
    try {
      const compressedFile = await compressImage(file);
      const result = await mediaService.uploadMedia(compressedFile);
      if (result.isSuccess) {
        handleUpdateCombo(index, "imageUrl", result.value.publicUrl);
        toast.success("Đã tải lên ảnh Combo!");
      }
    } catch (error) {
      toast.error("Lỗi khi tải ảnh lên");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveCombo = (index: number) => {
    setFormData(prev => ({
      ...prev,
      comboImages: prev.comboImages?.filter((_, i) => i !== index)
    }));
  };

  const handleAIGenerate = async (index: number) => {
    const combo = formData.comboImages?.[index];
    if (!combo?.combinationKey) {
      toast.error("Vui lòng chọn phụ kiện cho tổ hợp này");
      return;
    }
    if (formData.media.length === 0) {
      toast.error("Cần ít nhất một ảnh gốc");
      return;
    }

    setIsGeneratingAI(index);
    try {
      const currentAccIds = combo.combinationKey.split("|");
      const accDetails = accessoriesList.filter(a => currentAccIds.includes(a.accessoryId));
      const accNames = accDetails.map(a => a.name);
      const accImages = accDetails.map(a => a.imageUrl).filter(Boolean) as string[];

      const res = await aiService.generateProductCombo(
        formData.media[0].url,
        combo.combinationKey,
        accNames,
        accImages // Truyền ảnh phụ kiện cho Canvas compositor
      );

      if (res?.url) {
        handleUpdateCombo(index, "imageUrl", res.url);
        toast.success("Đã ghép ảnh combo thành công!");
      } else {
        toast.error("Không thể ghép ảnh, vui lòng thử lại");
      }
    } finally {
      setIsGeneratingAI(null);
    }
  };

  const handleToggleAccessoryInCombo = (comboIndex: number, accId: string) => {
    const combo = formData.comboImages?.[comboIndex];
    if (!combo) return;
    let currentIds = combo.combinationKey ? combo.combinationKey.split("|") : [];
    currentIds = currentIds.includes(accId) ? currentIds.filter(id => id !== accId) : [...currentIds, accId];
    handleUpdateCombo(comboIndex, "combinationKey", generateCombinationKey(currentIds));
  };

  const handleAddVariant = () => {
    const baseSku = formData.sku || "PROD";
    const variantIndex = (formData.variants?.length || 0) + 1;
    setFormData(prev => ({
      ...prev,
      variants: [
        ...(prev.variants || []),
        { 
          sku: `${baseSku}-V${variantIndex}`, 
          price: prev.price || 0, 
          weightGram: prev.weightGram || 0, 
          sizeTag: "M", 
          stockQuantity: 0,
          sizeDescription: "",
          baseCost: 0,
          assemblyCost: 0
        }
      ]
    }));
  };

  const handleUpdateVariant = (index: number, field: string, value: any) => {
    setFormData(prev => {
      const newVariants = [...(prev.variants || [])];
      newVariants[index] = { ...newVariants[index], [field]: value };
      return { ...prev, variants: newVariants };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.sku) {
      toast.error("Vui lòng nhập tên và SKU");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await productService.createProduct(formData);
      if (res.isSuccess) {
        toast.success("Thêm sản phẩm thành công!");
        router.push("/admin/products");
      } else {
        toast.error(res.error?.description || "Thêm sản phẩm thất bại");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-[1450px] mx-auto px-4 md:px-10 pb-24">
      <PageHeader
        title="Thêm sản phẩm mới"
        sticky={true}
        actions={
          <div className="flex gap-3">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-gray-100 text-gray-400 font-black text-xs hover:bg-gray-50 transition-all shadow-sm"
            >
              <MdArrowBack className="text-lg" /> Quay lại
            </button>
            <div className="w-px h-10 bg-gray-100 mx-1" />
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || isUploading}
              className="flex items-center gap-2 px-8 py-3 rounded-xl bg-[#17409A] text-white font-black text-xs shadow-xl shadow-[#17409A]/20 hover:bg-[#0E2A66] transition-all disabled:opacity-50"
            >
              <MdSave className="text-lg" /> {isSubmitting ? "Đang lưu..." : "Lưu sản phẩm"}
            </button>
          </div>
        }
      />

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <BasicInfoSection formData={formData} onChange={handleChange} />
          
          <MediaSection 
            media={formData.media} 
            isUploading={isUploading} 
            onUpload={handleMediaUpload} 
            onRemove={handleRemoveMedia} 
            onUpdate={handleUpdateMedia} 
            inputRef={mediaInputRef} 
          />

          <ComboMatrixSection
          comboImages={formData.comboImages || []}
          selectedAccessories={selectedAccessories}
          isGeneratingAI={isGeneratingAI}
          onAdd={handleAddCombo}
          onRemove={handleRemoveCombo}
          onUpload={handleUploadComboImage}
          onAIGenerate={handleAIGenerate}
          onToggleAccessory={handleToggleAccessoryInCombo}
        />

          <VariantsSection 
            variants={formData.variants || []} 
            onAdd={handleAddVariant} 
            onRemove={(idx) => setFormData(p => ({ ...p, variants: p.variants?.filter((_, i) => i !== idx) }))} 
            onUpdate={handleUpdateVariant} 
          />
        </div>

        <SidebarSettings 
          formData={formData} 
          categories={categories} 
          characters={characters}
          accessoriesList={accessoriesList} 
          onToggle={handleToggle} 
          onPriceChange={handleChange} 
          onMultiSelect={handleMultiSelect} 
        />
      </form>
    </div>
  );
}
