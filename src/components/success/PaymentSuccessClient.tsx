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
} from "react-icons/io5";
import { paymentService } from "@/services/payment.service";
import { useCart } from "@/contexts/CartContext";
import { STORAGE_KEYS } from "@/constants";

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
          setIsPaid(false);
          setErrorText("Bạn đã hủy thanh toán.");
          return;
        }

        if (status && status.toUpperCase() !== "PAID") {
          setIsPaid(false);
          setErrorText(`Trạng thái thanh toán: ${status}`);
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

  return (
    <div className="max-w-4xl mx-auto px-8 md:px-16">
      <div
        className="rounded-3xl p-8 md:p-10 shadow-lg"
        style={{ backgroundColor: "#FFFFFF", border: "1px solid #E5E7EB" }}
      >
        <div className="flex items-start gap-4">
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
            <h1 className="text-3xl font-black" style={{ color: "#1A1A2E" }}>
              {title}
            </h1>
            <p className="text-sm mt-2" style={{ color: "#6B7280" }}>
              {loading
                ? "Hệ thống đang kiểm tra giao dịch từ cổng thanh toán..."
                : isPaid
                  ? "Cảm ơn bạn đã mua hàng tại Design A Bear."
                  : errorText || "Giao dịch chưa được xác nhận."}
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-5 mt-8">
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
              {orderNumber || orderCode || "Đang cập nhật"}
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
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
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
