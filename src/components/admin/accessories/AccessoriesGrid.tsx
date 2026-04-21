"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { formatPrice } from "@/utils/currency";
import { useDebounce } from "@/hooks";
import Image from "next/image";
import {
  MdSearch,
  MdAdd,
  MdEdit,
  MdGridView,
  MdTableRows,
  MdRemoveRedEye,
  MdDelete,
} from "react-icons/md";
import AccessoryModal from "../products/AccessoryModal";
import { useToast } from "@/contexts/ToastContext";
import { accessoryService } from "@/services/accessory.service";
import type { AccessoryResponse } from "@/types/accessory";

type ViewMode = "grid" | "table";

const COL_HEADS = [
  "Phụ kiện",
  "SKU",
  "Giá mục tiêu",
  "Giá gốc",
  "Lắp ráp",
  "Trạng thái",
  "",
];

export default function AccessoriesGrid() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 350);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  
  const [accessories, setAccessories] = useState<AccessoryResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingAccessory, setEditingAccessory] = useState<AccessoryResponse | null>(null);
  const [deletingAccessory, setDeletingAccessory] = useState<AccessoryResponse | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { success, error: toastError } = useToast();

  const fetchAccessories = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await accessoryService.getAll();
      if (res.isSuccess && res.value) {
        setAccessories(res.value);
      }
    } catch (err) {
      toastError("Không thể tải danh sách phụ kiện");
    } finally {
      setIsLoading(false);
    }
  }, [toastError]);

  useEffect(() => {
    fetchAccessories();
  }, [fetchAccessories]);

  const handleEdit = (a: AccessoryResponse) => {
    setEditingAccessory(a);
    setModalOpen(true);
  };

  const handleDelete = (a: AccessoryResponse) => {
    setDeletingAccessory(a);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingAccessory) return;
    setIsDeleting(true);
    try {
      const ok = await accessoryService.deleteAccessory(deletingAccessory.accessoryId);
      if (ok.isSuccess) {
        success("Xóa phụ kiện thành công!");
        fetchAccessories();
      } else {
        toastError(ok.error?.description || "Có lỗi xảy ra khi xóa.");
      }
    } catch (err) {
      toastError("Lỗi kết nối");
    } finally {
      setIsDeleting(false);
      setDeletingAccessory(null);
    }
  };

  const filtered = useMemo(() =>
    accessories.filter(a => {
      if (debouncedSearch) {
        const q = debouncedSearch.toLowerCase();
        return a.name.toLowerCase().includes(q) || (a.sku ?? "").toLowerCase().includes(q);
      }
      return true;
    }),
    [accessories, debouncedSearch]
  );

  return (
    <div className="bg-white rounded-3xl p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <p className="text-[#9CA3AF] text-[10px] font-black tracking-[0.22em] uppercase mb-0.5">Danh mục</p>
          <p className="text-[#1A1A2E] font-black text-xl">Quản lý phụ kiện</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] text-base pointer-events-none" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm phụ kiện..."
              className="bg-[#F4F7FF] text-[#1A1A2E] text-sm font-semibold placeholder:text-[#9CA3AF] rounded-xl pl-9 pr-4 py-2.5 outline-none border-2 border-transparent focus:border-[#17409A]/20 transition-colors w-44"
            />
          </div>
          <div className="flex bg-[#F4F7FF] rounded-xl p-0.5">
            {(["grid", "table"] as ViewMode[]).map((m) => (
              <button
                key={m}
                onClick={() => setViewMode(m)}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                  viewMode === m ? "bg-[#17409A] text-white shadow-sm" : "text-[#9CA3AF] hover:text-[#6B7280]"
                }`}
              >
                {m === "grid" ? <MdGridView className="text-base" /> : <MdTableRows className="text-base" />}
              </button>
            ))}
          </div>
          <button 
            onClick={() => {
              setEditingAccessory(null);
              setModalOpen(true);
            }} 
            className="flex items-center gap-1.5 bg-[#17409A] text-white text-xs font-black px-4 py-2.5 rounded-xl hover:bg-[#0f2d70] transition-colors whitespace-nowrap"
          >
            <MdAdd className="text-base" /> Thêm mới
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="py-20 text-center text-[#9CA3AF] font-bold">Đang tải dữ liệu...</div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center text-[#9CA3AF] font-bold">Không tìm thấy phụ kiện nào.</div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filtered.map(a => (
            <div key={a.accessoryId} className="group bg-[#F8F9FF] rounded-2xl overflow-hidden border border-transparent hover:border-[#17409A]/10 hover:shadow-lg transition-all p-4 flex flex-col h-full">
              <div className="relative h-28 flex items-center justify-center bg-white rounded-xl mb-4 overflow-hidden">
                <Image
                  src={a.imageUrl || "/teddy_bear.png"}
                  alt={a.name}
                  width={80}
                  height={80}
                  className="object-contain transition-transform group-hover:scale-110"
                />
              </div>
              <div className="flex-1">
                <p className="text-[#1A1A2E] font-black text-sm mb-1 line-clamp-1">{a.name}</p>
                <div className="text-[10px] font-bold text-[#9CA3AF] mb-3">{a.sku}</div>
                <p className="text-[#17409A] font-black text-base">{formatPrice(a.targetPrice)}</p>
                <div className="flex flex-wrap gap-2 text-[9px] mt-2 text-[#6B7280]">
                    <span className="bg-white px-2 py-0.5 rounded border border-[#E9ECEF]">Base: {formatPrice(a.baseCost)}</span>
                    <span className="bg-white px-2 py-0.5 rounded border border-[#E9ECEF]">Assembly: {formatPrice(a.assemblyCost)}</span>
                </div>
              </div>
              <div className="mt-4 flex gap-1.5 pt-3 border-t border-[#E9ECEF]">
                <button
                  onClick={() => handleEdit(a)}
                  className="flex-1 bg-[#17409A]/8 hover:bg-[#17409A]/15 text-[#17409A] text-[10px] font-black py-2 rounded-xl transition-colors flex items-center justify-center gap-1"
                >
                  <MdEdit className="text-sm" /> Sửa
                </button>
                <button
                  onClick={() => handleDelete(a)}
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-[#9CA3AF] hover:text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors"
                >
                  <MdDelete className="text-base" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[9px] font-black text-[#9CA3AF] tracking-widest uppercase border-b border-[#F4F7FF]">
                {COL_HEADS.map((h, i) => <th key={i} className="pb-4 px-2">{h}</th>)}
              </tr>
            </thead>
            <tbody className="text-sm font-bold text-[#1A1A2E]">
              {filtered.map(a => (
                <tr key={a.accessoryId} className="group border-b border-[#F4F7FF] hover:bg-[#F8F9FF] transition-colors">
                  <td className="py-3 px-2 flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#F4F7FF] rounded-lg overflow-hidden shrink-0 flex items-center justify-center">
                      <Image src={a.imageUrl || "/teddy_bear.png"} alt={a.name} width={32} height={32} className="object-contain" />
                    </div>
                    <span>{a.name}</span>
                  </td>
                  <td className="py-3 px-2 font-mono text-xs">{a.sku}</td>
                  <td className="py-3 px-2 text-[#17409A]">{formatPrice(a.targetPrice)}</td>
                  <td className="py-3 px-2 text-xs text-[#6B7280]">{formatPrice(a.baseCost)}</td>
                  <td className="py-3 px-2 text-xs text-[#6B7280]">{formatPrice(a.assemblyCost)}</td>
                  <td className="py-3 px-2">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] ${a.isActive ? "bg-[#4ECDC418] text-[#4ECDC4]" : "bg-red-50 text-red-400"}`}>
                      {a.isActive ? "Đang bán" : "Nháp"}
                    </span>
                  </td>
                  <td className="py-3 px-2">
                    <div className="flex gap-1 justify-end">
                      <button onClick={() => handleEdit(a)} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#9CA3AF] hover:text-[#17409A] hover:bg-[#F4F7FF] transition-all"><MdEdit /></button>
                      <button onClick={() => handleDelete(a)} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#9CA3AF] hover:text-[#EF4444] hover:bg-[#EF4444]/10 transition-all"><MdDelete /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <AccessoryModal
          accessory={editingAccessory}
          onClose={() => {
            setModalOpen(false);
            setEditingAccessory(null);
          }}
          onSuccess={() => {
            setModalOpen(false);
            fetchAccessories();
          }}
        />
      )}

      {/* Delete Confirm */}
      {deletingAccessory && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mb-4"><MdDelete className="text-2xl" /></div>
            <h3 className="text-lg font-black text-[#1A1A2E] mb-2">Xác nhận xóa?</h3>
            <p className="text-sm font-semibold text-[#6B7280] mb-6">Bạn có chắc muốn xóa phụ kiện <span className="text-[#1A1A2E] font-black">"{deletingAccessory.name}"</span>?</p>
            <div className="flex gap-3">
              <button onClick={() => setDeletingAccessory(null)} className="flex-1 py-3 rounded-2xl text-sm font-bold text-[#6B7280] bg-[#F4F7FF]">Hủy</button>
              <button onClick={handleDeleteConfirm} disabled={isDeleting} className="flex-1 py-3 rounded-2xl text-sm font-bold text-white bg-red-500 disabled:opacity-50">Xóa ngay</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
