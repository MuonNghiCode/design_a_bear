import { useImperativeHandle } from "react";
import { useState, useEffect, useCallback } from "react";
import { MdClose, MdAutorenew, MdEdit, MdDelete } from "react-icons/md";
import { categoryService } from "@/services";
import { useToast } from "@/contexts/ToastContext";
import type { ProductCategory } from "@/types";
import { generateSlug } from "@/utils/string";

export interface CategoryTableRef {
  handleOpenCreate: () => void;
}

function CategoryTable({ ref }: { ref?: React.Ref<CategoryTableRef> }) {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<ProductCategory | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    parentId: "",
  });
  const [processing, setProcessing] = useState(false);

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

  const handleOpenCreate = () => {
    setEditingCat(null);
    setFormData({ name: "", slug: "", parentId: "" });
    setIsModalOpen(true);
  };

  useImperativeHandle(ref, () => ({
    handleOpenCreate,
  }));

  const handleOpenEdit = (cat: ProductCategory) => {
    setEditingCat(cat);
    setFormData({
      name: cat.name,
      slug: cat.slug,
      parentId: cat.parentId || "",
    });
    setIsModalOpen(true);
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setProcessing(true);
    try {
      const payload = {
        name: formData.name,
        slug: generateSlug(formData.name),
        parentId: formData.parentId || null,
      };

      let res;
      if (editingCat) {
        res = await categoryService.updateCategory(
          editingCat.categoryId,
          payload,
        );
      } else {
        res = await categoryService.createCategory(payload);
      }

      if (res.isSuccess) {
        success(editingCat ? "Cập nhật thành công!" : "Tạo mới thành công!");
        setIsModalOpen(false);
        fetchCategories();
      } else {
        toastError(res.error?.description || "Thao tác thất bại!");
      }
    } catch {
      toastError("Lỗi hệ thống.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <>
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
            {loading ? (
              <tr>
                <td colSpan={3} className="text-center py-10">
                  <MdAutorenew className="animate-spin text-[#17409A] text-3xl mx-auto mb-2" />
                  <span className="font-bold text-[#6B7280]">Đang tải...</span>
                </td>
              </tr>
            ) : categories.length === 0 ? (
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
                        onClick={() => handleOpenEdit(cat)}
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

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in duration-200">
            <div className="flex items-center justify-between p-6 border-b border-[#F4F7FF]">
              <h3 className="text-xl font-black text-[#1A1A2E]">
                {editingCat ? "Cập nhật Danh mục" : "Tạo Danh mục mới"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#F4F7FF] flex items-center justify-center text-[#6B7280] hover:text-[#1A1A2E] hover:bg-[#E5E7EB] transition-colors"
              >
                <MdClose className="text-xl" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-black text-[#9CA3AF] uppercase tracking-wider mb-2">
                  Tên Danh mục *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => {
                    const newName = e.target.value;
                    setFormData({
                      ...formData,
                      name: newName,
                      slug: generateSlug(newName),
                    });
                  }}
                  className="w-full bg-[#F4F7FF] text-[#1A1A2E] font-bold px-4 py-3 rounded-xl border border-transparent focus:border-[#17409A] focus:bg-white focus:outline-none transition-all"
                  placeholder="Nhập tên..."
                />
              </div>
              <div>
                <label className="block text-xs font-black text-[#9CA3AF] uppercase tracking-wider mb-2">
                  Parent ID (Tùy chọn)
                </label>
                <input
                  type="text"
                  value={formData.parentId}
                  onChange={(e) =>
                    setFormData({ ...formData, parentId: e.target.value })
                  }
                  className="w-full bg-[#F4F7FF] text-[#1A1A2E] font-bold px-4 py-3 rounded-xl border border-transparent focus:border-[#17409A] focus:bg-white focus:outline-none transition-all"
                  placeholder="Nhập ID danh mục cha nếu có..."
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={processing}
                  className="w-full py-4 rounded-xl font-black text-white bg-[#17409A] hover:bg-[#112D6E] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {processing ? (
                    <MdAutorenew className="animate-spin text-xl" />
                  ) : null}
                  {editingCat ? "LƯU THAY ĐỔI" : "TẠO MỚI"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

CategoryTable.displayName = "CategoryTable";
export default CategoryTable;
