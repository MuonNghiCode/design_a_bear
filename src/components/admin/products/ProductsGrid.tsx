"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import {
  MdSearch,
  MdAdd,
  MdEdit,
  MdMoreVert,
  MdStar,
  MdGridView,
  MdTableRows,
  MdFileDownload,
  MdWarning,
  MdClose,
  MdRemoveRedEye,
  MdDelete,
} from "react-icons/md";
import { GiPawPrint } from "react-icons/gi";
import { type ProductAdmin, type ProductAdminStatus } from "@/data/admin";
import { type GetProductsRequest } from "@/types";
import { useAdminProductsApi } from "@/hooks/useAdminProductsApi";
import { useToast } from "@/contexts/ToastContext";
import type { ProductListItem } from "@/types";
import { useEffect } from "react";
import CreateProductModal from "./CreateProductModal";
import EditProductModal from "./EditProductModal";

type ViewMode = "grid" | "table";
type CategoryFilter = "all" | "complete" | "bear" | "accessory";

const STATUS_CFG: Record<
  ProductAdminStatus,
  { label: string; color: string; bg: string }
> = {
  active: { label: "Đang bán", color: "#4ECDC4", bg: "#4ECDC418" },
  draft: { label: "Bản nháp", color: "#7C5CFC", bg: "#7C5CFC18" },
  archived: { label: "Lưu trữ", color: "#9CA3AF", bg: "#9CA3AF18" },
};

const CATEGORY_TABS: { key: CategoryFilter; label: string }[] = [
  { key: "all", label: "Tất cả" },
  { key: "complete", label: "Gấu hoàn chỉnh" },
  { key: "bear", label: "Thân gấu" },
  { key: "accessory", label: "Phụ kiện" },
];

