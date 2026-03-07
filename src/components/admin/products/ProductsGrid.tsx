"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import {
  MdSearch,
  MdAdd,
  MdEdit,
  MdVisibility,
  MdVisibilityOff,
  MdMoreVert,
  MdStar,
  MdGridView,
  MdTableRows,
  MdFileDownload,
  MdWarning,
} from "react-icons/md";
import { GiPawPrint } from "react-icons/gi";
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
function ProductCard({ p }: { p: ProductAdmin }) {
  const st = STATUS_CFG[p.status];
  return (
    <div className="group bg-[#F8F9FF] rounded-2xl overflow-hidden border border-transparent hover:border-[#17409A]/10 hover:shadow-lg hover:shadow-[#17409A]/5 transition-all duration-300 cursor-pointer relative">
      {/* Category color top stripe */}
      <div className="h-0.5 w-full" style={{ backgroundColor: p.badgeColor }} />

      {/* Image area */}
      <div
        className="relative flex items-center justify-center py-4 overflow-hidden"
        style={{ backgroundColor: p.badgeColor + "0d" }}
      >
        <Image
          src={p.image}
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
          <button className="flex-1 flex items-center justify-center gap-1 text-[10px] font-black text-[#17409A] bg-[#17409A]/8 hover:bg-[#17409A]/15 rounded-xl py-2 transition-colors">
            <MdEdit className="text-sm" /> Sửa
          </button>
          <button
            className="w-8 h-8 flex items-center justify-center text-[#9CA3AF] hover:text-[#4B5563] hover:bg-[#F4F7FF] rounded-xl transition-all"
            title={p.status === "active" ? "Ẩn sản phẩm" : "Hiện sản phẩm"}
          >
            {p.status === "active" ? (
              <MdVisibility className="text-base" />
            ) : (
              <MdVisibilityOff className="text-base" />
            )}
          </button>
          <button className="w-8 h-8 flex items-center justify-center text-[#9CA3AF] hover:text-[#4B5563] hover:bg-[#F4F7FF] rounded-xl transition-all">
            <MdMoreVert className="text-base" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Table row ────────────────────────────────────────────────────────────────
function ProductRow({ p, index }: { p: ProductAdmin; index: number }) {
  const st = STATUS_CFG[p.status];
  const AVATAR_COLORS = [
    "#17409A",
    "#7C5CFC",
    "#4ECDC4",
    "#FF8C42",
    "#FF6B9D",
    "#FFD93D",
  ];
  const avatarColor = AVATAR_COLORS[index % AVATAR_COLORS.length];

  const CATEGORY_LABELS: Record<string, string> = {
    complete: "Gấu hoàn chỉnh",
    bear: "Thân gấu",
    accessory: "Phụ kiện",
  };

  return (
    <tr className="group border-t border-[#F4F7FF] hover:bg-[#F8F9FF] transition-colors duration-150 cursor-pointer">
      {/* Product */}
      <td className="py-3 pr-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 group-hover:scale-105 transition-transform duration-200 bg-[#F4F7FF] flex items-center justify-center">
            <Image
              src={p.image}
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
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
          <button
            className="w-7 h-7 rounded-lg flex items-center justify-center text-[#9CA3AF] hover:text-[#17409A] hover:bg-[#17409A]/10 transition-all"
            title="Chỉnh sửa"
          >
            <MdEdit className="text-sm" />
          </button>
          <button
            className="w-7 h-7 rounded-lg flex items-center justify-center text-[#9CA3AF] hover:text-[#4B5563] hover:bg-[#F4F7FF] transition-all"
            title="Ẩn/Hiện"
          >
            <MdVisibility className="text-sm" />
          </button>
          <button className="w-7 h-7 rounded-lg flex items-center justify-center text-[#9CA3AF] hover:text-[#4B5563] hover:bg-[#F4F7FF] transition-all">
            <MdMoreVert className="text-sm" />
          </button>
        </div>
      </td>
    </tr>
  );
}

// ── Main component ───────────────────────────────────────────────────────────
export default function ProductsGrid() {
  const [catFilter, setCatFilter] = useState<CategoryFilter>("all");
  const [statusFilter, setStatus] = useState<ProductAdminStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  const catCounts = useMemo(() => {
    const c: Record<string, number> = { all: PRODUCTS_ADMIN.length };
    PRODUCTS_ADMIN.forEach((p: ProductAdmin) => {
      c[p.category] = (c[p.category] ?? 0) + 1;
    });
    return c;
  }, []);

  const filtered = useMemo(
    () =>
      PRODUCTS_ADMIN.filter((p: ProductAdmin) => {
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
    [catFilter, statusFilter, search],
  );

  const STATUS_FILTERS: { key: ProductAdminStatus | "all"; label: string }[] = [
    { key: "all", label: "Tất cả" },
    { key: "active", label: "Đang bán" },
    { key: "draft", label: "Bản nháp" },
    { key: "archived", label: "Lưu trữ" },
  ];

  return (
    <div className="bg-white rounded-3xl p-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div>
          <p className="text-[#9CA3AF] text-[10px] font-black tracking-[0.22em] uppercase mb-0.5">
            Danh mục
          </p>
          <p className="text-[#1A1A2E] font-black text-xl">Quản lý sản phẩm</p>
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
          <button className="flex items-center gap-1.5 bg-[#17409A] text-white text-xs font-black px-4 py-2.5 rounded-xl hover:bg-[#0f2d70] transition-colors whitespace-nowrap">
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
                  active ? "bg-white/20 text-white" : "bg-white text-[#9CA3AF]"
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
                <ProductCard key={p.id} p={p} />
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
                <ProductRow key={p.id} p={p} index={i} />
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
            <span className="text-[#1A1A2E] font-black">{filtered.length}</span>{" "}
            / {PRODUCTS_ADMIN.length} sản phẩm
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
