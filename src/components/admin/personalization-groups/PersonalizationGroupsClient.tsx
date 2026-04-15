"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { MdAdd, MdChecklist, MdLink } from "react-icons/md";
import { useSearchParams } from "next/navigation";
import type {
  CreatePersonalizationGroupRequest,
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
import PersonalizationGroupFormModal from "./PersonalizationGroupFormModal";
import PersonalizationGroupsTable from "./PersonalizationGroupsTable";
import PersonalizationRulesTable from "@/components/admin/personalization-rules/PersonalizationRulesTable";
import PersonalizationRuleFormModal from "@/components/admin/personalization-rules/PersonalizationRuleFormModal";

const EMPTY_FORM = {
  name: "",
  description: "",
};

const EMPTY_RULE_FORM = {
  baseProductId: "",
  groupId: "",
  allowedComponentProductId: "",
  isRequired: false,
  maxQuantity: 1,
  ruleType: "OPTIONAL",
};

const normalizeProductType = (value: string | null | undefined) =>
  (value || "").trim().toUpperCase();

const extractProductItems = (value: unknown): ProductListItem[] => {
  if (Array.isArray(value)) {
    return value as ProductListItem[];
  }

  if (
    value &&
    typeof value === "object" &&
    Array.isArray((value as { items?: unknown }).items)
  ) {
    return (value as { items: ProductListItem[] }).items;
  }

  return [];
};

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

export default function PersonalizationGroupsClient() {
  const searchParams = useSearchParams();
  const ref = useRef<HTMLDivElement>(null);
  const [groups, setGroups] = useState<PersonalizationGroup[]>([]);
  const [activeTab, setActiveTab] = useState<"groups" | "rules">("groups");
  const [loadingGroups, setLoadingGroups] = useState(true);
  const [loadingRules, setLoadingRules] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<PersonalizationGroup | null>(
    null,
  );
  const [isProcessingGroup, setIsProcessingGroup] = useState(false);
  const [formData, setFormData] = useState(EMPTY_FORM);

  const [rules, setRules] = useState<PersonalizationRule[]>([]);
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [isRuleModalOpen, setIsRuleModalOpen] = useState(false);
  const [isProcessingRule, setIsProcessingRule] = useState(false);
  const [editingRule, setEditingRule] = useState<PersonalizationRule | null>(
    null,
  );
  const [ruleFormData, setRuleFormData] = useState(EMPTY_RULE_FORM);

  const { success, error: toastError } = useToast();

  const fetchGroups = useCallback(async () => {
    setLoadingGroups(true);
    try {
      const res = await personalizationGroupService.getGroups();
      if (res.isSuccess && Array.isArray(res.value)) {
        setGroups(res.value);
      } else {
        toastError(
          res.error?.description || "Không thể tải nhóm personalization.",
        );
      }
    } catch (err) {
      toastError(
        err instanceof Error
          ? err.message
          : "Lỗi hệ thống khi tải nhóm personalization.",
      );
    } finally {
      setLoadingGroups(false);
    }
  }, [toastError]);

  const fetchRulesAndProducts = useCallback(async () => {
    setLoadingRules(true);
    const [rulesResult, productsResult] = await Promise.allSettled([
      personalizationRuleService.getRules(),
      productService.getProducts({ pageSize: 200 }),
    ]);

    if (rulesResult.status === "fulfilled") {
      const rulesRes = rulesResult.value;
      const ruleItems = extractRuleItems(rulesRes.value);
      if (rulesRes.isSuccess) {
        setRules(ruleItems);
      } else {
        setRules([]);
        toastError(
          rulesRes.error?.description || "Không thể tải danh sách rule.",
        );
      }
    } else {
      setRules([]);
      toastError(
        rulesResult.reason instanceof Error
          ? rulesResult.reason.message
          : "Lỗi hệ thống khi tải personalization rule.",
      );
    }

    if (productsResult.status === "fulfilled") {
      const productsRes = productsResult.value;
      const productItems = extractProductItems(productsRes.value);
      if (productsRes.isSuccess) {
        setProducts(productItems);
      } else {
        setProducts([]);
        toastError(productsRes.error?.description || "Không thể tải sản phẩm.");
      }
    } else {
      setProducts([]);
      toastError(
        productsResult.reason instanceof Error
          ? productsResult.reason.message
          : "Lỗi hệ thống khi tải sản phẩm.",
      );
    }

    setLoadingRules(false);
  }, [toastError]);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  useEffect(() => {
    if (activeTab === "rules") {
      fetchRulesAndProducts();
      if (groups.length === 0) {
        fetchGroups();
      }
    }
  }, [activeTab, fetchRulesAndProducts, fetchGroups, groups.length]);

  useEffect(() => {
    if (searchParams.get("tab") === "rules") {
      setActiveTab("rules");
    }
  }, [searchParams]);

  useEffect(() => {
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
  }, []);

  const totalGroups = useMemo(() => groups.length, [groups]);
  const totalRules = useMemo(() => rules.length, [rules]);
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
    setEditingGroup(null);
    setFormData(EMPTY_FORM);
    setIsModalOpen(true);
  };

  const openEditModal = (group: PersonalizationGroup) => {
    setEditingGroup(group);
    setFormData({
      name: group.name,
      description: group.description || "",
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingGroup(null);
    setFormData(EMPTY_FORM);
  };

  const handleDelete = async (group: PersonalizationGroup) => {
    const ok = window.confirm(`Xóa nhóm \"${group.name}\"?`);
    if (!ok) return;

    try {
      const res = await personalizationGroupService.deleteGroup(group.groupId);
      if (res.isSuccess) {
        success("Xóa nhóm thành công!");
        fetchGroups();
      } else {
        toastError(res.error?.description || "Xóa nhóm thất bại.");
      }
    } catch (err) {
      toastError(
        err instanceof Error ? err.message : "Lỗi hệ thống khi xóa nhóm.",
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toastError("Tên nhóm là bắt buộc.");
      return;
    }

    setIsProcessingGroup(true);
    const payload: CreatePersonalizationGroupRequest = {
      name: formData.name.trim(),
      description: formData.description.trim() || null,
    };

    try {
      if (editingGroup) {
        const res = await personalizationGroupService.updateGroup(
          editingGroup.groupId,
          payload,
        );
        if (res.isSuccess) {
          success("Cập nhật nhóm thành công!");
          closeModal();
          fetchGroups();
        } else {
          toastError(res.error?.description || "Cập nhật nhóm thất bại.");
        }
      } else {
        const res = await personalizationGroupService.createGroup(payload);
        if (res.isSuccess) {
          success("Tạo nhóm thành công!");
          closeModal();
          fetchGroups();
        } else {
          toastError(res.error?.description || "Tạo nhóm thất bại.");
        }
      }
    } catch (err) {
      toastError(
        err instanceof Error ? err.message : "Lỗi hệ thống khi lưu nhóm.",
      );
    } finally {
      setIsProcessingGroup(false);
    }
  };

  const openCreateRuleModal = () => {
    setEditingRule(null);
    setRuleFormData(EMPTY_RULE_FORM);
    setIsRuleModalOpen(true);
  };

  const openEditRuleModal = (rule: PersonalizationRule) => {
    setEditingRule(rule);
    setRuleFormData({
      baseProductId: rule.baseProductId,
      groupId: rule.groupId,
      allowedComponentProductId: rule.allowedComponentProductId,
      isRequired: rule.isRequired,
      maxQuantity: rule.maxQuantity,
      ruleType: rule.ruleType || "OPTIONAL",
    });
    setIsRuleModalOpen(true);
  };

  const closeRuleModal = () => {
    setIsRuleModalOpen(false);
    setEditingRule(null);
    setRuleFormData(EMPTY_RULE_FORM);
  };

  const handleDeleteRule = async (rule: PersonalizationRule) => {
    const ok = window.confirm(`Xóa rule ${rule.ruleId}?`);
    if (!ok) return;

    try {
      const res = await personalizationRuleService.deleteRule(rule.ruleId);
      if (res.isSuccess) {
        success("Xóa rule thành công!");
        fetchRulesAndProducts();
      } else {
        toastError(res.error?.description || "Xóa rule thất bại.");
      }
    } catch (err) {
      toastError(
        err instanceof Error ? err.message : "Lỗi hệ thống khi xóa rule.",
      );
    }
  };

  const validateRuleForm = () => {
    if (!ruleFormData.baseProductId) {
      toastError("Vui lòng chọn baseProductId.");
      return false;
    }
    if (!ruleFormData.groupId) {
      toastError("Vui lòng chọn groupId.");
      return false;
    }
    if (!ruleFormData.allowedComponentProductId) {
      toastError("Vui lòng chọn allowedComponentProductId.");
      return false;
    }

    const baseProduct = baseProducts.find(
      (p) => p.productId === ruleFormData.baseProductId,
    );
    if (!baseProduct) {
      toastError("baseProduct phải là product có productType = BASE_BEAR.");
      return false;
    }

    const allowedProduct = accessoryProducts.find(
      (p) => p.productId === ruleFormData.allowedComponentProductId,
    );
    if (!allowedProduct) {
      toastError("allowedId phải là product có productType = ACCESSORY.");
      return false;
    }

    if (ruleFormData.maxQuantity < 0) {
      toastError("maxQuantity phải lớn hơn hoặc bằng 0.");
      return false;
    }

    return true;
  };

  const handleRuleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateRuleForm()) return;

    setIsProcessingRule(true);
    try {
      if (editingRule) {
        const payload: UpdatePersonalizationRuleRequest = {
          isRequired: ruleFormData.isRequired,
          maxQuantity: ruleFormData.maxQuantity,
          ruleType: ruleFormData.ruleType,
        };

        const res = await personalizationRuleService.updateRule(
          editingRule.ruleId,
          payload,
        );

        if (res.isSuccess) {
          success("Cập nhật rule thành công!");
          closeRuleModal();
          fetchRulesAndProducts();
        } else {
          toastError(res.error?.description || "Cập nhật rule thất bại.");
        }
      } else {
        const payload: CreatePersonalizationRuleRequest = {
          baseProductId: ruleFormData.baseProductId,
          groupId: ruleFormData.groupId,
          allowedComponentProductId: ruleFormData.allowedComponentProductId,
          isRequired: ruleFormData.isRequired,
          maxQuantity: ruleFormData.maxQuantity,
          ruleType: ruleFormData.ruleType,
        };

        const res = await personalizationRuleService.createRule(payload);
        if (res.isSuccess) {
          success("Tạo rule thành công!");
          closeRuleModal();
          fetchRulesAndProducts();
        } else {
          toastError(res.error?.description || "Tạo rule thất bại.");
        }
      }
    } catch (err) {
      toastError(
        err instanceof Error ? err.message : "Lỗi hệ thống khi lưu rule.",
      );
    } finally {
      setIsProcessingRule(false);
    }
  };

  return (
    <div ref={ref} className="max-w-full space-y-5">
      <div className="ac flex flex-wrap items-end justify-between gap-2">
        <div>
          <h1 className="text-2xl font-black leading-tight text-[#1A1A2E]">
            Quản lý Personalization
          </h1>
          <p className="text-sm font-semibold text-[#9CA3AF]">
            Quản lý Group và Rule trên cùng một màn hình · Tháng 4 / 2026
          </p>
        </div>
      </div>

      <section className="ac relative overflow-hidden rounded-[28px] border border-white/70 bg-white/75 shadow-[0_24px_60px_rgba(23,64,154,0.12)] backdrop-blur-xl">
        <div className="pointer-events-none absolute -right-16 -top-20 h-44 w-44 rounded-full bg-[#17409A]/10" />
        <div className="pointer-events-none absolute -bottom-16 -left-12 h-36 w-36 rounded-full bg-[#4ECDC4]/15" />

        <div className="relative border-b border-[#E8EEFF] p-6 md:p-7">
          <div className="inline-flex rounded-2xl bg-[#F4F7FF] p-1.5 border border-[#E5E7EB]">
            <button
              onClick={() => setActiveTab("groups")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-all duration-150 ${
                activeTab === "groups"
                  ? "bg-white text-[#17409A] shadow-sm"
                  : "text-[#6B7280] hover:text-[#17409A]"
              }`}
            >
              <MdChecklist className="text-sm" />
              Group
            </button>
            <button
              onClick={() => setActiveTab("rules")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-all duration-150 ${
                activeTab === "rules"
                  ? "bg-white text-[#17409A] shadow-sm"
                  : "text-[#6B7280] hover:text-[#17409A]"
              }`}
            >
              <MdLink className="text-sm" />
              Rule
            </button>
          </div>
        </div>

        <div className="relative p-6 md:p-7">
          {activeTab === "groups" && (
            <div className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="inline-flex items-center gap-2 rounded-2xl border border-[#E5E7EB] bg-[#F4F7FF] px-3 py-2">
                  <MdChecklist className="text-base text-[#17409A]" />
                  <p className="text-xs font-black text-[#17409A]">
                    Tổng số nhóm: {totalGroups}
                  </p>
                </div>

                <button
                  onClick={openCreateModal}
                  className="flex items-center gap-2 rounded-xl bg-[#17409A] px-4 py-2.5 text-xs font-black text-white shadow-lg shadow-[#17409A]/20 transition-colors hover:bg-[#0f2d70]"
                >
                  <MdAdd className="text-base" />
                  Tạo nhóm
                </button>
              </div>

              <PersonalizationGroupsTable
                groups={groups}
                loading={loadingGroups}
                onEdit={openEditModal}
                onDelete={handleDelete}
              />
            </div>
          )}

          {activeTab === "rules" && (
            <div className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="inline-flex items-center gap-2 rounded-2xl border border-[#E5E7EB] bg-[#F4F7FF] px-3 py-2">
                  <MdLink className="text-base text-[#17409A]" />
                  <p className="text-xs font-black text-[#17409A]">
                    Tổng số rules: {totalRules}
                  </p>
                </div>

                <button
                  onClick={openCreateRuleModal}
                  className="flex items-center gap-2 rounded-xl bg-[#17409A] px-4 py-2.5 text-xs font-black text-white shadow-lg shadow-[#17409A]/20 transition-colors hover:bg-[#0f2d70]"
                >
                  <MdAdd className="text-base" />
                  Tạo rule
                </button>
              </div>

              <PersonalizationRulesTable
                rules={rules}
                loading={loadingRules}
                groups={groups}
                products={products}
                onEdit={openEditRuleModal}
                onDelete={handleDeleteRule}
              />
            </div>
          )}
        </div>
      </section>

      <PersonalizationGroupFormModal
        isOpen={isModalOpen}
        onClose={closeModal}
        editingGroup={editingGroup}
        formData={formData}
        onFormDataChange={setFormData}
        onSubmit={handleSubmit}
        isProcessing={isProcessingGroup}
      />

      <PersonalizationRuleFormModal
        isOpen={isRuleModalOpen}
        onClose={closeRuleModal}
        editingRule={editingRule}
        formData={ruleFormData}
        onFormDataChange={setRuleFormData}
        onSubmit={handleRuleSubmit}
        isProcessing={isProcessingRule}
        baseProducts={baseProducts}
        accessoryProducts={accessoryProducts}
        groups={groups}
      />
    </div>
  );
}