const COL_HEADS = [
  "Sản phẩm",
  "Danh mục",
  "Giá",
  "Tồn kho",
  "Đã bán",
  "Đánh giá",
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

// ── Luxe product grid card ───────────────────────────────────────────────────
function ProductCard({
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
      className="group bg-[#F8F9FF] rounded-2xl overflow-hidden border border-transparent hover:border-[#17409A]/10 hover:shadow-lg hover:shadow-[#17409A]/5 transition-all duration-300 cursor-pointer relative"
    >
      {/* Category color top stripe */}
      <div className="h-0.5 w-full" style={{ backgroundColor: p.badgeColor }} />

      {/* Image area */}
      <div
        className="relative flex items-center justify-center py-4 overflow-hidden"
        style={{ backgroundColor: p.badgeColor + "0d" }}
      >
        <Image
          src={p.imageUrl || "/teddy_bear.png"}
          alt={p.name}
          width={96}
          height={96}
          className="object-contain transition-transform duration-300 group-hover:scale-110 drop-shadow-md"
        />
        {/* Popular badge */}
        {p.popular && (
          <span className="absolute top-2.5 left-2.5 bg-[#FFD93D] text-[#1A1A2E] text-[8px] font-black px-2 py-0.5 rounded-full flex items-center gap-0.5">
            <MdStar className="text-xs" /> HOT
          </span>
        )}
        {/* Status pill */}
        <span
          className="absolute top-2.5 right-2.5 text-[8px] font-black px-2 py-0.5 rounded-full"
          style={{ color: st.color, backgroundColor: st.bg }}
        >
          {st.label}
        </span>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Name + badge */}
        <div className="mb-2.5">
          {p.badge && (
            <span
              className="text-[8px] font-black px-1.5 py-0.5 rounded-full mb-1 inline-block"
              style={{
                color: p.badgeColor,
                backgroundColor: p.badgeColor + "18",
              }}
            >
              {p.badge}
            </span>
          )}
          <p className="text-[#1A1A2E] font-black text-sm leading-snug line-clamp-2">
            {p.name}
          </p>
        </div>

        {/* Price */}
        <p className="text-[#17409A] font-black text-lg leading-none mb-3">
          {(p.price / 1000).toFixed(0)}K
          <span className="text-[#9CA3AF] font-semibold text-[10px] ml-0.5">
            đ
          </span>
        </p>

        {/* Stats row */}
        <div className="flex items-center justify-between text-[10px] font-semibold text-[#9CA3AF] mb-3">
          <span>
            <span className="text-[#4B5563] font-black">{p.sold}</span> đơn
          </span>
          {p.rating > 0 ? (
            <span className="flex items-center gap-0.5 text-[#FFD93D] font-black">
              <MdStar className="text-xs" />
              {p.rating}
            </span>
          ) : (
            <span className="text-[#D1D5DB]">—</span>
          )}
          <StockBadge stock={p.stock} />
        </div>

        {/* Stock bar */}
        {p.status === "active" && p.stock > 0 && (
          <div className="h-1 bg-[#E5E7EB] rounded-full overflow-hidden mb-3">
            <div
              className="h-full rounded-full"
              style={{
                width: `${Math.min(100, Math.round((p.stock / 80) * 100))}%`,
                backgroundColor: p.stock <= 10 ? "#FF8C42" : "#4ECDC4",
              }}
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-1.5 pt-1 border-t border-[#E9ECEF]">
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
              onView(p);
            }}
            className="w-8 h-8 flex items-center justify-center text-[#9CA3AF] hover:text-[#17409A] hover:bg-[#17409A]/10 rounded-xl transition-all"
            title="Xem chi tiết"
          >
            <MdRemoveRedEye className="text-base" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(p);
            }}
            disabled={isDeleting}
            className="w-8 h-8 flex items-center justify-center text-[#9CA3AF] hover:text-[#EF4444] hover:bg-[#EF4444]/10 rounded-xl transition-all disabled:opacity-50"
            title="Xóa sản phẩm"
          >
            <MdDelete className="text-base" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Table row ────────────────────────────────────────────────────────────────
function ProductRow({
  p,
  index,
  onView,
  onEdit,
  onDelete,
  isDeleting,
}: {
  p: ProductAdmin;
  index: number;
  onView: (p: ProductAdmin) => void;
  onEdit: (p: ProductAdmin) => void;
  onDelete: (p: ProductAdmin) => void;
  isDeleting: boolean;
}) {
  const st = STATUS_CFG[p.status];
  const AVATAR_COLORS = [
    "#17409A",
    "#7C5CFC",
    "#4ECDC4",
    "#FF8C42",
    "#FF6B9D",
    "#FFD93D",
  ];

  const CATEGORY_LABELS: Record<string, string> = {
    complete: "Gấu hoàn chỉnh",
    bear: "Thân gấu",
    accessory: "Phụ kiện",
  };

  return (
    <tr
      onClick={() => onView(p)}
      className="group border-t border-[#F4F7FF] hover:bg-[#F8F9FF] transition-colors duration-150 cursor-pointer"
    >
      {/* Product */}
      <td className="py-3 pr-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 group-hover:scale-105 transition-transform duration-200 bg-[#F4F7FF] flex items-center justify-center">
            <Image
              src={p.imageUrl || "/teddy_bear.png"}
              alt={p.name}
              width={40}
              height={40}
              className="object-contain w-full h-full"
            />
          </div>
          <div>
            <p className="text-[#1A1A2E] font-bold text-sm leading-tight max-w-48 truncate">
              {p.name}
            </p>
            {p.badge && (
              <span
                className="text-[8px] font-black px-1.5 py-0.5 rounded-full mt-0.5 inline-block"
                style={{
                  color: p.badgeColor,
                  backgroundColor: p.badgeColor + "18",
                }}
              >
                {p.badge}
              </span>
            )}
          </div>
        </div>
      </td>

      {/* Category */}
      <td className="py-3 pr-4">
        <span className="text-[10px] font-black text-[#6B7280] bg-[#F4F7FF] px-2.5 py-1 rounded-lg whitespace-nowrap">
          {CATEGORY_LABELS[p.category]}
        </span>
      </td>

      {/* Price */}
      <td className="py-3 pr-4 whitespace-nowrap">
        <span className="text-[#17409A] font-black text-sm">
          {(p.price / 1000).toFixed(0)}K
        </span>
        <span className="text-[#9CA3AF] font-semibold text-[10px] ml-0.5">
          đ
        </span>
      </td>

      {/* Stock */}
      <td className="py-3 pr-4">
        <StockBadge stock={p.stock} />
      </td>

      {/* Sold */}
      <td className="py-3 pr-4">
        <span className="text-[#1A1A2E] font-black text-sm">{p.sold}</span>
      </td>

      {/* Rating */}
      <td className="py-3 pr-4">
        {p.rating > 0 ? (
          <span className="flex items-center gap-1 text-[#FFD93D] font-black text-sm">
            <MdStar className="text-base" />
            {p.rating}
          </span>
        ) : (
          <span className="text-[#D1D5DB] text-sm">—</span>
        )}
      </td>

      {/* Status */}
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

      {/* Actions */}
      <td className="py-3">
        <div className="flex gap-1.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(p);
            }}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-[#9CA3AF] hover:text-[#17409A] hover:bg-[#F4F7FF] transition-all"
            title="Sửa"
          >
            <MdEdit className="text-sm" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onView(p);
            }}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-[#9CA3AF] hover:text-[#17409A] hover:bg-[#17409A]/10 transition-all"
            title="Xem chi tiết"
          >
            <MdRemoveRedEye className="text-sm" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(p);
            }}
            disabled={isDeleting}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-[#9CA3AF] hover:text-[#EF4444] hover:bg-[#EF4444]/10 transition-all disabled:opacity-50"
            title="Xóa sản phẩm"
          >
            <MdDelete className="text-sm" />
          </button>
        </div>
      </td>
    </tr>
  );
}

