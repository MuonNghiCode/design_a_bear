"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  MdSearch,
  MdFilterList,
  MdOutlineInventory,
  MdCheckCircleOutline,
  MdArrowForward,
  MdLockOutline,
  MdRefresh,
} from "react-icons/md";
import { productService, inventoryService, accessoryService } from "@/services";
import type { Inventory, ProductListItem, AccessoryResponse } from "@/types";
import { useToast } from "@/contexts/ToastContext";
import PageHeader from "@/components/admin/common/PageHeader";
import DataTable from "@/components/admin/common/DataTable";

interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  imageUrl?: string;
  productType: "BEAR" | "ACCESSORY" | "Standard";
  isAccessory: boolean;
}

export default function InventoryClient() {
  const router = useRouter();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [inventories, setInventories] = useState<Record<string, Inventory[]>>({});
  const [totals, setTotals] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"ALL" | "BEAR" | "ACCESSORY">("ALL");
  const [expandedProducts, setExpandedProducts] = useState<Record<string, boolean>>({});
  
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
          totalMap[item.id] = res.value.reduce((acc, inv) => acc + (inv.onHand || 0), 0);
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
      const [prodRes, accRes] = await Promise.all([
        productService.getProducts({ pageSize: 150 }),
        accessoryService.getAll()
      ]);

      let normalizedItems: InventoryItem[] = [];

      if (prodRes.isSuccess && prodRes.value?.items) {
        normalizedItems = [...normalizedItems, ...prodRes.value.items.map((p) => ({
          id: p.productId,
          name: p.name,
          sku: p.sku || "",
          imageUrl: p.imageUrl || undefined,
          productType: "BEAR" as const,
          isAccessory: false,
        }))];
      }

      if (accRes.isSuccess && accRes.value) {
        normalizedItems = [...normalizedItems, ...accRes.value.map((a) => ({
          id: a.accessoryId,
          name: a.name,
          sku: a.sku || "",
          imageUrl: a.imageUrl || undefined,
          productType: "ACCESSORY" as const,
          isAccessory: true,
        }))];
      }

      setItems(normalizedItems);
      await fetchInventoryData(normalizedItems);
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

  const getAggregate = (id: string) => {
    const invs = inventories[id] || [];
    return invs.reduce(
      (acc, curr) => ({
        onHand: acc.onHand + (curr.onHand || 0),
        reserved: acc.reserved + (curr.reserved || 0),
        available: acc.available + (curr.totalAvailable || 0),
      }),
      { onHand: 0, reserved: 0, available: 0 }
    );
  };

  const navigateToAdjust = (item: InventoryItem, identityId?: string) => {
    const params = new URLSearchParams({
      id: item.id,
      name: item.name,
      isAccessory: String(item.isAccessory),
    });
    if (identityId) params.append("identityId", identityId);
    router.push(`/admin/inventory/adjust?${params.toString()}`);
  };

  const navigateToReserve = (item: InventoryItem, type: "RESERVE" | "RELEASE", identityId?: string) => {
    const params = new URLSearchParams({
      id: item.id,
      name: item.name,
      type,
      isAccessory: String(item.isAccessory),
    });
    if (identityId) params.append("identityId", identityId);
    router.push(`/admin/inventory/reserve?${params.toString()}`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Quản lý kho hàng"
        breadcrumbs={[
          { label: "Quản trị", href: "/admin" },
          { label: "Kho hàng" }
        ]}
        actions={
          <button
            onClick={() => fetchData()}
            disabled={isLoading}
            className="flex items-center gap-2 bg-white text-[#17409A] text-xs font-black px-4 py-2.5 rounded-xl border border-white/50 shadow-sm hover:bg-gray-50 transition-all"
          >
            <MdRefresh className={`text-base ${isLoading ? "animate-spin" : ""}`} />
            Làm mới
          </button>
        }
      />

      {/* Tabs & Search */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex items-center gap-2 p-1 bg-white rounded-2xl shadow-sm border border-white/50">
          {[
            { id: "ALL", label: "Tất cả", icon: MdOutlineInventory },
            { id: "BEAR", label: "Gấu bông", icon: MdOutlineInventory },
            { id: "ACCESSORY", label: "Phụ kiện", icon: MdFilterList },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${
                activeTab === tab.id
                  ? "bg-[#17409A] text-white shadow-md"
                  : "text-gray-400 hover:text-[#17409A] hover:bg-gray-50"
              }`}
            >
              <tab.icon className="text-base" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full lg:w-96 group">
          <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl group-focus-within:text-[#17409A] transition-colors" />
          <input
            type="text"
            placeholder="Tìm theo tên hoặc SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-white/50 rounded-2xl shadow-sm text-sm font-bold text-[#1A1A2E] outline-none focus:border-[#17409A]/20 transition-all"
          />
        </div>
      </div>

      <DataTable
        data={filteredItems}
        isLoading={isLoading}
        columns={[
          {
            header: "Sản phẩm",
            accessor: (p) => (
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#F4F7FF] border border-white p-1 overflow-hidden shadow-sm">
                  <img
                    src={p.imageUrl || (p.isAccessory ? "/accessory_placeholder.png" : "/teddy_bear.png")}
                    className="w-full h-full object-cover rounded-lg"
                    alt=""
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-[#1A1A2E]">{p.name}</span>
                    <span className={`text-[8px] px-1.5 py-0.5 rounded font-black uppercase ${p.isAccessory ? "bg-purple-100 text-purple-600" : "bg-blue-100 text-blue-600"}`}>
                      {p.isAccessory ? "Phụ kiện" : "Gấu"}
                    </span>
                  </div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">SKU: {p.sku || "N/A"}</p>
                </div>
              </div>
            ),
          },
          {
            header: "Tồn thực",
            align: "center",
            accessor: (p) => <span className="font-black text-[#1A1A2E]">{getAggregate(p.id).onHand}</span>,
          },
          {
            header: "Tạm khóa",
            align: "center",
            accessor: (p) => (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-orange-50 text-orange-600 font-black text-xs">
                <MdLockOutline /> {getAggregate(p.id).reserved}
              </div>
            ),
          },
          {
            header: "Khả dụng",
            align: "center",
            accessor: (p) => {
              const available = getAggregate(p.id).available;
              return (
                <span className={`font-black ${available <= 3 ? "text-red-600" : "text-green-600"}`}>
                  {available}
                </span>
              );
            },
          },
          {
            header: "Trạng thái",
            align: "center",
            accessor: (p) => {
              const available = getAggregate(p.id).available;
              return (
                <span className={`text-[9px] font-black px-2.5 py-1 rounded-full uppercase ${
                  available <= 0 ? "bg-red-100 text-red-600" : available <= 5 ? "bg-yellow-100 text-yellow-600" : "bg-green-100 text-green-600"
                }`}>
                  {available <= 0 ? "Hết hàng" : available <= 5 ? "Sắp hết" : "Ổn định"}
                </span>
              );
            },
          },
          {
            header: "Hành động",
            align: "right",
            accessor: (p) => (
              <div className="flex items-center justify-end gap-2">
                {!p.isAccessory && (
                  <button
                    onClick={() => navigateToReserve(p, "RESERVE")}
                    className="p-2 rounded-xl bg-orange-50 text-orange-600 hover:bg-orange-600 hover:text-white transition-all shadow-sm"
                    title="Giữ hàng"
                  >
                    <MdLockOutline className="text-lg" />
                  </button>
                )}
                <button
                  onClick={() => navigateToAdjust(p)}
                  className="px-4 py-2 rounded-xl bg-[#17409A] text-white text-[11px] font-black hover:bg-[#0E2A66] transition-all shadow-md shadow-[#17409A]/10"
                >
                  Nhập/Xuất
                </button>
              </div>
            ),
          },
        ]}
      />

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Tổng loại sản phẩm", value: items.length, icon: MdOutlineInventory, color: "text-[#17409A]", bg: "bg-blue-50" },
          { label: "Hàng sẵn sàng", value: Object.values(totals).reduce((a, b) => a + b, 0), icon: MdCheckCircleOutline, color: "text-green-600", bg: "bg-green-50" },
          { 
            label: "Đang bị khóa", 
            value: Object.values(inventories).flat().reduce((acc, curr) => acc + (curr.reserved || 0), 0), 
            icon: MdLockOutline, 
            color: "text-orange-600", 
            bg: "bg-orange-50" 
          },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[32px] shadow-sm border border-white/50 flex items-center gap-5">
            <div className={`w-14 h-14 rounded-2xl ${stat.bg} flex items-center justify-center ${stat.color} text-2xl`}>
              <stat.icon />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
              <p className={`text-xl font-black ${stat.color}`}>{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
