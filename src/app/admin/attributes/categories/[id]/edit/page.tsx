"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import gsap from "gsap";
import { 
  MdArrowBack, 
  MdSave, 
  MdCategory, 
  MdInfo, 
  MdSettings, 
  MdLink,
  MdVisibility
} from "react-icons/md";
import { categoryService } from "@/services";
import { useToast } from "@/contexts/ToastContext";
import { generateSlug } from "@/utils/string";
import type { ProductCategory } from "@/types";
import PageHeader from "@/components/admin/common/PageHeader";

export default function EditCategoryPage() {
  const router = useRouter();
  const { id } = useParams() as { id: string };
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    isActive: true,
    parentId: null as string | null,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const { success, error: toastError } = useToast();

  const fetchCategory = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await categoryService.getCategories();
      if (res.isSuccess) {
        const found = res.value.find(c => c.categoryId === id);
        if (found) {
          setFormData({
            name: found.name,
            slug: found.slug,
            isActive: found.isActive !== false,
            parentId: found.parentId || null,
          });
        } else {
          toastError("Không tìm thấy danh mục");
          router.push("/admin/attributes");
        }
      }
    } catch {
      toastError("Lỗi hệ thống khi tải danh mục");
    } finally {
      setIsLoading(false);
    }
  }, [id, router, toastError]);

  useEffect(() => {
    fetchCategory();
  }, [fetchCategory]);

  // Entry animation
  useEffect(() => {
    if (!containerRef.current || isLoading) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".ac",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power2.out" }
      );
    }, containerRef);
    return () => ctx.revert();
  }, [isLoading]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      if (name === "name") {
        newData.slug = generateSlug(value);
      }
      return newData;
    });
  };

  const handleToggle = (name: keyof typeof formData) => {
    setFormData(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!formData.name.trim()) return;

    setIsProcessing(true);
    try {
      const res = await categoryService.updateCategory(id, {
        name: formData.name,
        slug: formData.slug,
        parentId: formData.parentId,
        isActive: formData.isActive,
      });

      if (res.isSuccess) {
        success("Cập nhật danh mục thành công!");
        router.push("/admin/attributes");
      } else {
        toastError(res.error?.description || "Không thể cập nhật danh mục");
      }
    } catch {
      toastError("Lỗi hệ thống khi cập nhật danh mục");
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="w-12 h-12 border-4 border-[#17409A]/20 border-t-[#17409A] rounded-full animate-spin" />
        <p className="text-[#17409A] font-black text-xs uppercase tracking-[0.2em] animate-pulse">Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="max-w-[1450px] mx-auto px-4 md:px-10 pb-24">
      <PageHeader
        title={`Sửa: ${formData.name}`}
        sticky={true}
        actions={
          <div className="flex gap-3">
            <button 
              onClick={() => router.back()} 
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-gray-100 text-gray-400 font-black text-xs hover:bg-gray-50 transition-all shadow-sm"
            >
              <MdArrowBack className="text-lg" /> Quay lại
            </button>
            <button 
              onClick={() => handleSubmit()} 
              disabled={isProcessing || !formData.name.trim()} 
              className="flex items-center gap-2 px-8 py-3 rounded-xl bg-[#17409A] text-white font-black text-xs shadow-xl shadow-[#17409A]/20 hover:bg-[#0E2A66] transition-all disabled:opacity-50"
            >
              <MdSave className="text-lg" /> {isProcessing ? "Đang lưu..." : "Cập nhật danh mục"}
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-8 space-y-8">
          <section className="ac bg-white rounded-[32px] p-8 shadow-sm border border-white/50 space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-[16px] bg-blue-50 flex items-center justify-center text-[#17409A]">
                <MdInfo className="text-2xl" />
              </div>
              <h2 className="text-2xl font-black text-[#1A1A2E]">Thông tin chính</h2>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-2">Tên danh mục</label>
                <div className="relative group">
                  <MdCategory className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 text-xl group-focus-within:text-[#17409A] transition-colors" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Nhập tên danh mục..."
                    className="w-full pl-14 pr-6 py-4 bg-[#F8FAFC] border-2 border-transparent rounded-[20px] text-base font-bold text-[#1A1A2E] outline-none focus:border-[#17409A]/10 focus:bg-white transition-all shadow-inner"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-2">Đường dẫn (Slug)</label>
                <div className="relative group">
                  <MdLink className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 text-xl group-focus-within:text-[#17409A] transition-colors" />
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    readOnly
                    className="w-full pl-14 pr-6 py-4 bg-gray-50 border-2 border-transparent rounded-[20px] text-base font-bold text-gray-400 outline-none cursor-not-allowed"
                  />
                </div>
                <p className="text-[10px] font-bold text-gray-300 ml-2 uppercase tracking-tight italic">* Tự động tạo dựa trên tên danh mục</p>
              </div>
            </div>
          </section>

          {/* Preview Card */}
          <section className="ac bg-gradient-to-br from-[#17409A] to-[#0E2A66] rounded-[32px] p-8 shadow-xl shadow-[#17409A]/10 relative overflow-hidden group">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/5 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700" />
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2">
                <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em]">Xem trước hiển thị</p>
                <h3 className="text-white text-3xl font-black font-fredoka">{formData.name || "Tên danh mục"}</h3>
                <div className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full border border-white/10 w-fit">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                  <span className="text-white/60 text-[9px] font-black uppercase tracking-widest">Sẵn sàng hiển thị</span>
                </div>
              </div>
              <div className="flex -space-x-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-16 h-16 rounded-2xl bg-white/10 border-2 border-white/20 backdrop-blur-md flex items-center justify-center text-white/20">
                    <MdCategory className="text-2xl" />
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar Settings */}
        <div className="lg:col-span-4 space-y-8">
          <section className="ac bg-white rounded-[32px] p-8 shadow-sm border border-white/50 space-y-8 text-left">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-[16px] bg-purple-50 flex items-center justify-center text-purple-600">
                <MdSettings className="text-2xl" />
              </div>
              <h2 className="text-2xl font-black text-[#1A1A2E]">Thiết lập</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-6 bg-[#F4F7FF] rounded-[24px] border border-transparent hover:border-blue-100 transition-all shadow-sm">
                <div className="text-left">
                  <p className="text-base font-black text-[#1A1A2E]">Trạng thái</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider text-left">Công khai trên Web</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggle("isActive")}
                  className={`w-12 h-6 rounded-full p-1 transition-all ${formData.isActive ? "bg-green-500 shadow-lg shadow-green-500/20" : "bg-gray-300"}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-all ${formData.isActive ? "translate-x-6" : ""}`} />
                </button>
              </div>

              <div className="p-6 bg-[#F8FAFC] rounded-[24px] border border-transparent space-y-3">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Metadata</p>
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-400 font-bold">ID:</span>
                    <span className="text-[#1A1A2E] font-black font-mono">{id.substring(0, 8)}...</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-400 font-bold">Loại:</span>
                    <span className="text-[#1A1A2E] font-black uppercase tracking-widest">Category</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="ac bg-white rounded-[32px] p-8 shadow-sm border border-white/50 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-[16px] bg-orange-50 flex items-center justify-center text-orange-600">
                <MdVisibility className="text-2xl" />
              </div>
              <h2 className="text-2xl font-black text-[#1A1A2E]">Hỗ trợ</h2>
            </div>
            <p className="text-sm text-gray-400 font-semibold leading-relaxed">
              Bạn có thể tạm ẩn danh mục này khỏi trang cửa hàng bằng cách tắt nút <strong>Trạng thái</strong>. Hệ thống sẽ tự động cập nhật trong vòng vài giây.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
