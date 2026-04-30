import { forwardRef, useImperativeHandle } from "react";
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
  refresh: () => void;
}

interface CategoryTableProps {
  onOpenCreate?: () => void;
  onOpenEdit?: (cat: ProductCategory) => void;
}

const ITEMS_PER_PAGE = 5;

const CategoryTable = forwardRef<CategoryTableRef, CategoryTableProps>(
  ({ onOpenCreate, onOpenEdit }, ref) => {
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

    useImperativeHandle(ref, () => ({
      refresh: () => {
        fetchCategories();
      },
    }));

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

    const activeCategories = useMemo(() => {
      return categories.filter((cat) => cat.isActive !== false);
    }, [categories]);

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
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#F8FAFC]">
                    <th className="text-left text-[10px] font-black text-gray-400 tracking-widest uppercase px-8 py-5">
                      Danh mục
                    </th>
                    <th className="text-left text-[10px] font-black text-gray-400 tracking-widest uppercase px-8 py-5">
                      Slug
                    </th>
                    <th className="text-left text-[10px] font-black text-gray-400 tracking-widest uppercase px-8 py-5">
                      Trạng thái
                    </th>
                    <th className="text-right text-[10px] font-black text-gray-400 tracking-widest uppercase px-8 py-5">
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {activeCategories.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="text-center py-20 font-bold text-gray-300"
                      >
                        Chưa có dữ liệu danh mục.
                      </td>
                    </tr>
                  ) : (
                    paginatedCategories.map((cat) => (
                      <tr
                        key={cat.categoryId}
                        className="group hover:bg-[#F8FAFC]/50 transition-all duration-200 border-b border-[#F8FAFC] last:border-0"
                      >
                        <td className="py-5 px-8">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-[#F4F7FF] text-[#17409A] flex items-center justify-center font-black text-xs shadow-sm">
                              {cat.name.charAt(0)}
                            </div>
                            <span className="font-black text-[#1A1A2E]">{cat.name}</span>
                          </div>
                        </td>
                        <td className="py-5 px-8">
                          <code className="text-[11px] font-bold text-[#17409A] bg-[#F4F7FF] px-2 py-1 rounded-lg">
                            {cat.slug}
                          </code>
                        </td>
                        <td className="py-5 px-8">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            cat.isActive !== false 
                            ? "bg-green-50 text-green-600 border border-green-100" 
                            : "bg-gray-50 text-gray-400 border border-gray-100"
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${cat.isActive !== false ? "bg-green-500 animate-pulse" : "bg-gray-400"}`} />
                            {cat.isActive !== false ? "Hoạt động" : "Tạm ẩn"}
                          </span>
                        </td>
                        <td className="py-5 px-8 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => onOpenEdit?.(cat)}
                              className="w-9 h-9 rounded-xl flex items-center justify-center bg-white text-gray-400 border border-[#F1F5F9] hover:text-[#17409A] hover:border-[#17409A] hover:shadow-sm transition-all"
                              title="Chỉnh sửa"
                            >
                              <MdEdit className="text-base" />
                            </button>
                            <button
                              onClick={() => handleToggleActive(cat)}
                              className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all ${
                                cat.isActive
                                  ? "bg-white text-gray-400 border-[#F1F5F9] hover:text-red-500 hover:border-red-500"
                                  : "bg-white text-gray-400 border-[#F1F5F9] hover:text-green-500 hover:border-green-500"
                              }`}
                              title={cat.isActive ? "Ẩn" : "Hiện"}
                            >
                              {cat.isActive ? (
                                <MdVisibilityOff className="text-base" />
                              ) : (
                                <MdVisibility className="text-base" />
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
  },
);

CategoryTable.displayName = "CategoryTable";

export default CategoryTable;
