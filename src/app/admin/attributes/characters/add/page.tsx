"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { 
  MdArrowBack, 
  MdSave, 
  MdStars, 
  MdInfo, 
  MdSettings, 
  MdLink,
  MdVisibility,
  MdVerified,
  MdAdd
} from "react-icons/md";
import { characterService } from "@/services";
import { useToast } from "@/contexts/ToastContext";
import { generateSlug } from "@/utils/string";
import PageHeader from "@/components/admin/common/PageHeader";

export default function AddCharacterPage() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    licenseBrand: "",
    isActive: true,
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const { success, error: toastError } = useToast();

  // Entry animation
  useEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".ac",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power2.out" }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

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
      const res = await characterService.createCharacter({
        name: formData.name,
        slug: formData.slug,
        licenseBrand: formData.licenseBrand.trim() || null,
        isActive: formData.isActive,
      });

      if (res.isSuccess) {
        success("Tạo tính cách mới thành công!");
        router.push("/admin/attributes");
      } else {
        toastError(res.error?.description || "Không thể tạo tính cách");
      }
    } catch {
      toastError("Lỗi hệ thống khi tạo tính cách");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div ref={containerRef} className="max-w-[1450px] mx-auto px-4 md:px-10 pb-24 text-left">
      <PageHeader
        title="Thêm tính cách mới"
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
              <MdAdd className="text-lg" /> {isProcessing ? "Đang xử lý..." : "Tạo tính cách"}
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-2 text-left block">Tên tính cách</label>
                <div className="relative group">
                  <MdStars className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 text-xl group-focus-within:text-[#17409A] transition-colors" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Nhập tên tính cách (ví dụ: Vui vẻ, Dũng cảm...)"
                    className="w-full pl-14 pr-6 py-4 bg-[#F8FAFC] border-2 border-transparent rounded-[20px] text-base font-bold text-[#1A1A2E] outline-none focus:border-[#17409A]/10 focus:bg-white transition-all shadow-inner"
                  />
                </div>
              </div>

              <div className="space-y-2 text-left">
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-2 block">Bản quyền (Tùy chọn)</label>
                <div className="relative group">
                  <MdVerified className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 text-xl group-focus-within:text-[#17409A] transition-colors" />
                  <input
                    type="text"
                    name="licenseBrand"
                    value={formData.licenseBrand}
                    onChange={handleChange}
                    placeholder="Ví dụ: Disney, Marvel..."
                    className="w-full pl-14 pr-6 py-4 bg-[#F8FAFC] border-2 border-transparent rounded-[20px] text-base font-bold text-[#1A1A2E] outline-none focus:border-[#17409A]/10 focus:bg-white transition-all shadow-inner"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2 text-left">
              <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-2 block">Đường dẫn (Slug)</label>
              <div className="relative group">
                <MdLink className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 text-xl group-focus-within:text-[#17409A] transition-colors" />
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  readOnly
                  placeholder="slug-se-tu-dong-tao"
                  className="w-full pl-14 pr-6 py-4 bg-gray-50 border-2 border-transparent rounded-[20px] text-base font-bold text-gray-400 outline-none cursor-not-allowed"
                />
              </div>
            </div>
          </section>

          {/* Preview Card */}
          <section className="ac bg-gradient-to-br from-[#7C5CFC] to-[#4F39A7] rounded-[32px] p-8 shadow-xl shadow-[#7C5CFC]/10 relative overflow-hidden group">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/5 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700" />
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-left">
                <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em]">Xem trước tính cách</p>
                <div className="flex items-center gap-3">
                  <h3 className="text-white text-3xl font-black font-fredoka">{formData.name || "Tên tính cách"}</h3>
                  {formData.licenseBrand && (
                    <span className="px-2 py-0.5 bg-white/20 text-white rounded text-[9px] font-black uppercase tracking-wider backdrop-blur-sm border border-white/10">
                      {formData.licenseBrand}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full border border-white/10 w-fit">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4ECDC4] animate-pulse" />
                  <span className="text-white/60 text-[9px] font-black uppercase tracking-widest">Sẵn sàng khởi tạo</span>
                </div>
              </div>
              <div className="flex -space-x-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-16 h-16 rounded-2xl bg-white/10 border-2 border-white/20 backdrop-blur-md flex items-center justify-center text-white/20">
                    <MdStars className="text-2xl" />
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
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider text-left block">Kích hoạt ngay</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggle("isActive")}
                  className={`w-12 h-6 rounded-full p-1 transition-all ${formData.isActive ? "bg-green-500 shadow-lg shadow-green-500/20" : "bg-gray-300"}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-all ${formData.isActive ? "translate-x-6" : ""}`} />
                </button>
              </div>
            </div>
          </section>

          <section className="ac bg-white rounded-[32px] p-8 shadow-sm border border-white/50 space-y-6 text-left">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-[16px] bg-orange-50 flex items-center justify-center text-orange-600">
                <MdVisibility className="text-2xl" />
              </div>
              <h2 className="text-2xl font-black text-[#1A1A2E]">Thông tin</h2>
            </div>
            <p className="text-sm text-gray-400 font-semibold leading-relaxed text-left block">
              Tạo tính cách mới sẽ giúp các sản phẩm của bạn trở nên sinh động và có câu chuyện riêng biệt.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