// ── Main component ───────────────────────────────────────────────────────────
const mapProductToAdmin = (p: ProductListItem, index: number): ProductAdmin => {
  const badgeColors = [
    "#17409A",
    "#7C5CFC",
    "#4ECDC4",
    "#FF8C42",
    "#FF6B9D",
    "#FFD93D",
  ];
  const color = badgeColors[index % badgeColors.length];

  let category: "complete" | "bear" | "accessory" = "bear";
  if (p.productType === "ACCESSORY") category = "accessory";
  else if (p.productType === "COMPLETE_BEAR") category = "complete";

  const badgeName = p.productType === "ACCESSORY" ? "Phụ kiện" : "Gấu bông";

  return {
    id: p.productId,
    name: p.name,
    imageUrl: p.imageUrl || "/teddy_bear.png",
    badge: badgeName,
    badgeColor: color,
    category,
    price: p.price,
    stock: 50, // Mock stock as it's missing from API
    sold: p.totalSales,
    rating: p.averageRating,
    status: p.isActive ? "active" : "draft",
    popular: p.viewCountIn10Min > 5,
  };
};

export default function ProductsGrid() {
  const [catFilter, setCatFilter] = useState<CategoryFilter>("all");
  const [statusFilter, setStatus] = useState<ProductAdminStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [selected, setSelected] = useState<ProductAdmin | null>(null);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<ProductAdmin | null>(
    null,
  );

  const {
    data,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    isCreating,
    isUpdating,
    isDeleting,
  } = useAdminProductsApi();
  const { success, error } = useToast();

  const handleDelete = (p: ProductAdmin) => {
    setDeletingProduct(p);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingProduct) return;
    const ok = await deleteProduct(deletingProduct.id);
    if (ok) {
      success("Xóa sản phẩm thành công!");
      fetchProducts({ pageIndex: 1, pageSize: 50 });
    } else {
      error("Có lỗi xảy ra khi xóa sản phẩm.");
    }
    setDeletingProduct(null);
  };

  useEffect(() => {
    fetchProducts({ pageIndex: 1, pageSize: 50 });
  }, [fetchProducts]);

  const mappedData = useMemo(() => {
    if (!data?.items) return [];
    return data.items.map(mapProductToAdmin);
  }, [data]);

  const catCounts = useMemo(() => {
    const c: Record<string, number> = { all: mappedData.length };
    mappedData.forEach((p: ProductAdmin) => {
      c[p.category] = (c[p.category] ?? 0) + 1;
    });
    return c;
  }, [mappedData]);

  const filtered = useMemo(
    () =>
      mappedData.filter((p: ProductAdmin) => {
        if (catFilter !== "all" && p.category !== catFilter) return false;
        if (statusFilter !== "all" && p.status !== statusFilter) return false;
        if (search) {
          const q = search.toLowerCase();
          return (
            p.name.toLowerCase().includes(q) ||
            (p.badge ?? "").toLowerCase().includes(q)
          );
        }
        return true;
      }),
    [mappedData, catFilter, statusFilter, search],
  );

  const STATUS_FILTERS: { key: ProductAdminStatus | "all"; label: string }[] = [
    { key: "all", label: "Tất cả" },
    { key: "active", label: "Đang bán" },
    { key: "draft", label: "Bản nháp" },
    { key: "archived", label: "Lưu trữ" },
  ];

  return (
    <>
      <div className="bg-white rounded-3xl p-6">
        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div>
            <p className="text-[#9CA3AF] text-[10px] font-black tracking-[0.22em] uppercase mb-0.5">
              Danh mục
            </p>
            <p className="text-[#1A1A2E] font-black text-xl">
              Quản lý sản phẩm
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {/* Search */}
            <div className="relative">
              <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] text-base pointer-events-none" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm sản phẩm..."
                className="bg-[#F4F7FF] text-[#1A1A2E] text-sm font-semibold placeholder:text-[#9CA3AF] rounded-xl pl-9 pr-4 py-2.5 outline-none border-2 border-transparent focus:border-[#17409A]/20 transition-colors w-44"
              />
            </div>

            {/* View toggle */}
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

            {/* Export */}
            <button className="flex items-center gap-1.5 bg-[#F4F7FF] text-[#6B7280] text-xs font-black px-3.5 py-2.5 rounded-xl hover:bg-[#E8EEF9] transition-colors">
              <MdFileDownload className="text-sm" />
              Xuất
            </button>

            {/* Add new */}
            <button
              onClick={() => setCreateModalOpen(true)}
              className="flex items-center gap-1.5 bg-[#17409A] text-white text-xs font-black px-4 py-2.5 rounded-xl hover:bg-[#0f2d70] transition-colors whitespace-nowrap"
            >
              <MdAdd className="text-base" /> Thêm mới
            </button>
          </div>
        </div>

        {/* ── Category tabs ── */}
        <div className="flex items-center gap-1.5 flex-wrap mb-3">
          {CATEGORY_TABS.map(({ key, label }) => {
            const active = catFilter === key;
            return (
              <button
                key={key}
                onClick={() => setCatFilter(key)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black transition-all duration-200 ${
                  active
                    ? "bg-[#17409A] text-white shadow-sm"
                    : "bg-[#F4F7FF] text-[#6B7280] hover:bg-[#E8EEF9]"
                }`}
              >
                {label}
                <span
                  className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${
                    active
                      ? "bg-white/20 text-white"
                      : "bg-white text-[#9CA3AF]"
                  }`}
                >
                  {catCounts[key] ?? 0}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── Status filter chips ── */}
        <div className="flex items-center gap-1.5 flex-wrap mb-6 pb-4 border-b border-[#F4F7FF]">
          {STATUS_FILTERS.map(({ key, label }) => {
            const active = statusFilter === key;
            const cfg =
              key !== "all" ? STATUS_CFG[key as ProductAdminStatus] : null;
            return (
              <button
                key={key}
                onClick={() => setStatus(key)}
                className={`px-3 py-1 rounded-lg text-[10px] font-black transition-all duration-200 ${
                  active ? "ring-1" : "opacity-70 hover:opacity-100"
                }`}
                style={
                  active && cfg
                    ? {
                        color: cfg.color,
                        backgroundColor: cfg.bg,
                        outline: `1px solid ${cfg.color}`,
                      }
                    : active
                      ? {
                          color: "#17409A",
                          backgroundColor: "#17409A18",
                          outline: "1px solid #17409A",
                        }
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

        {/* ── Grid view ── */}
        {viewMode === "grid" && (
          <>
            {filtered.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {filtered.map((p: ProductAdmin) => (
                  <ProductCard
                    key={p.id}
                    p={p}
                    onView={setSelected}
                    onEdit={(p) => setEditingProductId(p.id)}
                    onDelete={handleDelete}
                    isDeleting={isDeleting && deletingProduct?.id === p.id}
                  />
                ))}
              </div>
            ) : (
              <EmptyState />
            )}
          </>
        )}

        {/* ── Table view ── */}
        {viewMode === "table" && (
          <div className="overflow-x-auto">
            <table className="w-full min-w-170">
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
                {filtered.map((p: ProductAdmin, i: number) => (
                  <ProductRow
                    key={p.id}
                    p={p}
                    index={i}
                    onView={setSelected}
                    onEdit={(p) => setEditingProductId(p.id)}
                    onDelete={handleDelete}
                    isDeleting={isDeleting && deletingProduct?.id === p.id}
                  />
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && <EmptyState />}
          </div>
        )}

        {/* Footer */}
        {filtered.length > 0 && (
          <div className="flex items-center justify-between mt-5 pt-4 border-t border-[#F4F7FF]">
            <p className="text-[#9CA3AF] text-[11px] font-semibold">
              Hiển thị{" "}
              <span className="text-[#1A1A2E] font-black">
                {filtered.length}
              </span>{" "}
              / {mappedData.length} sản phẩm
            </p>
            <div className="flex items-center gap-0.5">
              {[1, 2].map((p) => (
                <button
                  key={p}
                  className={`w-7 h-7 rounded-lg text-[11px] font-black transition-colors ${
                    p === 1
                      ? "bg-[#17409A] text-white"
                      : "text-[#9CA3AF] hover:bg-[#F4F7FF]"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Product detail modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setSelected(null)}
          />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden">
            {/* Image header */}
            <div
              className="relative flex items-center justify-center py-6"
              style={{ backgroundColor: selected.badgeColor + "18" }}
            >
              <div
                className="absolute top-0 left-0 right-0 h-0.5"
                style={{ backgroundColor: selected.badgeColor }}
              />
              <Image
                src={selected.imageUrl}
                alt={selected.name}
                width={120}
                height={120}
                className="object-contain drop-shadow-lg"
              />
              {selected.popular && (
                <span className="absolute top-3 left-4 bg-[#FFD93D] text-[#1A1A2E] text-[8px] font-black px-2 py-0.5 rounded-full flex items-center gap-0.5">
                  <MdStar className="text-xs" /> HOT
                </span>
              )}
              <button
                onClick={() => setSelected(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-xl flex items-center justify-center bg-white/70 text-[#6B7280] hover:text-[#1A1A2E] transition-all"
              >
                <MdClose className="text-lg" />
              </button>
              <span
                className="absolute bottom-3 right-4 text-[9px] font-black px-2.5 py-1 rounded-full"
                style={{
                  color: STATUS_CFG[selected.status].color,
                  backgroundColor: STATUS_CFG[selected.status].bg,
                }}
              >
                {STATUS_CFG[selected.status].label}
              </span>
            </div>

            {/* Content */}
            <div className="p-5">
              {selected.badge && (
                <span
                  className="text-[9px] font-black px-2 py-0.5 rounded-full mb-1.5 inline-block"
                  style={{
                    color: selected.badgeColor,
                    backgroundColor: selected.badgeColor + "18",
                  }}
                >
                  {selected.badge}
                </span>
              )}
              <p className="text-[#1A1A2E] font-black text-xl mb-0.5">
                {selected.name}
              </p>
              <p className="text-[#17409A] font-black text-2xl mb-4">
                {(selected.price / 1000).toFixed(0)}K
                <span className="text-[#9CA3AF] font-semibold text-sm ml-1">
                  đ
                </span>
              </p>

              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-[#F8F9FF] rounded-xl p-3 text-center">
                  <p className="text-[#9CA3AF] text-[9px] font-black tracking-wide mb-0.5">
                    TỒN KHO
                  </p>
                  <p className="text-[#1A1A2E] font-black text-base">
                    {selected.stock}
                  </p>
                </div>
                <div className="bg-[#F8F9FF] rounded-xl p-3 text-center">
                  <p className="text-[#9CA3AF] text-[9px] font-black tracking-wide mb-0.5">
                    ĐÃ BÁN
                  </p>
                  <p className="text-[#1A1A2E] font-black text-base">
                    {selected.sold}
                  </p>
                </div>
                <div className="bg-[#F8F9FF] rounded-xl p-3 text-center">
                  <p className="text-[#9CA3AF] text-[9px] font-black tracking-wide mb-0.5">
                    ĐÁNH GIÁ
                  </p>
                  {selected.rating > 0 ? (
                    <p className="text-[#FFD93D] font-black text-base flex items-center justify-center gap-0.5">
                      <MdStar className="text-xs" />
                      {selected.rating}
                    </p>
                  ) : (
                    <p className="text-[#D1D5DB] font-black text-base">—</p>
                  )}
                </div>
              </div>

              {selected.status === "active" && selected.stock > 0 && (
                <div>
                  <div className="flex justify-between text-[10px] font-semibold text-[#9CA3AF] mb-1.5">
                    <span>Tồn kho</span>
                    <span>
                      {Math.min(100, Math.round((selected.stock / 80) * 100))}%
                    </span>
                  </div>
                  <div className="h-1.5 bg-[#E5E7EB] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${Math.min(100, Math.round((selected.stock / 80) * 100))}%`,
                        backgroundColor:
                          selected.stock <= 10 ? "#FF8C42" : "#4ECDC4",
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Create Product Modal */}
      {isCreateModalOpen && (
        <CreateProductModal
          onClose={() => setCreateModalOpen(false)}
          onSubmit={async (payload) => {
            const response = await createProduct(payload);
            if (response) {
              success("Thêm mới sản phẩm thành công! 🎉");
              fetchProducts({ pageIndex: 1, pageSize: 50 });
            } else {
              error("Lỗi khi thêm mới sản phẩm.");
            }
            return response;
          }}
          isSubmitting={isCreating}
        />
      )}

      {/* Edit Product Modal */}
      {editingProductId && (
        <EditProductModal
          productId={editingProductId}
          onClose={() => setEditingProductId(null)}
          onSubmit={async (payload) => {
            const ok = await updateProduct(editingProductId, payload);
            if (ok) {
              success("Cập nhật sản phẩm thành công! ✨");
              fetchProducts({ pageIndex: 1, pageSize: 50 });
            } else {
              error("Lỗi khi cập nhật sản phẩm.");
            }
            return ok;
          }}
          isSubmitting={isUpdating}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deletingProduct && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={() => !isDeleting && setDeletingProduct(null)}
          />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-[#EF4444]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <MdDelete className="text-3xl text-[#EF4444]" />
              </div>
              <h3 className="text-xl font-black text-[#1A1A2E] mb-2">
                Xóa sản phẩm này?
              </h3>
              <p className="text-sm font-semibold text-[#6B7280]">
                Bạn đang chuẩn bị xóa sản phẩm{" "}
                <span className="text-[#1A1A2E] font-black">
                  &quot;{deletingProduct.name}&quot;
                </span>
                . Hành động này không thể hoàn tác.
              </p>
            </div>
            <div className="px-6 py-4 bg-[#F8F9FF] flex items-center gap-3">
              <button
                type="button"
                onClick={() => setDeletingProduct(null)}
                disabled={isDeleting}
                className="flex-1 py-3 rounded-xl text-sm font-bold text-[#6B7280] bg-white border border-[#E5E7EB] hover:bg-[#F4F7FF] hover:text-[#1A1A2E] transition-colors disabled:opacity-50"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="flex-1 py-3 rounded-xl text-sm font-bold text-white bg-[#EF4444] hover:bg-[#DC2626] shadow-lg hover:shadow-xl shadow-[#EF4444]/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isDeleting ? "Đang xóa..." : "Xóa vĩnh viễn"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center py-12 text-center">
      <GiPawPrint className="text-[#E5E7EB] mb-3" style={{ fontSize: 52 }} />
      <p className="text-[#9CA3AF] font-black text-sm">
        Không tìm thấy sản phẩm phù hợp
      </p>
      <p className="text-[#9CA3AF] text-[11px] font-semibold mt-1">
        Thử thay đổi bộ lọc hoặc từ khoá
      </p>
    </div>
  );
}
