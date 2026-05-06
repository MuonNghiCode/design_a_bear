"use client";

import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  useMemo,
} from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import {
  MdSearch,
  MdFilterList,
  MdOutlineInventory,
  MdLockOutline,
  MdRefresh,
} from "react-icons/md";
import { productService, inventoryService, accessoryService } from "@/services";
import type { Inventory } from "@/types";
import { useToast } from "@/contexts/ToastContext";
import DataTable from "@/components/admin/common/DataTable";
import Pagination from "@/components/admin/common/Pagination";
import InventoryHero from "./InventoryHero";
import InventoryTopStats from "./InventoryTopStats";

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
  const ref = useRef<HTMLDivElement>(null);
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [inventories, setInventories] = useState<Record<string, Inventory[]>>(
    {},
  );
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"ALL" | "BEAR" | "ACCESSORY">(
    "ALL",
  );

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const toast = useToast();

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

  const fetchInventoryData = useCallback(async (itemList: InventoryItem[]) => {
    const invMap: Record<string, Inventory[]> = {};

    const promises = itemList.map(async (item) => {
      try {
        const res = item.isAccessory
          ? await inventoryService.getByAccessoryId(item.id)
          : await inventoryService.getByProductId(item.id);

        if (res.isSuccess && res.value) {
          invMap[item.id] = res.value;
        }
      } catch {}
    });
    await Promise.all(promises);
    setInventories(invMap);
  }, []);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [prodRes, accRes] = await Promise.all([
        productService.getProducts({ pageSize: 150 }),
        accessoryService.getAll(),
      ]);

      let normalizedItems: InventoryItem[] = [];

      if (prodRes.isSuccess && prodRes.value?.items) {
        normalizedItems = [
          ...normalizedItems,
          ...prodRes.value.items.map((p) => ({
            id: p.productId,
            name: p.name,
            sku: p.sku || "",
            imageUrl: p.imageUrl || undefined,
            productType: "BEAR" as const,
            isAccessory: false,
          })),
        ];
      }

      if (accRes.isSuccess && accRes.value) {
        normalizedItems = [
          ...normalizedItems,
          ...accRes.value.map((a) => ({
            id: a.accessoryId,
            name: a.name,
            sku: a.sku || "",
            imageUrl: a.imageUrl || undefined,
            productType: "ACCESSORY" as const,
            isAccessory: true,
          })),
        ];
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

  const allInventoryRows = useMemo(() => {
    const rows: any[] = [];
    items.forEach((item) => {
      const invs = inventories[item.id] || [];

      // Calculate totals for the product (master row)
      const totalOnHand = invs.reduce((sum, i) => sum + (i.onHand || 0), 0);
      const totalReserved = invs.reduce((sum, i) => sum + (i.reserved || 0), 0);
      const totalAvailable = invs.reduce(
        (sum, i) => sum + (i.totalAvailable || 0),
        0,
      );

      // Add Master Product Row
      rows.push({
        ...item,
        id: `master-${item.id}`,
        isMaster: true,
        onHand: totalOnHand,
        reserved: totalReserved,
        totalAvailable: totalAvailable,
        variantCount: invs.length,
      });

      // Add Variant Rows immediately after
      invs.forEach((inv) => {
        rows.push({
          ...item,
          ...inv,
          id: inv.inventoryId, // Use unique inventory ID
          isVariant: true,
        });
      });
    });
    return rows;
  }, [items, inventories]);

  const filteredRows = allInventoryRows.filter((p) => {
    const nameMatch = p.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const skuMatch = p.sku?.toLowerCase().includes(searchQuery.toLowerCase());
    const sizeMatch = p.sizeTag
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesSearch = nameMatch || skuMatch || sizeMatch;

    if (activeTab === "ALL") return matchesSearch;
    if (activeTab === "BEAR") return matchesSearch && !p.isAccessory;
    if (activeTab === "ACCESSORY") return matchesSearch && p.isAccessory;
    return matchesSearch;
  });

  const totalPages = Math.ceil(filteredRows.length / pageSize);
  const paginatedRows = filteredRows.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeTab]);

  const navigateToAdjust = (row: any) => {
    const params = new URLSearchParams({
      id: row.identityId || row.id,
      productId: row.productId || row.id,
      name: row.name,
      isAccessory: String(row.isAccessory),
      sizeTag: row.sizeTag || "",
    });
    router.push(`/admin/inventory/adjust?${params.toString()}`);
  };

  const navigateToReserve = (row: any, type: "RESERVE" | "RELEASE") => {
    const params = new URLSearchParams({
      id: row.identityId || row.id,
      productId: row.productId || row.id,
      name: row.name,
      type,
      isAccessory: String(row.isAccessory),
    });
    router.push(`/admin/inventory/reserve?${params.toString()}`);
  };

  return (
    <div ref={ref} className="space-y-5">
      {/* Page title */}
      <div className="ac flex items-end justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-[#1A1A2E] font-black text-2xl leading-tight">
            Quản lý Kho hàng
          </h1>
          <p className="text-[#9CA3AF] text-sm font-semibold">
            Theo dõi tồn kho thực tế và quản lý nhập/xuất · Tháng 3 / 2026
          </p>
        </div>
        <button
          onClick={() => fetchData()}
          className="flex items-center gap-2 bg-white text-[#17409A] text-[11px] font-black px-6 py-3.5 rounded-2xl hover:bg-[#F4F7FF] transition-all border border-[#F4F7FF] shadow-sm active:scale-95 disabled:opacity-50 uppercase tracking-widest"
          disabled={isLoading}
        >
          <MdRefresh className={`text-lg ${isLoading ? "animate-spin" : ""}`} />
          Làm mới dữ liệu
        </button>
      </div>

      {/* Hero (left 3/5) + Stats (right 2/5) */}
      <div className="ac grid grid-cols-1 lg:grid-cols-5 gap-5">
        <div className="lg:col-span-3">
          <InventoryHero />
        </div>
        <div className="lg:col-span-2">
          <InventoryTopStats />
        </div>
      </div>

      {/* Control Bar */}
      <div className="ac bg-white rounded-[24px] p-3 shadow-sm border border-white/50 flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
        <div className="flex items-center gap-1.5 p-1 bg-[#F4F7FF] rounded-xl">
          {[
            { id: "ALL", label: "Tất cả", icon: MdOutlineInventory },
            { id: "BEAR", label: "Gấu bông", icon: MdOutlineInventory },
            { id: "ACCESSORY", label: "Phụ kiện", icon: MdFilterList },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
                activeTab === tab.id
                  ? "bg-[#17409A] text-white shadow-md shadow-[#17409A]/10"
                  : "text-gray-400 hover:text-[#17409A] hover:bg-white"
              }`}
            >
              <tab.icon className="text-sm" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative flex-1 lg:max-w-md group">
          <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg group-focus-within:text-[#17409A] transition-colors" />
          <input
            type="text"
            placeholder="Tìm sản phẩm hoặc mã SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-5 py-2.5 bg-[#F4F7FF] border-2 border-transparent rounded-xl text-sm font-bold text-[#1A1A2E] outline-none focus:border-[#17409A]/10 focus:bg-white transition-all placeholder:text-gray-300 shadow-inner"
          />
        </div>
      </div>

      <div className="ac">
        <DataTable
          data={paginatedRows}
          isLoading={isLoading}
          columns={[
            {
              header: "Sản phẩm / Biến thể",
              accessor: (p) => (
                <div
                  className={`flex items-center gap-4 py-0.5 ${p.isVariant ? "ml-12" : ""}`}
                >
                  {!p.isVariant && (
                    <div className="w-12 h-12 rounded-xl bg-[#F4F7FF] border border-white p-1 overflow-hidden shadow-sm shrink-0">
                      <img
                        src={
                          p.imageUrl ||
                          (p.isAccessory
                            ? "/accessory_placeholder.png"
                            : "/teddy_bear.png")
                        }
                        className="w-full h-full object-contain"
                        alt=""
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = p.isAccessory
                            ? "/accessory_placeholder.png"
                            : "/teddy_bear.png";
                        }}
                      />
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span
                        className={`text-sm truncate ${p.isMaster ? "font-black text-[#1A1A2E]" : "font-bold text-gray-500"}`}
                      >
                        {p.isVariant ? (
                          <span className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#17409A]/20" />
                            Kích cỡ: {p.sizeTag || "Mặc định"}
                          </span>
                        ) : (
                          p.name
                        )}
                      </span>
                      {!p.isVariant && (
                        <span
                          className={`text-[8px] px-2 py-0.5 rounded-full font-black uppercase tracking-tighter shrink-0 ${
                            p.isAccessory
                              ? "bg-purple-100 text-purple-600"
                              : "bg-blue-100 text-blue-600"
                          }`}
                        >
                          {p.isAccessory ? "Phụ kiện" : "Gấu"}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest leading-none">
                        SKU: {p.sku || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              ),
            },
            {
              header: "Tồn thực",
              align: "center",
              accessor: (p) => (
                <div className="flex flex-col items-center">
                  <span
                    className={`text-base font-black ${p.isMaster ? "text-[#1A1A2E]" : "text-gray-400"}`}
                  >
                    {p.onHand}
                  </span>
                </div>
              ),
            },
            {
              header: "Tạm khóa",
              align: "center",
              accessor: (p) => {
                const reserved = p.reserved || 0;
                return (
                  <div
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg font-black text-xs ${
                      reserved > 0
                        ? "bg-orange-50 text-orange-600"
                        : "text-gray-300 opacity-50"
                    }`}
                  >
                    <MdLockOutline className="text-sm" /> {reserved}
                  </div>
                );
              },
            },
            {
              header: "Khả dụng",
              align: "center",
              accessor: (p) => {
                const available = p.totalAvailable ?? p.onHand - p.reserved;
                return (
                  <span
                    className={`text-base font-black ${available <= 3 ? "text-red-500" : "text-emerald-500"} ${p.isMaster ? "" : "opacity-50"}`}
                  >
                    {available}
                  </span>
                );
              },
            },
            {
              header: "Trạng thái",
              align: "center",
              accessor: (p) => {
                const available = p.totalAvailable ?? p.onHand - p.reserved;
                const isOut = available <= 0;
                const isLow = available <= 10;
                return (
                  <span
                    className={`text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-wider ${
                      isOut
                        ? "bg-red-50 text-red-600"
                        : isLow
                          ? "bg-amber-50 text-amber-600"
                          : "bg-emerald-50 text-emerald-600"
                    }`}
                  >
                    {isOut ? "Hết hàng" : isLow ? "Sắp hết" : "An toàn"}
                  </span>
                );
              },
            },
            {
              header: "Thao tác",
              align: "right",
              accessor: (p) => (
                <div className="flex items-center justify-end gap-2">
                  {!p.isAccessory && (
                    <button
                      onClick={() => navigateToReserve(p, "RESERVE")}
                      className="w-9 h-9 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center hover:bg-orange-600 hover:text-white transition-all shadow-sm active:scale-90"
                    >
                      <MdLockOutline className="text-lg" />
                    </button>
                  )}
                  <button
                    onClick={() => navigateToAdjust(p)}
                    className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 ${
                      p.isMaster
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-[#17409A] text-white hover:bg-[#0E2A66] hover:shadow-lg hover:shadow-[#17409A]/20"
                    }`}
                    disabled={p.isMaster}
                  >
                    {p.isMaster ? "Chọn biến thể" : "Nhập/Xuất"}
                  </button>
                </div>
              ),
            },
          ]}
        />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
