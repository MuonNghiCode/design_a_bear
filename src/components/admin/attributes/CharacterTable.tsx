import { useImperativeHandle } from "react";
import { useState, useEffect, useCallback } from "react";
import { MdEdit, MdDelete } from "react-icons/md";
import { characterService } from "@/services";
import { useToast } from "@/contexts/ToastContext";
import type { CharacterItem } from "@/types";
import { SkeletonCharacterTable } from "./SkeletonLoader";

export interface CharacterTableRef {
  handleOpenCreate: () => void;
}

interface CharacterTableProps {
  onOpenCreate?: () => void;
  onOpenEdit?: (char: CharacterItem) => void;
}

const CharacterTable = ({ onOpenCreate, onOpenEdit }: CharacterTableProps) => {
  const [characters, setCharacters] = useState<CharacterItem[]>([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    let ignore = false;
    fetchCharacters(ignore).then(() => {});
    return () => {
      ignore = true;
    };
  }, [fetchCharacters]);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa Tính cách này?")) return;
    try {
      const res = await characterService.deleteCharacter(id);
      if (res.isSuccess) {
        success("Xóa thành công!");
        fetchCharacters();
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
        <SkeletonCharacterTable />
      ) : (
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
                <th className="text-right text-[9px] font-black text-[#9CA3AF] tracking-[0.18em] uppercase px-6 pb-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {characters.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="text-center py-10 font-bold text-[#6B7280]"
                  >
                    Chưa có Tính cách nào.
                  </td>
                </tr>
              ) : (
                characters.map((char) => (
                  <tr
                    key={char.characterId}
                    className={`border-t border-[#F4F7FF] last:border-b transition-colors duration-150 group hover:bg-[#F9FAFB]`}
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
                          onClick={() => handleDelete(char.characterId)}
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

CharacterTable.displayName = "CharacterTable";
export default CharacterTable;
