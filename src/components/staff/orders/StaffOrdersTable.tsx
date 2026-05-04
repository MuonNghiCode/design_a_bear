"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/utils/currency";
import { useDebounce } from "@/hooks";
import {
  MdSearch,
  MdRemoveRedEye,
  MdFileDownload,
  MdClose,
  MdAutorenew,
} from "react-icons/md";
import { GiPawPrint } from "react-icons/gi";
import { useAdminOrdersApi } from "@/hooks/useAdminOrdersApi";
import { orderService } from "@/services/order.service";
import { addressService } from "@/services/address.service";
import { fulfillmentService } from "@/services/fulfillment.service";
import { shippingService } from "@/services/shipping.service";
import { useToast } from "@/contexts/ToastContext";
import CustomDropdown from "@/components/shared/CustomDropdown";
import type { OrderListItem, AddressDetail, Order } from "@/types";
import type { FulfillmentResponse } from "@/types/responses";
import { formatShortOrderCode } from "@/utils/order";
import { MdLocalShipping, MdPrint } from "react-icons/md";

export type StaffOrderStatus =
  | "pending"
  | "processing"
  | "printing"
  | "ready_for_pickup"
  | "shipping";

const STAFF_BACKEND_STATUSES: { value: string; label: string }[] = [
  { value: "PENDING", label: "Chờ xử lý" },
  { value: "PROCESSING", label: "Đang xử lý" },
  { value: "PRINTING", label: "Đang in" },
  { value: "READY_FOR_PICKUP", label: "Sẵn sàng lấy hàng" },
  { value: "SHIPPING", label: "Đang giao" },
];

const STAFF_STATUS_CFG: Record<
  StaffOrderStatus,
  { label: string; color: string; bg: string }
> = {
  pending: { label: "Chờ xử lý", color: "#FF8C42", bg: "#FF8C4218" },
  processing: { label: "Đang xử lý", color: "#7C5CFC", bg: "#7C5CFC18" },
  printing: { label: "Đang in", color: "#06B6D4", bg: "#06B6D418" },
  ready_for_pickup: {
    label: "Sẵn sàng lấy hàng",
    color: "#4ECDC4",
    bg: "#4ECDC418",
  },
  shipping: { label: "Đang giao", color: "#14B8A6", bg: "#14B8A618" },
};

const STAFF_TABS: { key: StaffOrderStatus | "all"; label: string }[] = [
  { key: "all", label: "Tất cả" },
  { key: "pending", label: "Chờ xử lý" },
  { key: "processing", label: "Đang xử lý" },
  { key: "printing", label: "Đang in" },
  { key: "ready_for_pickup", label: "Sẵn sàng lấy" },
  { key: "shipping", label: "Đang giao" },
];

const AVATAR_COLORS = [
  "#17409A",
  "#7C5CFC",
  "#4ECDC4",
  "#FF8C42",
  "#FF6B9D",
  "#FFD93D",
];

const COL_HEADS = [
  "Mã đơn",
  "Khách hàng",
  "Sản phẩm",
  "Thành tiền",
  "Trạng thái",
  "Ngày",
  "",
];

const STAFF_API_STATUS_TO_UI: Record<string, StaffOrderStatus> = {
  PENDING: "pending",
  PROCESSING: "processing",
  PRINTING: "printing",
  READY_FOR_PICKUP: "ready_for_pickup",
  SHIPPING: "shipping",
};

