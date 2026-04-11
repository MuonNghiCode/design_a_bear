"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  IoCheckmarkCircle,
  IoCloseCircle,
  IoReceiptOutline,
  IoCashOutline,
  IoHomeOutline,
  IoBagHandleOutline,
  IoShieldCheckmarkOutline,
  IoTimeOutline,
} from "react-icons/io5";
import { paymentService } from "@/services/payment.service";
import { orderService } from "@/services/order.service";
import { useCart } from "@/contexts/CartContext";
import { STORAGE_KEYS } from "@/constants";
import { formatShortOrderCode } from "@/utils/order";
import { PawPrint } from "@/components/checkout/checkout.atoms";

type PendingPaymentData = {
  orderDetails?: {
    orderId?: string;
    orderNumber?: string;
    grandTotal?: number;
  };
  orderCode?: string | null;
  finalTotal?: number;
  createdAt?: string;
};

function formatVnd(value: number) {
  return `${value.toLocaleString("vi-VN")} đ`;
}

export default function PaymentSuccessClient() {
  const searchParams = useSearchParams();
  const { clearCart } = useCart();

  const [loading, setLoading] = useState(true);
  const [isPaid, setIsPaid] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [orderCode, setOrderCode] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [amount, setAmount] = useState(0);

  const status = searchParams.get("status") || "";
  const cancel = searchParams.get("cancel") || "false";
  const orderCodeFromQuery =
    searchParams.get("orderCode") ||
    searchParams.get("code") ||
    searchParams.get("paymentCode") ||
    "";

  useEffect(() => {
    const run = async () => {
      try {
        const rawPending = localStorage.getItem(
          STORAGE_KEYS.PENDING_PAYMENT_ORDER,
        );
        const pending: PendingPaymentData | null = rawPending
          ? JSON.parse(rawPending)
          : null;

        if (pending) {
          setOrderNumber(
            pending.orderDetails?.orderNumber ||
              pending.orderDetails?.orderId ||
              "",
          );
          setAmount(
            pending.finalTotal || pending.orderDetails?.grandTotal || 0,
          );
          setOrderCode(orderCodeFromQuery || pending.orderCode || "");
        } else {
          setOrderCode(orderCodeFromQuery);
        }

        if (cancel === "true") {
          if (pending?.orderDetails?.orderId) {
            await orderService.updateOrderStatus(pending.orderDetails.orderId, {
              status: "CANCELLED",
              notes: "Khách hàng hủy thanh toán",
            });
          }
          setIsPaid(false);
          setErrorText("Bạn đã hủy thanh toán.");
          localStorage.removeItem(STORAGE_KEYS.PENDING_PAYMENT_ORDER);
          return;
        }

        if (status && status.toUpperCase() !== "PAID") {
          if (pending?.orderDetails?.orderId) {
            await orderService.updateOrderStatus(pending.orderDetails.orderId, {
              status: "CANCELLED",
              notes: `Thanh toán thất bại với trạng thái: ${status}`,
            });
          }
          setIsPaid(false);
          setErrorText(`Trạng thái thanh toán: ${status}`);
          localStorage.removeItem(STORAGE_KEYS.PENDING_PAYMENT_ORDER);
          return;
        }

        if (!orderCodeFromQuery && !pending?.orderCode) {
          setIsPaid(false);
          setErrorText("Không tìm thấy mã giao dịch để xác nhận.");
          return;
        }

        const codeToConfirm = orderCodeFromQuery || pending?.orderCode || "";
        const confirmRes = await paymentService.confirmPayment(codeToConfirm);

        if (!confirmRes.isSuccess) {
          throw new Error(
            confirmRes.error?.description || "Xác nhận thanh toán thất bại",
          );
        }

        setIsPaid(true);
        await clearCart();
        localStorage.removeItem(STORAGE_KEYS.PENDING_PAYMENT_ORDER);
      } catch (error: any) {
        setIsPaid(false);
        setErrorText(error.message || "Có lỗi khi xác nhận thanh toán");
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [status, cancel, orderCodeFromQuery, clearCart]);

  const title = useMemo(() => {
    if (loading) return "Đang xác nhận thanh toán";
    if (isPaid) return "Thanh toán thành công";
    return "Thanh toán chưa hoàn tất";
  }, [loading, isPaid]);

  const paymentStatusLabel = useMemo(() => {
    if (loading) return "ĐANG XÁC NHẬN";
    return isPaid ? "ĐÃ THANH TOÁN" : "CHƯA THANH TOÁN";
  }, [loading, isPaid]);

  return (
    <div className="max-w-5xl mx-auto px-5 sm:px-8 lg:px-12">
      <div
        className="relative overflow-hidden rounded-3xl p-6 sm:p-8 lg:p-10 shadow-lg"
        style={{ backgroundColor: "#FFFFFF", border: "1px solid #E5E7EB" }}
      >
        <div
          className="absolute -top-14 -right-16 w-56 h-56 rounded-full pointer-events-none"
          style={{
            background: isPaid
              ? "radial-gradient(circle, rgba(78,205,196,0.20) 0%, rgba(78,205,196,0) 72%)"
              : "radial-gradient(circle, rgba(255,107,157,0.20) 0%, rgba(255,107,157,0) 72%)",
          }}
        />

        <div className="flex items-start gap-4 sm:gap-5 relative z-10">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
            style={{
              backgroundColor: isPaid
                ? "rgba(78,205,196,0.12)"
                : "rgba(255,107,157,0.12)",
            }}
          >
            {isPaid ? (
              <IoCheckmarkCircle
                className="text-3xl"
                style={{ color: "#4ECDC4" }}
              />
            ) : (
              <IoCloseCircle
                className="text-3xl"
                style={{ color: "#FF6B9D" }}
              />
            )}
          </div>
          <div className="flex-1">
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-extrabold"
              style={{
                backgroundColor: isPaid
                  ? "rgba(78,205,196,0.12)"
                  : "rgba(255,107,157,0.12)",
                color: isPaid ? "#0F766E" : "#BE123C",
              }}
            >
              <PawPrint size={14} />
              {paymentStatusLabel}
            </div>
            <h1
              className="text-2xl sm:text-3xl font-black mt-3"
              style={{ color: "#1A1A2E" }}
            >
              {title}
            </h1>
            <p
              className="text-sm sm:text-base mt-2"
              style={{ color: "#6B7280" }}
            >
              {loading
                ? "Hệ thống đang kiểm tra giao dịch từ cổng thanh toán..."
                : isPaid
                  ? "Cảm ơn bạn đã mua hàng tại Design A Bear."
                  : errorText || "Giao dịch chưa được xác nhận."}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-7 relative z-10">
          <div
            className="rounded-2xl p-5"
            style={{ backgroundColor: "#F8FAFF", border: "1px solid #E5E7EB" }}
          >
            <div className="flex items-center gap-2 mb-2">
              <IoReceiptOutline style={{ color: "#17409A" }} />
              <span className="text-sm font-bold" style={{ color: "#17409A" }}>
                Mã đơn hàng
              </span>
            </div>
            <p
              className="text-lg font-black break-all"
              style={{ color: "#1A1A2E" }}
            >
              {formatShortOrderCode(orderNumber || orderCode) ||
                "Đang cập nhật"}
            </p>
          </div>

          <div
            className="rounded-2xl p-5"
            style={{ backgroundColor: "#F8FAFF", border: "1px solid #E5E7EB" }}
          >
            <div className="flex items-center gap-2 mb-2">
              <IoCashOutline style={{ color: "#17409A" }} />
              <span className="text-sm font-bold" style={{ color: "#17409A" }}>
                Số tiền thanh toán
              </span>
            </div>
            <p className="text-lg font-black" style={{ color: "#1A1A2E" }}>
              {amount > 0 ? formatVnd(amount) : "Đang cập nhật"}
            </p>
          </div>

          <div
            className="rounded-2xl p-5"
            style={{ backgroundColor: "#F8FAFF", border: "1px solid #E5E7EB" }}
          >
            <div className="flex items-center gap-2 mb-2">
              <IoTimeOutline style={{ color: "#17409A" }} />
              <span className="text-sm font-bold" style={{ color: "#17409A" }}>
                Tiến trình đơn hàng
              </span>
            </div>
            <p className="text-lg font-black" style={{ color: "#1A1A2E" }}>
              {isPaid ? "Đã ghi nhận" : "Đang chờ xử lý"}
            </p>
            <p className="text-xs mt-1" style={{ color: "#6B7280" }}>
              {isPaid
                ? "Đơn sẽ được chuẩn bị và giao trong 2-5 ngày làm việc."
                : "Bạn có thể thanh toán lại để hoàn tất đơn hàng."}
            </p>
          </div>
        </div>

        <div
          className="rounded-2xl p-4 sm:p-5 mt-6 flex items-start gap-3 relative z-10"
          style={{
            backgroundColor: isPaid ? "#F0FDFA" : "#FFF4F8",
            border: `1px solid ${isPaid ? "#A7F3D0" : "#FFD4E3"}`,
          }}
        >
          <IoShieldCheckmarkOutline
            className="text-xl mt-0.5"
            style={{ color: isPaid ? "#0F766E" : "#BE123C" }}
          />
          <div>
            <p
              className="text-sm font-black"
              style={{ color: isPaid ? "#0F766E" : "#BE123C" }}
            >
              {isPaid ? "Thanh toán đã an toàn" : "Cần xác nhận lại giao dịch"}
            </p>
            <p className="text-sm mt-1" style={{ color: "#6B7280" }}>
              {isPaid
                ? "Hệ thống đã nhận thanh toán. Bạn có thể theo dõi trạng thái tại trang hồ sơ đơn hàng."
                : "Nếu tài khoản đã bị trừ tiền nhưng trạng thái chưa cập nhật, vui lòng liên hệ hỗ trợ để kiểm tra."}
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3 relative z-10">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm"
            style={{ backgroundColor: "#17409A", color: "#FFFFFF" }}
          >
            <IoBagHandleOutline />
            Tiếp tục mua sắm
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm"
            style={{
              border: "2px solid #17409A",
              color: "#17409A",
              backgroundColor: "#FFFFFF",
            }}
          >
            <IoHomeOutline />
            Về trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}
