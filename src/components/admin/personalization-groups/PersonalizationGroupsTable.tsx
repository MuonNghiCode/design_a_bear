import { MdDelete, MdEdit } from "react-icons/md";
import type { PersonalizationGroup } from "@/types";

interface Props {
  groups: PersonalizationGroup[];
  loading: boolean;
  onEdit: (group: PersonalizationGroup) => void;
  onDelete: (group: PersonalizationGroup) => void;
}

function TableSkeleton() {
  return (
    <div className="-mx-6 overflow-x-auto">
      <div className="min-w-175 space-y-2 px-6 pb-1">
        <div className="grid grid-cols-[1.5fr_2fr_120px] gap-4 py-2">
          <div className="h-3 w-24 animate-pulse rounded bg-[#E5E7EB]" />
          <div className="h-3 w-20 animate-pulse rounded bg-[#E5E7EB]" />
          <div className="ml-auto h-3 w-14 animate-pulse rounded bg-[#E5E7EB]" />
        </div>
        {Array.from({ length: 6 }).map((_, idx) => (
          <div
            key={idx}
            className="grid grid-cols-[1.5fr_2fr_120px] gap-4 border-t border-[#F4F7FF] py-4"
          >
            <div className="h-4 w-40 animate-pulse rounded bg-[#E5E7EB]" />
            <div className="h-4 w-full animate-pulse rounded bg-[#E5E7EB]" />
            <div className="ml-auto h-8 w-20 animate-pulse rounded-xl bg-[#E5E7EB]" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PersonalizationGroupsTable({
  groups,
  loading,
  onEdit,
  onDelete,
}: Props) {
  if (loading) return <TableSkeleton />;

  return (
    <div className="-mx-6 overflow-x-auto">
      <table className="w-full min-w-175">
        <thead>
          <tr>
            <th className="px-6 pb-3 text-left text-[9px] font-black uppercase tracking-[0.18em] text-[#9CA3AF]">
              Tên nhóm
            </th>
            <th className="px-6 pb-3 text-left text-[9px] font-black uppercase tracking-[0.18em] text-[#9CA3AF]">
              Mô tả
            </th>
            <th className="px-6 pb-3 text-right text-[9px] font-black uppercase tracking-[0.18em] text-[#9CA3AF]">
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="text-sm">
          {groups.length === 0 ? (
            <tr>
              <td
                colSpan={3}
                className="py-10 text-center font-bold text-[#6B7280]"
              >
                Chưa có nhóm personalization nào.
              </td>
            </tr>
          ) : (
            groups.map((group) => (
              <tr
                key={group.groupId}
                className="group border-t border-[#F4F7FF] transition-colors duration-150 hover:bg-[#F9FAFB]"
              >
                <td className="px-6 py-4 font-black text-[#1A1A2E]">
                  {group.name}
                </td>
                <td className="px-6 py-4 font-semibold text-[#6B7280]">
                  {group.description || "-"}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onEdit(group)}
                      className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#F4F7FF] text-[#17409A] transition-colors hover:bg-[#17409A] hover:text-white"
                      title="Chỉnh sửa"
                    >
                      <MdEdit className="text-sm" />
                    </button>
                    <button
                      onClick={() => onDelete(group)}
                      className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#FFE8EF] text-[#FF6B9D] transition-colors hover:bg-[#FF6B9D] hover:text-white"
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
  );
}
