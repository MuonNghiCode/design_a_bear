"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { MdAdd, MdLink } from "react-icons/md";
import type {
  CreatePersonalizationRuleRequest,
  PersonalizationGroup,
  PersonalizationRule,
  ProductListItem,
  UpdatePersonalizationRuleRequest,
} from "@/types";
import {
  personalizationGroupService,
  personalizationRuleService,
  productService,
} from "@/services";
import { useToast } from "@/contexts/ToastContext";
import PersonalizationRuleFormModal from "./PersonalizationRuleFormModal";
import PersonalizationRulesTable from "./PersonalizationRulesTable";

type RuleFormData = {
  baseProductId: string;
  groupId: string;
  allowedComponentProductId: string;
  isRequired: boolean;
  maxQuantity: number;
  ruleType: string;
};

const EMPTY_FORM: RuleFormData = {
  baseProductId: "",
  groupId: "",
  allowedComponentProductId: "",
  isRequired: false,
  maxQuantity: 1,
  ruleType: "OPTIONAL",
};

const normalizeProductType = (value: string | null | undefined) =>
  (value || "").trim().toUpperCase();

const extractRuleItems = (value: unknown): PersonalizationRule[] => {
  if (Array.isArray(value)) {
    return value as PersonalizationRule[];
  }

  if (
    value &&
    typeof value === "object" &&
    Array.isArray((value as { items?: unknown }).items)
  ) {
    return (value as { items: PersonalizationRule[] }).items;
  }

  return [];
};

interface PersonalizationRulesClientProps {
  embedded?: boolean;
}

