import { forwardRef, useImperativeHandle } from "react";
import { useState, useEffect, useCallback, useMemo } from "react";
import {
  MdEdit,
  MdVisibility,
  MdVisibilityOff,
  MdChevronLeft,
  MdChevronRight,
} from "react-icons/md";
import { characterService } from "@/services";
import { useToast } from "@/contexts/ToastContext";
import type { ProductCharacter } from "@/types";
import { SkeletonCharacterTable } from "./SkeletonLoader";

export interface CharacterTableRef {
  refresh: () => void;
}

interface CharacterTableProps {
  onOpenCreate?: () => void;
  onOpenEdit?: (char: ProductCharacter) => void;
}

const ITEMS_PER_PAGE = 5;

const CharacterTable = forwardRef<CharacterTableRef, CharacterTableProps>(
  ({ onOpenCreate, onOpenEdit }, ref) => {
    const [characters, setCharacters] = useState<ProductCharacter[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    const { success, error: toastError } = useToast();

    const fetchCharacters = useCallback(
      async (ignore = false) => {
        setLoading(true);
        try {
          const res = await characterService.getCharacters();
          if (ignore) return;
          if (res.isSuccess) {
            setCharacters(res.value);
          } else {
            toastError("Không thể tải danh sách Tính cách.");
          }
        } catch (error: unknown) {
          if (ignore) return;
          toastError(
            (error as Error).message || "Lỗi hệ thống khi tải Tính cách.",
          );
        } finally {
          if (!ignore) setLoading(false);
        }
      },
      [toastError],
    );

    useImperativeHandle(ref, () => ({
      refresh: () => {
        fetchCharacters();
      },
    }));

    useEffect(() => {
      let ignore = false;
      fetchCharacters(ignore).then(() => {});
      return () => {
        ignore = true;
      };
    }, [fetchCharacters]);

    const handleToggleActive = async (char: ProductCharacter) => {
      const action = char.isActive ? "Ẩn" : "Hiện";
      if (!window.confirm(`Bạn có chắc chắn muốn ${action} Tính cách này?`))
        return;
      try {
        const res = await characterService.deleteCharacter(char.characterId);
        if (res.isSuccess) {
          success(`${action} thành công!`);
          fetchCharacters();
        } else {
          toastError(res.error?.description || `${action} thất bại!`);
        }
      } catch {
        toastError(`Lỗi hệ thống khi ${action}.`);
      }
    };

    const activeCharacters = useMemo(() => {
      return characters.filter((char) => char.isActive !== false);
    }, [characters]);

    const totalPages = Math.ceil(activeCharacters.length / ITEMS_PER_PAGE);
    const paginatedCharacters = useMemo(() => {
      const start = (currentPage - 1) * ITEMS_PER_PAGE;
      return activeCharacters.slice(start, start + ITEMS_PER_PAGE);
    }, [activeCharacters, currentPage]);

    const goToPage = (page: number) => {
      if (page >= 1 && page <= totalPages) {
        setCurrentPage(page);
      }
    };

    return (
      <>
        {loading ? (
          <SkeletonCharacterTable />
        ) : (
          <div className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#F8FAFC]">
                    <th className="text-left text-[10px] font-black text-gray-400 tracking-widest uppercase px-8 py-5">
                      Tính cách
                    </th>
                    <th className="text-left text-[10px] font-black text-gray-400 tracking-widest uppercase px-8 py-5">
                      Slug
                    </th>
                    <th className="text-left text-[10px] font-black text-gray-400 tracking-widest uppercase px-8 py-5">
                      Bản quyền
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
                  {activeCharacters.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="text-center py-20 font-bold text-gray-300"
                      >
                        Chưa có dữ liệu tính cách.
                      </td>
                    </tr>
                  ) : (
                    paginatedCharacters.map((char) => (
                      <tr
                        key={char.characterId}
                        className="group hover:bg-[#F8FAFC]/50 transition-all duration-200 border-b border-[#F8FAFC] last:border-0"
                      >
                        <td className="py-5 px-8">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-[#F4F7FF] text-[#FF8C42] flex items-center justify-center font-black text-xs shadow-sm">
                              {char.name.charAt(0)}
                            </div>
                            <span className="font-black text-[#1A1A2E]">{char.name}</span>
                          </div>
                        </td>
                        <td className="py-5 px-8">
                          <code className="text-[11px] font-bold text-[#17409A] bg-[#F4F7FF] px-2 py-1 rounded-lg">
                            {char.slug}
                          </code>
                        </td>
                        <td className="py-5 px-8">
                          {char.licenseBrand ? (
                            <span className="px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-[10px] font-black uppercase tracking-wider border border-purple-100">
                              {char.licenseBrand}
                            </span>
                          ) : (
                            <span className="text-gray-300">—</span>
                          )}
                        </td>
                        <td className="py-5 px-8">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            char.isActive !== false 
                            ? "bg-green-50 text-green-600 border border-green-100" 
                            : "bg-gray-50 text-gray-400 border border-gray-100"
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${char.isActive !== false ? "bg-green-500 animate-pulse" : "bg-gray-400"}`} />
                            {char.isActive !== false ? "Hoạt động" : "Tạm ẩn"}
                          </span>
                        </td>
                        <td className="py-5 px-8 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => onOpenEdit?.(char)}
                              className="w-9 h-9 rounded-xl flex items-center justify-center bg-white text-gray-400 border border-[#F1F5F9] hover:text-[#17409A] hover:border-[#17409A] hover:shadow-sm transition-all"
                              title="Chỉnh sửa"
                            >
                              <MdEdit className="text-base" />
                            </button>
                            <button
                              onClick={() => handleToggleActive(char)}
                              className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all ${
                                char.isActive
                                  ? "bg-white text-gray-400 border-[#F1F5F9] hover:text-red-500 hover:border-red-500"
                                  : "bg-white text-gray-400 border-[#F1F5F9] hover:text-green-500 hover:border-green-500"
                              }`}
                              title={char.isActive ? "Ẩn" : "Hiện"}
                            >
                              {char.isActive ? (
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

CharacterTable.displayName = "CharacterTable";
export default CharacterTable;
