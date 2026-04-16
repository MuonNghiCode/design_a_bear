"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { MdAdd, MdCategory, MdStars } from "react-icons/md";
import { categoryService, characterService } from "@/services";
import { useToast } from "@/contexts/ToastContext";
import type { ProductCategory, CharacterItem } from "@/types";
import { generateSlug } from "@/utils/string";
import CategoryTable from "./CategoryTable";
import CharacterTable from "./CharacterTable";
import AttributesHero from "./AttributesHero";
import CategoryFormModal from "./CategoryFormModal";
import CharacterFormModal from "./CharacterFormModal";

type TabToken = "categories" | "characters";
type EditingType = "category" | "character" | null;

export default function AttributesClient() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<TabToken>("categories");

  // Modal & Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingType, setEditingType] = useState<EditingType>(null);
  const [editingCategory, setEditingCategory] =
    useState<ProductCategory | null>(null);
  const [editingCharacter, setEditingCharacter] =
    useState<CharacterItem | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    parentId: "",
    licenseBrand: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const { success, error: toastError } = useToast();

  // Mock stats
  const [stats] = useState({
    totalCategories: 11,
    totalCharacters: 6,
    activeCategories: 10,
    activeCharacters: 6,
  });

  const handleOpenCreate = () => {
    setFormData({ name: "", slug: "", parentId: "", licenseBrand: "" });
    setEditingCategory(null);
    setEditingCharacter(null);
    setEditingType(activeTab === "categories" ? "category" : "character");
    setIsModalOpen(true);
  };

  const handleOpenEditCategory = useCallback((cat: ProductCategory) => {
    setEditingCategory(cat);
    setEditingCharacter(null);
    setFormData({
      name: cat.name,
      slug: cat.slug,
      parentId: cat.parentId || "",
      licenseBrand: "",
    });
    setEditingType("category");
    setIsModalOpen(true);
  }, []);

  const handleOpenEditCharacter = useCallback((char: CharacterItem) => {
    setEditingCharacter(char);
    setEditingCategory(null);
    setFormData({
      name: char.name,
      slug: char.slug,
      parentId: "",
      licenseBrand: char.licenseBrand || "",
    });
    setEditingType("character");
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingType(null);
    setEditingCategory(null);
    setEditingCharacter(null);
    setFormData({ name: "", slug: "", parentId: "", licenseBrand: "" });
  }, []);

  const handleFormSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsProcessing(true);

      try {
        if (editingType === "category") {
          const payload = {
            name: formData.name,
            slug: generateSlug(formData.name),
            parentId: formData.parentId || null,
          };

          let res;
          if (editingCategory) {
            res = await categoryService.updateCategory(
              editingCategory.categoryId,
              payload,
            );
          } else {
            res = await categoryService.createCategory(payload);
          }

          if (res.isSuccess) {
            success(
              editingCategory
                ? "Cập nhật danh mục thành công!"
                : "Tạo danh mục mới thành công!",
            );
            handleCloseModal();
            // TODO: trigger refresh categories
          } else {
            toastError(res.error?.description || "Thao tác thất bại!");
          }
        } else if (editingType === "character") {
          const payload = {
            name: formData.name,
            slug: generateSlug(formData.name),
            licenseBrand: formData.licenseBrand || null,
          };

          let res;
          if (editingCharacter) {
            res = await characterService.updateCharacter(
              editingCharacter.characterId,
              payload,
            );
          } else {
            res = await characterService.createCharacter(payload);
          }

          if (res.isSuccess) {
            success(
              editingCharacter
                ? "Cập nhật tính cách thành công!"
                : "Tạo tính cách mới thành công!",
            );
            handleCloseModal();
            // TODO: trigger refresh characters
          } else {
            toastError(res.error?.description || "Thao tác thất bại!");
          }
        }
      } catch {
        toastError("Lỗi hệ thống.");
      } finally {
        setIsProcessing(false);
      }
    },
    [
      editingType,
      editingCategory,
      editingCharacter,
      formData,
      success,
      toastError,
      handleCloseModal,
    ],
  );

  // GSAP entrance animations
  useEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".ac",
        { opacity: 0, y: 18 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power2.out",
          stagger: 0.07,
          clearProps: "all",
        },
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="space-y-5 max-w-full">
      {/* Page Title */}
      <div className="ac flex items-end justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-[#1A1A2E] font-black text-2xl leading-tight">
            Thuộc tính
          </h1>
          <p className="text-[#9CA3AF] text-sm font-semibold">
            Quản lý danh mục và tính cách
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="ac flex items-center gap-2 bg-[#17409A] text-white text-xs font-black px-4 py-2.5 rounded-xl hover:bg-[#0f2d70] transition-colors shadow-lg shadow-[#17409A]/20"
        >
          <MdAdd className="text-base" />
          Tạo mới
        </button>
      </div>

      {/* Hero Section */}
      <div className="ac">
        <AttributesHero stats={stats} />
      </div>

      {/* Main Content - Tabs & Tables */}
      <section className="ac relative overflow-hidden rounded-[28px] border border-white/70 bg-white/75 backdrop-blur-xl shadow-[0_24px_60px_rgba(23,64,154,0.12)]">
        <div className="pointer-events-none absolute -top-20 -right-16 h-44 w-44 rounded-full bg-[#17409A]/10" />
        <div className="pointer-events-none absolute -bottom-16 -left-12 h-36 w-36 rounded-full bg-[#4ECDC4]/15" />

        <div className="relative p-6 md:p-7 border-b border-[#E8EEFF]">
          <div className="mt-0 inline-flex rounded-2xl bg-[#F4F7FF] p-1.5 border border-[#E5E7EB]">
            <button
              onClick={() => setActiveTab("categories")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-all duration-150 ${
                activeTab === "categories"
                  ? "bg-white text-[#17409A] shadow-sm"
                  : "text-[#6B7280] hover:text-[#17409A]"
              }`}
            >
              <MdCategory className="text-sm" />
              Danh mục
            </button>
            <button
              onClick={() => setActiveTab("characters")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-all duration-150 ${
                activeTab === "characters"
                  ? "bg-white text-[#17409A] shadow-sm"
                  : "text-[#6B7280] hover:text-[#17409A]"
              }`}
            >
              <MdStars className="text-sm" />
              Tính cách
            </button>
          </div>
        </div>

        <div className="relative p-6 md:p-7">
          {activeTab === "categories" && (
            <CategoryTable
              onOpenCreate={handleOpenCreate}
              onOpenEdit={handleOpenEditCategory}
            />
          )}
          {activeTab === "characters" && (
            <CharacterTable
              onOpenCreate={handleOpenCreate}
              onOpenEdit={handleOpenEditCharacter}
            />
          )}
        </div>
      </section>

      {/* Category Form Modal */}
      {editingType === "category" && (
        <CategoryFormModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          editingCat={editingCategory}
          formData={{
            name: formData.name,
            slug: formData.slug,
            parentId: formData.parentId,
          }}
          onFormDataChange={(newData) =>
            setFormData({ ...formData, ...newData })
          }
          onSubmit={handleFormSubmit}
          isProcessing={isProcessing}
        />
      )}

      {/* Character Form Modal */}
      {editingType === "character" && (
        <CharacterFormModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          editingChar={editingCharacter}
          formData={{
            name: formData.name,
            slug: formData.slug,
            licenseBrand: formData.licenseBrand,
          }}
          onFormDataChange={(newData) =>
            setFormData({ ...formData, ...newData })
          }
          onSubmit={handleFormSubmit}
          isProcessing={isProcessing}
        />
      )}
    </div>
  );
}
