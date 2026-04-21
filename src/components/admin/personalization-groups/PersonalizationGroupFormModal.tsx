import { MdClose } from "react-icons/md";
import type { PersonalizationGroup } from "@/types";

interface PersonalizationGroupFormData {
  name: string;
  description: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  editingGroup: PersonalizationGroup | null;
  formData: PersonalizationGroupFormData;
  onFormDataChange: (next: PersonalizationGroupFormData) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  isProcessing: boolean;
}

export default function PersonalizationGroupFormModal({
  isOpen,
  onClose,
  editingGroup,
  formData,
  onFormDataChange,
  onSubmit,
  isProcessing,
}: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-80 flex items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-black/45 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-white/60 bg-[#F4F7FF] shadow-2xl shadow-[#0E2A66]/20">
        <div className="flex items-center justify-between border-b border-white/60 bg-white/60 px-6 py-5">
          <div>
            <h2 className="text-xl font-black text-[#1A1A2E]">
              {editingGroup ? "Chỉnh sửa nhóm tùy chỉnh" : "Tạo nhóm tùy chỉnh"}
            </h2>
            <p className="mt-0.5 text-xs font-semibold text-[#6B7280]">
              Nhóm này sẽ hiển thị thành tab khi khách tùy chỉnh gấu.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-[#9CA3AF] transition-all hover:text-[#1A1A2E]"
          >
            <MdClose className="text-xl" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-5 p-6">
          <div className="space-y-1.5">
            <label className="text-[11px] font-black uppercase tracking-wide text-[#6B7280]">
              Tên nhóm *
            </label>
            <input
              required
              value={formData.name}
              onChange={(e) =>
                onFormDataChange({ ...formData, name: e.target.value })
              }
              placeholder="VD: Trang phục"
              className="w-full rounded-xl border-2 border-transparent bg-white px-4 py-3 text-sm font-semibold text-[#1A1A2E] shadow-sm outline-none transition-all focus:border-[#17409A]/20"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-black uppercase tracking-wide text-[#6B7280]">
              Mô tả
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) =>
                onFormDataChange({ ...formData, description: e.target.value })
              }
              placeholder="Mô tả ngắn cho nhóm"
              className="w-full resize-none rounded-xl border-2 border-transparent bg-white px-4 py-3 text-sm font-semibold text-[#1A1A2E] shadow-sm outline-none transition-all focus:border-[#17409A]/20"
            />
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-[#E5E7EB] bg-white px-4 py-2.5 text-xs font-black text-[#6B7280] transition-colors hover:bg-[#F9FAFB]"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isProcessing}
              className="rounded-xl bg-[#17409A] px-4 py-2.5 text-xs font-black text-white shadow-lg shadow-[#17409A]/20 transition-colors hover:bg-[#0f2d70] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isProcessing
                ? "Đang xử lý..."
                : editingGroup
                  ? "Lưu thay đổi"
                  : "Tạo nhóm"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
