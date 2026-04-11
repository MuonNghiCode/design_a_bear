"use client";

import { useState, useMemo, useEffect } from "react";
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
import { useToast } from "@/contexts/ToastContext";
import CustomDropdown from "@/components/shared/CustomDropdown";
import type { OrderListItem, AddressDetail } from "@/types";
import { formatShortOrderCode } from "@/utils/order";

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
  const { data, loading, fetchOrders, usersMap } = useAdminOrdersApi();
  const [tab, setTab] = useState<StaffOrderStatus | "all">("all");
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 350);
  const [selected, setSelected] = useState<OrderListItem | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<AddressDetail | null>(
    null,
  );
  const [loadingDetails, setLoadingDetails] = useState<string | null>(null);
  const [pageIndex, setPageIndex] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const pageSize = 10;

  const handleViewDetails = async (
    orderId: string,
    shippingAddressId?: string | null,
  ) => {
    try {
      setLoadingDetails(orderId);
      setSelectedAddress(null);

      const orderAction = orderService.getOrderById(orderId);
      const addressAction = shippingAddressId
        ? addressService.getAddressById(shippingAddressId)
        : Promise.resolve(null);

      const [res, addressRes] = await Promise.all([orderAction, addressAction]);

      if (res.isSuccess && res.value) {
        setSelected(res.value);
      } else {
        const localData = data?.items.find((o) => o.orderId === orderId);
        if (localData) setSelected(localData);
      }

      if (addressRes?.isSuccess && addressRes.value) {
        setSelectedAddress(addressRes.value);
      }
    } catch (e) {
      const localData = data?.items.find((o) => o.orderId === orderId);
      if (localData) setSelected(localData);
    } finally {
      setLoadingDetails(null);
    }
  };

  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const { success, error: toastError } = useToast();

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
      <div className="bg-white rounded-3xl p-6">
        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div>
            <p className="text-[#9CA3AF] text-[10px] font-black tracking-[0.22em] uppercase mb-0.5">
              Danh sách
            </p>
            <p className="text-[#1A1A2E] font-black text-xl">Tất cả đơn hàng</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] text-base pointer-events-none" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm đơn, khách hàng..."
                className="bg-[#F4F7FF] text-[#1A1A2E] text-sm font-semibold placeholder:text-[#9CA3AF] rounded-xl pl-9 pr-4 py-2.5 outline-none border-2 border-transparent focus:border-[#17409A]/20 transition-colors w-52"
              />
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshing || loading}
              className="bg-[#17409A] hover:bg-[#17409A]/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-sm rounded-xl px-4 py-2.5 flex items-center gap-2 transition-all duration-200 shadow-sm hover:shadow-md"
              title="Làm mới dữ liệu"
            >
              <MdAutorenew className={`text-base ${refreshing ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Làm mới</span>
            </button>
          </div>
        </div>

        {/* ── Status filter tabs ── */}
        <div className="flex gap-1.5 flex-wrap mb-5 pb-1">
          {STAFF_TABS.map(({ key, label }) => {
            const active = tab === key;
            const cfg =
              key !== "all" ? STAFF_STATUS_CFG[key as StaffOrderStatus] : null;
            return (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black transition-all duration-200 ${
                  active
                    ? "bg-[#17409A] text-white shadow-sm"
                    : "bg-[#F4F7FF] text-[#6B7280] hover:bg-[#E8EEF9]"
                }`}
              >
                {label}
                <span
                  className={`text-[9px] font-black px-1.5 py-0.5 rounded-full min-w-4.5 text-center transition-all ${
                    active ? "bg-white/20 text-white" : ""
                  }`}
                  style={
                    !active && cfg
                      ? { color: cfg.color, backgroundColor: cfg.bg }
                      : !active
                        ? { color: "#9CA3AF", backgroundColor: "#F4F7FF" }
                        : undefined
                  }
                >
                  {counts[key] ?? 0}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── Table ── */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-170">
            <thead>
              <tr>
                {COL_HEADS.map((h, i) => (
                  <th
                    key={i}
                    className="text-left text-[9px] font-black text-[#9CA3AF] tracking-[0.2em] uppercase pb-3 pr-4 whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading && filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-6 text-sm text-[#9CA3AF]"
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
                      ? "Thành viên (Id đang tải)"
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
                      className="group border-t border-[#F4F7FF] hover:bg-[#F8F9FF] transition-colors duration-150 cursor-pointer"
                    >
                      <td className="py-3 pr-4">
                        <span className="text-[11px] font-black text-[#17409A] bg-[#17409A]/8 px-2.5 py-1 rounded-lg tracking-wide font-mono">
                          {formatShortOrderCode(
                            order.orderNumber || order.orderId,
                          )}
                        </span>
                      </td>

                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-white font-black text-xs group-hover:scale-105 transition-transform duration-200"
                            style={{ backgroundColor: avatarColor }}
                          >
                            {avatarChar}
                          </div>
                          <div>
                            <p className="text-[#1A1A2E] font-bold text-sm leading-tight">
                              {customerName}
                            </p>
                            <p className="text-[#9CA3AF] text-[10px] font-semibold leading-tight">
                              {order.userId ? "Đã đăng ký" : "Khách mới"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 pr-4">
                        <p className="text-[#1A1A2E] font-semibold text-sm leading-tight">
                          {order.orderItems && order.orderItems.length > 0
                            ? `${order.orderItems.length} sản phẩm`
                            : "Không có SP"}
                        </p>
                      </td>

                      <td className="py-3 pr-4 whitespace-nowrap">
                        <div className="text-[#17409A] font-black text-sm">
                          {formatPrice(order.grandTotal)}
                        </div>
                      </td>

                      <td className="py-3 pr-4">
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

                      <td className="py-3 pr-4">
                        <p className="text-[#4B5563] font-semibold text-[11px] leading-tight">
                          {dateStr}
                        </p>
                        <p className="text-[#9CA3AF] text-[10px] font-semibold leading-tight">
                          {timeStr}
                        </p>
                      </td>

                      <td className="py-3">
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
            <div className="flex flex-col items-center py-12 text-center">
              <GiPawPrint
                className="text-[#E5E7EB] mb-3"
                style={{ fontSize: 52 }}
              />
              <p className="text-[#9CA3AF] font-black text-sm">
                Không có đơn hàng phù hợp
              </p>
              <p className="text-[#9CA3AF] text-[11px] font-semibold mt-1">
                Thử thay đổi bộ lọc hoặc từ khoá tìm kiếm
              </p>
            </div>
          )}
        </div>

        {filtered.length > 0 && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#F4F7FF]">
            <p className="text-[#9CA3AF] text-[11px] font-semibold">
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
                    className={`w-7 h-7 rounded-lg text-[11px] font-black transition-colors ${
                      p === pageIndex
                        ? "bg-[#17409A] text-white"
                        : "text-[#9CA3AF] hover:bg-[#F4F7FF]"
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
                        options={STAFF_BACKEND_STATUSES.map((sts) => ({
                          label: sts.label,
                          value: sts.value,
                        }))}
                        value={selected.status}
                        onChange={handleStatusUpdate}
                        disabled={updatingStatus !== null}
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
                    <div className="bg-[#F8F9FF] rounded-2xl p-3">
                      <p className="text-[#1A1A2E] font-bold text-sm">
                        {selected.orderItems && selected.orderItems.length > 0
                          ? `${selected.orderItems.length} sản phẩm`
                          : "Không có thông tin chi tiết sp"}
                      </p>
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
