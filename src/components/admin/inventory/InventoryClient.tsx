"use client";

import { useState, useCallback, useEffect } from "react";
import {
  MdSearch,
  MdFilterList,
  MdOutlineInventory,
  MdAdd,
  MdHistory,
  MdInfoOutline,
  MdLockOutline,
  MdCheckCircleOutline,
  MdBusiness,
} from "react-icons/md";
import { productService, inventoryService } from "@/services";
import type { ProductListItem, Inventory } from "@/types";
import { useToast } from "@/contexts/ToastContext";
import AdjustStockModal from "./AdjustStockModal";
import ReserveReleaseModal from "./ReserveReleaseModal";
import LocationTab from "./LocationTab";

export default function InventoryClient() {
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [inventories, setInventories] = useState<Record<string, Inventory[]>>(
    {},
  );
  const [totals, setTotals] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"PRODUCTS" | "LOCATIONS">(
    "PRODUCTS",
  );
  const [selectedProduct, setSelectedProduct] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [reserveReleaseAction, setReserveReleaseAction] = useState<{
    productId: string;
    productName: string;
    actionType: "RESERVE" | "RELEASE";
  } | null>(null);
  const toast = useToast();

  const fetchInventoryData = useCallback(
    async (productItems: ProductListItem[]) => {
      const invMap: Record<string, Inventory[]> = {};
      const totalMap: Record<string, number> = {};

      const promises = productItems.map(async (p) => {
        try {
          // Fetch detailed inventories (currently 0 due to BE mapping issue)
          const res = await inventoryService.getByProductId(p.productId);
          if (res.isSuccess && res.value) {
            invMap[p.productId] = res.value;
          }

          // Fetch TRUE total available (works on BE)
          const totalRes = await inventoryService.getTotalAvailable(
            p.productId,
          );
          if (totalRes.isSuccess && totalRes.value) {
            totalMap[p.productId] = totalRes.value.totalAvailable;
          }
        } catch {}
      });
      await Promise.all(promises);
      setInventories(invMap);
      setTotals(totalMap);
    },
    [],
  );

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await productService.getProducts({ pageSize: 100 });
      if (res.isSuccess && res.value?.items) {
        setProducts(res.value.items);
        await fetchInventoryData(res.value.items);
      }
    } catch (err) {
      toast.error("Không thể tải dữ liệu kho hàng");
    } finally {
      setIsLoading(false);
    }
  }, [fetchInventoryData, toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const getAggregate = (productId: string) => {
    const invs = inventories[productId] || [];
    return invs.reduce(
      (acc, curr) => {
        const onHand = Number(curr.quantityAvailable || 0);
        const reserved = Number(curr.quantityReserved || 0);
        return {
          onHand: acc.onHand + onHand,
          reserved: acc.reserved + reserved,
          available: acc.available + (onHand - reserved),
        };
      },
      { onHand: 0, reserved: 0, available: 0 },
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Tab Switcher */}
      <div className="flex items-center gap-1 p-1 bg-white rounded-2xl w-fit shadow-sm border border-white/50 mb-2">
        <button
          onClick={() => setActiveTab("PRODUCTS")}
          className={`px-6 py-2.5 rounded-xl text-sm font-black transition-all ${
            activeTab === "PRODUCTS"
              ? "bg-[#17409A] text-white shadow-lg shadow-[#17409A]/20"
              : "text-[#6B7280] hover:bg-[#F4F7FF] hover:text-[#17409A]"
          }`}
        >
          <div className="flex items-center gap-2">
            <MdOutlineInventory className="text-lg" />
            Tồn kho sản phẩm
          </div>
        </button>
        <button
          onClick={() => setActiveTab("LOCATIONS")}
          className={`px-6 py-2.5 rounded-xl text-sm font-black transition-all ${
            activeTab === "LOCATIONS"
              ? "bg-[#17409A] text-white shadow-lg shadow-[#17409A]/20"
              : "text-[#6B7280] hover:bg-[#F4F7FF] hover:text-[#17409A]"
          }`}
        >
          <div className="flex items-center gap-2">
            <MdBusiness className="text-lg" />
            Danh mục kho bãi
          </div>
        </button>
      </div>

      {activeTab === "PRODUCTS" ? (
        <>
          {/* Search & Actions */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-5 rounded-3xl shadow-sm border border-white/50">
            <div className="relative w-full md:w-96 group">
              <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl group-focus-within:text-[#17409A] transition-colors" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên sản phẩm, SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-[#F4F7FF] rounded-2xl text-sm font-bold text-[#1A1A2E] outline-none border-2 border-transparent focus:border-[#17409A]/20 transition-all"
              />
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white border border-gray-100 text-[#1A1A2E] font-bold text-sm hover:bg-[#F4F7FF] transition-all shadow-sm">
                <MdFilterList className="text-lg" /> Bộ lọc
              </button>
              <button
                onClick={() => fetchData()}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#17409A] text-white font-bold text-sm hover:bg-[#0E2A66] transition-all shadow-lg shadow-[#17409A]/20"
              >
                Làm mới dữ liệu
              </button>
            </div>
          </div>

          {/* Inventory Grid */}
          <div className="bg-white rounded-3xl overflow-hidden border border-white/50 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#F4F7FF]/50">
                    <th className="px-6 py-4 text-[11px] font-black text-[#6B7280] uppercase tracking-wider">
                      Sản phẩm
                    </th>
                    <th className="px-6 py-4 text-[11px] font-black text-[#6B7280] uppercase tracking-wider text-center">
                      Tổng kho (Tồn thực)
                    </th>
                    <th className="px-6 py-4 text-[11px] font-black text-[#6B7280] uppercase tracking-wider text-center">
                      Đang giữ (Khóa tạm)
                    </th>
                    <th className="px-6 py-4 text-[11px] font-black text-[#6B7280] uppercase tracking-wider text-center">
                      Sẵn có (Khả dụng)
                    </th>
                    <th className="px-6 py-4 text-[11px] font-black text-[#6B7280] uppercase tracking-wider text-center w-40">
                      Thao tác nhanh
                    </th>
                    <th className="px-6 py-4 text-[11px] font-black text-[#6B7280] uppercase tracking-wider text-right">
                      Cấu hình
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {isLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td className="px-6 py-5">
                          <div className="h-10 w-40 bg-gray-100 rounded-xl" />
                        </td>
                        <td className="px-6 py-5">
                          <div className="h-6 w-16 bg-gray-100 rounded-lg mx-auto" />
                        </td>
                        <td className="px-6 py-5">
                          <div className="h-6 w-16 bg-gray-100 rounded-lg mx-auto" />
                        </td>
                        <td className="px-6 py-5">
                          <div className="h-6 w-16 bg-gray-100 rounded-lg mx-auto" />
                        </td>
                        <td className="px-6 py-5 text-right">
                          <div className="ml-auto h-10 w-24 bg-gray-100 rounded-xl" />
                        </td>
                      </tr>
                    ))
                  ) : filteredProducts.length > 0 ? (
                    filteredProducts.map((p) => {
                      const stats = getAggregate(p.productId);
                      const availableValue = totals[p.productId] ?? 0;
                      const isLow = availableValue < 5 && availableValue > 0;
                      const isOut = availableValue <= 0;

                      return (
                        <tr
                          key={p.productId}
                          className="hover:bg-[#F4F7FF]/30 transition-colors group"
                        >
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-2xl bg-[#F4F7FF] border border-white/50 overflow-hidden flex-shrink-0">
                                <img
                                  src={p.imageUrl || "/teddy_bear.png"}
                                  alt={p.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div>
                                <p className="text-sm font-black text-[#1A1A2E] group-hover:text-[#17409A] transition-colors">
                                  {p.name}
                                </p>
                                <p className="text-[10px] font-bold text-[#9CA3AF] uppercase">
                                  SKU: {p.sku || "N/A"}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-5 text-center">
                            <div className="flex flex-col items-center">
                              <span className="text-sm font-black text-[#1A1A2E]">
                                {stats.onHand}
                              </span>
                              <span className="text-[9px] font-bold text-[#9CA3AF] uppercase">
                                Cái
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-5 text-center">
                            <div className="flex flex-col items-center">
                              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 text-orange-600 border border-orange-100/50">
                                <MdLockOutline className="text-sm" />
                                <span className="text-sm font-black">
                                  {stats.reserved}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-5 text-center">
                            <div className="flex flex-col items-center">
                              <div
                                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full font-black text-sm border ${
                                  isOut
                                    ? "bg-red-50 text-red-600 border-red-100"
                                    : isLow
                                      ? "bg-yellow-50 text-yellow-600 border-yellow-100"
                                      : "bg-green-50 text-green-600 border-green-100"
                                }`}
                              >
                                {totals[p.productId] ?? 0}
                                {isOut && (
                                  <span className="text-[10px] ml-1">
                                    (Hết hàng)
                                  </span>
                                )}
                                {isLow && (
                                  <span className="text-[10px] ml-1">
                                    (Sắp hết)
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-5 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                title="Giữ hàng"
                                onClick={() => {
                                  setReserveReleaseAction({
                                    productId: p.productId,
                                    productName: p.name,
                                    actionType: "RESERVE",
                                  });
                                }}
                                className="p-2 rounded-xl bg-orange-50 text-orange-600 hover:bg-orange-600 hover:text-white transition-all border border-orange-100"
                              >
                                <MdLockOutline className="text-lg" />
                              </button>
                              <button
                                title="Giải phóng hàng giữ"
                                onClick={() => {
                                  setReserveReleaseAction({
                                    productId: p.productId,
                                    productName: p.name,
                                    actionType: "RELEASE",
                                  });
                                }}
                                className="p-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all border border-blue-100"
                              >
                                <MdHistory className="text-lg" />
                              </button>
                            </div>
                          </td>
                          <td className="px-6 py-5 text-right">
                            <button
                              onClick={() =>
                                setSelectedProduct({
                                  id: p.productId,
                                  name: p.name,
                                })
                              }
                              className="px-4 py-2 rounded-xl bg-white border border-gray-100 text-[#1A1A2E] font-black text-xs hover:bg-[#17409A] hover:text-white hover:border-[#17409A] shadow-sm transition-all"
                            >
                              Điều chỉnh
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-20 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <MdOutlineInventory className="text-5xl text-gray-200" />
                          <p className="text-gray-400 font-bold text-sm">
                            Không tìm thấy sản phẩm nào
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-white/50 shadow-sm flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center text-green-500">
                <MdCheckCircleOutline className="text-3xl" />
              </div>
              <div>
                <p className="text-xs font-black text-[#6B7280] uppercase tracking-wider">
                  Cạnh tranh lành mạnh
                </p>
                <p className="text-sm font-bold text-[#1A1A2E] mt-0.5">
                  Hệ thống xử lý ưu tiên người thanh toán sớm nhất.
                </p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-white/50 shadow-sm flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-500">
                <MdLockOutline className="text-3xl" />
              </div>
              <div>
                <p className="text-xs font-black text-[#6B7280] uppercase tracking-wider">
                  Tự động khóa hàng
                </p>
                <p className="text-sm font-bold text-[#1A1A2E] mt-0.5">
                  Sản phẩm sẽ bị tạm khóa ngay khi khách nhấn đặt hàng.
                </p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-white/50 shadow-sm flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500">
                <MdHistory className="text-3xl" />
              </div>
              <div>
                <p className="text-xs font-black text-[#6B7280] uppercase tracking-wider">
                  Hoàn trả kho tự động
                </p>
                <p className="text-sm font-bold text-[#1A1A2E] mt-0.5">
                  Số lượng tự động trả về kho nếu đơn hàng bị hủy.
                </p>
              </div>
            </div>
          </div>
        </>
      ) : (
        <LocationTab />
      )}

      {/* Adjust Modal */}
      {selectedProduct && (
        <AdjustStockModal
          productId={selectedProduct.id}
          productName={selectedProduct.name}
          onClose={() => setSelectedProduct(null)}
          onSuccess={() => fetchData()}
        />
      )}

      {/* Reserve/Release Modal */}
      {reserveReleaseAction && (
        <ReserveReleaseModal
          productId={reserveReleaseAction.productId}
          productName={reserveReleaseAction.productName}
          actionType={reserveReleaseAction.actionType}
          onClose={() => setReserveReleaseAction(null)}
          onSuccess={() => fetchData()}
        />
      )}
    </div>
  );
}
