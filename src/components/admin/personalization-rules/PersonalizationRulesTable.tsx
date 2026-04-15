import { MdDelete, MdEdit } from "react-icons/md";
import type {
  PersonalizationGroup,
  PersonalizationRule,
  ProductListItem,
} from "@/types";

interface Props {
  rules: PersonalizationRule[];
  loading: boolean;
  groups: PersonalizationGroup[];
  products: ProductListItem[];
  onEdit: (rule: PersonalizationRule) => void;
  onDelete: (rule: PersonalizationRule) => void;
}

function TableSkeleton() {
  return (
    <div className="-mx-6 overflow-x-auto">
      <div className="min-w-245 space-y-2 px-6 pb-1">
        <div className="grid grid-cols-[1.4fr_1.2fr_1.4fr_90px_90px_120px] gap-4 py-2">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              className="h-3 w-24 animate-pulse rounded bg-[#E5E7EB]"
            />
          ))}
        </div>
        {Array.from({ length: 6 }).map((_, idx) => (
          <div
            key={idx}
            className="grid grid-cols-[1.4fr_1.2fr_1.4fr_90px_90px_120px] gap-4 border-t border-[#F4F7FF] py-4"
          >
            {Array.from({ length: 5 }).map((__, i) => (
              <div
                key={i}
                className="h-4 w-full animate-pulse rounded bg-[#E5E7EB]"
              />
            ))}
            <div className="ml-auto h-8 w-20 animate-pulse rounded-xl bg-[#E5E7EB]" />
          </div>
        ))}
      </div>
    </div>
  );
}

function getProductName(products: ProductListItem[], id: string) {
  return products.find((p) => p.productId === id)?.name || id;
}

function getGroupName(groups: PersonalizationGroup[], id: string) {
  return groups.find((g) => g.groupId === id)?.name || id;
}

export default function PersonalizationRulesTable({
  rules,
  loading,
  groups,
  products,
  onEdit,
  onDelete,
}: Props) {
  if (loading) return <TableSkeleton />;

  return (
    <div className="-mx-6 overflow-x-auto">
      <table className="w-full min-w-245">
        <thead>
          <tr>
            <th className="px-6 pb-3 text-left text-[9px] font-black uppercase tracking-[0.18em] text-[#9CA3AF]">
              Base Product
            </th>
            <th className="px-6 pb-3 text-left text-[9px] font-black uppercase tracking-[0.18em] text-[#9CA3AF]">
              Group
            </th>
            <th className="px-6 pb-3 text-left text-[9px] font-black uppercase tracking-[0.18em] text-[#9CA3AF]">
              Allowed ACCESSORY
            </th>
            <th className="px-6 pb-3 text-left text-[9px] font-black uppercase tracking-[0.18em] text-[#9CA3AF]">
              Type
            </th>
            <th className="px-6 pb-3 text-left text-[9px] font-black uppercase tracking-[0.18em] text-[#9CA3AF]">
              Max Qty
            </th>
            <th className="px-6 pb-3 text-right text-[9px] font-black uppercase tracking-[0.18em] text-[#9CA3AF]">
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="text-sm">
          {rules.length === 0 ? (
            <tr>
              <td
                colSpan={6}
                className="py-10 text-center font-bold text-[#6B7280]"
              >
                Chưa có personalization rule nào.
              </td>
            </tr>
          ) : (
            rules.map((rule) => (
              <tr
                key={rule.ruleId}
                className="group border-t border-[#F4F7FF] transition-colors duration-150 hover:bg-[#F9FAFB]"
              >
                <td className="px-6 py-4 font-black text-[#1A1A2E]">
                  {getProductName(products, rule.baseProductId)}
                </td>
                <td className="px-6 py-4 font-semibold text-[#6B7280]">
                  {getGroupName(groups, rule.groupId)}
                </td>
                <td className="px-6 py-4 font-semibold text-[#6B7280]">
                  {getProductName(products, rule.allowedComponentProductId)}
                </td>
                <td className="px-6 py-4">
                  <span className="rounded-lg bg-[#17409A]/10 px-2 py-1 text-xs font-black text-[#17409A]">
                    {rule.ruleType}
                  </span>
                </td>
                <td className="px-6 py-4 font-bold text-[#1A1A2E]">
                  {rule.maxQuantity}
                  {rule.isRequired ? (
                    <span className="ml-2 rounded bg-[#FF8C42]/15 px-1.5 py-0.5 text-[10px] font-black uppercase text-[#FF8C42]">
                      Required
                    </span>
                  ) : null}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onEdit(rule)}
                      className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#F4F7FF] text-[#17409A] transition-colors hover:bg-[#17409A] hover:text-white"
                      title="Chỉnh sửa"
                    >
                      <MdEdit className="text-sm" />
                    </button>
                    <button
                      onClick={() => onDelete(rule)}
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