export default function StaffOrdersTable() {
  const router = useRouter();
  const { data, loading, fetchOrders, usersMap } = useAdminOrdersApi();
  const [tab, setTab] = useState<StaffOrderStatus | "all">("all");
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 350);
  const [selected, setSelected] = useState<OrderListItem | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<AddressDetail | null>(
    null,
  );
  const [fulfillment, setFulfillment] = useState<FulfillmentResponse | null>(null);
  const [pushingGhtk, setPushingGhtk] = useState(false);
  const [trackingData, setTrackingData] = useState<any>(null);
  const [loadingTracking, setLoadingTracking] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState<string | null>(null);
  const [pageIndex, setPageIndex] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const pageSize = 10;

  const handleViewDetails = (
    orderId: string,
    shippingAddressId?: string | null,
  ) => {
    router.push(`/staff/orders/${orderId}`);
  };

  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const { success, error: toastError } = useToast();

  const handleSubmitToGhtk = async () => {
    if (!selected || !selectedAddress) return;
    setPushingGhtk(true);
    try {
      const orderRes = await orderService.getOrderById(selected.orderId);
      if (!orderRes.isSuccess || !orderRes.value) throw new Error("Không thể tải thông tin đơn hàng");
      const fullOrder = orderRes.value;

      const products = fullOrder.orderItems.map((item) => {
        let weight = item.weightSnapshot || 500;
        if (weight === 0) weight = 500;
        return {
          name:
            item.buildDetails?.buildName ||
            item.buildDetails?.baseProductName ||
            item.productNameSnapshot ||
            item.productName ||
            "Sản phẩm đồ chơi",
          weight: weight,
          quantity: item.quantity,
          productCode: item.sku || undefined,
        };
      });

      const isOldAddress = selectedAddress.city.includes("Thành phố") || selectedAddress.city.includes("Tỉnh");
      const province = isOldAddress ? selectedAddress.city : (selectedAddress.state || selectedAddress.city);
      const district = isOldAddress ? selectedAddress.state : selectedAddress.city;

      const res = await shippingService.submitExpressOrder({
        orderId: selected.orderId,
        customerName: selectedAddress.fullName,
        customerPhone: selectedAddress.phoneNumber,
        customerAddress: `${selectedAddress.line1}${selectedAddress.line2 ? `, ${selectedAddress.line2}` : ""}`,
        customerProvince: province,
        customerDistrict: district,
        customerWard: selectedAddress.line2 || undefined,
        hamlet: selectedAddress.line2 || undefined,
        pickMoney: fullOrder.isPaid ? 0 : fullOrder.grandTotal,
        value: fullOrder.subtotal,
        products: products,
      });

      if (res.isSuccess && res.value?.order?.label) {
        success("Đẩy đơn sang GHTK thành công!");
        const label = res.value.order.label;
        const fulfillRes = await fulfillmentService.create({
          orderId: selected.orderId,
          trackingNumber: label,
          carrier: "GHTK",
        });
        if (fulfillRes.isSuccess && fulfillRes.value) {
          setFulfillment(fulfillRes.value);
          // Auto transition to SHIPPING status
          await orderService.updateOrderStatus(selected.orderId, { status: "SHIPPING" });
          handleRefresh();
        }
      } else {
        toastError(res.error?.description || "GHTK từ chối đẩy đơn");
      }
    } catch (e: any) {
      console.error(e);
      toastError("Lỗi khi đẩy đơn: " + (e.message || "Unknown"));
    } finally {
      setPushingGhtk(false);
    }
  };

  const handleTrackGhtk = async () => {
    if (!fulfillment?.trackingNumber) return;
    setLoadingTracking(true);
    try {
      const res = await shippingService.getTrackingStatus(fulfillment.trackingNumber);
      if (res.isSuccess && res.value) {
        setTrackingData(res.value);
      } else {
        toastError(res.error?.description || "Không thể lấy thông tin tracking");
      }
    } catch (e: any) {
      console.error(e);
      toastError("Lỗi mạng khi lấy tracking");
    } finally {
      setLoadingTracking(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await fetchOrders({ pageIndex: 1, pageSize, fetchAllPages: true });
      setPageIndex(1);
      success("Đã làm mới dữ liệu!");
    } catch (e) {
      toastError("Lỗi khi làm mới dữ liệu!");
    } finally {
      setRefreshing(false);
    }
  };

  const handleStatusUpdate = async (newStatus: string) => {
    if (!selected) return;
    try {
      setUpdatingStatus(newStatus);
      const res = await orderService.updateOrderStatus(selected.orderId, {
        status: newStatus,
        notes: `Cập nhật trạng thái thủ công thành ${newStatus}`,
      });
      if (res.isSuccess || res.value === null) {
        success("Thay đổi trạng thái thành công!");
        setSelected({ ...selected, status: newStatus });
        fetchOrders({ pageIndex: 1, pageSize, fetchAllPages: true });
        setPageIndex(1);
      } else {
        toastError("Không thể thay đổi trạng thái!");
      }
    } catch (e) {
      toastError("Lỗi mạng khi đổi trạng thái!");
    } finally {
      setUpdatingStatus(null);
    }
  };

  useEffect(() => {
    fetchOrders({ pageIndex: 1, pageSize, fetchAllPages: true });
  }, [fetchOrders, pageSize]);

  const orders = useMemo(() => data?.items || [], [data?.items]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: orders.length };
    orders.forEach((o) => {
      const st = STAFF_API_STATUS_TO_UI[o.status] || "pending";
      c[st] = (c[st] ?? 0) + 1;
    });
    return c;
  }, [orders]);

  const filtered = useMemo(
    () =>
      orders.filter((o) => {
        const st = STAFF_API_STATUS_TO_UI[o.status] || "pending";
        if (tab !== "all" && st !== tab) return false;
        const q = debouncedSearch.toLowerCase();
        return (
          o.orderNumber.toLowerCase().includes(q) ||
          (o.userId || "").toLowerCase().includes(q) ||
          (o.userId
            ? (usersMap[o.userId]?.fullName || "").toLowerCase().includes(q)
            : false)
        );
      }),
    [tab, debouncedSearch, orders, usersMap],
  );

  const localTotalCount = filtered.length;
  const localTotalPages = Math.max(1, Math.ceil(localTotalCount / pageSize));
  const pagedOrders = useMemo(() => {
    const start = (pageIndex - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, pageIndex, pageSize]);

  useEffect(() => {
    if (pageIndex > localTotalPages) {
      setPageIndex(localTotalPages);
    }
  }, [localTotalPages, pageIndex]);

  useEffect(() => {
    setPageIndex(1);
  }, [tab, debouncedSearch]);

  return (
    <>
      <div className="space-y-6">
      {/* ── Search & Tabs (Admin style) ── */}
      <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
        <div className="flex items-center gap-2 p-1.5 bg-white rounded-2xl shadow-sm border border-white/50 overflow-x-auto max-w-full no-scrollbar">
          {STAFF_TABS.map(({ key, label }) => {
            const active = tab === key;
            return (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`px-5 py-2.5 rounded-xl text-[13px] font-black transition-all uppercase tracking-wider whitespace-nowrap ${
                  active
                    ? "bg-[#17409A] text-white shadow-md"
                    : "text-gray-400 hover:text-[#17409A] hover:bg-gray-50"
                }`}
              >
                {label}
                <span
                  className={`ml-1.5 text-[10px] px-1.5 py-0.5 rounded-md font-bold ${
                    active ? "bg-white/20 text-white" : "bg-[#F4F7FF] text-[#6B7280]"
                  }`}
                >
                  {counts[key] ?? 0}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-80 group">
            <MdSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 text-2xl group-focus-within:text-[#17409A] transition-colors pointer-events-none" />
            <input
              type="text"
              placeholder="Tìm đơn hàng, khách hàng..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-14 pr-6 py-3.5 bg-white border border-white/50 rounded-2xl shadow-sm text-sm font-bold text-[#1A1A2E] outline-none focus:border-[#17409A]/20 transition-all placeholder:text-gray-300 uppercase tracking-wide"
            />
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing || loading}
            className="flex items-center gap-2 bg-white border border-white/50 text-[#17409A] text-[13px] font-black px-6 py-3.5 rounded-2xl hover:bg-gray-50 transition-all shadow-sm uppercase tracking-widest disabled:opacity-50"
            title="Làm mới dữ liệu"
          >
            <MdAutorenew className={`text-xl ${refreshing ? "animate-spin" : ""}`} />
            <span>Làm mới</span>
          </button>
        </div>
      </div>

      {/* ── Table (Admin style) ── */}
      <div className="bg-white rounded-[32px] overflow-hidden border border-white/50 shadow-sm border-b-8 border-b-[#f4f7ff]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F4F7FF]/50 border-b border-[#f4f7ff]">
                {COL_HEADS.map((h, i) => (
                  <th
                    key={i}
                    className="px-6 py-5 text-[11px] font-black text-[#6B7280] uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading && filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-12 text-sm text-[#9CA3AF] font-bold uppercase"
                  >
                    Đang tải...
                  </td>
                </tr>
              ) : (
                pagedOrders.map((order, i: number) => {
                  const uiStatus =
                    STAFF_API_STATUS_TO_UI[order.status] || "pending";
                  const st = STAFF_STATUS_CFG[uiStatus];

                  const userDetail = order.userId
                    ? usersMap[order.userId]
                    : null;
                  const customerName = userDetail
                    ? userDetail.fullName
                    : order.userId
                      ? "Thành viên"
                      : "Khách vãng lai";

                  const avatarColor =
                    AVATAR_COLORS[
                      (userDetail ? userDetail.email.charCodeAt(0) : i) %
                        AVATAR_COLORS.length
                    ];
                  const avatarChar = customerName.charAt(0).toUpperCase();

                  const dateObj = new Date(order.createdAt);
                  const dateStr = dateObj.toLocaleDateString("vi-VN");
                  const timeStr = dateObj.toLocaleTimeString("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  });

                  return (
                    <tr
                      key={order.orderId}
                      className="group transition-all cursor-pointer hover:bg-[#F4F7FF]/30"
                    >
                      <td className="px-6 py-5 border-b border-gray-50">
                        <span className="text-[14px] font-black text-[#17409A] tracking-wider font-mono">
                          #{formatShortOrderCode(
                            order.orderNumber || order.orderId,
                          )}
                        </span>
                      </td>

                      <td className="px-6 py-5 border-b border-gray-50">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-white font-black text-xs group-hover:scale-105 transition-transform duration-200 border border-white shadow-sm"
                            style={{ backgroundColor: avatarColor }}
                          >
                            {avatarChar}
                          </div>
                          <div>
                            <p className="text-[#1A1A2E] font-bold text-sm leading-tight">
                              {customerName}
                            </p>
                            <p className="text-[#9CA3AF] text-[10px] font-semibold leading-tight mt-0.5">
                              {order.userId ? "Đã đăng ký" : "Khách mới"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-5 border-b border-gray-50">
                        <p className="text-[#1A1A2E] font-semibold text-sm leading-tight">
                          {order.orderItems && order.orderItems.length > 0
                            ? `${order.orderItems.length} sản phẩm`
                            : "Không có SP"}
                        </p>
                      </td>

                      <td className="px-6 py-5 border-b border-gray-50 whitespace-nowrap">
                        <div className="text-[#17409A] font-black text-sm">
                          {formatPrice(order.grandTotal)}
                        </div>
                      </td>

                      <td className="px-6 py-5 border-b border-gray-50">
                        <div className="flex items-center gap-1.5">
                          <span
                            className="w-1.5 h-1.5 rounded-full shrink-0"
                            style={{ backgroundColor: st.color }}
                          />
                          <span
                            className="text-[10px] font-black px-2.5 py-1 rounded-full whitespace-nowrap"
                            style={{ color: st.color, backgroundColor: st.bg }}
                          >
                            {st.label}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-5 border-b border-gray-50">
                        <p className="text-[#4B5563] font-semibold text-[11px] leading-tight">
                          {dateStr}
                        </p>
                        <p className="text-[#9CA3AF] text-[10px] font-semibold leading-tight">
                          {timeStr}
                        </p>
                      </td>

                      <td className="px-6 py-5 border-b border-gray-50">
                        <button
                          onClick={() =>
                            handleViewDetails(
                              order.orderId,
                              order.shippingAddressId,
                            )
                          }
                          disabled={loadingDetails === order.orderId}
                          className="w-8 h-8 rounded-xl flex items-center justify-center text-[#9CA3AF] hover:text-[#17409A] hover:bg-[#17409A]/10 transition-all duration-150 disabled:opacity-50"
                          title="Xem chi tiết"
                        >
                          {loadingDetails === order.orderId ? (
                            <MdAutorenew className="text-base animate-spin" />
                          ) : (
                            <MdRemoveRedEye className="text-base" />
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="flex flex-col items-center py-20 text-center">
              <GiPawPrint
                className="text-[#E5E7EB] mb-3"
                style={{ fontSize: 52 }}
              />
              <p className="text-[#9CA3AF] font-black text-sm uppercase">
                Không có dữ liệu hiển thị
              </p>
            </div>
          )}
        </div>
      </div>

      {filtered.length > 0 && (
        <div className="flex items-center justify-between pt-4">
          <p className="text-[#9CA3AF] text-[11px] font-semibold uppercase tracking-wider">
            Hiển thị{" "}
            <span className="text-[#1A1A2E] font-black">
              {pagedOrders.length}
            </span>{" "}
            / {localTotalCount} đơn hàng
          </p>
          <div className="flex items-center gap-1">
            {Array.from({ length: localTotalPages }, (_, i) => i + 1).map(
              (p) => (
                <button
                  key={p}
                  onClick={() => setPageIndex(p)}
                  className={`w-8 h-8 rounded-xl text-[11px] font-black transition-colors ${
                    p === pageIndex
                      ? "bg-[#17409A] text-white shadow-sm"
                      : "text-[#9CA3AF] hover:bg-white border border-transparent hover:border-gray-100"
                  }`}
                >
                  {p}
                </button>
              ),
            )}
          </div>
        </div>
      )}
    </div>

      {/* Order detail modal */}
      {selected &&
        (() => {
          const uiStatus = STAFF_API_STATUS_TO_UI[selected.status] || "pending";
          const userDetail = selected.userId ? usersMap[selected.userId] : null;
          const customerName = userDetail
            ? userDetail.fullName
            : selected.userId
              ? "Thành viên (Id đang tải)"
              : "Khách vãng lai";
          const dateObj = new Date(selected.createdAt);
          const dateStr = dateObj.toLocaleDateString("vi-VN");
          const timeStr = dateObj.toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
          });

          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={() => setSelected(null)}
              />
              <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                <div
                  className="px-6 pt-5 pb-4"
                  style={{ backgroundColor: STAFF_STATUS_CFG[uiStatus].bg }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className="text-[10px] font-black tracking-[0.2em] uppercase"
                      style={{ color: STAFF_STATUS_CFG[uiStatus].color }}
                    >
                      Chi tiết đơn hàng
                    </span>
                    <button
                      onClick={() => setSelected(null)}
                      className="w-8 h-8 rounded-xl flex items-center justify-center text-[#9CA3AF] hover:text-[#1A1A2E] hover:bg-white/60 transition-all"
                    >
                      <MdClose className="text-lg" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[#1A1A2E] font-black text-lg font-mono">
                      {formatShortOrderCode(
                        selected.orderNumber || selected.orderId,
                      )}
                    </span>
                    <span
                      className="text-[10px] font-black px-2.5 py-1 rounded-full"
                      style={{
                        color: STAFF_STATUS_CFG[uiStatus].color,
                        backgroundColor:
                          STAFF_STATUS_CFG[uiStatus].color + "28",
                      }}
                    >
                      {STAFF_STATUS_CFG[uiStatus].label}
                    </span>
                  </div>
                  <p className="text-[#1A1A2E] font-black text-3xl leading-none">
                    {formatPrice(selected.grandTotal)}
                  </p>

                  <div className="mt-5 pt-4 border-t border-black/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <p className="text-[9px] font-black text-[#1A1A2E]/50 tracking-[0.15em] mb-0.5 uppercase">
                        Trạng thái Đơn hàng
                      </p>
                      <p className="text-[#1A1A2E]/70 text-[10px] font-bold">
                        Lưu thay đổi tự động
                      </p>
                    </div>

                    <div className="relative w-full sm:w-37.5">
                      <CustomDropdown
                        options={STAFF_BACKEND_STATUSES.filter(sts => {
                          // Staff only allowed to switch to SHIPPING or keep current
                          return sts.value === 'SHIPPING' || sts.value === selected.status;
                        }).map((sts) => ({
                          label: sts.label,
                          value: sts.value,
                        }))}
                        value={selected.status}
                        onChange={handleStatusUpdate}
                        disabled={updatingStatus !== null || selected.status === 'SHIPPING'}
                        buttonClassName="w-full bg-white/60 backdrop-blur-sm border border-white hover:bg-white text-[11px] font-black tracking-wide text-[#1A1A2E] py-2.5 px-3 rounded-2xl cursor-pointer shadow-sm transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-white/40 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-between"
                        chevronClassName="text-[#1A1A2E] text-sm opacity-60 transition-transform"
                        menuClassName="absolute z-30 mt-2 w-full rounded-2xl border border-white bg-white shadow-xl py-1 overflow-hidden"
                        optionClassName="w-full text-left px-3 py-2 text-[11px] font-bold text-[#1A1A2E] hover:bg-[#F4F7FF] transition-colors"
                        activeOptionClassName="w-full text-left px-3 py-2 text-[11px] font-black text-[#17409A] bg-[#17409A]/10"
                        ariaLabel="Cập nhật trạng thái đơn hàng"
                      />
                      {updatingStatus ? (
                        <div className="pointer-events-none absolute inset-y-0 right-8 flex items-center text-[#1A1A2E]">
                          <MdAutorenew className="animate-spin text-sm" />
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className="p-6 flex flex-col gap-4">
                  <div>
                    <p className="text-[9px] font-black tracking-[0.22em] uppercase text-[#9CA3AF] mb-2">
                      Khách hàng
                    </p>
                    <div className="flex items-center gap-3 bg-[#F8F9FF] rounded-2xl p-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-sm shrink-0"
                        style={{
                          backgroundColor:
                            AVATAR_COLORS[
                              customerName.charCodeAt(0) % AVATAR_COLORS.length
                            ],
                        }}
                      >
                        {customerName.charAt(0)}
                      </div>
                      <div>
                        <p className="text-[#1A1A2E] font-bold text-sm">
                          {customerName}
                        </p>
                        <p className="text-[#9CA3AF] text-[11px] font-semibold">
                          {selected.userId ? "Đã đăng ký" : "Guest"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-[9px] font-black tracking-[0.22em] uppercase text-[#9CA3AF] mb-2">
                      Sản phẩm
                    </p>
                    <div className="bg-[#F8F9FF] rounded-2xl p-3 space-y-2 max-h-48 overflow-y-auto">
                      {selected.orderItems && selected.orderItems.length > 0 ? (
                        selected.orderItems.map((item, idx) => {
                          const itemName =
                            item.buildDetails?.buildName ||
                            item.buildDetails?.baseProductName ||
                            item.productionJobs?.[0]?.productName ||
                            item.productNameSnapshot ||
                            item.productName ||
                            "Sản phẩm";
                          const variantLabel = item.variantName?.trim();
                          const lineTotal =
                            item.lineTotal ?? item.unitPrice * item.quantity;

                          return (
                            <div
                              key={
                                item.orderItemId || `${item.variantId}-${idx}`
                              }
                              className="bg-white rounded-xl p-2.5 border border-[#E5E7EB] flex items-start gap-2.5"
                            >
                              <img
                                src={
                                  item.buildDetails?.baseProductImageUrl ||
                                  item.productionJobs?.[0]?.imageUrl ||
                                  item.productImageUrl ||
                                  "/teddy_bear.png"
                                }
                                alt={itemName}
                                className="w-12 h-12 rounded-lg object-cover border border-[#E5E7EB] shrink-0"
                              />
                              <div className="min-w-0">
                                <p className="text-[#1A1A2E] font-bold text-sm leading-tight">
                                  {variantLabel
                                    ? `${itemName} (${variantLabel})`
                                    : itemName}
                                </p>
                                <p className="text-[#6B7280] text-[11px] font-semibold mt-1">
                                  SL: {item.quantity} x{" "}
                                  {formatPrice(item.unitPrice)}
                                </p>
                                <p className="text-[#17409A] text-[11px] font-black mt-0.5">
                                  Thành tiền: {formatPrice(lineTotal)}
                                </p>

                                {item.buildDetails?.personalizationNote && (
                                  <p className="mt-1 text-[10px] text-[#FF8C42] font-semibold italic">
                                    Ghi chú:{" "}
                                    {item.buildDetails.personalizationNote}
                                  </p>
                                )}

                                {item.buildDetails?.buildComponents &&
                                  item.buildDetails.buildComponents.length >
                                    0 && (
                                    <div className="mt-1.5 flex flex-wrap gap-1">
                                      {item.buildDetails.buildComponents.map(
                                        (comp: any, cIdx: number) => (
                                          <span
                                            key={cIdx}
                                            className="px-1.5 py-0.5 rounded bg-white border border-[#E5E7EB] text-[9px] font-bold text-[#4B5563]"
                                          >
                                            {comp.productName ||
                                              comp.variantName ||
                                              "Phụ kiện"}
                                          </span>
                                        ),
                                      )}
                                    </div>
                                  )}
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <p className="text-[#6B7280] font-semibold text-sm">
                          Không có thông tin chi tiết sản phẩm
                        </p>
                      )}
                    </div>
                  </div>

                  {selectedAddress && (
                    <div>
                      <p className="text-[9px] font-black tracking-[0.22em] uppercase text-[#9CA3AF] mb-2">
                        Giao hàng tới
                      </p>
                      <div className="bg-[#F8F9FF] rounded-2xl p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="text-[#1A1A2E] font-bold text-sm">
                              {selectedAddress.fullName}
                            </p>
                            <p className="text-[#9CA3AF] text-xs font-semibold mt-0.5">
                              {selectedAddress.phoneNumber}
                            </p>
                          </div>
                        </div>
                        <div className="w-full h-px bg-[#E5E7EB] my-3" />
                        <p className="text-[#4B5563] text-xs leading-relaxed font-medium">
                          {selectedAddress.state}, {selectedAddress.city}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* GHTK Shipping Section */}
                  {(selected.status === "READY_FOR_PICKUP" || fulfillment) && (
                    <div>
                      <p className="text-[9px] font-black tracking-[0.22em] uppercase text-[#9CA3AF] mb-2">
                        Giao hàng (GHTK)
                      </p>
                      <div className="bg-[#F8F9FF] rounded-2xl p-4">
                        {fulfillment ? (
                          <>
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <p className="text-[#1A1A2E] font-bold text-sm">
                                  Mã vận đơn: {fulfillment.trackingNumber}
                                </p>
                                <p className="text-[#9CA3AF] text-[11px] font-semibold mt-0.5">
                                  Đơn vị: {fulfillment.carrier || "GHTK"}
                                </p>
                              </div>
                              <a
                                href={shippingService.getPrintLabelUrl(fulfillment.trackingNumber || "")}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 bg-white border border-[#E5E7EB] text-[#17409A] px-3 py-1.5 rounded-lg text-[11px] font-black hover:bg-[#F4F7FF] transition-colors"
                              >
                                <MdPrint className="text-sm" />
                                In phiếu gửi
                              </a>
                            </div>

                            {/* Tracking button and data */}
                            {!trackingData ? (
                              <button
                                onClick={handleTrackGhtk}
                                disabled={loadingTracking}
                                className="w-full flex items-center justify-center gap-2 bg-[#17409A] text-white py-2 rounded-xl text-xs font-black hover:bg-[#0f2d70] transition-colors disabled:opacity-50"
                              >
                                <MdLocalShipping className="text-base" />
                                {loadingTracking ? "Đang lấy thông tin..." : "Theo dõi hành trình"}
                              </button>
                            ) : (
                              <div className="mt-3 p-3 bg-white rounded-xl border border-[#E5E7EB]">
                                <p className="text-[#1A1A2E] font-bold text-xs mb-1">
                                  Trạng thái: <span className="text-[#17409A]">{trackingData.order?.status_text || trackingData.message}</span>
                                </p>
                                <p className="text-[#6B7280] text-[10px] font-semibold">
                                  Cập nhật lúc: {trackingData.order?.action_time || "N/A"}
                                </p>
                                {trackingData.order?.reason && (
                                  <p className="text-[#FF8C42] text-[10px] italic mt-1">Lý do: {trackingData.order.reason}</p>
                                )}
                              </div>
                            )}
                          </>
                        ) : (
                          <button
                            onClick={handleSubmitToGhtk}
                            disabled={pushingGhtk}
                            className="w-full flex items-center justify-center gap-2 bg-[#17409A] text-white py-2.5 rounded-xl text-xs font-black hover:bg-[#0f2d70] transition-colors disabled:opacity-50"
                          >
                            {pushingGhtk ? (
                              <MdAutorenew className="animate-spin text-base" />
                            ) : (
                              <MdLocalShipping className="text-base" />
                            )}
                            Đẩy đơn sang GHTK
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <div className="bg-[#F8F9FF] rounded-xl px-4 py-2.5">
                      <p className="text-[9px] font-black tracking-wide text-[#9CA3AF] mb-0.5">
                        NGÀY
                      </p>
                      <p className="text-[#1A1A2E] text-[11px] font-bold">
                        {dateStr}
                      </p>
                    </div>
                    <div className="bg-[#F8F9FF] rounded-xl px-4 py-2.5">
                      <p className="text-[9px] font-black tracking-wide text-[#9CA3AF] mb-0.5">
                        GIỜ
                      </p>
                      <p className="text-[#1A1A2E] text-[11px] font-bold">
                        {timeStr}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
    </>
  );
}
