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
            <div className="overflow-x-auto -mx-6">
              <table className="w-full min-w-175">
                <thead>
                  <tr>
                    <th className="text-left text-[9px] font-black text-[#9CA3AF] tracking-[0.18em] uppercase px-6 pb-3">
                      Tên Tính cách
                    </th>
                    <th className="text-left text-[9px] font-black text-[#9CA3AF] tracking-[0.18em] uppercase px-6 pb-3">
                      Slug
                    </th>
                    <th className="text-left text-[9px] font-black text-[#9CA3AF] tracking-[0.18em] uppercase px-6 pb-3">
                      Bản quyền
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
                  {activeCharacters.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="text-center py-10 font-bold text-[#6B7280]"
                      >
                        Chưa có Tính cách nào.
                      </td>
                    </tr>
                  ) : (
                    paginatedCharacters.map((char) => (
                      <tr
                        key={char.characterId}
                        className="border-t border-[#F4F7FF] last:border-b transition-all duration-150 group hover:bg-[#F9FAFB]"
                      >
                        <td className="py-4 px-6 font-black text-[#1A1A2E]">
                          {char.name}
                        </td>
                        <td className="py-4 px-6 font-semibold text-[#6B7280]">
                          {char.slug}
                        </td>
                        <td className="py-4 px-6 text-[#6B7280]">
                          {char.licenseBrand ? (
                            <span className="px-3 py-1 bg-[#F4F7FF] rounded-full text-xs font-semibold text-[#17409A]">
                              {char.licenseBrand}
                            </span>
                          ) : (
                            "—"
                          )}
                        </td>
                        <td className="py-4 px-6">
                          <span className="px-3 py-1 rounded-full bg-[#E6FFFA] text-[#319795] text-[10px] font-black uppercase tracking-wider">
                            Hoạt động
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => onOpenEdit?.(char)}
                              className="w-8 h-8 rounded-xl flex items-center justify-center bg-[#F4F7FF] text-[#17409A] hover:bg-[#17409A] hover:text-white transition-colors"
                              title="Chỉnh sửa"
                            >
                              <MdEdit className="text-sm" />
                            </button>
                            <button
                              onClick={() => handleToggleActive(char)}
                              className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                                char.isActive
                                  ? "bg-[#FFE8EF] text-[#FF6B9D] hover:bg-[#FF6B9D] hover:text-white"
                                  : "bg-[#E6FFFA] text-[#319795] hover:bg-[#319795] hover:text-white"
                              }`}
                              title={char.isActive ? "Ẩn" : "Hiện"}
                            >
                              {char.isActive ? (
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
