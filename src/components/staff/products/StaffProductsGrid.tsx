"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import {
  MdSearch,
  MdStar,
  MdGridView,
  MdTableRows,
  MdWarning,
  MdClose,
  MdAdd,
  MdRemove,
} from "react-icons/md";
import {
  PRODUCTS_ADMIN,
  type ProductAdmin,
  type ProductAdminStatus,
} from "@/data/admin";

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

// ── Stock update modal ────────────────────────────────────────────────────────
function StockModal({
  product,
  onClose,
  onSave,
}: {
  product: ProductAdmin;
  onClose: () => void;
  onSave: (newStock: number) => void;
}) {
  const [val, setVal] = useState(product.stock);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden">
        {/* Header */}
        <div className="bg-[#17409A] px-6 py-5 flex items-start justify-between">
          <div>
            <p className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-0.5">
              Cập nhật tồn kho
            </p>
            <p className="text-white font-black text-base leading-snug">
              {product.name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition-colors cursor-pointer shrink-0"
          >
            <MdClose className="text-lg" />
          </button>
        </div>

        <div className="p-6 flex flex-col gap-5">
          {/* Current stock */}
          <div className="flex items-center gap-3 bg-[#F4F7FF] rounded-2xl p-4">
            <Image
              src={product.imageUrl}
              alt={product.name}
              width={52}
              height={52}
              className="object-contain"
            />
            <div>
              <p className="text-[#9CA3AF] text-xs">Hiện tại</p>
              <p className="font-black text-[#1A1A2E] text-2xl leading-none">
                {product.stock}
              </p>
              <p className="text-[#9CA3AF] text-[10px]">sản phẩm trong kho</p>
            </div>
          </div>

          {/* Stepper */}
          <div>
            <label className="text-[#1A1A2E] text-sm font-bold block mb-2">
              Số lượng mới
            </label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setVal((v) => Math.max(0, v - 1))}
                className="w-10 h-10 rounded-2xl bg-[#F4F7FF] hover:bg-[#EEF1FF] flex items-center justify-center text-[#17409A] font-black transition-colors cursor-pointer"
              >
                <MdRemove />
              </button>
              <input
                type="number"
                min={0}
                value={val}
                onChange={(e) =>
                  setVal(Math.max(0, parseInt(e.target.value) || 0))
                }
                className="flex-1 bg-[#F4F7FF] rounded-2xl px-4 py-2.5 text-center text-[#1A1A2E] font-black text-lg outline-none focus:ring-2 focus:ring-[#17409A]/30"
              />
              <button
                onClick={() => setVal((v) => v + 1)}
                className="w-10 h-10 rounded-2xl bg-[#F4F7FF] hover:bg-[#EEF1FF] flex items-center justify-center text-[#17409A] font-black transition-colors cursor-pointer"
              >
                <MdAdd />
              </button>
            </div>
            {val !== product.stock && (
              <p className="text-xs text-[#9CA3AF] mt-1.5 text-center">
                Thay đổi: {val - product.stock > 0 ? "+" : ""}
                {val - product.stock} sản phẩm
              </p>
            )}
          </div>

          {/* Footer */}
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-2xl bg-[#F4F7FF] hover:bg-[#EEF1FF] text-[#9CA3AF] font-bold text-sm transition-colors cursor-pointer"
            >
              Hủy
            </button>
            <button
              onClick={() => {
                onSave(val);
                onClose();
              }}
              className="flex-1 py-2.5 rounded-2xl bg-[#17409A] hover:bg-[#1a3a8a] text-white font-bold text-sm transition-colors cursor-pointer"
            >
              Lưu thay đổi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Card (grid view) ──────────────────────────────────────────────────────────
function ProductCard({
  p,
  onUpdateStock,
  onToggleStatus,
}: {
  p: ProductAdmin;
  onUpdateStock: (p: ProductAdmin) => void;
  onToggleStatus: (id: string) => void;
}) {
  const st = STATUS_CFG[p.status];
  return (
    <div className="group bg-[#F8F9FF] rounded-2xl overflow-hidden border border-transparent hover:border-[#17409A]/10 hover:shadow-lg hover:shadow-[#17409A]/5 transition-all duration-300">
      <div className="h-0.5 w-full" style={{ backgroundColor: p.badgeColor }} />
      <div
        className="relative flex items-center justify-center py-4 overflow-hidden"
        style={{ backgroundColor: p.badgeColor + "0d" }}
      >
        <Image
          src={p.imageUrl}
          alt={p.name}
          width={96}
          height={96}
          className="object-contain transition-transform duration-300 group-hover:scale-110 drop-shadow-md"
        />
        {p.popular && (
          <span className="absolute top-2.5 left-2.5 bg-[#FFD93D] text-[#1A1A2E] text-[8px] font-black px-2 py-0.5 rounded-full flex items-center gap-0.5">
            <MdStar className="text-xs" /> HOT
          </span>
        )}
        <span
          className="absolute top-2.5 right-2.5 text-[8px] font-black px-2 py-0.5 rounded-full"
          style={{ color: st.color, backgroundColor: st.bg }}
        >
          {st.label}
        </span>
      </div>
      <div className="p-4">
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
        <p className="font-black text-[#1A1A2E] text-sm leading-snug mb-1 line-clamp-2">
          {p.name}
        </p>
        <div className="flex items-center gap-1 mb-3">
          <MdStar style={{ color: "#FFD93D", fontSize: 12 }} />
          <span className="text-[10px] font-bold text-[#1A1A2E]">
            {p.rating}
          </span>
          <span className="text-[10px] text-[#9CA3AF]">· {p.sold} đã bán</span>
        </div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <StockBadge stock={p.stock} />
          <span className="text-xs font-black text-[#17409A]">
            {(p.price / 1000).toFixed(0)}k
          </span>
        </div>
        <div className="flex gap-1.5">
          <button
            onClick={() => onUpdateStock(p)}
            className="flex-1 py-1.5 rounded-xl bg-[#17409A]/10 hover:bg-[#17409A]/20 text-[#17409A] text-[10px] font-bold transition-colors cursor-pointer"
          >
            Cập nhật kho
          </button>
          {p.status !== "draft" && (
            <button
              onClick={() => onToggleStatus(p.id)}
              className="flex-1 py-1.5 rounded-xl text-[10px] font-bold transition-colors cursor-pointer"
              style={{
                backgroundColor:
                  p.status === "active" ? "#9CA3AF18" : "#4ECDC418",
                color: p.status === "active" ? "#9CA3AF" : "#4ECDC4",
              }}
            >
              {p.status === "active" ? "Ẩn" : "Kích hoạt"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function StaffProductsGrid() {
  const [products, setProducts] = useState<ProductAdmin[]>(PRODUCTS_ADMIN);
  const [view, setView] = useState<ViewMode>("grid");
  const [cat, setCat] = useState<CategoryFilter>("all");
  const [search, setSearch] = useState("");
  const [editingStock, setEditingStock] = useState<ProductAdmin | null>(null);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchCat = cat === "all" || p.category === cat;
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [products, cat, search]);

  function handleUpdateStock(product: ProductAdmin) {
    setEditingStock(product);
  }

  function handleSaveStock(id: string, newStock: number) {
    setProducts((ps) =>
      ps.map((p) => (p.id === id ? { ...p, stock: newStock } : p)),
    );
  }

  function handleToggleStatus(id: string) {
    setProducts((ps) =>
      ps.map((p) => {
        if (p.id !== id) return p;
        return { ...p, status: p.status === "active" ? "archived" : "active" };
      }),
    );
  }

  return (
    <>
      {/* Controls */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-[#F4F7FF]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          {/* Search */}
          <div className="relative flex-1 max-w-xs">
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] text-lg" />
            <input
              type="text"
              placeholder="Tìm sản phẩm…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#F4F7FF] rounded-2xl pl-9 pr-4 py-2.5 text-sm text-[#1A1A2E] placeholder-[#9CA3AF] outline-none focus:ring-2 focus:ring-[#17409A]/20 transition"
            />
          </div>

          {/* View toggle */}
          <div className="flex gap-1 bg-[#F4F7FF] rounded-2xl p-1">
            {(["grid", "table"] as ViewMode[]).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all cursor-pointer ${view === v ? "bg-[#17409A] text-white shadow-sm" : "text-[#9CA3AF] hover:text-[#1A1A2E]"}`}
              >
                {v === "grid" ? (
                  <MdGridView className="text-base" />
                ) : (
                  <MdTableRows className="text-base" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Category tabs */}
        <div className="flex gap-1.5 flex-wrap">
          {CATEGORY_TABS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setCat(key)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${cat === key ? "bg-[#17409A] text-white" : "bg-[#F4F7FF] text-[#9CA3AF] hover:text-[#1A1A2E]"}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid view */}
      {view === "grid" && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-4">
          {filtered.map((p) => (
            <ProductCard
              key={p.id}
              p={p}
              onUpdateStock={handleUpdateStock}
              onToggleStatus={handleToggleStatus}
            />
          ))}
        </div>
      )}

      {/* Table view */}
      {view === "table" && (
        <div className="bg-white rounded-3xl shadow-sm border border-[#F4F7FF] overflow-hidden mt-4">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#F4F7FF]">
                  {COL_HEADS.map((h) => (
                    <th
                      key={h}
                      className="text-left px-4 py-3 text-[#9CA3AF] text-[10px] font-black uppercase tracking-wider whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((p, i) => {
                  const st = STATUS_CFG[p.status];
                  return (
                    <tr
                      key={p.id}
                      className={`border-b border-[#F4F7FF] hover:bg-[#F8F9FF] transition-colors ${i % 2 === 0 ? "" : "bg-[#FAFBFF]"}`}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Image
                            src={p.imageUrl}
                            alt={p.name}
                            width={40}
                            height={40}
                            className="object-contain rounded-xl bg-[#F4F7FF] p-1"
                          />
                          <div>
                            <p className="font-bold text-[#1A1A2E] text-xs leading-snug line-clamp-1">
                              {p.name}
                            </p>
                            {p.badge && (
                              <span
                                className="text-[8px] font-black"
                                style={{ color: p.badgeColor }}
                              >
                                {p.badge}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-[10px] text-[#6B7280] capitalize font-semibold">
                        {p.category}
                      </td>
                      <td className="px-4 py-3 text-xs font-black text-[#17409A] whitespace-nowrap">
                        {p.price.toLocaleString("vi-VN")}₫
                      </td>
                      <td className="px-4 py-3">
                        <StockBadge stock={p.stock} />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <MdStar style={{ color: "#FFD93D", fontSize: 12 }} />
                          <span className="text-[10px] font-bold text-[#1A1A2E]">
                            {p.rating}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className="text-[9px] font-black px-2 py-1 rounded-full"
                          style={{ color: st.color, backgroundColor: st.bg }}
                        >
                          {st.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleUpdateStock(p)}
                            className="text-[9px] font-black px-2.5 py-1 rounded-xl bg-[#17409A]/10 hover:bg-[#17409A]/20 text-[#17409A] transition-colors cursor-pointer whitespace-nowrap"
                          >
                            Cập nhật kho
                          </button>
                          {p.status !== "draft" && (
                            <button
                              onClick={() => handleToggleStatus(p.id)}
                              className="text-[9px] font-black px-2.5 py-1 rounded-xl transition-colors cursor-pointer whitespace-nowrap"
                              style={{
                                backgroundColor:
                                  p.status === "active"
                                    ? "#9CA3AF18"
                                    : "#4ECDC418",
                                color:
                                  p.status === "active" ? "#9CA3AF" : "#4ECDC4",
                              }}
                            >
                              {p.status === "active" ? "Ẩn" : "Kích hoạt"}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-[#F4F7FF] text-[#9CA3AF] text-xs">
            {filtered.length} / {products.length} sản phẩm
          </div>
        </div>
      )}

      {/* Stock modal */}
      {editingStock && (
        <StockModal
          product={editingStock}
          onClose={() => setEditingStock(null)}
          onSave={(newStock) => {
            handleSaveStock(editingStock.id, newStock);
          }}
        />
      )}
    </>
  );
}
