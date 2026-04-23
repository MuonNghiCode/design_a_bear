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
  MdWarning,
  MdRemoveRedEye,
  MdDelete,
} from "react-icons/md";
import { type ProductAdmin, type ProductAdminStatus } from "@/data/admin";
import { useAdminProductsApi } from "@/hooks/useAdminProductsApi";
import { useToast } from "@/contexts/ToastContext";
import type { AccessoryResponse } from "@/types";

import CreateAccessoryModal from "../products/accessories/CreateAccessoryModal";
import EditAccessoryModal from "../products/accessories/EditAccessoryModal";
import AccessoryDetailModal from "../products/accessories/AccessoryDetailModal";

type ViewMode = "grid" | "table";

const STATUS_CFG: Record<
  ProductAdminStatus,
  { label: string; color: string; bg: string }
> = {
  active: { label: "Đang bán", color: "#4ECDC4", bg: "#4ECDC418" },
  draft: { label: "Bản nháp", color: "#7C5CFC", bg: "#7C5CFC18" },
  archived: { label: "Lưu trữ", color: "#9CA3AF", bg: "#9CA3AF18" },
};

const COL_HEADS = [
  "Phụ kiện",
  "Giá",
  "Tồn kho",
  "Trạng thái",
  "",
];

function StockBadge({ stock }: { stock: number }) {
  if (stock === 0)
    return (
      <span className="flex items-center gap-1 text-[9px] font-black text-[#FF6B9D] bg-[#FF6B9D]/10 px-2 py-0.5 rounded-full">
        Hết hàng
      </span>
    );
  if (stock <= 10)
    return (
      <span className="flex items-center gap-1 text-[9px] font-black text-[#FF8C42] bg-[#FF8C42]/10 px-2 py-0.5 rounded-full">
        <MdWarning className="text-xs" />
        Còn {stock}
      </span>
    );
  return <span className="text-[10px] font-black text-[#4B5563]">{stock}</span>;
}

function AccessoryCard({
  p,
  onView,
  onEdit,
  onDelete,
  isDeleting,
}: {
  p: ProductAdmin;
  onView: (p: ProductAdmin) => void;
  onEdit: (p: ProductAdmin) => void;
  onDelete: (p: ProductAdmin) => void;
  isDeleting: boolean;
}) {
  const st = STATUS_CFG[p.status];

  return (
    <div
      onClick={() => onView(p)}
      className="group h-full bg-[#F8F9FF] rounded-2xl overflow-hidden border border-transparent hover:border-[#17409A]/10 hover:shadow-lg hover:shadow-[#17409A]/5 transition-all duration-300 relative flex flex-col cursor-pointer"
    >
      <div className="h-0.5 w-full" style={{ backgroundColor: p.badgeColor }} />
      <div
        className="relative h-28 flex items-center justify-center overflow-hidden"
        style={{ backgroundColor: p.badgeColor + "0d" }}
      >
        <Image
          src={p.imageUrl || "/accessory_placeholder.png"}
          alt={p.name}
          width={96}
          height={96}
          className="object-contain transition-transform duration-300 group-hover:scale-110 drop-shadow-md"
        />
        <div className="absolute top-2.5 right-2.5 flex flex-col items-end gap-1.5 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
           <span
            className="text-[8px] font-black px-2 py-0.5 rounded-full shadow-sm"
            style={{ color: st.color, backgroundColor: "white", outline: `1px solid ${st.bg}` }}
          >
            {st.label}
          </span>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onView(p);
            }}
            className="w-7 h-7 rounded-lg bg-white shadow-sm flex items-center justify-center text-[#9CA3AF] hover:text-[#17409A] transition-colors"
          >
            <MdRemoveRedEye className="text-base" />
          </button>
        </div>
      </div>

      <div className="p-4 flex flex-1 flex-col">
        <div className="mb-2.5 min-h-10">
          <p className="text-[#1A1A2E] font-black text-sm leading-snug line-clamp-2">
            {p.name}
          </p>
        </div>

        <p className="text-[#17409A] font-black text-lg leading-none mb-3">
          {formatPrice(p.price)}
        </p>

        <div className="flex items-center justify-between text-[10px] font-semibold text-[#9CA3AF] mb-3">
          <StockBadge stock={p.stock} />
        </div>

        <div className="mt-auto flex items-center gap-1.5 pt-1 border-t border-[#E9ECEF]">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(p);
            }}
            className="flex-1 flex items-center justify-center gap-1 text-[10px] font-black text-[#17409A] bg-[#17409A]/8 hover:bg-[#17409A]/15 rounded-xl py-2 transition-colors"
          >
            <MdEdit className="text-sm" /> Sửa
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(p);
            }}
            disabled={isDeleting}
            className="w-8 h-8 flex items-center justify-center text-[#9CA3AF] hover:text-[#EF4444] hover:bg-[#EF4444]/10 rounded-xl transition-all disabled:opacity-50"
          >
            <MdDelete className="text-base" />
          </button>
        </div>
      </div>
    </div>
  );
}

