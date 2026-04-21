"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { formatPrice } from "@/utils/currency";
import { useDebounce } from "@/hooks";
import Image from "next/image";
import {
  MdSearch,
  MdAdd,
  MdEdit,
  MdDelete,
  MdRemoveRedEye,
  MdRefresh,
  MdLabel,
  MdAttachMoney,
  MdInventory,
} from "react-icons/md";
import { useAdminAccessoryApi } from "@/hooks/useAdminAccessoryApi";
import { useToast } from "@/contexts/ToastContext";
import type { AccessoryResponse } from "@/types";
import AccessoryModal from "./AccessoryModal";

export default function AccessoriesGrid() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 350);
  
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingAccessory, setEditingAccessory] = useState<AccessoryResponse | null>(null);
  const [deletingAccessory, setDeletingAccessory] = useState<AccessoryResponse | null>(null);

  const {
    accessories,
    loading,
    isDeleting,
    fetchAccessories,
    deleteAccessory,
  } = useAdminAccessoryApi();
  
  const { success, error: toastError } = useToast();

  const handleRefresh = useCallback(() => {
    fetchAccessories();
  }, [fetchAccessories]);

  useEffect(() => {
    handleRefresh();
  }, [handleRefresh]);

  const handleDeleteConfirm = async () => {
    if (!deletingAccessory) return;
    const ok = await deleteAccessory(deletingAccessory.accessoryId);
    if (ok) {
      success("Xóa phụ kiện thành công!");
      handleRefresh();
    } else {
      toastError("Có lỗi xảy ra khi xóa phụ kiện.");
    }
    setDeletingAccessory(null);
  };

  const filtered = useMemo(() =>
    accessories.filter(a => {
      if (debouncedSearch) {
        const q = debouncedSearch.toLowerCase();
        return a.name.toLowerCase().includes(q) || a.sku.toLowerCase().includes(q);
      }
      return true;
    }),
    [accessories, debouncedSearch]
  );

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#F4F7FF]">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <p className="text-[#9CA3AF] text-[10px] font-black tracking-[0.22em] uppercase mb-0.5">Quản lý</p>
          <h2 className="text-[#1A1A2E] font-black text-xl">Danh mục Phụ kiện</h2>
        </div>
        
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] text-base pointer-events-none" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo tên, SKU..."
              className="bg-[#F4F7FF] text-[#1A1A2E] text-sm font-semibold placeholder:text-[#9CA3AF] rounded-xl pl-9 pr-4 py-2.5 outline-none border-2 border-transparent focus:border-[#17409A]/20 transition-colors w-48"
            />
          </div>
          
          <button 
            onClick={handleRefresh}
            disabled={loading}
            className="w-10 h-10 flex items-center justify-center bg-[#F4F7FF] text-[#17409A] rounded-xl hover:bg-[#E8EEF9] transition-colors disabled:opacity-50"
          >
            <MdRefresh className={`text-xl ${loading ? "animate-spin" : ""}`} />
          </button>

          <button 
            onClick={() => setModalOpen(true)} 
            className="flex items-center gap-1.5 bg-[#17409A] text-white text-xs font-black px-4 py-2.5 rounded-xl hover:bg-[#0f2d70] transition-all shadow-lg shadow-[#17409A]/20 whitespace-nowrap"
          >
            <MdAdd className="text-base" /> Thêm phụ kiện
          </button>
        </div>
      </div>

      {/* Grid Display */}
      {loading && accessories.length === 0 ? (
        <div className="py-20 flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#17409A]" />
          <p className="text-[#9CA3AF] text-xs font-bold mt-4">Đang tải phụ kiện...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center bg-[#F8F9FF] rounded-2xl border-2 border-dashed border-[#E5E7EB]">
          <MdLabel className="text-5xl text-[#D1D5DB] mx-auto mb-3" />
          <p className="text-[#1A1A2E] font-black">Không tìm thấy phụ kiện nào</p>
          <p className="text-[#9CA3AF] text-xs font-medium mt-1">Hãy thử tìm kiếm khác hoặc thêm phụ kiện mới.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((a) => (
            <div 
              key={a.accessoryId}
              className="group bg-[#F8F9FF] rounded-2xl p-4 border border-transparent hover:border-[#17409A]/10 hover:shadow-xl hover:shadow-[#17409A]/5 transition-all duration-300 relative"
            >
              {/* Image & Basic Info */}
              <div className="flex items-start gap-3 mb-4">
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-white border border-[#E5E7EB] shrink-0">
                  <Image
                    src={a.imageUrl || "/teddy_bear.png"}
                    alt={a.name}
                    width={56}
                    height={56}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="min-w-0">
                  <h3 className="text-[#1A1A2E] font-black text-sm truncate" title={a.name}>{a.name}</h3>
                  <p className="text-[#17409A] text-[10px] font-black tracking-wider uppercase mt-0.5">{a.sku}</p>
                </div>
                <div className={`ml-auto w-2 h-2 rounded-full ${a.isActive ? 'bg-[#4ECDC4]' : 'bg-[#9CA3AF]'}`} />
              </div>

              {/* Price Tiers */}
              <div className="space-y-2 bg-white/60 rounded-xl p-3 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-black text-[#9CA3AF] uppercase">Giá vốn</span>
                  <span className="text-[10px] font-bold text-[#4B5563]">{formatPrice(a.baseCost)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-black text-[#9CA3AF] uppercase">Gia công</span>
                  <span className="text-[10px] font-bold text-[#4B5563]">{formatPrice(a.assemblyCost)}</span>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-dashed border-[#E5E7EB]">
                  <span className="text-[10px] font-black text-[#17409A] uppercase">Giá bán</span>
                  <span className="text-sm font-black text-[#17409A]">{formatPrice(a.targetPrice)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => setEditingAccessory(a)}
                  className="flex-1 flex items-center justify-center gap-1 py-2 bg-[#17409A] text-white text-[10px] font-black rounded-xl hover:bg-[#0E2A66] transition-colors"
                >
                  <MdEdit className="text-sm" /> Sửa
                </button>
                <button 
                  onClick={() => setDeletingAccessory(a)}
                  className="w-9 h-9 flex items-center justify-center bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all transition-colors"
                >
                  <MdDelete className="text-lg" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      {(isModalOpen || editingAccessory) && (
        <AccessoryModal
          accessory={editingAccessory}
          onClose={() => {
            setModalOpen(false);
            setEditingAccessory(null);
          }}
          onSuccess={handleRefresh}
        />
      )}

      {/* Delete Confirmation */}
      {deletingAccessory && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl animate-in zoom-in duration-200 text-center">
            <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mb-4 mx-auto">
              <MdDelete className="text-3xl" />
            </div>
            <h3 className="text-lg font-black text-[#1A1A2E] mb-2">Xác nhận xóa phụ kiện?</h3>
            <p className="text-sm font-semibold text-[#6B7280] mb-6">
              Sản phẩm liên kết có thể bị ảnh hưởng. Bạn có chắc chắn muốn xóa <span className="text-[#1A1A2E] font-black">"{deletingAccessory.name}"</span>?
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeletingAccessory(null)} className="flex-1 py-3 rounded-2xl text-sm font-bold text-[#6B7280] bg-[#F4F7FF] hover:bg-[#E5E7EB] transition-all">Hủy</button>
              <button 
                onClick={handleDeleteConfirm} 
                disabled={isDeleting}
                className="flex-1 py-3 rounded-2xl text-sm font-bold text-white bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/20 transition-all disabled:opacity-50"
              >
                {isDeleting ? "Đang xóa..." : "Xác nhận xóa"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
