"use client";

import { useState, useEffect } from "react";
import { MdClose, MdSave, MdPercent, MdAttachMoney, MdStars, MdLocalShipping } from "react-icons/md";
import { promotionService } from "@/services/promotion.service";
import { useToast } from "@/contexts/ToastContext";
import type { Promotion, UpdatePromotionRequest } from "@/types";

interface UpdatePromotionModalProps {
  promotion: Promotion | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function UpdatePromotionModal({
  promotion,
  isOpen,
  onClose,
  onSuccess,
}: UpdatePromotionModalProps) {
  const { success, error } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState<UpdatePromotionRequest>({
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

  useEffect(() => {
    if (promotion) {
      setForm({
        code: promotion.code,
        discountType: promotion.discountType,
        value: promotion.value,
        startsAt: promotion.startsAt ? promotion.startsAt.slice(0, 16) : null,
        endsAt: promotion.endsAt ? promotion.endsAt.slice(0, 16) : null,
        isActive: promotion.isActive,
        minOrderAmount: promotion.minOrderAmount,
        maxUsageCount: promotion.maxUsageCount,
        maxUsagePerUser: promotion.maxUsagePerUser,
        description: promotion.description || "",
      });
    }
  }, [promotion]);

  if (!isOpen || !promotion) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await promotionService.updatePromotion(promotion.promotionId, form);
      if (res.isSuccess) {
        success("Cập nhật mã giảm giá thành công!");
        onSuccess();
        onClose();
      } else {
        error(res.error?.description || "Có lỗi xảy ra khi cập nhật mã giảm giá.");
      }
    } catch (err) {
      error("Lỗi hệ thống khi cập nhật mã giảm giá.");
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#F4F7FF]">
          <div>
            <h3 className="text-lg font-black text-[#1A1A2E]">Cập nhật mã: {promotion.code}</h3>
            <p className="text-xs font-bold text-[#9CA3AF]">
              Thay đổi thông tin chương trình ưu đãi
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-2xl flex items-center justify-center bg-[#F4F7FF] text-[#1A1A2E] hover:bg-[#E8EEF9] transition-all"
          >
            <MdClose className="text-xl" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          {/* Main Info Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Code */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-[#9CA3AF] tracking-[0.15em] uppercase px-1">
                Mã giảm giá
              </label>
              <input
                required
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                placeholder="VD: GIANGSINH2024"
                className="w-full bg-[#F4F7FF] text-[#1A1A2E] text-sm font-bold rounded-xl px-4 py-3 outline-none border-2 border-transparent focus:border-[#17409A]/20 transition-all"
              />
            </div>

            {/* Discount Type */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-[#9CA3AF] tracking-[0.15em] uppercase px-1">
                Loại giảm giá
              </label>
              <select
                required
                value={form.discountType}
                onChange={(e) => setForm({ ...form, discountType: e.target.value })}
                className="w-full bg-[#F4F7FF] text-[#1A1A2E] text-sm font-bold rounded-xl px-4 py-3 outline-none border-2 border-transparent focus:border-[#17409A]/20 transition-all appearance-none cursor-pointer"
              >
                {DISCOUNT_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Value */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-[#9CA3AF] tracking-[0.15em] uppercase px-1">
                Giá trị giảm
              </label>
              <input
                required
                type="number"
                min="0"
                value={form.value}
                onChange={(e) => setForm({ ...form, value: Number(e.target.value) })}
                className="w-full bg-[#F4F7FF] text-[#1A1A2E] text-sm font-bold rounded-xl px-4 py-3 outline-none border-2 border-transparent focus:border-[#17409A]/20 transition-all"
              />
            </div>

            {/* Min Order Amount */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-[#9CA3AF] tracking-[0.15em] uppercase px-1">
                Đơn tối thiểu (đ)
              </label>
              <input
                required
                type="number"
                min="0"
                value={form.minOrderAmount}
                onChange={(e) => setForm({ ...form, minOrderAmount: Number(e.target.value) })}
                className="w-full bg-[#F4F7FF] text-[#1A1A2E] text-sm font-bold rounded-xl px-4 py-3 outline-none border-2 border-transparent focus:border-[#17409A]/20 transition-all"
              />
            </div>
          </div>

          {/* Usage Limits */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-[#9CA3AF] tracking-[0.15em] uppercase px-1">
                Tổng lượt sử dụng
              </label>
              <input
                type="number"
                min="1"
                placeholder="Để trống nếu không giới hạn"
                value={form.maxUsageCount || ""}
                onChange={(e) => setForm({ ...form, maxUsageCount: e.target.value ? Number(e.target.value) : null })}
                className="w-full bg-[#F4F7FF] text-[#1A1A2E] text-sm font-bold rounded-xl px-4 py-3 outline-none border-2 border-transparent focus:border-[#17409A]/20 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-[#9CA3AF] tracking-[0.15em] uppercase px-1">
                Số lần dùng/người
              </label>
              <input
                type="number"
                min="1"
                value={form.maxUsagePerUser || ""}
                onChange={(e) => setForm({ ...form, maxUsagePerUser: e.target.value ? Number(e.target.value) : null })}
                placeholder="Mặc định: 1"
                className="w-full bg-[#F4F7FF] text-[#1A1A2E] text-sm font-bold rounded-xl px-4 py-3 outline-none border-2 border-transparent focus:border-[#17409A]/20 transition-all"
              />
            </div>
          </div>

          {/* Range Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-[#9CA3AF] tracking-[0.15em] uppercase px-1">
                Ngày bắt đầu
              </label>
              <input
                type="datetime-local"
                value={form.startsAt || ""}
                onChange={(e) => setForm({ ...form, startsAt: e.target.value })}
                className="w-full bg-[#F4F7FF] text-[#1A1A2E] text-sm font-bold rounded-xl px-4 py-3 outline-none border-2 border-transparent focus:border-[#17409A]/20 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-[#9CA3AF] tracking-[0.15em] uppercase px-1">
                Ngày kết thúc
              </label>
              <input
                type="datetime-local"
                value={form.endsAt || ""}
                onChange={(e) => setForm({ ...form, endsAt: e.target.value })}
                className="w-full bg-[#F4F7FF] text-[#1A1A2E] text-sm font-bold rounded-xl px-4 py-3 outline-none border-2 border-transparent focus:border-[#17409A]/20 transition-all"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-[#9CA3AF] tracking-[0.15em] uppercase px-1">
              Mô tả chương trình
            </label>
            <textarea
              rows={3}
              value={form.description || ""}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Nội dung khuyến mãi hiển thị cho khách hàng..."
              className="w-full bg-[#F4F7FF] text-[#1A1A2E] text-sm font-bold rounded-xl px-4 py-3 outline-none border-2 border-transparent focus:border-[#17409A]/20 transition-all resize-none"
            />
          </div>

          {/* Status Toggle */}
          <div className="flex items-center gap-3 bg-[#F4F7FF]/50 p-4 rounded-2xl border border-[#F4F7FF]">
            <input
              type="checkbox"
              id="isActiveUpdate"
              checked={form.isActive}
              onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
              className="w-5 h-5 accent-[#17409A]"
            />
            <label htmlFor="isActiveUpdate" className="text-sm font-black text-[#1A1A2E] cursor-pointer">
              Đang kích hoạt
            </label>
          </div>
        </form>

        {/* Footer */}
        <div className="p-6 bg-[#F8F9FF] border-t border-[#F4F7FF] flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl text-xs font-black text-[#6B7280] hover:bg-[#E9ECEF] transition-all"
          >
            Hủy bỏ
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-8 py-2.5 rounded-xl text-xs font-black bg-[#17409A] text-white hover:bg-[#0f2d70] shadow-lg shadow-[#17409A]/20 transition-all disabled:opacity-50"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <MdSave className="text-base" />
            )}
            Cập nhật mã
          </button>
        </div>
      </div>
    </div>
  );
}