function AccessoryRow({
  p,
  onView,
  onEdit,
  onDelete,
  isDeleting,
}: {
  p: ProductAdmin;
  onView: (p: ProductAdmin) => void;
  onEdit: (p: ProductAdmin) => void;
  onDelete: (p: ProductAdmin) => void;
  isDeleting: boolean;
}) {
  const st = STATUS_CFG[p.status];

  return (
    <tr className="group border-t border-[#F4F7FF] hover:bg-[#F8F9FF] transition-colors duration-150 cursor-pointer" onClick={() => onView(p)}>
      <td className="py-3 pr-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 group-hover:scale-105 transition-transform duration-200 bg-[#F4F7FF] flex items-center justify-center">
            <Image
              src={p.imageUrl || "/accessory_placeholder.png"}
              alt={p.name}
              width={40}
              height={40}
              className="object-contain w-full h-full"
            />
          </div>
          <p className="text-[#1A1A2E] font-bold text-sm leading-tight max-w-48 truncate">
            {p.name}
          </p>
        </div>
      </td>

      <td className="py-3 pr-4 whitespace-nowrap">
        <span className="text-[#17409A] font-black text-sm">
          {formatPrice(p.price)}
        </span>
      </td>

      <td className="py-3 pr-4">
        <StockBadge stock={p.stock} />
      </td>

      <td className="py-3 pr-4">
        <div className="flex items-center gap-1.5">
          <span
            className="w-1.5 h-1.5 rounded-full shrink-0"
            style={{ backgroundColor: st.color }}
          />
          <span
            className="text-[10px] font-black px-2.5 py-1 rounded-full whitespace-nowrap"
            style={{ color: st.color, backgroundColor: st.bg }}
          >
            {st.label}
          </span>
        </div>
      </td>

      <td className="py-3">
        <div className="flex gap-1.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onView(p);
            }}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-[#9CA3AF] hover:text-[#17409A] hover:bg-[#F4F7FF] transition-all"
          >
            <MdRemoveRedEye className="text-sm" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(p);
            }}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-[#9CA3AF] hover:text-[#17409A] hover:bg-[#F4F7FF] transition-all"
          >
            <MdEdit className="text-sm" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(p);
            }}
            disabled={isDeleting}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-[#9CA3AF] hover:text-[#EF4444] hover:bg-[#EF4444]/10 transition-all disabled:opacity-50"
          >
            <MdDelete className="text-sm" />
          </button>
        </div>
      </td>
    </tr>
  );
}

const mapAccessoryToAdmin = (
  a: AccessoryResponse,
  index: number,
): ProductAdmin => {
  const badgeColors = ["#FF8C42", "#FF6B9D", "#7C5CFC", "#17409A"];
  const color = badgeColors[index % badgeColors.length];

  return {
    id: a.accessoryId,
    name: a.name,
    imageUrl: a.imageUrl || "/accessory_placeholder.png",
    badge: "Phụ kiện",
    badgeColor: color,
    category: "accessory",
    price: a.targetPrice,
    stock: a.available || 0,
    sold: 0,
    rating: 0,
    status: a.isActive ? "active" : "draft",
    popular: false,
  };
};

