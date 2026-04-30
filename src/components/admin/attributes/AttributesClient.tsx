"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { 
  MdAdd, 
  MdCategory, 
  MdStars, 
  MdRefresh, 
  MdSearch, 
  MdEdit, 
  MdVisibility, 
  MdVisibilityOff 
} from "react-icons/md";
import { categoryService, characterService } from "@/services";
import { useToast } from "@/contexts/ToastContext";
import type { ProductCategory, ProductCharacter } from "@/types";
import AttributesHero from "./AttributesHero";
import DataTable from "@/components/admin/common/DataTable";
import ConfirmDialog from "@/components/admin/common/ConfirmDialog";

type TabToken = "categories" | "characters";
type StatusFilter = "all" | "active" | "hidden";

export default function AttributesClient() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [activeTab, setActiveTab] = useState<TabToken>("categories");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("active"); // Default to active as requested
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [characters, setCharacters] = useState<ProductCharacter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  const { success, error: toastError } = useToast();

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [catRes, charRes] = await Promise.all([
        categoryService.getCategories(),
        characterService.getCharacters(),
      ]);

      if (catRes.isSuccess) setCategories(catRes.value);
      if (charRes.isSuccess) setCharacters(charRes.value);
    } catch (err) {
      toastError("Không thể tải dữ liệu thuộc tính");
    } finally {
      setIsLoading(false);
    }
  }, [toastError]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await fetchData();
    setIsRefreshing(false);
  }, [fetchData]);

  // Animation
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

  const filteredData = useMemo(() => {
    const data = activeTab === "categories" ? categories : characters;
    return data.filter(item => {
      const isActive = item.isActive !== false && item.isActive !== null;
      const statusMatch = statusFilter === "all" || (statusFilter === "active" ? isActive : !isActive);
      const searchMatch = !searchQuery || 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.slug.toLowerCase().includes(searchQuery.toLowerCase());
      
      return statusMatch && searchMatch;
    }).map(item => ({
      ...item,
      id: activeTab === "categories" ? (item as ProductCategory).categoryId : (item as ProductCharacter).characterId
    }));
  }, [activeTab, categories, characters, searchQuery, statusFilter]);

  const stats = useMemo(() => ({
    totalCategories: categories.length,
    totalCharacters: characters.length,
    activeCategories: categories.filter(c => c.isActive !== false && c.isActive !== null).length,
    activeCharacters: characters.filter(c => c.isActive !== false && c.isActive !== null).length,
  }), [categories, characters]);

  const handleToggleActive = async () => {
    if (!confirmingId) return;
    const action = "Cập nhật";
    try {
      const res = activeTab === "categories" 
        ? await categoryService.deleteCategory(confirmingId)
        : await characterService.deleteCharacter(confirmingId);

      if (res.isSuccess) {
        success(`${action} trạng thái thành công!`);
        fetchData();
      } else {
        toastError(res.error?.description || `${action} thất bại!`);
      }
    } catch {
      toastError(`Lỗi hệ thống khi ${action}.`);
    } finally {
      setConfirmingId(null);
    }
  };

  return (
    <div ref={containerRef} className="space-y-6 pb-10">
      {/* Page Title & Actions */}
      <div className="ac flex items-end justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-[#1A1A2E] font-black text-2xl leading-tight">
            Thuộc tính
          </h1>
          <p className="text-[#9CA3AF] text-sm font-semibold">
            Quản lý danh mục và tính cách · Tháng 3 / 2026
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 bg-white text-[#17409A] text-[13px] font-black px-6 py-3 rounded-2xl border border-[#F4F7FF] shadow-sm hover:bg-gray-50 transition-all active:scale-95"
          >
            <MdRefresh
              className={`text-xl ${isRefreshing ? "animate-spin" : ""}`}
            />
            Làm mới dữ liệu
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="ac">
        <AttributesHero stats={stats} />
      </div>

      {/* Control Bar - Sycned with Products/Inventory */}
      <div className="ac space-y-6">
        <div className="flex items-center gap-2 p-1.5 bg-white w-fit rounded-2xl shadow-sm border border-white/50">
          {[
            { id: "categories", label: "Danh mục", icon: MdCategory },
            { id: "characters", label: "Tính cách", icon: MdStars },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabToken)}
              className={`px-6 py-2.5 rounded-xl text-[13px] font-black transition-all flex items-center gap-2 ${
                activeTab === tab.id
                  ? "bg-[#17409A] text-white shadow-md shadow-[#17409A]/10"
                  : "text-gray-400 hover:text-[#17409A] hover:bg-gray-50"
              }`}
            >
              <tab.icon className="text-lg" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
          <div className="flex items-center gap-2 p-1.5 bg-white rounded-2xl shadow-sm border border-white/50">
            {[
              { id: "all", label: "Tất cả" },
              { id: "active", label: "Đang hoạt động" },
              { id: "hidden", label: "Tạm ẩn" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id as StatusFilter)}
                className={`px-5 py-2.5 rounded-xl text-[13px] font-black transition-all ${
                  statusFilter === tab.id
                    ? "bg-[#17409A] text-white shadow-md"
                    : "text-gray-400 hover:text-[#17409A] hover:bg-gray-50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-80 group">
              <MdSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 text-2xl group-focus-within:text-[#17409A] transition-colors" />
              <input
                type="text"
                placeholder={`Tìm ${activeTab === "categories" ? "danh mục" : "tính cách"}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-6 py-3.5 bg-white border border-white/50 rounded-2xl shadow-sm text-sm font-bold text-[#1A1A2E] outline-none focus:border-[#17409A]/20 transition-all placeholder:text-gray-300"
              />
            </div>
            <button
              onClick={() => router.push(`/admin/attributes/${activeTab}/add`)}
              className="flex items-center gap-2 bg-[#17409A] text-white text-sm font-black px-8 py-3.5 rounded-2xl hover:bg-[#0E2A66] transition-all shadow-lg shadow-[#17409A]/20"
            >
              <MdAdd className="text-xl" /> Thêm mới
            </button>
          </div>
        </div>
      </div>

      {/* Main Table Section */}
      <div className="ac">
        <DataTable
          data={filteredData}
          isLoading={isLoading}
          columns={[
            {
              header: activeTab === "categories" ? "Danh mục" : "Tính cách",
              accessor: (item) => (
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-[#F4F7FF] text-[#17409A] flex items-center justify-center font-black text-xs shadow-inner border border-white shrink-0">
                    {item.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-base font-black text-[#1A1A2E] truncate mb-0.5">{item.name}</p>
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest leading-none">Slug: {item.slug}</p>
                  </div>
                </div>
              ),
            },
            ...(activeTab === "characters" ? [{
              header: "Bản quyền",
              accessor: (item: any) => (
                item.licenseBrand ? (
                  <span className="px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-[10px] font-black uppercase tracking-wider border border-purple-100">
                    {item.licenseBrand}
                  </span>
                ) : (
                  <span className="text-gray-300 font-bold tracking-widest">NONE</span>
                )
              ),
            }] : []),
            {
              header: "Trạng thái",
              align: "center",
              accessor: (item) => {
                const isActive = item.isActive !== false && item.isActive !== null;
                return (
                  <span className={`text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-wider ${
                    isActive ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"
                  }`}>
                    {isActive ? "Hoạt động" : "Tạm ẩn"}
                  </span>
                );
              },
            },
            {
              header: "Hành động",
              align: "right",
              accessor: (item) => (
                <div className="flex items-center justify-end gap-2.5">
                  <button
                    onClick={() => router.push(`/admin/attributes/${activeTab}/${item.id}/edit`)}
                    className="p-2.5 rounded-2xl text-gray-400 hover:text-[#17409A] hover:bg-blue-50 transition-all border border-transparent hover:border-blue-100"
                    title="Sửa"
                  >
                    <MdEdit className="text-xl" />
                  </button>
                  <button
                    onClick={() => setConfirmingId(item.id)}
                    className={`p-2.5 rounded-2xl text-gray-400 transition-all border border-transparent ${
                      (item.isActive !== false && item.isActive !== null)
                        ? "hover:text-red-500 hover:bg-red-50 hover:border-red-100"
                        : "hover:text-green-500 hover:bg-green-50 hover:border-green-100"
                    }`}
                    title={(item.isActive !== false && item.isActive !== null) ? "Ẩn" : "Hiện"}
                  >
                    {(item.isActive !== false && item.isActive !== null) ? (
                      <MdVisibilityOff className="text-xl" />
                    ) : (
                      <MdVisibility className="text-xl" />
                    )}
                  </button>
                </div>
              ),
            },
          ]}
        />
      </div>

      <ConfirmDialog
        isOpen={!!confirmingId}
        onClose={() => setConfirmingId(null)}
        onConfirm={handleToggleActive}
        title="Xác nhận thay đổi?"
        message="Bạn có chắc chắn muốn thay đổi trạng thái hoạt động của mục này?"
        variant="warning"
      />
    </div>
  );
}
