import { MdClose } from "react-icons/md";
import type {
  PersonalizationGroup,
  PersonalizationRule,
  ProductListItem,
} from "@/types";
import CustomDropdown from "@/components/shared/CustomDropdown";

type RuleFormData = {
  baseProductId: string;
  groupId: string;
  allowedComponentProductId: string;
  isRequired: boolean;
  maxQuantity: number;
  ruleType: string;
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
  editingRule: PersonalizationRule | null;
  formData: RuleFormData;
  onFormDataChange: (next: RuleFormData) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  isProcessing: boolean;
  baseProducts: ProductListItem[];
  accessoryProducts: ProductListItem[];
  groups: PersonalizationGroup[];
}

const RULE_TYPE_OPTIONS = ["OPTIONAL", "REQUIRED"];

export default function PersonalizationRuleFormModal({
  isOpen,
  onClose,
  editingRule,
  formData,
  onFormDataChange,
  onSubmit,
  isProcessing,
  baseProducts,
  accessoryProducts,
  groups,
}: Props) {
  if (!isOpen) return null;

  const lockedIdentity = Boolean(editingRule);
  const baseProductOptions = baseProducts.map((product) => ({
    label: product.name,
    value: product.productId,
  }));
  const groupOptions = groups.map((group) => ({
    label: group.name,
    value: group.groupId,
  }));
  const accessoryOptions = accessoryProducts.map((product) => ({
    label: product.name,
    value: product.productId,
  }));
  const ruleTypeOptions = RULE_TYPE_OPTIONS.map((type) => ({
    label: type,
    value: type,
  }));

  return (
    <div className="fixed inset-0 z-80 flex items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-black/45 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-white/60 bg-[#F4F7FF] shadow-2xl shadow-[#0E2A66]/20">
        <div className="flex items-center justify-between border-b border-white/60 bg-white/60 px-6 py-5">
          <div>
            <h2 className="text-xl font-black text-[#1A1A2E]">
              {editingRule
                ? "Chỉnh sửa Personalization Rule"
                : "Tạo Personalization Rule"}
            </h2>
            <p className="mt-0.5 text-xs font-semibold text-[#6B7280]">
              allowedId chỉ chọn từ sản phẩm có productType là ACCESSORY.
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
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-[11px] font-black uppercase tracking-wide text-[#6B7280]">
                Base Product *
              </label>
              <CustomDropdown
                options={baseProductOptions}
                value={formData.baseProductId}
                onChange={(value) =>
                  onFormDataChange({ ...formData, baseProductId: value })
                }
                placeholder="Chọn base product"
                disabled={lockedIdentity}
                buttonClassName="w-full min-h-11 rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-sm font-semibold text-[#1A1A2E] outline-none transition-all focus:border-[#17409A]/30 disabled:cursor-not-allowed disabled:bg-[#F3F4F6] flex items-center justify-between"
                menuClassName="absolute z-30 mt-2 w-full rounded-xl border border-[#E5E7EB] bg-white shadow-xl py-1 max-h-64 overflow-y-auto"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-black uppercase tracking-wide text-[#6B7280]">
                Group *
              </label>
              <CustomDropdown
                options={groupOptions}
                value={formData.groupId}
                onChange={(value) =>
                  onFormDataChange({ ...formData, groupId: value })
                }
                placeholder="Chọn personalization group"
                disabled={lockedIdentity}
                buttonClassName="w-full min-h-11 rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-sm font-semibold text-[#1A1A2E] outline-none transition-all focus:border-[#17409A]/30 disabled:cursor-not-allowed disabled:bg-[#F3F4F6] flex items-center justify-between"
                menuClassName="absolute z-30 mt-2 w-full rounded-xl border border-[#E5E7EB] bg-white shadow-xl py-1 max-h-64 overflow-y-auto"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-[11px] font-black uppercase tracking-wide text-[#6B7280]">
                Allowed Accessory *
              </label>
              <CustomDropdown
                options={accessoryOptions}
                value={formData.allowedComponentProductId}
                onChange={(value) =>
                  onFormDataChange({
                    ...formData,
                    allowedComponentProductId: value,
                  })
                }
                placeholder="Chọn product ACCESSORY"
                disabled={lockedIdentity}
                buttonClassName="w-full min-h-11 rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-sm font-semibold text-[#1A1A2E] outline-none transition-all focus:border-[#17409A]/30 disabled:cursor-not-allowed disabled:bg-[#F3F4F6] flex items-center justify-between"
                menuClassName="absolute z-30 mt-2 w-full rounded-xl border border-[#E5E7EB] bg-white shadow-xl py-1 max-h-64 overflow-y-auto"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-black uppercase tracking-wide text-[#6B7280]">
                Rule Type *
              </label>
              <CustomDropdown
                options={ruleTypeOptions}
                value={formData.ruleType}
                onChange={(value) =>
                  onFormDataChange({ ...formData, ruleType: value })
                }
                buttonClassName="w-full min-h-11 rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-sm font-semibold text-[#1A1A2E] outline-none transition-all focus:border-[#17409A]/30 flex items-center justify-between"
                menuClassName="absolute z-30 mt-2 w-full rounded-xl border border-[#E5E7EB] bg-white shadow-xl py-1"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-black uppercase tracking-wide text-[#6B7280]">
                Max Quantity *
              </label>
              <input
                required
                min={0}
                type="number"
                value={formData.maxQuantity}
                onChange={(e) =>
                  onFormDataChange({
                    ...formData,
                    maxQuantity: Number(e.target.value),
                  })
                }
                className="w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-sm font-semibold text-[#1A1A2E] outline-none transition-all focus:border-[#17409A]/30"
              />
            </div>
          </div>

          <label className="flex items-center gap-2.5 rounded-xl border border-[#E5E7EB] bg-white px-4 py-3">
            <input
              type="checkbox"
              checked={formData.isRequired}
              onChange={(e) =>
                onFormDataChange({ ...formData, isRequired: e.target.checked })
              }
              className="h-4 w-4 rounded border-[#D1D5DB] text-[#17409A]"
            />
            <span className="text-sm font-bold text-[#1A1A2E]">isRequired</span>
          </label>

          {lockedIdentity && (
            <p className="text-xs font-semibold text-[#9CA3AF]">
              Khi chỉnh sửa, baseProductId/groupId/allowedId được giữ nguyên
              theo API.
            </p>
          )}

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
                : editingRule
                  ? "Lưu thay đổi"
                  : "Tạo rule"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
