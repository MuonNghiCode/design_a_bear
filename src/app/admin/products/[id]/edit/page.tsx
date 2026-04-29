"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
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

import type { 
  ProductCategory, 
  ProductCharacter, 
  AccessoryResponse,
  UpdateProductRequest,
  CreateProductMediaRequest,
  CreateProductVariantRequest,
  CreateProductComboImageRequest
} from "@/types";

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

export default function EditProductPage() {
  const router = useRouter();
  const { id } = useParams();
  const toast = useToast();
  const mediaInputRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState<number | null>(null);

  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [characters, setCharacters] = useState<ProductCharacter[]>([]);
  const [accessoriesList, setAccessoriesList] = useState<AccessoryResponse[]>([]);

  // Form State
  const [formData, setFormData] = useState<UpdateProductRequest>({
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
      try {
        const [catRes, charRes, accRes, prodRes] = await Promise.all([
          categoryService.getCategories(),
          characterService.getCharacters(),
          accessoryService.getAll(),
          productService.getProductById(id as string)
        ]);

        if (catRes.isSuccess) setCategories(catRes.value || []);
        if (charRes.isSuccess) setCharacters(charRes.value || []);
        if (accRes.isSuccess) setAccessoriesList(accRes.value || []);

        if (prodRes.isSuccess && prodRes.value) {
          const p = prodRes.value;
          setFormData({
            name: p.name,
            slug: p.slug || "",
            productType: p.productType,
            description: p.description || "",
            isPersonalizable: p.isPersonalizable,
            isActive: p.isActive,
            price: p.price,
            sku: p.sku || "",
            weightGram: p.weightGram,
            stockQuantity: p.stockQuantity || 0,
            model3DUrl: p.model3DUrl || "",
            categoryIds: p.categories?.map(c => c.categoryId) || [],
            characterIds: p.characters?.map(c => c.characterId) || [],
            accessoryIds: p.accessories?.map(a => a.accessoryId) || [],
            media: p.media?.map(m => ({
              url: m.url,
              altText: m.altText,
              sortOrder: m.sortOrder
            })) || [],
            variants: p.variants?.map(v => ({
              sku: v.sku,
              price: v.price,
              weightGram: v.weightGram,
              sizeTag: v.sizeTag || "M",
              sizeDescription: v.sizeDescription || "",
              baseCost: v.baseCost || 0,
              assemblyCost: v.assemblyCost || 0,
              stockQuantity: v.available || 0
            })) || [],
            comboImages: p.comboImages?.map(ci => ({
              combinationKey: ci.combinationKey,
              imageUrl: ci.imageUrl
            })) || []
          });
        }
      } catch (err) {
        toast.error("Lỗi khi tải dữ liệu");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

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
    setFormData(prev => ({ ...prev, [name]: !prev[name as keyof UpdateProductRequest] }));
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, price: Number(e.target.value) }));
  };

  const handleMultiSelect = (name: string, id: string) => {
    setFormData(prev => {
      const current = [...(prev[name as keyof UpdateProductRequest] as string[])];
      const index = current.indexOf(id);
      if (index > -1) current.splice(index, 1);
      else current.push(id);
      return { ...prev, [name]: current };
    });
  };

  // Handlers for Sections
  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setIsUploading(true);
    try {
      const files = Array.from(e.target.files);
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

  const handleAIGenerate = async (index: number) => {
    const combo = formData.comboImages?.[index];
    if (!combo?.combinationKey) return;
    if (formData.media.length === 0) return;

    setIsGeneratingAI(index);
    try {
      const currentAccIds = combo.combinationKey.split("|");
      const accDetails = accessoriesList.filter(a => currentAccIds.includes(a.accessoryId));
      const accNames = accDetails.map(a => a.name);
      const accImages = accDetails.map(a => a.imageUrl).filter(Boolean) as string[];

      const res = await aiService.generateProductCombo(formData.media[0].url, combo.combinationKey, accNames, accImages);
      if (res?.url) {
        const newCombos = [...(formData.comboImages || [])];
        newCombos[index] = { ...newCombos[index], imageUrl: res.url };
        setFormData(p => ({ ...p, comboImages: newCombos }));
        toast.success("Đã ghép ảnh combo thành công!");
      }
    } finally {
      setIsGeneratingAI(null);
    }
  };

  const handleUploadComboImage = async (index: number, file: File) => {
    setIsUploading(true);
    try {
      const compressedFile = await compressImage(file);
      const result = await mediaService.uploadMedia(compressedFile);
      if (result.isSuccess) {
        const newCombos = [...(formData.comboImages || [])];
        newCombos[index] = { ...newCombos[index], imageUrl: result.value.publicUrl };
        setFormData(p => ({ ...p, comboImages: newCombos }));
        toast.success("Đã tải lên ảnh Combo!");
      }
    } catch (error) {
      toast.error("Lỗi khi tải ảnh lên");
    } finally {
      setIsUploading(false);
    }
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

  const handleToggleAccessoryInCombo = (comboIndex: number, accId: string) => {
    const combo = formData.comboImages?.[comboIndex];
    if (!combo) return;
    let currentIds = combo.combinationKey ? combo.combinationKey.split("|") : [];
    currentIds = currentIds.includes(accId) ? currentIds.filter(id => id !== accId) : [...currentIds, accId];
    const newCombos = [...(formData.comboImages || [])];
    newCombos[comboIndex] = { ...newCombos[comboIndex], combinationKey: generateCombinationKey(currentIds) };
    setFormData(p => ({ ...p, comboImages: newCombos }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await productService.updateProduct(id as string, formData);
      if (res.isSuccess) {
        toast.success("Cập nhật thành công!");
        router.push("/admin/products");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedAccessories = useMemo(() => {
    return accessoriesList.filter(acc => formData.accessoryIds.includes(acc.accessoryId));
  }, [accessoriesList, formData.accessoryIds]);

  if (isLoading) return <div className="flex justify-center items-center h-screen font-black text-[#17409A] animate-pulse uppercase tracking-[0.3em]">Đang tải dữ liệu...</div>;

  return (
    <div className="max-w-[1450px] mx-auto px-4 md:px-10 pb-24">
      <PageHeader
        title={`Sửa: ${formData.name}`}
        sticky={true}
        actions={
          <div className="flex gap-3">
            <button onClick={() => router.back()} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-gray-100 text-gray-400 font-black text-xs hover:bg-gray-50 transition-all shadow-sm">
              <MdArrowBack className="text-lg" /> Quay lại
            </button>
            <button onClick={handleSubmit} disabled={isSubmitting || isUploading} className="flex items-center gap-2 px-8 py-3 rounded-xl bg-[#17409A] text-white font-black text-xs shadow-xl shadow-[#17409A]/20 hover:bg-[#0E2A66] transition-all disabled:opacity-50">
              <MdSave className="text-lg" /> {isSubmitting ? "Đang lưu..." : "Cập nhật sản phẩm"}
            </button>
          </div>
        }
      />

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <BasicInfoSection formData={formData} onChange={handleChange} isEdit={true} />
          
          <MediaSection 
            media={formData.media} 
            isUploading={isUploading} 
            onUpload={handleMediaUpload} 
            onRemove={(idx) => setFormData(p => ({ ...p, media: p.media.filter((_, i) => i !== idx) }))} 
            onUpdate={handleUpdateMedia} 
            inputRef={mediaInputRef} 
          />

          <ComboMatrixSection
            comboImages={formData.comboImages || []}
            selectedAccessories={selectedAccessories}
            isGeneratingAI={isGeneratingAI}
            onAdd={() => {
              const newCombo = {
                combinationKey: "",
                imageUrl: "",
                sortOrder: (formData.comboImages?.length || 0)
              };
              setFormData(p => ({ ...p, comboImages: [...(p.comboImages || []), newCombo] }));
            }}
            onRemove={(idx) => setFormData(p => ({ ...p, comboImages: p.comboImages?.filter((_, i) => i !== idx) }))}
            onUpload={handleUploadComboImage}
            onAIGenerate={handleAIGenerate}
            onToggleAccessory={handleToggleAccessoryInCombo}
          />

          <VariantsSection 
            variants={formData.variants || []} 
            onAdd={handleAddVariant}
            onRemove={(idx) => setFormData(p => ({ ...p, variants: p.variants?.filter((_, i) => i !== idx) }))} 
            onUpdate={(idx, field, val) => {
              const newVariants = [...(formData.variants || [])];
              newVariants[idx] = { ...newVariants[idx], [field]: val };
              setFormData(p => ({ ...p, variants: newVariants }));
            }} 
          />
        </div>

        <SidebarSettings 
          formData={formData}
          categories={categories}
          characters={characters}
          accessoriesList={accessoriesList}
          onToggle={handleToggle}
          onPriceChange={handlePriceChange}
          onMultiSelect={handleMultiSelect}
        />
      </form>
    </div>
  );
}
