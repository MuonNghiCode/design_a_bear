import { useImperativeHandle } from "react";
import { useState, useEffect, useCallback } from "react";
import { MdClose, MdAutorenew, MdEdit, MdDelete } from "react-icons/md";
import { characterService } from "@/services";
import { useToast } from "@/contexts/ToastContext";
import type { CharacterItem } from "@/types";
import { generateSlug } from "@/utils/string";

export interface CharacterTableRef {
  handleOpenCreate: () => void;
}

function CharacterTable({ ref }: { ref?: React.Ref<CharacterTableRef> }) {
    const [characters, setCharacters] = useState<CharacterItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingChar, setEditingChar] = useState<CharacterItem | null>(null);
    const [formData, setFormData] = useState({
      name: "",
      slug: "",
      licenseBrand: "",
    });
    const [processing, setProcessing] = useState(false);

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

    const handleOpenCreate = () => {
      setEditingChar(null);
      setFormData({ name: "", slug: "", licenseBrand: "" });
      setIsModalOpen(true);
    };

    useImperativeHandle(ref, () => ({
      handleOpenCreate,
    }));

    const handleOpenEdit = (char: CharacterItem) => {
      setEditingChar(char);
      setFormData({
        name: char.name,
        slug: char.slug,
        licenseBrand: char.licenseBrand || "",
      });
      setIsModalOpen(true);
    };

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

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setProcessing(true);
      try {
        const payload = {
          name: formData.name,
          slug: generateSlug(formData.name),
          licenseBrand: formData.licenseBrand || null,
        };

        let res;
        if (editingChar) {
          res = await characterService.updateCharacter(
            editingChar.characterId,
            payload,
          );
        } else {
          res = await characterService.createCharacter(payload);
        }

        if (res.isSuccess) {
          success(editingChar ? "Cập nhật thành công!" : "Tạo mới thành công!");
          setIsModalOpen(false);
          fetchCharacters();
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
              {loading ? (
                <tr>
                  <td colSpan={4} className="text-center py-10">
                    <MdAutorenew className="animate-spin text-[#17409A] text-3xl mx-auto mb-2" />
                    <span className="font-bold text-[#6B7280]">
                      Đang tải...
                    </span>
                  </td>
                </tr>
              ) : characters.length === 0 ? (
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
                          onClick={() => handleOpenEdit(char)}
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

        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in duration-200">
              <div className="flex items-center justify-between p-6 border-b border-[#F4F7FF]">
                <h3 className="text-xl font-black text-[#1A1A2E]">
                  {editingChar ? "Cập nhật Tính cách" : "Tạo Tính cách mới"}
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
                    Tên Tính cách *
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
                    Hãng Bản Quyền (Tùy chọn)
                  </label>
                  <input
                    type="text"
                    value={formData.licenseBrand}
                    onChange={(e) =>
                      setFormData({ ...formData, licenseBrand: e.target.value })
                    }
                    className="w-full bg-[#F4F7FF] text-[#1A1A2E] font-bold px-4 py-3 rounded-xl border border-transparent focus:border-[#17409A] focus:bg-white focus:outline-none transition-all"
                    placeholder="Disney, Marvel..."
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
                    {editingChar ? "LƯU THAY ĐỔI" : "TẠO MỚI"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </>
    );
}

CharacterTable.displayName = "CharacterTable";
export default CharacterTable;
