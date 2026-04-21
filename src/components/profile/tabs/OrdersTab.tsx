"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useOrderApi } from "@/hooks/useOrderApi";
import type { Order, ProductIssueReport } from "@/types";
import { formatShortOrderCode } from "@/utils/order";
import ProductIssueModal from "@/components/orders/ProductIssueModal";
import { productIssueService } from "@/services/productIssue.service";
import { formatDateTime } from "@/utils/date";

const STATUS_STYLE: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  PENDING: { label: "Chờ xử lý", color: "#FF8C42", bg: "#FF8C4218" },
  PAID: { label: "Đã thanh toán", color: "#1D4ED8", bg: "#1D4ED818" },
  CANCELLED: { label: "Đã hủy", color: "#FF6B9D", bg: "#FF6B9D18" },
  PROCESSING: { label: "Đang xử lý", color: "#7C5CFC", bg: "#7C5CFC18" },
  COMPLETED: { label: "Hoàn thành", color: "#4ECDC4", bg: "#4ECDC418" },
  REFUNDED: { label: "Đã hoàn tiền", color: "#6B7280", bg: "#6B728018" },
};

const BILLABLE_STATUSES = new Set(["PAID", "PROCESSING", "COMPLETED"]);

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

  // Issues Modal State
  const [issueModalOpen, setIssueModalOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState("");
  const [selectedItemName, setSelectedItemName] = useState("");
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
      const detail = await getOrderById(order.orderId);
      setOrderDetailsMap((prev) => ({ ...prev, [order.orderId]: detail }));
    } catch {
      // error handled in UI block below
    } finally {
      setDetailLoadingId(null);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between mb-2 flex-wrap gap-3">
        <p className="text-[#1A1A2E] font-black text-xl">Lịch sử đơn hàng</p>
        <div className="flex items-center gap-4 flex-wrap">
          <span className="text-sm font-black" style={{ color: "#4ECDC4" }}>
            Tổng đã chi: {formatMoney(totalSpent, "VND")}
          </span>
          <Link
            href="/products"
            className="text-[#17409A] text-sm font-black hover:underline underline-offset-2"
          >
            Mua thêm →
          </Link>
        </div>
      </div>

      {loading && orders.length === 0 && (
        <div className="bg-[#F8F9FF] rounded-2xl p-6 text-center text-sm text-[#6B7280]">
          Đang tải lịch sử mua hàng...
        </div>
      )}

      {error && orders.length === 0 && (
        <div className="bg-[#FFF1F5] border border-[#FF6B9D33] rounded-2xl p-6 text-sm text-[#C43D6B]">
          Không thể tải lịch sử đơn hàng: {error}
        </div>
      )}

      {!loading && orders.length === 0 && !error && (
        <div className="bg-[#F8F9FF] rounded-2xl p-6 text-center text-sm text-[#6B7280]">
          Bạn chưa có đơn hàng nào.
        </div>
      )}

      {pagedOrders.map((order) => {
        const normalizedStatus = order.status?.toUpperCase() || "";
        const st = STATUS_STYLE[normalizedStatus] ?? {
          label: "Trạng thái không xác định",
          color: "#17409A",
          bg: "#17409A18",
        };
        const firstItem = order.orderItems[0];
        const firstItemName =
          firstItem?.productName ||
          firstItem?.productNameSnapshot ||
          "Sản phẩm không có tên";
        const firstItemImage = firstItem?.productImageUrl || null;

        const detail = orderDetailsMap[order.orderId];
        const isExpanded = expandedOrderId === order.orderId;

        return (
          <div
            key={order.orderId}
            className="bg-[#F8F9FF] rounded-2xl p-5 hover:shadow-md hover:shadow-[#17409A]/5 transition-shadow"
          >
            <div
              className="flex items-center gap-4 cursor-pointer"
              onClick={() => handleToggleDetail(order)}
            >
              <div className="w-16 h-16 rounded-xl bg-[#17409A]/8 flex items-center justify-center shrink-0 overflow-hidden">
                {firstItemImage ? (
                  <img
                    src={firstItemImage}
                    alt={firstItemName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span
                    className="text-sm font-black"
                    style={{ color: "#17409A" }}
                  >
                    #{orders.findIndex((o) => o.orderId === order.orderId) + 1}
                  </span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-[#1A1A2E] font-bold text-base truncate">
                  {formatShortOrderCode(order.orderNumber)}
                </p>
                <p className="text-[#4B5563] text-xs font-semibold mt-0.5 truncate">
                  {firstItemName}
                  {order.orderItems.length > 1
                    ? ` +${order.orderItems.length - 1} sản phẩm khác`
                    : ""}
                </p>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span className="text-[#9CA3AF] text-xs font-semibold">
                    {formatDateTime(order.createdAt)}
                  </span>
                  <span
                    className="text-[10px] font-black px-2.5 py-1 rounded-full"
                    style={{ color: st.color, backgroundColor: st.bg }}
                  >
                    {st.label}
                  </span>
                  <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-[#17409A18] text-[#17409A]">
                    {order.orderItems.length} sản phẩm
                  </span>
                </div>
              </div>

              <div className="text-right shrink-0">
                <p className="text-[#17409A] font-black text-base">
                  {formatMoney(order.grandTotal, order.currency)}
                </p>
                <span className="text-[#9CA3AF] font-semibold text-xs">
                  Nhấn để xem chi tiết
                </span>
              </div>
            </div>

            {isExpanded && (
              <div className="mt-4 pt-4 border-t border-[#E5E7EB] space-y-2">
                {detailLoadingId === order.orderId && (
                  <p className="text-xs text-[#9CA3AF]">
                    Đang tải chi tiết đơn hàng...
                  </p>
                )}

                {!detailLoadingId && detail && (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <p className="text-[#6B7280]">
                        <span className="font-bold text-[#1A1A2E]">
                          Mã đơn:
                        </span>{" "}
                        {formatShortOrderCode(
                          detail.orderNumber || detail.orderId,
                        )}
                      </p>
                      <p className="text-[#6B7280]">
                        <span className="font-bold text-[#1A1A2E]">
                          Ghi chú:
                        </span>{" "}
                        {detail.notes || "-"}
                      </p>
                      <p className="text-[#6B7280]">
                        <span className="font-bold text-[#1A1A2E]">
                          Tạm tính:
                        </span>{" "}
                        {formatMoney(detail.subtotal, detail.currency)}
                      </p>
                      <p className="text-[#6B7280]">
                        <span className="font-bold text-[#1A1A2E]">
                          Phí ship:
                        </span>{" "}
                        {formatMoney(detail.shippingTotal, detail.currency)}
                      </p>
                      <p className="text-[#6B7280]">
                        <span className="font-bold text-[#1A1A2E]">
                          Giảm giá:
                        </span>{" "}
                        {formatMoney(detail.discountTotal, detail.currency)}
                      </p>
                      <p className="text-[#6B7280]">
                        <span className="font-bold text-[#1A1A2E]">
                          Thành tiền:
                        </span>{" "}
                        {formatMoney(detail.grandTotal, detail.currency)}
                      </p>
                    </div>

                    <div className="mt-3">
                      <p className="text-xs font-black text-[#17409A] mb-2">
                        Danh sách sản phẩm
                      </p>
                      {detail.orderItems.length === 0 ? (
                        <p className="text-xs text-[#9CA3AF]">
                          Đơn hàng hiện chưa có item snapshot.
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {detail.orderItems.map((item) => (
                            <div
                              key={item.orderItemId}
                              className="rounded-xl bg-white p-3 border border-[#E5E7EB] flex items-start gap-3"
                            >
                              {item.productImageUrl ? (
                                <img
                                  src={item.productImageUrl}
                                  alt={
                                    item.productName ||
                                    item.productNameSnapshot ||
                                    "Sản phẩm"
                                  }
                                  className="h-14 w-14 rounded-lg object-cover border border-[#E5E7EB] shrink-0"
                                />
                              ) : (
                                <div className="h-14 w-14 rounded-lg bg-[#F3F4F6] border border-[#E5E7EB] shrink-0" />
                              )}
                              <div className="min-w-0 flex-1">
                                <p className="text-xs font-bold text-[#1A1A2E] truncate">
                                  {item.productName ||
                                    item.productNameSnapshot ||
                                    "Sản phẩm không có tên"}
                                </p>
                                <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-[#6B7280]">
                                  <span>SL: {item.quantity}</span>
                                  <span>
                                    Đơn giá:{" "}
                                    {formatMoney(
                                      item.unitPrice,
                                      detail.currency,
                                    )}
                                  </span>
                                  <span>
                                    Line total:{" "}
                                    {formatMoney(
                                      item.lineTotal ??
                                        item.totalPrice ??
                                        item.unitPrice * item.quantity,
                                      detail.currency,
                                    )}
                                  </span>
                                </div>
                                {order.status === "COMPLETED" &&
                                  (reportedItemMap[item.orderItemId] ? (
                                    <div className="mt-2 flex items-center gap-2 text-xs font-black">
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
                                            className={`px-2 py-1 rounded-md text-[10px] ${style}`}
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
                                      className="mt-2 text-[#FF8C42] text-[10px] font-black underline hover:text-[#e07530] transition-colors"
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
                  </>
                )}
              </div>
            )}
          </div>
        );
      })}

      {orders.length > PAGE_SIZE && (
        <div className="mt-2 flex items-center justify-between rounded-2xl bg-[#F8F9FF] p-4 border border-[#E5E7EB]">
          <p className="text-sm font-semibold text-[#6B7280]">
            Trang {currentPage}/{totalPages} • Tổng {orders.length} đơn
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={goPrevPage}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-xl text-sm font-black border border-[#D7DEEF] text-[#17409A] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Trước
            </button>
            <button
              onClick={goNextPage}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-xl text-sm font-black bg-[#17409A] text-white disabled:opacity-40 disabled:cursor-not-allowed"
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
