"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  MdArrowBack, 
  MdSave, 
  MdPercent, 
  MdAttachMoney, 
  MdStars, 
  MdLocalShipping,
  MdCardGiftcard
} from "react-icons/md";
import { promotionService } from "@/services/promotion.service";
import { useToast } from "@/contexts/ToastContext";
import CustomDropdown from "@/components/shared/CustomDropdown";
import type { CreatePromotionRequest } from "@/types";

export default function PromotionAddView() {
  const router = useRouter();
  const { success, error } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState<CreatePromotionRequest>({
    code: "",
    discountType: "PERCENTAGE",
    value: 0,
    startsAt: null,
    endsAt: null,
    isActive: true,
    minOrderAmount: 0,
    maxUsageCount: null,
    maxUsagePerUser: null,
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await promotionService.createPromotion(form);
      if (res.isSuccess) {
        success("Tạo mã giảm giá thành công!");
        router.push("/admin/promotions");
        router.refresh();
      } else {
        error(res.error?.description || "Có lỗi xảy ra khi tạo mã giảm giá.");
      }
    } catch (err) {
      error("Lỗi hệ thống khi tạo mã giảm giá.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const DISCOUNT_TYPES = [
    { value: "PERCENTAGE", label: "Phần trăm (%)", icon: MdPercent },
    { value: "FIXED", label: "Số tiền cố định (đ)", icon: MdAttachMoney },
    { value: "FIXED_PRICE", label: "Đồng giá (đ)", icon: MdStars },
    { value: "SHIPPING", label: "Giảm giá Ship (%)", icon: MdLocalShipping },
    { value: "SHIPPING_FIXED", label: "Giảm tiền Ship cố định (đ)", icon: MdLocalShipping },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-[#1A1A2E] hover:bg-[#F4F7FF] transition-all shadow-sm border border-white"
          >
            <MdArrowBack className="text-2xl" />
          </button>
          <div>
            <h1 className="text-[#1A1A2E] font-black text-2xl leading-tight">
              Tạo mã giảm giá
            </h1>
            <p className="text-[#9CA3AF] text-sm font-semibold tracking-wide opacity-70">
              Thiết lập chương trình ưu đãi mới cho khách hàng
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Main Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[32px] p-8 shadow-sm border border-white">
            <div className="flex items-center gap-3 mb-8 pb-4 border-b border-[#F4F7FF]">
              <div className="w-10 h-10 rounded-xl bg-[#F4F7FF] flex items-center justify-center text-[#17409A]">
                <MdCardGiftcard className="text-xl" />
              </div>
              <h2 className="text-[#1A1A2E] font-black text-lg">Thông tin cơ bản</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Code */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#9CA3AF] tracking-[0.15em] uppercase px-1">
                  Mã giảm giá
                </label>
                <input
                  required
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                  placeholder="VD: GIANGSINH2024"
                  className="w-full bg-[#F4F7FF] text-[#1A1A2E] text-sm font-bold rounded-2xl px-5 py-4 outline-none border-2 border-transparent focus:border-[#17409A]/20 transition-all placeholder:text-gray-300"
                />
              </div>

              {/* Discount Type */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#9CA3AF] tracking-[0.15em] uppercase px-1">
                  Loại giảm giá
                </label>
                <CustomDropdown
                  options={DISCOUNT_TYPES}
                  value={form.discountType}
                  onChange={(val) => setForm({ ...form, discountType: val })}
                  buttonClassName="w-full bg-[#F4F7FF] text-[#1A1A2E] text-sm font-bold rounded-2xl px-5 py-4 outline-none border-2 border-transparent focus:border-[#17409A]/20 transition-all flex items-center justify-between"
                  menuClassName="absolute z-20 mt-2 w-full rounded-2xl border border-[#F4F7FF] bg-white shadow-xl py-2 overflow-hidden"
                />
              </div>

              {/* Value */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#9CA3AF] tracking-[0.15em] uppercase px-1">
                  Giá trị giảm
                </label>
                <input
                  required
                  type="number"
                  min="0"
                  value={form.value}
                  onChange={(e) => setForm({ ...form, value: Number(e.target.value) })}
                  className="w-full bg-[#F4F7FF] text-[#1A1A2E] text-sm font-bold rounded-2xl px-5 py-4 outline-none border-2 border-transparent focus:border-[#17409A]/20 transition-all"
                />
              </div>

              {/* Min Order Amount */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#9CA3AF] tracking-[0.15em] uppercase px-1">
                  Đơn tối thiểu (đ)
                </label>
                <input
                  required
                  type="number"
                  min="0"
                  value={form.minOrderAmount}
                  onChange={(e) => setForm({ ...form, minOrderAmount: Number(e.target.value) })}
                  className="w-full bg-[#F4F7FF] text-[#1A1A2E] text-sm font-bold rounded-2xl px-5 py-4 outline-none border-2 border-transparent focus:border-[#17409A]/20 transition-all"
                />
              </div>
            </div>

            {/* Description */}
            <div className="mt-6 space-y-2">
              <label className="text-[10px] font-black text-[#9CA3AF] tracking-[0.15em] uppercase px-1">
                Mô tả chương trình
              </label>
              <textarea
                rows={4}
                value={form.description || ""}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Nội dung khuyến mãi hiển thị cho khách hàng..."
                className="w-full bg-[#F4F7FF] text-[#1A1A2E] text-sm font-bold rounded-2xl px-5 py-4 outline-none border-2 border-transparent focus:border-[#17409A]/20 transition-all resize-none placeholder:text-gray-300"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Settings & Actions */}
        <div className="space-y-6">
          {/* Settings Section */}
          <div className="bg-white rounded-[32px] p-8 shadow-sm border border-white">
            <h3 className="text-[#1A1A2E] font-black text-base mb-6">Cài đặt nâng cao</h3>
            
            <div className="space-y-6">
              {/* Usage Limits */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#9CA3AF] tracking-[0.15em] uppercase px-1">
                  Tổng lượt sử dụng
                </label>
                <input
                  type="number"
                  min="1"
                  placeholder="Không giới hạn"
                  value={form.maxUsageCount || ""}
                  onChange={(e) => setForm({ ...form, maxUsageCount: e.target.value ? Number(e.target.value) : null })}
                  className="w-full bg-[#F4F7FF] text-[#1A1A2E] text-sm font-bold rounded-2xl px-5 py-4 outline-none border-2 border-transparent focus:border-[#17409A]/20 transition-all"
                />
              </div>

              {/* Range Dates */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#9CA3AF] tracking-[0.15em] uppercase px-1">
                    Ngày bắt đầu
                  </label>
                  <input
                    type="datetime-local"
                    value={form.startsAt || ""}
                    onChange={(e) => setForm({ ...form, startsAt: e.target.value })}
                    className="w-full bg-[#F4F7FF] text-[#1A1A2E] text-sm font-bold rounded-2xl px-5 py-4 outline-none border-2 border-transparent focus:border-[#17409A]/20 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#9CA3AF] tracking-[0.15em] uppercase px-1">
                    Ngày kết thúc
                  </label>
                  <input
                    type="datetime-local"
                    value={form.endsAt || ""}
                    onChange={(e) => setForm({ ...form, endsAt: e.target.value })}
                    className="w-full bg-[#F4F7FF] text-[#1A1A2E] text-sm font-bold rounded-2xl px-5 py-4 outline-none border-2 border-transparent focus:border-[#17409A]/20 transition-all"
                  />
                </div>
              </div>

              {/* Status Toggle */}
              <label className="flex items-center justify-between p-4 bg-[#F4F7FF]/50 rounded-2xl border border-[#F4F7FF] cursor-pointer group">
                <span className="text-sm font-black text-[#1A1A2E]">Kích hoạt ngay</span>
                <div className="relative">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={form.isActive}
                    onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#17409A]"></div>
                </div>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full bg-[#17409A] text-white font-black py-4 rounded-2xl shadow-lg shadow-[#17409A]/20 hover:bg-[#0f2d70] transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <MdSave className="text-xl" />
              )}
              Lưu mã giảm giá
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="w-full bg-white text-[#6B7280] font-black py-4 rounded-2xl border border-gray-100 hover:bg-gray-50 transition-all"
            >
              Hủy bỏ
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
