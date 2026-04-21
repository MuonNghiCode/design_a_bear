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
  MdFileDownload,
  MdWarning,
  MdClose,
  MdRemoveRedEye,
  MdDelete,
  MdStar,
} from "react-icons/md";
import { type ProductAdmin, type ProductAdminStatus } from "@/data/admin";
import { useAdminProductsApi } from "@/hooks/useAdminProductsApi";
import { useToast } from "@/contexts/ToastContext";
import type { ProductListItem, ProductDetail, AccessoryResponse } from "@/types";
import { productService } from "@/services/product.service";

import CreateProductModal from "./CreateProductModal";
import EditProductModal from "./EditProductModal";
import ProductDetailModal from "./ProductDetailModal";
import CreateAccessoryModal from "./accessories/CreateAccessoryModal";
import EditAccessoryModal from "./accessories/EditAccessoryModal";

type ViewMode = "grid" | "table";
type CategoryFilter = "all" | "bear" | "accessory";

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
  { key: "bear", label: "Gấu" },
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
  const stockPercent =
    p.status === "active" && p.stock > 0
      ? Math.min(100, Math.round((p.stock / 80) * 100))
      : 0;

  return (
    <div
      onClick={() => onView(p)}
      className="group h-full bg-[#F8F9FF] rounded-2xl overflow-hidden border border-transparent hover:border-[#17409A]/10 hover:shadow-lg hover:shadow-[#17409A]/5 transition-all duration-300 cursor-pointer relative flex flex-col"
    >
      <div className="h-0.5 w-full" style={{ backgroundColor: p.badgeColor }} />
      <div
        className="relative h-28 flex items-center justify-center overflow-hidden"
        style={{ backgroundColor: p.badgeColor + "0d" }}
      >
        <Image
          src={p.imageUrl || "/teddy_bear.png"}
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

      <div className="p-4 flex flex-1 flex-col">
        <div className="mb-2.5 min-h-14">
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

        <p className="text-[#17409A] font-black text-lg leading-none mb-3">
          {formatPrice(p.price)}
        </p>

        <div className="flex items-center justify-between text-[10px] font-semibold text-[#9CA3AF] mb-3 min-h-4">
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

        <div className="h-1 bg-[#E5E7EB] rounded-full overflow-hidden mb-3">
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${stockPercent}%`,
              backgroundColor: p.stock <= 10 ? "#FF8C42" : "#4ECDC4",
            }}
          />
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

function ProductRow({
  p,
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
  const CATEGORY_LABELS: Record<string, string> = {
    all: "Tất cả",
    bear: "Gấu",
    accessory: "Phụ kiện",
  };

  return (
    <tr
      onClick={() => onView(p)}
      className="group border-t border-[#F4F7FF] hover:bg-[#F8F9FF] transition-colors duration-150 cursor-pointer"
    >
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

      <td className="py-3 pr-4">
        <span className="text-[10px] font-black text-[#6B7280] bg-[#F4F7FF] px-2.5 py-1 rounded-lg whitespace-nowrap">
          {CATEGORY_LABELS[p.category]}
        </span>
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
        <span className="text-[#1A1A2E] font-black text-sm">{p.sold}</span>
      </td>

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

  return {
    id: p.productId,
    name: p.name,
    imageUrl: p.imageUrl || "/teddy_bear.png",
    badge: "Gấu",
    badgeColor: color,
    category: "bear",
    price: p.price,
    stock: 50, // This should normally come from inventory but using 50 as placeholder
    sold: p.totalSales,
    rating: p.averageRating,
    status: p.isActive ? "active" : "draft",
    popular: p.viewCountIn10Min > 5,
  };
};

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
    stock: 100,
    sold: 0,
    rating: 0,
    status: "active",
    popular: false,
  };
};

export default function ProductsGrid() {
  const [catFilter, setCatFilter] = useState<CategoryFilter>("all");
  const [statusFilter, setStatus] = useState<ProductAdminStatus | "all">("all");
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 350);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null,
  );
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isCreateAccessoryModalOpen, setCreateAccessoryModalOpen] =
    useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editingAccessoryId, setEditingAccessoryId] = useState<string | null>(
    null,
  );
  const [deletingProduct, setDeletingProduct] = useState<ProductAdmin | null>(
    null,
  );

  const {
    data,
    loading,
    accessories,
    accessoriesLoading,
    fetchProducts,
    fetchAccessories,
    deleteProduct,
    deleteAccessory,
    isDeleting,
  } = useAdminProductsApi();
  const { success, error: toastError } = useToast();

  const handleRefresh = useCallback(() => {
    if (catFilter === "accessory") {
      fetchAccessories();
    } else {
      fetchProducts({ pageIndex: 1, pageSize: 50 });
    }
  }, [catFilter, fetchProducts, fetchAccessories]);

  useEffect(() => {
    handleRefresh();
  }, [handleRefresh]);

  const handleDelete = (p: ProductAdmin) => {
    setDeletingProduct(p);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingProduct) return;
    const ok =
      deletingProduct.category === "accessory"
        ? await deleteAccessory(deletingProduct.id)
        : await deleteProduct(deletingProduct.id);

    if (ok) {
      success("Xóa thành công!");
      handleRefresh();
    } else {
      toastError("Có lỗi xảy ra khi xóa.");
    }
    setDeletingProduct(null);
  };

  const mappedData = useMemo(() => {
    if (catFilter === "accessory") {
      return accessories.map(mapAccessoryToAdmin);
    }
    if (!data?.items) return [];
    return data.items.map(mapProductToAdmin);
  }, [data, accessories, catFilter]);

  const catCounts = useMemo(() => {
    return {
      all: (data?.totalCount ?? 0) + accessories.length,
      bear: data?.totalCount ?? 0,
      accessory: accessories.length,
    };
  }, [data, accessories]);

  const filtered = useMemo(
    () =>
      mappedData.filter((p) => {
        if (catFilter !== "all" && p.category !== catFilter) return false;
        if (statusFilter !== "all" && p.status !== statusFilter) return false;
        if (debouncedSearch) {
          const q = debouncedSearch.toLowerCase();
          return (
            p.name.toLowerCase().includes(q) ||
            (p.badge ?? "").toLowerCase().includes(q)
          );
        }
        return true;
      }),
    [mappedData, catFilter, statusFilter, debouncedSearch],
  );

  return (
    <div className="bg-white rounded-3xl p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div>
          <p className="text-[#9CA3AF] text-[10px] font-black tracking-[0.22em] uppercase mb-0.5">
            Danh mục
          </p>
          <p className="text-[#1A1A2E] font-black text-xl">Quản lý sản phẩm</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] text-base pointer-events-none" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm sản phẩm..."
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
            onClick={() => {
              if (catFilter === "accessory") setCreateAccessoryModalOpen(true);
              else setCreateModalOpen(true);
            }}
            className="flex items-center gap-1.5 bg-[#17409A] text-white text-xs font-black px-4 py-2.5 rounded-xl hover:bg-[#0f2d70] transition-colors whitespace-nowrap"
          >
            <MdAdd className="text-base" /> Thêm mới
          </button>
        </div>
      </div>

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
                className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${active ? "bg-white/20 text-white" : "bg-white text-[#9CA3AF]"}`}
              >
                {catCounts[key] ?? 0}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-1.5 flex-wrap mb-6 pb-4 border-b border-[#F4F7FF]">
        {[
          { key: "all", label: "Tất cả" },
          { key: "active", label: "Đang bán" },
          { key: "draft", label: "Bản nháp" },
          { key: "archived", label: "Lưu trữ" },
        ].map(({ key, label }) => {
          const active = statusFilter === key;
          const cfg =
            key !== "all" ? STATUS_CFG[key as ProductAdminStatus] : null;
          return (
            <button
              key={key}
              onClick={() => setStatus(key as any)}
              className={`px-3 py-1 rounded-lg text-[10px] font-black transition-all duration-200 ${active ? "ring-1" : "opacity-70 hover:opacity-100"}`}
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

      {viewMode === "grid" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filtered.map((p) => (
            <ProductCard
              key={p.id}
              p={p}
              onView={(p) => setSelectedProductId(p.id)}
              onEdit={(p) => {
                if (p.category === "accessory") setEditingAccessoryId(p.id);
                else setEditingProductId(p.id);
              }}
              onDelete={handleDelete}
              isDeleting={isDeleting && deletingProduct?.id === p.id}
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
              {filtered.map((p, i) => (
                <ProductRow
                  key={p.id}
                  p={p}
                  index={i}
                  onView={(p) => setSelectedProductId(p.id)}
                  onEdit={(p) => {
                    if (p.category === "accessory") setEditingAccessoryId(p.id);
                    else setEditingProductId(p.id);
                  }}
                  onDelete={handleDelete}
                  isDeleting={isDeleting && deletingProduct?.id === p.id}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isCreateModalOpen && (
        <CreateProductModal
          onClose={() => setCreateModalOpen(false)}
          onSuccess={handleRefresh}
          isSubmitting={false}
        />
      )}

      {isCreateAccessoryModalOpen && (
        <CreateAccessoryModal
          onClose={() => setCreateAccessoryModalOpen(false)}
          onSuccess={handleRefresh}
        />
      )}

      {editingAccessoryId && (
        <EditAccessoryModal
          accessoryId={editingAccessoryId}
          onClose={() => setEditingAccessoryId(null)}
          onSuccess={handleRefresh}
        />
      )}

      {editingProductId && (
        <EditProductModal
          productId={editingProductId}
          onClose={() => setEditingProductId(null)}
          onSubmit={async (payload) => {
            const ok = await productService.updateProduct(
              editingProductId,
              payload,
            );
            if (ok.isSuccess) {
              success("Cập nhật thành công");
              handleRefresh();
              return true;
            }
            toastError("Thất bại");
            return false;
          }}
          isSubmitting={false}
        />
      )}

      {selectedProductId && (
        <ProductDetailModal
          productId={selectedProductId}
          onClose={() => setSelectedProductId(null)}
          onEdit={(id) => {
            setSelectedProductId(null);
            setEditingProductId(id);
          }}
        />
      )}

      {deletingProduct && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl animate-in zoom-in duration-200">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mb-4">
              <MdDelete className="text-2xl" />
            </div>
            <h3 className="text-lg font-black text-[#1A1A2E] mb-2">
              Xác nhận xóa?
            </h3>
            <p className="text-sm font-semibold text-[#6B7280] mb-6">
              Hành động này không thể hoàn tác. Bạn có chắc chắn muốn xóa sản
              phẩm{" "}
              <span className="text-[#1A1A2E] font-black">
                "{deletingProduct.name}"
              </span>
              ?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeletingProduct(null)}
                className="flex-1 py-3 rounded-2xl text-sm font-bold text-[#6B7280] bg-[#F4F7FF] hover:bg-[#E5E7EB] transition-all"
              >
                Hủy
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 py-3 rounded-2xl text-sm font-bold text-white bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/20 transition-all"
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
