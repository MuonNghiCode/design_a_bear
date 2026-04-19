"use client";

import Link from "next/link";
import { useMemo, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { paymentService } from "@/services/payment.service";
import {
  IoAlertCircle,
  IoBagHandleOutline,
  IoHomeOutline,
  IoRefreshOutline,
  IoReceiptOutline,
  IoShieldCheckmarkOutline,
} from "react-icons/io5";
import { formatShortOrderCode } from "@/utils/order";

type CancelInfoRowProps = {
  label: string;
  value: string;
};

function CancelInfoRow({ label, value }: CancelInfoRowProps) {
  return (
    <div
      className="rounded-xl p-4"
      style={{ backgroundColor: "#F8FAFF", border: "1px solid #E5E7EB" }}
    >
      <p
        className="text-xs font-extrabold uppercase"
        style={{ color: "#6B7280" }}
      >
        {label}
      </p>
      <p
        className="mt-1 text-base font-black break-all"
        style={{ color: "#1A1A2E" }}
      >
        {value}
      </p>
    </div>
  );
}

export default function PaymentCancelClient() {
  const searchParams = useSearchParams();

  const cancel = (searchParams.get("cancel") || "").toLowerCase() === "true";
  const status = searchParams.get("status") || "CANCELLED";
  const orderCode =
    searchParams.get("orderCode") ||
    searchParams.get("code") ||
    searchParams.get("paymentCode") ||
    "";
  const transactionId = searchParams.get("id") || "";
  const gatewayCode = searchParams.get("code") || "";
  const [isUpdating, setIsUpdating] = useState(true);
  const [statusMessage, setStatusMessage] = useState("Đang đồng bộ trạng thái...");
  
  // Update DB status immediately when landing on this page
  useEffect(() => {
    if (orderCode) {
      console.log(`[PaymentCancel] Initiating confirmPayment for orderCode: ${orderCode}`);
      paymentService.confirmPayment(orderCode)
        .then((res) => {
          console.log("[PaymentCancel] Backend sync successful:", res);
          setStatusMessage("Đã cập nhật trạng thái đơn hàng.");
          setIsUpdating(false);
        })
        .catch((err) => {
          console.error("[PaymentCancel] Backend sync failed:", err);
          setStatusMessage("Không thể đồng bộ trạng thái tự động.");
          setIsUpdating(false);
        });
    } else {
      console.warn("[PaymentCancel] No orderCode found in URL.");
      setIsUpdating(false);
      setStatusMessage("Không tìm thấy mã đơn hàng.");
    }
  }, [orderCode]);

  const heading = useMemo(() => {
    if (cancel) return "Bạn đã hủy thanh toán";
    return "Thanh toán chưa hoàn tất";
  }, [cancel]);

  const subText = useMemo(() => {
    if (cancel) {
      return "Đơn hàng của bạn chưa bị trừ tiền. Bạn có thể quay lại thanh toán bất cứ lúc nào.";
    }
    return "Giao dịch chưa thành công. Vui lòng kiểm tra lại thông tin thanh toán và thử lại.";
  }, [cancel]);

  return (
    <div className="max-w-4xl mx-auto px-5 sm:px-8 lg:px-12">
      <div
        className="relative overflow-hidden rounded-3xl p-6 sm:p-8 lg:p-10 shadow-lg"
        style={{ backgroundColor: "#FFFFFF", border: "1px solid #E5E7EB" }}
      >
        <div
          className="pointer-events-none absolute -top-16 -right-14 w-52 h-52 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(255,107,157,0.20) 0%, rgba(255,107,157,0) 72%)",
          }}
        />

        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: "rgba(255,107,157,0.14)" }}
          >
            <IoAlertCircle className="text-3xl" style={{ color: "#FF6B9D" }} />
          </div>
          <div className="flex-1">
            <h1
              className="text-2xl sm:text-3xl font-black"
              style={{ color: "#1A1A2E" }}
            >
              {heading}
            </h1>
            <p
              className="text-sm sm:text-base mt-2"
              style={{ color: "#6B7280" }}
            >
              {subText}
            </p>
          </div>
        </div>

        {/* Sync Status Bar */}
        <div 
          className="mt-6 px-4 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-2"
          style={{ 
            backgroundColor: isUpdating ? "#E0F2FE" : "#F0FDF4", 
            color: isUpdating ? "#0369A1" : "#15803D",
            border: `1px solid ${isUpdating ? "#BAE6FD" : "#DCFCE7"}`
          }}
        >
          <div className={`w-2 h-2 rounded-full ${isUpdating ? "animate-pulse" : ""}`} style={{ backgroundColor: isUpdating ? "#0EA5E9" : "#22C55E" }} />
          {statusMessage}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-7">
          <CancelInfoRow
            label="Mã đơn hàng"
            value={formatShortOrderCode(orderCode) || "Đang cập nhật"}
          />
          <CancelInfoRow label="Trạng thái" value={status.toUpperCase()} />
          <CancelInfoRow
            label="Mã giao dịch"
            value={transactionId || "Không có dữ liệu"}
          />
          <CancelInfoRow
            label="Mã phản hồi cổng thanh toán"
            value={gatewayCode || "Không có dữ liệu"}
          />
        </div>

        <div
          className="rounded-2xl p-4 sm:p-5 mt-7 flex items-start gap-3"
          style={{ backgroundColor: "#FFF4F8", border: "1px solid #FFD4E3" }}
        >
          <IoShieldCheckmarkOutline
            className="text-xl mt-0.5"
            style={{ color: "#E11D48" }}
          />
          <div>
            <p className="text-sm font-black" style={{ color: "#BE123C" }}>
              Thông tin an toàn giao dịch
            </p>
            <p className="text-sm mt-1" style={{ color: "#9F1239" }}>
              Nếu tài khoản ngân hàng bị trừ tiền nhưng đơn hàng vẫn ở trạng
              thái hủy, vui lòng liên hệ hỗ trợ để được xử lý nhanh.
            </p>
          </div>
        </div>

        <div className="mt-7 flex flex-wrap gap-3">
          <Link
            href="/checkout"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl font-black text-sm transition-all hover:scale-105 active:scale-95 shadow-lg shadow-[#17409A]/20"
            style={{ backgroundColor: "#17409A", color: "#FFFFFF" }}
          >
            <IoRefreshOutline className="text-lg" />
            Thử lại với đơn hàng mới
          </Link>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl font-black text-sm transition-all hover:scale-105 active:scale-95 border-2"
            style={{
              borderColor: "#17409A",
              color: "#17409A",
              backgroundColor: "#FFFFFF",
            }}
          >
            <IoBagHandleOutline className="text-lg" />
            Về trang sản phẩm
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm"
            style={{
              border: "2px solid #CBD5E1",
              color: "#334155",
              backgroundColor: "#FFFFFF",
            }}
          >
            <IoHomeOutline />
            Về trang chủ
          </Link>
        </div>

        <div className="mt-6 pt-5 border-t" style={{ borderColor: "#E5E7EB" }}>
          <p
            className="text-xs sm:text-sm flex items-center gap-2"
            style={{ color: "#6B7280" }}
          >
            <IoReceiptOutline />
            Bạn có thể xem lại trạng thái đơn trong trang cá nhân sau khi đặt
            hàng lại.
          </p>
        </div>
      </div>
    </div>
  );
}
