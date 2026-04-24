"use client";

import React, { useState, useCallback, useEffect } from "react";
import {
  MdSearch,
  MdFilterList,
  MdOutlineInventory,
  MdAdd,
  MdHistory,
  MdCheckCircleOutline,
  MdBusiness,
  MdArrowForward,
  MdLockOutline,
  MdRefresh,
} from "react-icons/md";
import { productService, inventoryService, accessoryService } from "@/services";
import type { ProductListItem, Inventory, AccessoryResponse } from "@/types";
import { useToast } from "@/contexts/ToastContext";
import AdjustStockModal from "./AdjustStockModal";
import ReserveReleaseModal from "./ReserveReleaseModal";

// Unified type for both Products and Accessories
interface InventoryItem {
  id: string; // ProductId or AccessoryId
  name: string;
  sku: string;
  imageUrl?: string;
  productType: "BEAR" | "ACCESSORY" | "Standard";
  isAccessory: boolean;
}

export default function InventoryClient() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [inventories, setInventories] = useState<Record<string, Inventory[]>>(
    {},
  );
  const [totals, setTotals] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"ALL" | "BEAR" | "ACCESSORY">(
    "ALL",
  );
  const [expandedProducts, setExpandedProducts] = useState<
    Record<string, boolean>
  >({});
  const [selectedItem, setSelectedItem] = useState<{
    id: string;
    identityId?: string;
    name: string;
    isAccessory: boolean;
  } | null>(null);
  const [reserveReleaseAction, setReserveReleaseAction] = useState<{
    id: string;
    identityId?: string;
    name: string;
    actionType: "RESERVE" | "RELEASE";
    isAccessory: boolean;
  } | null>(null);
  const toast = useToast();

  const fetchInventoryData = useCallback(async (itemList: InventoryItem[]) => {
    const invMap: Record<string, Inventory[]> = {};
    const totalMap: Record<string, number> = {};

    const promises = itemList.map(async (item) => {
      try {
        const res = item.isAccessory
          ? await inventoryService.getByAccessoryId(item.id)
          : await inventoryService.getByProductId(item.id);

        if (res.isSuccess && res.value) {
          invMap[item.id] = res.value;
          // Calculate available from inventory records
          totalMap[item.id] = res.value.reduce(
            (acc, inv) => acc + (inv.onHand || 0),
            0,
          );
        }
      } catch {}
    });
    await Promise.all(promises);
    setInventories(invMap);
    setTotals(totalMap);
  }, []);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      // 1. Fetch Products
      const prodRes = await productService.getProducts({ pageSize: 150 });
      let normalizedProducts: InventoryItem[] = [];
      if (prodRes.isSuccess && prodRes.value?.items) {
        normalizedProducts = prodRes.value.items.map((p) => ({
          id: p.productId,
          name: p.name,
          sku: p.sku || "",
          imageUrl: p.imageUrl || undefined,
          productType: "BEAR",
          isAccessory: false,
        }));
      }

      // 2. Fetch Accessories from dedicated table
      const accRes = await accessoryService.getAll();
      let normalizedAccessories: InventoryItem[] = [];
      if (accRes.isSuccess && accRes.value) {
        normalizedAccessories = accRes.value.map((a) => ({
          id: a.accessoryId,
          name: a.name,
          sku: a.sku || "",
          imageUrl: a.imageUrl || undefined,
          productType: "ACCESSORY",
          isAccessory: true,
        }));
      }

      const allItems = [...normalizedProducts, ...normalizedAccessories];
      setItems(allItems);
      await fetchInventoryData(allItems);
    } catch (err) {
      toast.error("Không thể tải dữ liệu kho hàng");
    } finally {
      setIsLoading(false);
    }
  }, [fetchInventoryData, toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredItems = items.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku?.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeTab === "ALL") return matchesSearch;
    if (activeTab === "BEAR") return matchesSearch && !p.isAccessory;
    if (activeTab === "ACCESSORY") return matchesSearch && p.isAccessory;
    return matchesSearch;
  });

  const toggleExpand = (id: string) => {
    setExpandedProducts((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const getAggregate = (id: string) => {
    const invs = inventories[id] || [];
    return invs.reduce(
      (acc, curr) => {
        return {
          onHand: acc.onHand + (curr.onHand || 0),
          reserved: acc.reserved + (curr.reserved || 0),
          available: acc.available + (curr.onHand || 0),
        };
      },
      { onHand: 0, reserved: 0, available: 0 },
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Category Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1 bg-white rounded-3xl w-fit shadow-sm border border-white/50 border-b-4 border-b-[#f4f7ff]">
        {[
          { id: "ALL", label: "Tất cả kho", icon: MdOutlineInventory },
          {
            id: "BEAR",
            label: "Gấu bông / Thú nhồi",
            icon: MdOutlineInventory,
          },
          { id: "ACCESSORY", label: "Phụ kiện đồ chơi", icon: MdFilterList },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-black transition-all ${
              activeTab === tab.id
                ? "bg-[#17409A] text-white shadow-lg shadow-[#17409A]/20 scale-105"
                : "text-[#6B7280] hover:bg-[#F4F7FF] hover:text-[#17409A]"
            }`}
          >
            <tab.icon className="text-lg" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search & Actions */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-5 rounded-3xl shadow-sm border border-white/50">
        <div className="relative w-full md:w-96 group">
          <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl group-focus-within:text-[#17409A] transition-colors" />
          <input
            type="text"
            placeholder="Tìm theo tên, mã SKU hoặc phân loại..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-[#F4F7FF] rounded-2xl text-sm font-bold text-[#1A1A2E] outline-none border-2 border-transparent focus:border-[#17409A]/20 transition-all"
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => fetchData()}
            disabled={isLoading}
            className="flex items-center gap-2 bg-[#F4F7FF] text-[#17409A] text-xs font-black px-4 py-2.5 rounded-xl hover:bg-[#E5E7EB] transition-all whitespace-nowrap"
          >
            <MdRefresh
              className={`text-base ${isLoading ? "animate-spin" : ""}`}
            />
            Làm mới đồng bộ
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-[32px] overflow-hidden border border-white/50 shadow-sm border-b-8 border-b-[#f4f7ff]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F4F7FF]/50 border-b border-[#f4f7ff]">
                <th className="px-8 py-5 text-[11px] font-black text-[#6B7280] uppercase tracking-wider">
                  Thông tin sản phẩm
                </th>
                <th className="px-6 py-5 text-[11px] font-black text-[#6B7280] uppercase tracking-wider text-center">
                  Tồn thực
                </th>
                <th className="px-6 py-5 text-[11px] font-black text-[#6B7280] uppercase tracking-wider text-center">
                  Tạm khóa
                </th>
                <th className="px-6 py-5 text-[11px] font-black text-[#6B7280] uppercase tracking-wider text-center">
                  Khả dụng
                </th>
                <th className="px-6 py-5 text-[11px] font-black text-[#6B7280] uppercase tracking-wider text-center">
                  Trạng thái
                </th>
                <th className="px-8 py-5 text-[11px] font-black text-[#6B7280] uppercase tracking-wider text-right">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={6} className="px-8 py-8">
                      <div className="h-10 bg-gray-100 rounded-2xl w-full" />
                    </td>
                  </tr>
                ))
              ) : filteredItems.length > 0 ? (
                filteredItems.map((p) => {
                  const stats = getAggregate(p.id);
                  const availableValue = stats.available;
                  const invRecords = inventories[p.id] || [];
                  const isExpanded = !!expandedProducts[p.id];
                  const hasVariants = !p.isAccessory && invRecords.length > 1;

                  return (
                    <React.Fragment key={p.id}>
                      <tr
                        onClick={() => hasVariants && toggleExpand(p.id)}
                        className={`group hover:bg-[#F4F7FF]/30 transition-all cursor-pointer ${isExpanded ? "bg-[#F4F7FF]/20" : ""}`}
                      >
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-4">
                            <div className="relative">
                              <div className="w-14 h-14 rounded-2xl bg-[#F4F7FF] border border-white p-1 overflow-hidden shadow-sm">
                                <img
                                  src={
                                    p.imageUrl ||
                                    (p.isAccessory
                                      ? "/accessory_placeholder.png"
                                      : "/teddy_bear.png")
                                  }
                                  className="w-full h-full object-cover rounded-xl"
                                  alt=""
                                />
                              </div>
                              {hasVariants && (
                                <div
                                  className={`absolute -right-2 -top-2 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black shadow-sm transition-all ${isExpanded ? "bg-[#17409A] text-white rotate-180" : "bg-white text-[#17409A]"}`}
                                >
                                  {isExpanded ? "—" : invRecords.length}
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="text-[15px] font-black text-[#1A1A2E]">
                                  {p.name}
                                </h3>
                                <span
                                  className={`text-[9px] px-2.5 py-0.5 rounded-lg font-black uppercase shadow-sm ${p.isAccessory ? "bg-purple-100 text-purple-600" : "bg-blue-100 text-blue-600"}`}
                                >
                                  {p.isAccessory ? "Phụ kiện" : "Sản phẩm"}
                                </span>
                              </div>
                              <p className="text-[10px] font-bold text-gray-400 uppercase mt-0.5">
                                Mã: {p.sku || "CHƯA CÓ SKU"}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-center">
                          <span className="text-sm font-black text-[#1A1A2E]">
                            {stats.onHand}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-center">
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-orange-50 text-orange-600 font-black text-sm">
                            <MdLockOutline /> {stats.reserved}
                          </div>
                        </td>
                        <td className="px-6 py-5 text-center">
                          <span
                            className={`text-sm font-black ${availableValue <= 3 ? "text-red-600" : "text-green-600"}`}
                          >
                            {availableValue}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-center">
                          <span
                            className={`text-[10px] font-black px-3 py-1 rounded-full uppercase ${
                              availableValue <= 0
                                ? "bg-red-100 text-red-600"
                                : availableValue <= 5
                                  ? "bg-yellow-100 text-yellow-600"
                                  : "bg-green-100 text-green-600"
                            }`}
                          >
                            {availableValue <= 0
                              ? "Hết hàng"
                              : availableValue <= 5
                                ? "Sắp hết"
                                : "Ổn định"}
                          </span>
                        </td>
                        <td className="px-8 py-5 text-right">
                          {p.isAccessory || !hasVariants ? (
                            <div
                              className="flex items-center justify-end gap-2"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {!p.isAccessory && (
                                <button
                                  onClick={() =>
                                    setReserveReleaseAction({
                                      id: p.id,
                                      identityId: invRecords[0]?.identityId,
                                      name: p.name,
                                      actionType: "RESERVE",
                                      isAccessory: p.isAccessory,
                                    })
                                  }
                                  className="p-2.5 rounded-xl bg-orange-50 text-orange-600 hover:bg-orange-600 hover:text-white transition-all shadow-sm"
                                >
                                  <MdLockOutline className="text-lg" />
                                </button>
                              )}
                              <button
                                onClick={() =>
                                  setSelectedItem({
                                    id: p.id,
                                    identityId: invRecords[0]?.identityId,
                                    name: p.name,
                                    isAccessory: p.isAccessory,
                                  })
                                }
                                className="px-4 py-2.5 rounded-xl bg-[#17409A] text-white text-xs font-black hover:bg-[#0E2A66] transition-all shadow-md shadow-[#17409A]/10"
                              >
                                Nhập/Xuất
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-end gap-2 text-[#17409A] font-black text-[11px] uppercase group-hover:translate-x-1 transition-all">
                              {isExpanded
                                ? "Thu gọn"
                                : `Xem ${invRecords.length} loại size`}{" "}
                              <MdArrowForward />
                            </div>
                          )}
                        </td>
                      </tr>

                      {isExpanded && !p.isAccessory && (
                        <tr>
                          <td
                            colSpan={6}
                            className="px-8 py-4 bg-[#F4F7FF]/20 border-l-4 border-l-[#17409A]"
                          >
                            <div className="bg-white rounded-2xl shadow-inner border border-[#f4f7ff] overflow-hidden">
                              <table className="w-full">
                                <thead>
                                  <tr className="bg-[#17409A] text-white">
                                    <th className="px-6 py-3 text-[10px] font-black uppercase text-left">
                                      Mã SKU cụ thể
                                    </th>
                                    <th className="px-6 py-3 text-[10px] font-black uppercase text-center">
                                      Phân loại / Kích cỡ
                                    </th>
                                    <th className="px-6 py-3 text-[10px] font-black uppercase text-center">
                                      Tồn thực
                                    </th>
                                    <th className="px-6 py-3 text-[10px] font-black uppercase text-center">
                                      Khóa kho
                                    </th>
                                    <th className="px-6 py-3 text-[10px] font-black uppercase text-center">
                                      Khả dụng
                                    </th>
                                    <th className="px-6 py-3 text-[10px] font-black uppercase text-right">
                                      Điều chỉnh
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                  {invRecords.map((v, i) => (
                                    <tr
                                      key={i}
                                      className="hover:bg-[#F4F7FF]/10 transition-colors"
                                    >
                                      <td className="px-6 py-4 font-bold text-gray-500">
                                        {v.sku || "N/A"}
                                      </td>
                                      <td className="px-6 py-4 text-center font-black text-[#1A1A2E]">
                                        {v.sizeTag || "Tiêu chuẩn"}{" "}
                                        {v.sizeDescription &&
                                          `(${v.sizeDescription})`}
                                      </td>
                                      <td className="px-6 py-4 text-center font-black">
                                        {v.onHand}
                                      </td>
                                      <td className="px-6 py-4 text-center">
                                        <span className="text-orange-600 font-black">
                                          {v.reserved}
                                        </span>
                                      </td>
                                      <td className="px-6 py-4 text-center">
                                        <span className="text-green-600 font-black">
                                          {v.onHand}
                                        </span>
                                      </td>
                                      <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                          <button
                                            onClick={() =>
                                              setReserveReleaseAction({
                                                id: p.id,
                                                identityId: v.identityId,
                                                name: `${p.name} - ${v.sizeTag || "Option"}`,
                                                actionType: "RESERVE",
                                                isAccessory: false,
                                              })
                                            }
                                            className="p-1.5 rounded-lg bg-orange-50 text-orange-600 hover:bg-orange-600 hover:text-white transition-all shadow-sm"
                                          >
                                            <MdLockOutline />
                                          </button>
                                          <button
                                            onClick={() =>
                                              setSelectedItem({
                                                id: p.id,
                                                identityId: v.identityId,
                                                name: `${p.name} (${v.sizeTag || "Option"})`,
                                                isAccessory: false,
                                              })
                                            }
                                            className="px-3 py-1.5 rounded-lg bg-[#17409A] text-white text-[10px] font-black shadow-sm"
                                          >
                                            Cập nhật
                                          </button>
                                        </div>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-20 h-20 rounded-[32px] bg-[#F4F7FF] flex items-center justify-center text-[#17409A]">
                        <MdOutlineInventory className="text-4xl" />
                      </div>
                      <p className="text-gray-400 font-black text-sm uppercase">
                        Không tìm thấy sản phẩm nào trong kho
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-[32px] shadow-sm border border-white/50 flex items-center gap-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50/50 rounded-bl-[64px] transition-all group-hover:scale-110" />
          <div className="w-16 h-16 rounded-[24px] bg-blue-50 flex items-center justify-center text-[#17409A] z-10">
            <MdOutlineInventory className="text-3xl" />
          </div>
          <div className="z-10">
            <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">
              Tổng loại mã sản phẩm
            </p>
            <p className="text-2xl font-black text-[#1A1A2E]">{items.length}</p>
          </div>
        </div>
        <div className="bg-white p-8 rounded-[32px] shadow-sm border border-white/50 flex items-center gap-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-green-50/50 rounded-bl-[64px] transition-all group-hover:scale-110" />
          <div className="w-16 h-16 rounded-[24px] bg-green-50 flex items-center justify-center text-green-600 z-10">
            <MdCheckCircleOutline className="text-3xl" />
          </div>
          <div className="z-10">
            <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">
              Hàng sẵn sàng
            </p>
            <p className="text-2xl font-black text-green-600">
              {Object.values(totals).reduce((a, b) => a + b, 0)}
            </p>
          </div>
        </div>
        <div className="bg-white p-8 rounded-[32px] shadow-sm border border-white/50 flex items-center gap-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-orange-50/50 rounded-bl-[64px] transition-all group-hover:scale-110" />
          <div className="w-16 h-16 rounded-[24px] bg-orange-50 flex items-center justify-center text-orange-600 z-10">
            <MdLockOutline className="text-3xl" />
          </div>
          <div className="z-10">
            <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">
              Đang bị khóa kho
            </p>
            <p className="text-2xl font-black text-orange-600">
              {Object.values(inventories)
                .flat()
                .reduce((acc, curr) => acc + (curr.reserved || 0), 0)}
            </p>
          </div>
        </div>
      </div>

      {selectedItem && (
        <AdjustStockModal
          productId={selectedItem.id}
          identityId={selectedItem.identityId}
          productName={selectedItem.name}
          isAccessory={selectedItem.isAccessory}
          onClose={() => setSelectedItem(null)}
          onSuccess={() => fetchData()}
        />
      )}

      {reserveReleaseAction && (
        <ReserveReleaseModal
          productId={reserveReleaseAction.id}
          identityId={reserveReleaseAction.identityId}
          productName={reserveReleaseAction.name}
          actionType={reserveReleaseAction.actionType}
          isAccessory={reserveReleaseAction.isAccessory}
          onClose={() => setReserveReleaseAction(null)}
          onSuccess={() => fetchData()}
        />
      )}
    </div>
  );
}
