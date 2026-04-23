import { useImperativeHandle } from "react";
import { useState, useEffect, useCallback, useMemo } from "react";
import {
  MdEdit,
  MdVisibility,
  MdVisibilityOff,
  MdChevronLeft,
  MdChevronRight,
} from "react-icons/md";
import { categoryService } from "@/services";
import { useToast } from "@/contexts/ToastContext";
import type { ProductCategory } from "@/types";
import { SkeletonCategoryTable } from "./SkeletonLoader";

export interface CategoryTableRef {
  handleOpenCreate: () => void;
}

interface CategoryTableProps {
  onOpenCreate?: () => void;
  onOpenEdit?: (cat: ProductCategory) => void;
}

const ITEMS_PER_PAGE = 5;

const CategoryTable = ({ onOpenCreate, onOpenEdit }: CategoryTableProps) => {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const { success, error: toastError } = useToast();

  const fetchCategories = useCallback(
    async (ignore = false) => {
      setLoading(true);
      try {
        const res = await categoryService.getCategories();
        if (ignore) return;
        if (res.isSuccess) {
          setCategories(res.value);
        } else {
          toastError("Không thể tải danh sách Danh mục.");
        }
      } catch (error: unknown) {
        if (ignore) return;
        toastError(
          (error as Error).message || "Lỗi hệ thống khi tải Danh mục.",
        );
      } finally {
        if (!ignore) setLoading(false);
      }
    },
    [toastError],
  );

  useEffect(() => {
    let ignore = false;
    fetchCategories(ignore).then(() => {});
    return () => {
      ignore = true;
    };
  }, [fetchCategories]);

  const handleToggleActive = async (cat: ProductCategory) => {
    const action = cat.isActive ? "Ẩn" : "Hiện";
    if (!window.confirm(`Bạn có chắc chắn muốn ${action} Danh mục này?`))
      return;
    try {
      // Logic BE: endpoint delete thực chất là toggle isActive
      const res = await categoryService.deleteCategory(cat.categoryId);
      if (res.isSuccess) {
        success(`${action} thành công!`);
        fetchCategories();
      } else {
        toastError(res.error?.description || `${action} thất bại!`);
      }
    } catch {
      toastError(`Lỗi hệ thống khi ${action}.`);
    }
  };

  // Filter only active categories
  const activeCategories = useMemo(() => {
    return categories.filter((cat) => cat.isActive !== false);
  }, [categories]);

  // Pagination Logic
  const totalPages = Math.ceil(activeCategories.length / ITEMS_PER_PAGE);
  const paginatedCategories = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return activeCategories.slice(start, start + ITEMS_PER_PAGE);
  }, [activeCategories, currentPage]);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <>
      {loading ? (
        <SkeletonCategoryTable />
      ) : (
        <div className="space-y-4">
          <div className="overflow-x-auto -mx-6">
            <table className="w-full min-w-175">
              <thead>
                <tr>
                  <th className="text-left text-[9px] font-black text-[#9CA3AF] tracking-[0.18em] uppercase px-6 pb-3">
                    Tên Danh Mục
                  </th>
                  <th className="text-left text-[9px] font-black text-[#9CA3AF] tracking-[0.18em] uppercase px-6 pb-3">
                    Slug
                  </th>
                  <th className="text-left text-[9px] font-black text-[#9CA3AF] tracking-[0.18em] uppercase px-6 pb-3">
                    Trạng thái
                  </th>
                  <th className="text-right text-[9px] font-black text-[#9CA3AF] tracking-[0.18em] uppercase px-6 pb-3">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody
                className="text-sm"
                style={{ fontFamily: "'Nunito', sans-serif" }}
              >
                {activeCategories.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="text-center py-10 font-bold text-[#6B7280]"
                    >
                      Chưa có Danh mục nào.
                    </td>
                  </tr>
                ) : (
                  paginatedCategories.map((cat) => (
                    <tr
                      key={cat.categoryId}
                      className="border-t border-[#F4F7FF] last:border-b transition-all duration-150 group hover:bg-[#F9FAFB]"
                    >
                      <td className="py-4 px-6 font-black text-[#1A1A2E]">
                        {cat.name}
                      </td>
                      <td className="py-4 px-6 font-semibold text-[#6B7280]">
                        {cat.slug}
                      </td>
                      <td className="py-4 px-6">
                        <span className="px-3 py-1 rounded-full bg-[#E6FFFA] text-[#319795] text-[10px] font-black uppercase tracking-wider">
                          Hoạt động
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => onOpenEdit?.(cat)}
                            className="w-8 h-8 rounded-xl flex items-center justify-center bg-[#F4F7FF] text-[#17409A] hover:bg-[#17409A] hover:text-white transition-colors"
                            title="Chỉnh sửa"
                          >
                            <MdEdit className="text-sm" />
                          </button>
                          <button
                            onClick={() => handleToggleActive(cat)}
                            className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                              cat.isActive
                                ? "bg-[#FFE8EF] text-[#FF6B9D] hover:bg-[#FF6B9D] hover:text-white"
                                : "bg-[#E6FFFA] text-[#319795] hover:bg-[#319795] hover:text-white"
                            }`}
                            title={cat.isActive ? "Ẩn" : "Hiện"}
                          >
                            {cat.isActive ? (
                              <MdVisibilityOff className="text-sm" />
                            ) : (
                              <MdVisibility className="text-sm" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="w-8 h-8 rounded-xl flex items-center justify-center bg-[#F4F7FF] text-[#17409A] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#17409A] hover:text-white transition-all shadow-sm"
              >
                <MdChevronLeft className="text-xl" />
              </button>

              <div className="flex items-center gap-1.5">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (p) => (
                    <button
                      key={p}
                      onClick={() => goToPage(p)}
                      className={`w-8 h-8 rounded-xl text-[11px] font-black transition-all ${
                        currentPage === p
                          ? "bg-[#17409A] text-white shadow-md shadow-[#17409A]/20"
                          : "bg-white text-[#6B7280] hover:bg-[#F4F7FF] border border-[#F4F7FF]"
                      }`}
                    >
                      {p}
                    </button>
                  ),
                )}
              </div>

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="w-8 h-8 rounded-xl flex items-center justify-center bg-[#F4F7FF] text-[#17409A] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#17409A] hover:text-white transition-all shadow-sm"
              >
                <MdChevronRight className="text-xl" />
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
};

CategoryTable.displayName = "CategoryTable";

export default CategoryTable;
