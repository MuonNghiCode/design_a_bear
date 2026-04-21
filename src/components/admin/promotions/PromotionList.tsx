"use client";

import { useState, useEffect, useMemo } from "react";
import {
  MdSearch,
  MdAdd,
  MdEdit,
  MdDelete,
  MdRefresh,
  MdCardGiftcard,
  MdCheckCircle,
  MdError,
  MdSchedule,
} from "react-icons/md";
import { promotionService } from "@/services/promotion.service";
import { formatPrice } from "@/utils/currency";
import { useToast } from "@/contexts/ToastContext";
import type { Promotion } from "@/types";
import AddPromotionModal from "./AddPromotionModal";
import UpdatePromotionModal from "./UpdatePromotionModal";

const COL_HEADS = [
  "Mã giảm giá",
  "Loại",
  "Giá trị",
  "Hạn dùng",
  "Sử dụng",
  "Trạng thái",
  "Hành động",
];

export default function PromotionList() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);
  const { success, error } = useToast();

  const fetchPromotions = async () => {
    setIsLoading(true);
    try {
      const res = await promotionService.getAllPromotions();
      if (res.isSuccess && res.value) {
        setPromotions(res.value);
      } else {
        error("Không thể tải danh sách mã giảm giá.");
      }
    } catch (err) {
      error("Lỗi kết nối khi tải mã giảm giá.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, []);

  const filteredPromotions = useMemo(() => {
    return promotions.filter((p) =>
      p.code.toLowerCase().includes(search.toLowerCase()) ||
      (p.description || "").toLowerCase().includes(search.toLowerCase())
    );
  }, [promotions, search]);

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa mã giảm giá này?")) return;

    try {
      const res = await promotionService.deletePromotion(id);
      if (res.isSuccess) {
        success("Xóa mã giảm giá thành công!");
        fetchPromotions();
      } else {
        error("Có lỗi xảy ra khi xóa.");
      }
    } catch (err) {
      error("Lỗi hệ thống khi xóa.");
    }
  };

  const getStatusBadge = (p: Promotion) => {
    const now = new Date();
    const start = p.startsAt ? new Date(p.startsAt) : null;
    const end = p.endsAt ? new Date(p.endsAt) : null;

    if (!p.isActive) {
      return (
        <span className="flex items-center gap-1 text-[10px] font-black text-[#9CA3AF] bg-[#F4F7FF] px-2 py-0.5 rounded-full">
          <MdError className="text-xs" /> Tạm dừng
        </span>
      );
    }

    if (end && now > end) {
      return (
        <span className="flex items-center gap-1 text-[10px] font-black text-[#FF6B9D] bg-[#FF6B9D]/10 px-2 py-0.5 rounded-full">
          <MdError className="text-xs" /> Hết hạn
        </span>
      );
    }

    if (start && now < start) {
      return (
        <span className="flex items-center gap-1 text-[10px] font-black text-[#FFB84D] bg-[#FFB84D]/10 px-2 py-0.5 rounded-full">
          <MdSchedule className="text-xs" /> Sắp diễn ra
        </span>
      );
    }

    return (
      <span className="flex items-center gap-1 text-[10px] font-black text-[#4ECDC4] bg-[#4ECDC4]/10 px-2 py-0.5 rounded-full">
        <MdCheckCircle className="text-xs" /> Đang chạy
      </span>
    );
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <p className="text-[#9CA3AF] text-[10px] font-black tracking-[0.22em] uppercase mb-0.5">
            Marketing
          </p>
          <div className="flex items-center gap-2">
            <MdCardGiftcard className="text-2xl text-[#17409A]" />
            <h2 className="text-[#1A1A2E] font-black text-xl">Quản lý mã giảm giá</h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] text-lg pointer-events-none" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm mã code..."
              className="bg-[#F4F7FF] text-[#1A1A2E] text-sm font-bold rounded-xl pl-10 pr-4 py-2.5 outline-none border-2 border-transparent focus:border-[#17409A]/20 transition-all w-48"
            />
          </div>
          <button
            onClick={fetchPromotions}
            className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#F4F7FF] text-[#1A1A2E] hover:bg-[#E8EEF9] transition-all"
            title="Làm mới"
          >
            <MdRefresh className={`text-xl ${isLoading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 bg-[#17409A] text-white text-xs font-black px-4 py-2.5 rounded-xl hover:bg-[#0f2d70] shadow-lg shadow-[#17409A]/20 transition-all"
          >
            <MdAdd className="text-lg" /> Thêm mã mới
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto min-h-[400px]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full py-20 gap-3">
            <div className="w-8 h-8 border-4 border-[#17409A]/10 border-t-[#17409A] rounded-full animate-spin" />
            <p className="text-xs font-bold text-[#9CA3AF]">Đang tải dữ liệu...</p>
          </div>
        ) : filteredPromotions.length > 0 ? (
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#F4F7FF]">
                {COL_HEADS.map((h, i) => (
                  <th
                    key={i}
                    className="text-left text-[9px] font-black text-[#9CA3AF] tracking-[0.2em] uppercase pb-4 px-4 whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredPromotions.map((p) => (
                <tr
                  key={p.promotionId}
                  className="group border-b border-[#F4F7FF] hover:bg-[#F8F9FF] transition-colors"
                >
                  <td className="py-4 px-4">
                    <div className="flex flex-col">
                      <span className="font-black text-sm text-[#1A1A2E] bg-[#F4F7FF] px-2 py-0.5 rounded-lg inline-block w-fit mb-1 border border-[#17409A]/10">
                        {p.code}
                      </span>
                      <span className="text-[10px] font-semibold text-[#6B7280] line-clamp-1 max-w-[200px]">
                        {p.description || "Không có mô tả"}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-[10px] font-black text-[#17409A] bg-[#17409A]/5 px-2 py-1 rounded-lg">
                      {p.discountType === "PERCENTAGE" ? "Phần trăm" : p.discountType === "FIXED" ? "Cố định" : "Đồng giá"}
                    </span>
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap">
                    <span className="font-black text-sm text-[#1A1A2E]">
                      {p.discountType === "PERCENTAGE" ? `${p.value}%` : formatPrice(p.value)}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex flex-col text-[10px] font-semibold text-[#6B7280]">
                      <span>BĐ: {p.startsAt ? new Date(p.startsAt).toLocaleDateString("vi-VN") : "—"}</span>
                      <span>KT: {p.endsAt ? new Date(p.endsAt).toLocaleDateString("vi-VN") : "—"}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex flex-col">
                      <span className="font-black text-xs text-[#1A1A2E]">{p.usageCount} lần</span>
                      <span className="text-[9px] font-bold text-[#9CA3AF]">
                        Giới hạn: {p.maxUsageCount || "∞"}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">{getStatusBadge(p)}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => setEditingPromotion(p)}
                        className="w-8 h-8 rounded-xl flex items-center justify-center bg-[#F4F7FF] text-[#17409A] hover:bg-[#17409A] hover:text-white transition-all shadow-sm"
                        title="Sửa"
                      >
                        <MdEdit className="text-base" />
                      </button>
                      <button
                        onClick={() => handleDelete(p.promotionId)}
                        className="w-8 h-8 rounded-xl flex items-center justify-center bg-[#FFF0F0] text-[#FF6B6B] hover:bg-[#FF6B6B] hover:text-white transition-all shadow-sm"
                        title="Xóa"
                      >
                        <MdDelete className="text-base" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-20 h-20 rounded-3xl bg-[#F4F7FF] flex items-center justify-center">
              <MdCardGiftcard className="text-4xl text-[#D1D5DB]" />
            </div>
            <div className="text-center">
              <p className="text-[#1A1A2E] font-black">Không tìm thấy mã giảm giá nào</p>
              <p className="text-xs font-bold text-[#9CA3AF]">Hãy thử đổi từ khóa tìm kiếm hoặc tạo mã mới.</p>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <AddPromotionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={fetchPromotions}
      />
      <UpdatePromotionModal
        promotion={editingPromotion}
        isOpen={!!editingPromotion}
        onClose={() => setEditingPromotion(null)}
        onSuccess={fetchPromotions}
      />
    </div>
  );
}
