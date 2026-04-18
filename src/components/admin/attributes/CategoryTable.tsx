import { useImperativeHandle } from "react";
import { useState, useEffect, useCallback } from "react";
import { MdEdit, MdDelete } from "react-icons/md";
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

const CategoryTable = ({ onOpenCreate, onOpenEdit }: CategoryTableProps) => {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);

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

  const handleDelete = async (id: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa Danh mục này?")) return;
    try {
      const res = await categoryService.deleteCategory(id);
      if (res.isSuccess) {
        success("Xóa thành công!");
        fetchCategories();
      } else {
        toastError(res.error?.description || "Xóa thất bại!");
      }
    } catch {
      toastError("Lỗi hệ thống khi xóa.");
    }
  };

  return (
    <>
      {loading ? (
        <SkeletonCategoryTable />
      ) : (
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
                <th className="text-right text-[9px] font-black text-[#9CA3AF] tracking-[0.18em] uppercase px-6 pb-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {categories.length === 0 ? (
                <tr>
                   <td
                    colSpan={3}
                    className="text-center py-10 font-bold text-[#6B7280]"
                  >
                    Chưa có Danh mục nào.
                  </td>
                </tr>
              ) : (
                categories.map((cat) => (
                  <tr
                    key={cat.categoryId}
                    className={`border-t border-[#F4F7FF] last:border-b transition-colors duration-150 group hover:bg-[#F9FAFB]`}
                  >
                    <td className="py-4 px-6 font-black text-[#1A1A2E]">
                      {cat.name}
                    </td>
                    <td className="py-4 px-6 font-semibold text-[#6B7280]">
                      {cat.slug}
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
                          onClick={() => handleDelete(cat.categoryId)}
                          className="w-8 h-8 rounded-xl flex items-center justify-center bg-[#FFE8EF] text-[#FF6B9D] hover:bg-[#FF6B9D] hover:text-white transition-colors"
                          title="Xóa"
                        >
                          <MdDelete className="text-sm" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

CategoryTable.displayName = "CategoryTable";

export default CategoryTable;