export default function AccessoriesGrid() {
  const [statusFilter, setStatus] = useState<ProductAdminStatus | "all">("all");
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 350);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
  const [editingAccessoryId, setEditingAccessoryId] = useState<string | null>(null);
  
  const [isDetailModalOpen, setDetailModalOpen] = useState(false);
  const [detailAccessoryId, setDetailAccessoryId] = useState<string | null>(null);

  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [deletingAccessory, setDeletingAccessory] = useState<ProductAdmin | null>(null);

  const {
    accessories,
    accessoriesLoading,
    fetchAccessories,
    deleteAccessory,
    isDeleting,
  } = useAdminProductsApi();
  const { success, error: toastError } = useToast();

  useEffect(() => {
    fetchAccessories();
  }, [fetchAccessories]);

  const handleDeleteConfirm = async () => {
    if (!deletingAccessory) return;
    const ok = await deleteAccessory(deletingAccessory.id);

    if (ok) {
      success("Xóa thành công!");
      fetchAccessories();
    } else {
      toastError("Có lỗi xảy ra khi xóa.");
    }
    setDeletingAccessory(null);
  };

  const filtered = useMemo(() => {
    return accessories
      .map(mapAccessoryToAdmin)
      .filter((p) => {
        if (statusFilter !== "all" && p.status !== statusFilter) return false;
        if (debouncedSearch) {
          const q = debouncedSearch.toLowerCase();
          return p.name.toLowerCase().includes(q);
        }
        return true;
      });
  }, [accessories, statusFilter, debouncedSearch]);

  return (
    <div className="bg-white rounded-3xl p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div>
          <p className="text-[#9CA3AF] text-[10px] font-black tracking-[0.22em] uppercase mb-0.5">
            Phụ kiện
          </p>
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
                  viewMode === m
                    ? "bg-[#17409A] text-white shadow-sm"
                    : "text-[#9CA3AF] hover:text-[#6B7280]"
                }`}
              >
                {m === "grid" ? (
                  <MdGridView className="text-base" />
                ) : (
                  <MdTableRows className="text-base" />
                )}
              </button>
            ))}
          </div>
          <button
            onClick={() => setCreateModalOpen(true)}
            className="flex items-center gap-1.5 bg-[#17409A] text-white text-xs font-black px-4 py-2.5 rounded-xl hover:bg-[#0f2d70] transition-colors whitespace-nowrap"
          >
            <MdAdd className="text-base" /> Thêm mới
          </button>
        </div>
      </div>

      <div className="flex items-center gap-1.5 flex-wrap mb-6 pb-4 border-b border-[#F4F7FF]">
        {[
          { key: "all", label: "Tất cả" },
          { key: "active", label: "Đang bán" },
          { key: "draft", label: "Bản nháp" },
          { key: "archived", label: "Lưu trữ" },
        ].map(({ key, label }) => {
          const active = statusFilter === key;
          const cfg = key !== "all" ? STATUS_CFG[key as ProductAdminStatus] : null;
          return (
            <button
              key={key}
              onClick={() => setStatus(key as any)}
              className={`px-3 py-1 rounded-lg text-[10px] font-black transition-all duration-200 ${active ? "ring-1" : "opacity-70 hover:opacity-100"}`}
              style={
                active && cfg
                  ? { color: cfg.color, backgroundColor: cfg.bg, outline: `1px solid ${cfg.color}` }
                  : active
                    ? { color: "#17409A", backgroundColor: "#17409A18", outline: "1px solid #17409A" }
                    : cfg
                      ? { color: cfg.color, backgroundColor: cfg.bg }
                      : { color: "#9CA3AF", backgroundColor: "#F4F7FF" }
              }
            >
              {label}
            </button>
          );
        })}
      </div>

      {accessoriesLoading ? (
         <div className="py-20 text-center text-[#9CA3AF] font-bold">Đang tải phụ kiện...</div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filtered.map((p) => (
            <AccessoryCard
              key={p.id}
              p={p}
              onView={(p) => {
                setDetailAccessoryId(p.id);
                setDetailModalOpen(true);
              }}
              onEdit={(p) => {
                setEditingAccessoryId(p.id);
                setUpdateModalOpen(true);
              }}
              onDelete={(p) => setDeletingAccessory(p)}
              isDeleting={isDeleting && deletingAccessory?.id === p.id}
            />
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                {COL_HEADS.map((h, i) => (
                  <th
                    key={i}
                    className="text-left text-[9px] font-black text-[#9CA3AF] tracking-[0.2em] uppercase pb-3 pr-4 whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <AccessoryRow
                  key={p.id}
                  p={p}
                  onView={(p) => {
                    setDetailAccessoryId(p.id);
                    setDetailModalOpen(true);
                  }}
                  onEdit={(p) => {
                    setEditingAccessoryId(p.id);
                    setUpdateModalOpen(true);
                  }}
                  onDelete={(p) => setDeletingAccessory(p)}
                  isDeleting={isDeleting && deletingAccessory?.id === p.id}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isCreateModalOpen && (
        <CreateAccessoryModal
          onClose={() => setCreateModalOpen(false)}
          onSuccess={() => {
            setCreateModalOpen(false);
            fetchAccessories();
          }}
        />
      )}

      {isUpdateModalOpen && editingAccessoryId && (
        <EditAccessoryModal
          accessoryId={editingAccessoryId}
          onClose={() => setUpdateModalOpen(false)}
          onSuccess={() => {
            setUpdateModalOpen(false);
            fetchAccessories();
          }}
        />
      )}

      {isDetailModalOpen && detailAccessoryId && (
        <AccessoryDetailModal
          accessoryId={detailAccessoryId}
          onClose={() => setDetailModalOpen(false)}
        />
      )}

      {deletingAccessory && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl animate-in zoom-in duration-200">
            <h3 className="text-lg font-black text-[#1A1A2E] mb-2">
              Xác nhận xóa?
            </h3>
            <p className="text-sm font-semibold text-[#6B7280] mb-6">
              Bạn có chắc chắn muốn xóa phụ kiện{" "}
              <span className="text-[#1A1A2E] font-black">
                "{deletingAccessory.name}"
              </span>
              ?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeletingAccessory(null)}
                className="flex-1 py-3 rounded-2xl text-sm font-bold text-[#6B7280] bg-[#F4F7FF]"
              >
                Hủy
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 py-3 rounded-2xl text-sm font-bold text-white bg-red-500"
              >
                Xóa ngay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
