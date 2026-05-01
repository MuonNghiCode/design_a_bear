"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useOrderApi } from "@/hooks/useOrderApi";
import type { Order, ProductIssueReport } from "@/types";
import { formatShortOrderCode } from "@/utils/order";
import ProductIssueModal from "@/components/orders/ProductIssueModal";
import { productIssueService } from "@/services/productIssue.service";
import { fulfillmentService } from "@/services/fulfillment.service";
import { shippingService } from "@/services/shipping.service";
import { orderService } from "@/services/order.service";
import { formatDateTime } from "@/utils/date";
import type { FulfillmentResponse } from "@/types/responses";
import { MdLocalShipping, MdAutorenew } from "react-icons/md";

const STATUS_STYLE: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  PENDING: { label: "Chờ xử lý", color: "#FF8C42", bg: "#FF8C4215" },
  PAID: { label: "Đã thanh toán", color: "#1D4ED8", bg: "#1D4ED815" },
  CANCELLED: { label: "Đã hủy", color: "#FF6B9D", bg: "#FF6B9D15" },
  PROCESSING: { label: "Đang xử lý", color: "#7C5CFC", bg: "#7C5CFC15" },
  PRINTING: { label: "Đang in", color: "#06B6D4", bg: "#06B6D415" },
  READY_FOR_PICKUP: { label: "Sẵn sàng lấy", color: "#4ECDC4", bg: "#4ECDC415" },
  SHIPPING: { label: "Đang giao", color: "#14B8A6", bg: "#14B8A615" },
  COMPLETED: { label: "Hoàn thành", color: "#4ECDC4", bg: "#4ECDC415" },
  REFUNDED: { label: "Đã hoàn tiền", color: "#6B7280", bg: "#6B728015" },
};

const BILLABLE_STATUSES = new Set(["PAID", "PROCESSING", "PRINTING", "READY_FOR_PICKUP", "SHIPPING", "COMPLETED"]);