export default function PersonalizationRulesClient({
  embedded = false,
}: PersonalizationRulesClientProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [rules, setRules] = useState<PersonalizationRule[]>([]);
  const [groups, setGroups] = useState<PersonalizationGroup[]>([]);
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [editingRule, setEditingRule] = useState<PersonalizationRule | null>(
    null,
  );
  const [formData, setFormData] = useState<RuleFormData>(EMPTY_FORM);

  const { success, error: toastError } = useToast();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [rulesRes, groupsRes, productsRes] = await Promise.all([
        personalizationRuleService.getRules(),
        personalizationGroupService.getGroups(),
        productService.getProducts({ pageSize: 200 }),
      ]);

      const ruleItems = extractRuleItems(rulesRes.value);
      if (rulesRes.isSuccess) {
        setRules(ruleItems);
      } else {
        toastError(
          rulesRes.error?.description || "Không thể tải danh sách rule.",
        );
      }

      if (groupsRes.isSuccess && Array.isArray(groupsRes.value)) {
        setGroups(groupsRes.value);
      } else {
        toastError(groupsRes.error?.description || "Không thể tải nhóm.");
      }

      if (productsRes.isSuccess && productsRes.value?.items) {
        setProducts(productsRes.value.items);
      } else {
        toastError(productsRes.error?.description || "Không thể tải sản phẩm.");
      }
    } catch (err) {
      toastError(
        err instanceof Error
          ? err.message
          : "Lỗi hệ thống khi tải personalization rule.",
      );
    } finally {
      setLoading(false);
    }
  }, [toastError]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (embedded) return;
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".ac",
        { opacity: 0, y: 18 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power2.out",
          stagger: 0.07,
          clearProps: "all",
        },
      );
    }, ref);
    return () => ctx.revert();
  }, [embedded]);

  const accessoryProducts = useMemo(
    () =>
      products.filter(
        (p) => normalizeProductType(p.productType) === "ACCESSORY",
      ),
    [products],
  );

  const baseProducts = useMemo(
    () =>
      products.filter(
        (p) => normalizeProductType(p.productType) === "BASE_BEAR",
      ),
    [products],
  );

  const openCreateModal = () => {
    setEditingRule(null);
    setFormData(EMPTY_FORM);
    setIsModalOpen(true);
  };

  const openEditModal = (rule: PersonalizationRule) => {
    setEditingRule(rule);
    setFormData({
      baseProductId: rule.baseProductId,
      groupId: rule.groupId,
      allowedComponentProductId: rule.allowedComponentProductId,
      isRequired: rule.isRequired,
      maxQuantity: rule.maxQuantity,
      ruleType: rule.ruleType || "OPTIONAL",
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingRule(null);
    setFormData(EMPTY_FORM);
  };

  const handleDelete = async (rule: PersonalizationRule) => {
    const ok = window.confirm(`Xóa rule ${rule.ruleId}?`);
    if (!ok) return;

    try {
      const res = await personalizationRuleService.deleteRule(rule.ruleId);
      if (res.isSuccess) {
        success("Xóa rule thành công!");
        fetchData();
      } else {
        toastError(res.error?.description || "Xóa rule thất bại.");
      }
    } catch (err) {
      toastError(
        err instanceof Error ? err.message : "Lỗi hệ thống khi xóa rule.",
      );
    }
  };

  const validateCreate = () => {
    if (!formData.baseProductId) {
      toastError("Vui lòng chọn baseProductId.");
      return false;
    }
    if (!formData.groupId) {
      toastError("Vui lòng chọn groupId.");
      return false;
    }
    if (!formData.allowedComponentProductId) {
      toastError("Vui lòng chọn allowedComponentProductId.");
      return false;
    }

    const allowedProduct = accessoryProducts.find(
      (p) => p.productId === formData.allowedComponentProductId,
    );
    if (!allowedProduct) {
      toastError("allowedId phải là product có productType = ACCESSORY.");
      return false;
    }

    if (formData.maxQuantity < 0) {
      toastError("maxQuantity phải lớn hơn hoặc bằng 0.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateCreate()) return;

    setIsProcessing(true);
    try {
      if (editingRule) {
        const payload: UpdatePersonalizationRuleRequest = {
          isRequired: formData.isRequired,
          maxQuantity: formData.maxQuantity,
          ruleType: formData.ruleType,
        };

        const res = await personalizationRuleService.updateRule(
          editingRule.ruleId,
          payload,
        );

        if (res.isSuccess) {
          success("Cập nhật rule thành công!");
          closeModal();
          fetchData();
        } else {
          toastError(res.error?.description || "Cập nhật rule thất bại.");
        }
      } else {
        const payload: CreatePersonalizationRuleRequest = {
          baseProductId: formData.baseProductId,
          groupId: formData.groupId,
          allowedComponentProductId: formData.allowedComponentProductId,
          isRequired: formData.isRequired,
          maxQuantity: formData.maxQuantity,
          ruleType: formData.ruleType,
        };

        const res = await personalizationRuleService.createRule(payload);
        if (res.isSuccess) {
          success("Tạo rule thành công!");
          closeModal();
          fetchData();
        } else {
          toastError(res.error?.description || "Tạo rule thất bại.");
        }
      }
    } catch (err) {
      toastError(
        err instanceof Error ? err.message : "Lỗi hệ thống khi lưu rule.",
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const totalRules = rules.length;

  return (
    <div ref={ref} className={embedded ? "max-w-full" : "max-w-full space-y-5"}>
      {!embedded && (
        <div className="ac flex flex-wrap items-end justify-between gap-2">
          <div>
            <h1 className="text-2xl font-black leading-tight text-[#1A1A2E]">
              Personalization Rule
            </h1>
            <p className="text-sm font-semibold text-[#9CA3AF]">
              Gắn Base Product với Product ACCESSORY theo từng Group · Tháng 4 /
              2026
            </p>
          </div>

          <button
            onClick={openCreateModal}
            className="ac flex items-center gap-2 rounded-xl bg-[#17409A] px-4 py-2.5 text-xs font-black text-white shadow-lg shadow-[#17409A]/20 transition-colors hover:bg-[#0f2d70]"
          >
            <MdAdd className="text-base" />
            Tạo rule
          </button>
        </div>
      )}

      <section
        className={`${embedded ? "" : "ac "}relative overflow-hidden rounded-[28px] border border-white/70 bg-white/75 shadow-[0_24px_60px_rgba(23,64,154,0.12)] backdrop-blur-xl`}
      >
        <div className="pointer-events-none absolute -right-16 -top-20 h-44 w-44 rounded-full bg-[#17409A]/10" />
        <div className="pointer-events-none absolute -bottom-16 -left-12 h-36 w-36 rounded-full bg-[#4ECDC4]/15" />

        <div className="relative border-b border-[#E8EEFF] p-6 md:p-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 rounded-2xl border border-[#E5E7EB] bg-[#F4F7FF] px-3 py-2">
              <MdLink className="text-base text-[#17409A]" />
              <p className="text-xs font-black text-[#17409A]">
                Tổng số rules: {totalRules}
              </p>
            </div>

            {embedded && (
              <button
                onClick={openCreateModal}
                className="flex items-center gap-2 rounded-xl bg-[#17409A] px-4 py-2.5 text-xs font-black text-white shadow-lg shadow-[#17409A]/20 transition-colors hover:bg-[#0f2d70]"
              >
                <MdAdd className="text-base" />
                Tạo rule
              </button>
            )}
          </div>
        </div>

        <div className="relative p-6 md:p-7">
          <PersonalizationRulesTable
            rules={rules}
            loading={loading}
            groups={groups}
            products={products}
            onEdit={openEditModal}
            onDelete={handleDelete}
          />
        </div>
      </section>

      <PersonalizationRuleFormModal
        isOpen={isModalOpen}
        onClose={closeModal}
        editingRule={editingRule}
        formData={formData}
        onFormDataChange={setFormData}
        onSubmit={handleSubmit}
        isProcessing={isProcessing}
        baseProducts={baseProducts}
        accessoryProducts={accessoryProducts}
        groups={groups}
      />
    </div>
  );
}