function formatMoney(amount: number, currency: string) {
  const locale = currency === "USD" ? "en-US" : "vi-VN";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function OrdersTab() {
  const { user } = useAuth();
  const { loading, error, getOrdersByUserId, getOrderById } = useOrderApi();

  const PAGE_SIZE = 4;
  const [orders, setOrders] = useState<Order[]>([]);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [orderDetailsMap, setOrderDetailsMap] = useState<Record<string, Order>>(
    {},
  );
  const [detailLoadingId, setDetailLoadingId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [fulfillmentMap, setFulfillmentMap] = useState<Record<string, FulfillmentResponse | null>>({});
  const [trackingDataMap, setTrackingDataMap] = useState<Record<string, any>>({});
  const [trackingLoadingMap, setTrackingLoadingMap] = useState<Record<string, boolean>>({});

  // Issues Modal State
  const [issueModalOpen, setIssueModalOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState("");
  const [selectedItemName, setSelectedItemName] = useState("");
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [reportedItemMap, setReportedItemMap] = useState<
    Record<string, ProductIssueReport>
  >({});

  useEffect(() => {
    const loadOrders = async () => {
      if (!user?.id) return;
      try {
        const data = await getOrdersByUserId(user.id);
        const sorted = [...data].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        setOrders(sorted);
      } catch {
        // error state handled by hook + UI
      }
    };

    loadOrders();
  }, [user?.id, getOrdersByUserId]);

  useEffect(() => {
    const loadIssues = async () => {
      if (!user?.id) return;
      try {
        const res = await productIssueService.getMyIssues({
          pageIndex: 1,
          pageSize: 200,
        });
        if (res.isSuccess && res.value) {
          const data = Array.isArray(res.value)
            ? res.value
            : (res.value as any).items || [];
          const map: Record<string, ProductIssueReport> = {};
          data.forEach((issue: ProductIssueReport) => {
            map[issue.orderItemId] = issue;
          });
          setReportedItemMap(map);
        }
      } catch (e) {
        // ignore
      }
    };
    loadIssues();
  }, [user?.id]);

  const totalSpent = useMemo(
    () =>
      orders
        .filter((o) => BILLABLE_STATUSES.has(o.status?.toUpperCase()))
        .reduce((sum, o) => sum + o.grandTotal, 0),
    [orders],
  );

  const totalPages = Math.max(1, Math.ceil(orders.length / PAGE_SIZE));

  const pagedOrders = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return orders.slice(start, start + PAGE_SIZE);
  }, [orders, currentPage]);

  const goPrevPage = () => {
    setExpandedOrderId(null);
    setCurrentPage((p) => Math.max(1, p - 1));
  };

  const goNextPage = () => {
    setExpandedOrderId(null);
    setCurrentPage((p) => Math.min(totalPages, p + 1));
  };

  const handleToggleDetail = async (order: Order) => {
    if (expandedOrderId === order.orderId) {
      setExpandedOrderId(null);
      return;
    }

    setExpandedOrderId(order.orderId);

    if (orderDetailsMap[order.orderId]) return;

    setDetailLoadingId(order.orderId);
    try {
      const orderAction = getOrderById(order.orderId);
      const fulfillmentAction = fulfillmentService.getByOrderId(order.orderId);

      const [detail, fulfillmentRes] = await Promise.all([orderAction, fulfillmentAction]);
      
      setOrderDetailsMap((prev) => ({ ...prev, [order.orderId]: detail }));
      
      if (fulfillmentRes.isSuccess && fulfillmentRes.value && fulfillmentRes.value.length > 0) {
        setFulfillmentMap((prev) => ({ ...prev, [order.orderId]: fulfillmentRes.value[0] }));
      } else {
        setFulfillmentMap((prev) => ({ ...prev, [order.orderId]: null }));
      }
    } catch {
      // error handled in UI block below
    } finally {
      setDetailLoadingId(null);
    }
  };

  const handleTrackGhtk = async (orderId: string, trackingNumber: string) => {
    setTrackingLoadingMap((prev) => ({ ...prev, [orderId]: true }));
    try {
      const res = await shippingService.getTrackingStatus(trackingNumber);
      if (res.isSuccess && res.value) {
        setTrackingDataMap((prev) => ({ ...prev, [orderId]: res.value }));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setTrackingLoadingMap((prev) => ({ ...prev, [orderId]: false }));
    }
  };

  const handleConfirmReceived = async (orderId: string) => {
    setConfirmingId(orderId);
    try {
      const res = await orderService.updateOrderStatus(orderId, {
        status: "COMPLETED",
        notes: "Khách hàng xác nhận đã nhận hàng",
      });
      if (res.isSuccess) {
        setOrders(orders.map(o => o.orderId === orderId ? { ...o, status: "COMPLETED" } : o));
        if (orderDetailsMap[orderId]) {
          setOrderDetailsMap((prev) => ({
            ...prev,
            [orderId]: { ...prev[orderId], status: "COMPLETED" }
          }));
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setConfirmingId(null);
    }
  };

  const getPipelineSteps = (order: Order) => {
    const status = order.status?.toUpperCase();
    return [
      { label: "Chờ duyệt", completed: true },
      { label: "Chế tác", active: ["PROCESSING", "PRINTING"].includes(status), completed: ["READY_FOR_PICKUP", "SHIPPING", "COMPLETED"].includes(status) },
      { label: "Kiểm định", active: status === "READY_FOR_PICKUP", completed: ["SHIPPING", "COMPLETED"].includes(status) },
      { label: "Đang giao", active: status === "SHIPPING", completed: status === "COMPLETED" },
      { label: "Hoàn thành", active: status === "COMPLETED", completed: status === "COMPLETED" },
    ];
  };

  return (
    <div className="flex flex-col gap-6" style={{ fontFamily: "'Nunito', sans-serif" }}>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
        <div>
          <p className="text-[#1A1A2E] font-black text-2xl tracking-tight">Lịch sử đơn hàng</p>
          <p className="text-slate-400 font-medium text-xs mt-0.5">Theo dõi chi tiết các đơn hàng của bạn</p>
        </div>
        <div className="flex items-center gap-6 flex-wrap">
          <div className="bg-[#17409A]/5 border border-[#17409A]/10 px-5 py-2.5 rounded-2xl">
            <span className="text-xs font-black text-[#1A1A2E]/50 uppercase tracking-wider block mb-0.5">Tổng đã chi</span>
            <span className="text-lg font-black text-[#17409A]">
              {formatMoney(totalSpent, "VND")}
            </span>
          </div>
          <Link
            href="/products"
            className="text-[#17409A] bg-[#F4F7FF] px-5 py-3 rounded-2xl text-xs font-black hover:bg-[#17409A] hover:text-white transition-all tracking-wider uppercase shadow-sm"
          >
            Mua thêm →
          </Link>
        </div>
      </div>

      {loading && orders.length === 0 && (
        <div className="bg-[#F8F9FF] rounded-3xl p-12 text-center text-sm font-semibold text-[#6B7280]">
          Đang tải lịch sử mua hàng...
        </div>
      )}

      {error && orders.length === 0 && (
        <div className="bg-[#FFF1F5] border border-[#FF6B9D33] rounded-3xl p-8 text-sm font-semibold text-[#C43D6B]">
          Không thể tải lịch sử đơn hàng: {error}
        </div>
      )}

      {!loading && orders.length === 0 && !error && (
        <div className="bg-[#F8F9FF] rounded-3xl p-12 text-center text-sm font-semibold text-[#6B7280]">
          Bạn chưa có đơn hàng nào.
        </div>
      )}

      <div className="flex flex-col gap-5">
        {pagedOrders.map((order) => {
          const normalizedStatus = order.status?.toUpperCase() || "";
          const st = STATUS_STYLE[normalizedStatus] ?? {
            label: "Trạng thái không xác định",
            color: "#17409A",
            bg: "#17409A15",
          };
          const firstItem = order.orderItems[0];

          const firstItemName =
            firstItem?.buildDetails?.buildName ||
            firstItem?.buildDetails?.baseProductName ||
            firstItem?.productionJobs?.[0]?.productName ||
            firstItem?.productNameSnapshot ||
            firstItem?.productName ||
            "Sản phẩm không có tên";

          const firstItemImage =
            firstItem?.buildDetails?.baseProductImageUrl ||
            firstItem?.productionJobs?.[0]?.imageUrl ||
            firstItem?.productImageUrl ||
            null;

          const detail = orderDetailsMap[order.orderId];
          const isExpanded = expandedOrderId === order.orderId;

          return (
            <div
              key={order.orderId}
              className={`bg-white rounded-3xl p-6 md:p-7 border border-slate-100 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 ${isExpanded ? "ring-2 ring-[#17409A]/15 shadow-xl bg-slate-50/20" : ""}`}
            >
              <div
                className="flex flex-col md:flex-row md:items-center justify-between gap-6 cursor-pointer"
                onClick={() => handleToggleDetail(order)}
              >
                <div className="flex items-center gap-5 flex-1 min-w-0">
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-[#F4F7FF] flex items-center justify-center shrink-0 overflow-hidden border border-slate-50 relative group shadow-inner">
                    {firstItemImage ? (
                      <img
                        src={firstItemImage}
                        alt={firstItemName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <span className="text-lg font-black text-[#17409A]">
                        #{orders.findIndex((o) => o.orderId === order.orderId) + 1}
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-[#1A1A2E] font-black text-lg md:text-xl leading-snug tracking-tight hover:text-[#17409A] transition-colors">
                      {formatShortOrderCode(order.orderNumber)}
                    </p>
                    <p className="text-slate-500 text-xs md:text-sm font-bold mt-1 max-w-md truncate">
                      {firstItemName}
                      {order.orderItems.length > 1
                        ? ` +${order.orderItems.length - 1} sản phẩm khác`
                        : ""}
                    </p>
                    <div className="flex items-center gap-2 mt-2.5 flex-wrap">
                      <span className="text-[#9CA3AF] text-xs font-bold">
                        {formatDateTime(order.createdAt)}
                      </span>
                      <span
                        className="text-[10px] font-black px-3.5 py-1.5 rounded-full uppercase tracking-wider shadow-sm"
                        style={{ color: st.color, backgroundColor: st.bg }}
                      >
                        {st.label}
                      </span>
                      <span className="text-[10px] font-black px-3.5 py-1.5 rounded-full bg-[#17409A10] text-[#17409A] uppercase tracking-wider">
                        {order.orderItems.length} sản phẩm
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-left md:text-right shrink-0 flex flex-col justify-between h-full md:items-end">
                  <p className="text-[#17409A] font-black text-xl md:text-2xl tracking-tight">
                    {formatMoney(order.grandTotal, order.currency)}
                  </p>
                  <span className="text-slate-400 font-bold text-xs mt-1 md:mt-0 flex items-center gap-1 group">
                    Xem chi tiết đơn hàng
                    <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                  </span>
                </div>
              </div>

              {isExpanded && (
                <div className="mt-6 pt-6 border-t border-slate-100 space-y-6 animate-in slide-in-from-top-2 duration-300">
                  {detailLoadingId === order.orderId && (
                    <p className="text-xs text-[#9CA3AF] font-bold">
                      Đang tải chi tiết đơn hàng...
                    </p>
                  )}

                  {!detailLoadingId && detail && (
                    <>
                      {/* Financial info card */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#F8F9FF] p-6 rounded-3xl border border-slate-100 text-xs">
                        <div className="space-y-2.5">
                          <p className="text-[#6B7280]">
                            <span className="font-black text-[#1A1A2E] text-xs block mb-0.5">
                              Mã đơn hàng
                            </span>
                            <span className="text-sm font-bold text-slate-700">
                              {formatShortOrderCode(detail.orderNumber || detail.orderId)}
                            </span>
                          </p>
                          <p className="text-[#6B7280]">
                            <span className="font-black text-[#1A1A2E] text-xs block mb-0.5">
                              Ghi chú đơn hàng
                            </span>
                            <span className="text-slate-600 font-semibold italic text-sm">
                              {detail.notes || "Không có ghi chú"}
                            </span>
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 border-t md:border-t-0 md:border-l border-slate-200/50 pt-2.5 md:pt-0 md:pl-4">
                          <p className="text-[#6B7280] flex justify-between">
                            <span className="font-bold text-[#1A1A2E]">Tạm tính:</span>
                            <span className="font-semibold text-slate-600">
                              {formatMoney(detail.subtotal, detail.currency)}
                            </span>
                          </p>
                          <p className="text-[#6B7280] flex justify-between">
                            <span className="font-bold text-[#1A1A2E]">Phí ship:</span>
                            <span className="font-semibold text-slate-600">
                              {formatMoney(detail.shippingTotal, detail.currency)}
                            </span>
                          </p>
                          <p className="text-[#6B7280] flex justify-between">
                            <span className="font-bold text-[#1A1A2E]">Giảm giá:</span>
                            <span className="font-semibold text-slate-600">
                              {formatMoney(detail.discountTotal, detail.currency)}
                            </span>
                          </p>
                          <p className="text-[#17409A] flex justify-between font-black text-sm border-t border-slate-200/60 pt-1 mt-1 col-span-2">
                            <span>Thành tiền:</span>
                            <span>
                              {formatMoney(detail.grandTotal, detail.currency)}
                            </span>
                          </p>
                        </div>
                      </div>

                      {/* Timeline */}
                      <div className="bg-white rounded-3xl p-6 border border-slate-50 shadow-sm">
                        <div className="flex items-center justify-between relative">
                          {getPipelineSteps(detail).map((step, idx, arr) => (
                            <div key={idx} className="flex flex-col items-center relative z-10 flex-1">
                              <div
                                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all duration-300 shadow-sm ${
                                  step.completed ? "bg-[#4ECDC4] text-white" : step.active ? "bg-[#17409A] text-white animate-pulse" : "bg-slate-100 text-slate-400"
                                }`}
                              >
                                {step.completed ? "✓" : idx + 1}
                              </div>
                              <span className={`text-[10px] md:text-xs font-black mt-2 whitespace-nowrap tracking-wide ${step.active ? "text-[#17409A]" : "text-slate-500"}`}>
                                {step.label}
                              </span>
                              {idx < arr.length - 1 && (
                                <div className="absolute left-1/2 top-3.5 w-full h-[2.5px] bg-slate-100 -z-10">
                                  <div
                                    className="h-full bg-[#4ECDC4] transition-all duration-500"
                                    style={{ width: step.completed ? "100%" : "0%" }}
                                  />
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Item Details */}
                      <div>
                        <p className="text-sm font-black text-[#17409A] uppercase tracking-wider mb-3">
                          Danh sách sản phẩm
                        </p>
                        {detail.orderItems.length === 0 ? (
                          <p className="text-xs text-[#9CA3AF]">
                            Đơn hàng hiện chưa có item snapshot.
                          </p>
                        ) : (
                          <div className="space-y-3">
                            {detail.orderItems.map((item) => (
                              <div
                                key={item.orderItemId}
                                className="rounded-3xl bg-[#F8F9FF] p-4 md:p-5 border border-slate-50 flex items-start gap-4 hover:shadow-md transition-all duration-200"
                              >
                                {item.buildDetails?.baseProductImageUrl ||
                                item.productionJobs?.[0]?.imageUrl ||
                                item.productImageUrl ? (
                                  <img
                                    src={
                                      item.buildDetails?.baseProductImageUrl ||
                                      item.productionJobs?.[0]?.imageUrl ||
                                      item.productImageUrl ||
                                      ""
                                    }
                                    alt={
                                      item.buildDetails?.buildName ||
                                      item.buildDetails?.baseProductName ||
                                      item.productName ||
                                      item.productNameSnapshot ||
                                      "Sản phẩm"
                                    }
                                    className="h-16 w-16 md:h-20 md:w-20 rounded-2xl object-cover border border-slate-100 shrink-0 shadow-sm"
                                  />
                                ) : (
                                  <div className="h-16 w-16 md:h-20 md:w-20 rounded-2xl bg-[#F3F4F6] border border-slate-100 shrink-0 shadow-sm" />
                                )}
                                <div className="min-w-0 flex-1">
                                  <p className="text-sm md:text-base font-black text-[#1A1A2E] leading-snug">
                                    {item.buildDetails?.buildName ||
                                      item.buildDetails?.baseProductName ||
                                      item.productionJobs?.[0]?.productName ||
                                      item.productNameSnapshot ||
                                      item.productName ||
                                      "Sản phẩm không có tên"}
                                  </p>
                                  <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 font-bold">
                                    <span>SL: <span className="text-[#1A1A2E]">{item.quantity}</span></span>
                                    <span>
                                      Đơn giá:{" "}
                                      <span className="text-[#1A1A2E]">
                                        {formatMoney(item.unitPrice, detail.currency)}
                                      </span>
                                    </span>
                                    <span>
                                      Thành tiền:{" "}
                                      <span className="text-[#17409A]">
                                        {formatMoney(
                                          item.lineTotal ??
                                            item.totalPrice ??
                                            item.unitPrice * item.quantity,
                                          detail.currency,
                                        )}
                                      </span>
                                    </span>
                                  </div>

                                  {item.buildDetails?.personalizationNote && (
                                    <p className="mt-2 text-xs text-[#FF8C42] font-bold italic leading-relaxed">
                                      Ghi chú cá nhân hóa:{" "}
                                      {item.buildDetails.personalizationNote}
                                    </p>
                                  )}

                                  {item.buildDetails?.buildComponents &&
                                    item.buildDetails.buildComponents.length >
                                      0 && (
                                      <div className="mt-3 flex flex-wrap gap-1.5">
                                        {item.buildDetails.buildComponents.map(
                                          (comp: any, cIdx: number) => (
                                            <span
                                              key={cIdx}
                                              className="px-2.5 py-1 rounded-xl bg-white text-[10px] font-bold text-slate-600 border border-slate-200/60 shadow-sm"
                                            >
                                              {comp.productName ||
                                                comp.variantName ||
                                                "Phụ kiện"}
                                            </span>
                                          ),
                                        )}
                                      </div>
                                    )}

                                  {order.status === "COMPLETED" &&
                                    (reportedItemMap[item.orderItemId] ? (
                                      <div className="mt-3 flex items-center gap-2 text-xs font-black">
                                        <span className="text-[#9CA3AF]">
                                          Bảo hành:
                                        </span>
                                        {(() => {
                                          const status =
                                            reportedItemMap[item.orderItemId]
                                              .status;
                                          let style =
                                            "bg-[#FF8C42]/20 text-[#FF8C42]";
                                          let label = "Chờ tiếp nhận";

                                          if (status === "CLOSED") {
                                            style =
                                              "bg-[#4ECDC4]/20 text-[#4ECDC4]";
                                            label = "Đã đóng";
                                          } else if (status === "RESOLVED") {
                                            style =
                                              "bg-[#1D4ED8]/20 text-[#1D4ED8]";
                                            label = "Đã có hướng xử lý";
                                          } else if (status === "REJECTED") {
                                            style = "bg-red-100 text-red-600";
                                            label = "Từ chối";
                                          } else if (status === "PROCESSING") {
                                            style =
                                              "bg-[#7C5CFC]/20 text-[#7C5CFC]";
                                            label = "Đang xử lý";
                                          }

                                          return (
                                            <span
                                              className={`px-3 py-1 rounded-xl text-[10px] ${style}`}
                                            >
                                              {label}
                                            </span>
                                          );
                                        })()}
                                      </div>
                                    ) : (
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setSelectedItemId(item.orderItemId);
                                          setSelectedItemName(
                                            item.productName ||
                                              item.productNameSnapshot ||
                                              "Sản phẩm",
                                          );
                                          setIssueModalOpen(true);
                                        }}
                                        className="mt-3 text-[#FF8C42] text-[11px] font-black underline hover:text-[#e07530] transition-colors"
                                      >
                                        Yêu cầu bảo hành / Báo lỗi
                                      </button>
                                    ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Fulfillment Section for User */}
                      {fulfillmentMap[order.orderId] && (
                        <div className="mt-4 pt-4 border-t border-slate-100">
                          <p className="text-sm font-black text-[#17409A] uppercase tracking-wider mb-3">
                            Thông tin giao hàng
                          </p>
                          <div className="bg-[#F8F9FF] rounded-3xl p-5 border border-slate-100">
                            <p className="text-[#1A1A2E] text-sm font-black mb-1">
                              Mã vận đơn: {fulfillmentMap[order.orderId]?.trackingNumber}
                            </p>
                            <p className="text-[#6B7280] text-xs font-bold mb-4">
                              Đơn vị vận chuyển: {fulfillmentMap[order.orderId]?.carrier || "GHTK"}
                            </p>

                            {!trackingDataMap[order.orderId] ? (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleTrackGhtk(order.orderId, fulfillmentMap[order.orderId]?.trackingNumber || "");
                                }}
                                disabled={trackingLoadingMap[order.orderId]}
                                className="flex items-center gap-2 bg-white border border-[#17409A] text-[#17409A] px-4 py-2.5 rounded-2xl text-xs font-black hover:bg-[#17409A] hover:text-white transition-all disabled:opacity-50 hover:-translate-y-0.5 shadow-sm"
                              >
                                {trackingLoadingMap[order.orderId] ? (
                                  <MdAutorenew className="animate-spin text-base" />
                                ) : (
                                  <MdLocalShipping className="text-base" />
                                )}
                                Theo dõi đơn hàng
                              </button>
                            ) : (
                              <div className="mt-3 p-3 bg-white rounded-2xl border border-slate-100">
                                <p className="text-[#1A1A2E] font-black text-xs mb-1">
                                  Trạng thái: <span className="text-[#17409A]">{trackingDataMap[order.orderId].order?.status_text || trackingDataMap[order.orderId].message}</span>
                                </p>
                                <p className="text-[#6B7280] text-[11px] font-bold">
                                  Cập nhật lúc: {trackingDataMap[order.orderId].order?.action_time || "N/A"}
                                </p>
                                {trackingDataMap[order.orderId].order?.reason && (
                                  <p className="text-[#FF8C42] text-[11px] font-bold italic mt-1.5">
                                    Ghi chú: {trackingDataMap[order.orderId].order.reason}
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Confirmation Button for User */}
                      {order.status === "SHIPPING" && (
                        <div className="mt-6">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleConfirmReceived(order.orderId);
                            }}
                            disabled={confirmingId === order.orderId}
                            className="w-full bg-[#4ECDC4] hover:bg-[#3db8af] text-white font-black py-4 rounded-2xl text-sm shadow-xl shadow-[#4ECDC4]/20 transition-all active:scale-[0.98] disabled:opacity-50 hover:-translate-y-0.5"
                          >
                            {confirmingId === order.orderId ? (
                              <MdAutorenew className="animate-spin inline mr-2 text-lg" />
                            ) : null}
                            Đã nhận được hàng
                          </button>
                          <p className="text-center text-[11px] text-[#9CA3AF] font-bold mt-2.5 tracking-wide">
                            * Vui lòng chỉ xác nhận sau khi đã kiểm tra kỹ sản phẩm
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {orders.length > PAGE_SIZE && (
        <div className="mt-4 flex items-center justify-between rounded-3xl bg-[#F8F9FF] p-5 border border-slate-100">
          <p className="text-xs md:text-sm font-bold text-[#6B7280]">
            Trang {currentPage}/{totalPages} • Tổng {orders.length} đơn
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={goPrevPage}
              disabled={currentPage === 1}
              className="px-5 py-2.5 rounded-2xl text-xs font-black border border-[#D7DEEF] text-[#17409A] disabled:opacity-40 disabled:cursor-not-allowed bg-white hover:bg-slate-50 transition-all shadow-sm"
            >
              Trước
            </button>
            <button
              onClick={goNextPage}
              disabled={currentPage === totalPages}
              className="px-5 py-2.5 rounded-2xl text-xs font-black bg-[#17409A] text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#12317A] transition-all shadow-md"
            >
              Sau
            </button>
          </div>
        </div>
      )}

      <ProductIssueModal
        isOpen={issueModalOpen}
        onClose={() => setIssueModalOpen(false)}
        orderItemId={selectedItemId}
        productName={selectedItemName}
        onSuccess={() => {
          setReportedItemMap((prev) => ({
            ...prev,
            [selectedItemId]: {
              status: "PENDING",
              orderItemId: selectedItemId,
            } as ProductIssueReport,
          }));
        }}
      />
    </div>
  );
}
