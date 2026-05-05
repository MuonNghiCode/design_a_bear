"use client";

import { useEffect, useRef, useMemo, useState } from "react";
import gsap from "gsap";
import { useRouter } from "next/navigation";
import { 
  MdArrowBack,
  MdLocalShipping, 
  MdPerson, 
  MdEmail, 
  MdPhone, 
  MdLocationOn, 
  MdPayment,
  MdAutorenew,
  MdInventory2,
  MdCheckCircle,
  MdCancel,
  MdContentCopy,
  MdPrint,
  MdQrCode,
  MdOutlineReceiptLong
} from "react-icons/md";
import { formatPrice } from "@/utils/currency";
import { formatShortOrderCode } from "@/utils/order";
import type { OrderListItem, AddressDetail, Order, UserDetail } from "@/types";
import type { FulfillmentResponse } from "@/types/responses";
import type { GhtkTrackingStatusResponse } from "@/types/shipping";
import CustomDropdown from "@/components/shared/CustomDropdown";
import { shippingService } from "@/services/shipping.service";
import { useToast } from "@/contexts/ToastContext";
import Skeleton from "@/components/shared/Skeleton";

interface OrderDetailsViewProps {
  order: Order | OrderListItem;
  address: AddressDetail | null;
  orderUser: UserDetail | null;
  fulfillment: FulfillmentResponse | null;
  onUpdateStatus: (newStatus: string) => Promise<void>;
  updatingStatus: string | null;
  onPushToGhtk: () => Promise<void>;
  pushingGhtk: boolean;
  userRole?: string;
  backendStatuses: { value: string; label: string }[];
  statusCfg: Record<string, { label: string; color: string; bg: string }>;
  onClose?: () => void;
}

const TIMELINE_STAGES = [
  { id: "CONFIRMATION", label: "Chờ duyệt", statuses: ["PENDING", "AWAITING_PAYMENT"] },
  { id: "PAID", label: "Thanh toán", statuses: ["PAID"] },
  { id: "PRODUCTION", label: "Chế tác", statuses: ["PROCESSING", "PRINTING"] },
  { id: "QC", label: "Kiểm định", statuses: ["READY_FOR_PICKUP"] },
  { id: "SHIPPING", label: "Đang giao", statuses: ["SHIPPING"] },
  { id: "COMPLETED", label: "Hoàn thành", statuses: ["COMPLETED"] },
];

export default function OrderDetailsView({
  order,
  address,
  orderUser,
  fulfillment,
  onUpdateStatus,
  updatingStatus,
  onPushToGhtk,
  pushingGhtk,
  userRole,
  backendStatuses,
  statusCfg,
  onClose,
}: OrderDetailsViewProps) {
  const router = useRouter();
  const headerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const { success, error: toastError } = useToast();
  const [avatarError, setAvatarError] = useState(false);
  const [trackingData, setTrackingData] = useState<GhtkTrackingStatusResponse | null>(null);
  const [trackingLoading, setTrackingLoading] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }
      );
      gsap.fromTo(
        ".detail-card",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power3.out", delay: 0.2 }
      );
    });
    return () => ctx.revert();
  }, []);

  const currentStageIndex = useMemo(() => {
    const status = order.status?.toUpperCase();
    if (status === "CANCELLED" || status === "REFUNDED") return -1;
    
    // Logic exactly like user side getPipelineSteps
    if (status === "PENDING" || status === "AWAITING_PAYMENT") return 0;
    if (status === "PAID") return 1;
    if (["PROCESSING", "PRINTING"].includes(status)) return 2;
    if (status === "READY_FOR_PICKUP") return 3;
    if (status === "SHIPPING") return 4;
    if (status === "COMPLETED") return 5;
    
    return 0;
  }, [order.status]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    success("Đã sao chép vào bộ nhớ tạm");
  };

  const handlePrintLabel = () => {
    if (!fulfillment?.trackingNumber) {
      toastError("Đơn hàng chưa có mã vận đơn");
      return;
    }
    const url = shippingService.getPrintLabelUrl(fulfillment.trackingNumber);
    window.open(url, '_blank');
  };

  const handleTrackDetail = async () => {
    if (!fulfillment?.trackingNumber) return;
    setTrackingLoading(true);
    try {
      const res = await shippingService.getTrackingStatus(fulfillment.trackingNumber);
      if (res.isSuccess && res.value) {
        setTrackingData(res.value);
        success("Đã cập nhật thông tin vận chuyển");
      } else {
        toastError(res.error?.description || "Không thể lấy thông tin vận chuyển");
      }
    } catch (e) {
      toastError("Lỗi kết nối khi lấy thông tin vận chuyển");
    } finally {
      setTrackingLoading(false);
    }
  };

  const statusDisplay = statusCfg[order.status.toLowerCase()] || { label: order.status, color: "#6B7280", bg: "#F3F4F6" };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      {/* Page Header - Glassmorphism style like Track Product */}
      <div 
        ref={headerRef} 
        className="bg-white/70 backdrop-blur-md border-b border-white/50 sticky top-0 z-30 px-8 py-6 shadow-sm shadow-gray-100/20"
      >
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <button 
              onClick={onClose ? onClose : () => router.back()}
              className="w-12 h-12 rounded-2xl bg-white/50 backdrop-blur-sm flex items-center justify-center text-gray-400 hover:text-[#17409A] hover:bg-white transition-all border border-white shadow-sm group"
            >
              <MdArrowBack className="text-xl group-hover:-translate-x-1 transition-transform" />
            </button>
            <div>
              <div className="flex items-center gap-4 mb-1">
                <h1 className="text-3xl font-black text-[#1A1A2E] font-mono tracking-tighter">
                  #{formatShortOrderCode(order.orderNumber || order.orderId)}
                </h1>
                <span 
                  className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest"
                  style={{ color: statusDisplay.color, backgroundColor: statusDisplay.bg }}
                >
                  {statusDisplay.label}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-[11px] font-black uppercase tracking-wider">
                <span>Đặt ngày {new Date(order.createdAt).toLocaleDateString("vi-VN")}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-gray-200" />
                <span>{new Date(order.createdAt).toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={handlePrintLabel}
              disabled={!fulfillment}
              className="px-6 py-3.5 rounded-2xl bg-white/80 backdrop-blur-sm border border-white text-gray-500 text-[11px] font-black hover:bg-white transition-all flex items-center gap-2 uppercase tracking-widest shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <MdPrint className="text-lg" />
              In nhãn GHTK
            </button>
            <div className="relative min-w-[220px]">
              <CustomDropdown
                options={backendStatuses.filter((sts) => {
                  if (userRole === "staff") {
                    return sts.value === "SHIPPING" || sts.value === order.status;
                  }
                  return true;
                }).map((sts) => ({
                  label: sts.label,
                  value: sts.value,
                }))}
                value={order.status}
                onChange={onUpdateStatus}
                disabled={updatingStatus !== null}
                buttonClassName="w-full bg-[#17409A] text-white text-[11px] font-black py-4 px-6 rounded-2xl shadow-xl shadow-blue-900/10 hover:bg-[#0F2D70] transition-all disabled:opacity-50 flex items-center justify-between uppercase tracking-[0.15em] border border-white/10"
                chevronClassName="text-white text-sm opacity-40"
                menuClassName="absolute top-full right-0 mt-2 w-full rounded-2xl border border-white bg-white/95 backdrop-blur-xl shadow-2xl py-2 overflow-hidden z-50"
                optionClassName="w-full text-left px-5 py-4 text-[11px] font-black text-gray-500 hover:bg-blue-50/50 hover:text-[#17409A] transition-colors uppercase tracking-wider"
                activeOptionClassName="w-full text-left px-5 py-4 text-[11px] font-black text-[#17409A] bg-blue-50 uppercase tracking-wider"
                ariaLabel="Cập nhật trạng thái đơn hàng"
              />
              {updatingStatus && (
                <div className="absolute inset-y-0 right-12 flex items-center">
                  <MdAutorenew className="animate-spin text-white text-sm" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div ref={contentRef} className="max-w-[1400px] mx-auto px-8 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Content Column */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Timeline Section */}
            <section className="detail-card bg-white rounded-[32px] p-10 shadow-sm border border-gray-100">
              <div className="flex items-center gap-4 mb-12">
                <div className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center text-[#17409A]">
                  <MdLocalShipping className="text-xl" />
                </div>
                <h3 className="text-lg font-black text-[#1A1A2E] uppercase tracking-wider">Tiến độ xử lý</h3>
              </div>

              <div className="relative px-4">
                {/* Progress Line */}
                <div className="absolute top-6 left-12 right-12 h-1 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#17409A] transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(23,64,154,0.3)]"
                    style={{ 
                      width: currentStageIndex <= 0 ? "0%" : `${(currentStageIndex / (TIMELINE_STAGES.length - 1)) * 100}%` 
                    }}
                  />
                </div>

                <div className="relative flex justify-between">
                  {TIMELINE_STAGES.map((stage, idx) => {
                    const isActive = idx <= currentStageIndex;
                    
                    return (
                      <div key={stage.id} className="flex flex-col items-center gap-4">
                        <div 
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center z-10 transition-all duration-500 border-4 ${
                            isActive 
                              ? "bg-[#17409A] text-white border-white shadow-lg shadow-blue-500/10 scale-110" 
                              : "bg-white border-gray-50 text-gray-200"
                          }`}
                        >
                          {isActive ? <MdCheckCircle className="text-xl" /> : <div className="w-2.5 h-2.5 rounded-full bg-gray-100" />}
                        </div>
                        <div className="text-center">
                          <p className={`text-[10px] font-black uppercase tracking-[0.12em] ${isActive ? "text-[#1A1A2E]" : "text-gray-300"}`}>
                            {stage.label}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {(order.status === "CANCELLED" || order.status === "REFUNDED") && (
                  <div className="mt-12 p-6 bg-red-50 rounded-[24px] border border-red-100 flex items-center gap-5">
                    <MdCancel className="text-3xl text-red-500" />
                    <div>
                      <p className="text-red-600 font-black text-[11px] uppercase tracking-widest">Đơn hàng {order.status === "CANCELLED" ? "đã bị hủy" : "đã hoàn tiền"}</p>
                      <p className="text-red-400 text-[11px] font-bold mt-1">{order.notes || "Không có lý do cụ thể được ghi nhận."}</p>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Product List */}
            <section className="detail-card bg-white rounded-[32px] p-10 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center text-[#17409A]">
                    <MdInventory2 className="text-xl" />
                  </div>
                  <h3 className="text-lg font-black text-[#1A1A2E] uppercase tracking-wider">Danh sách sản phẩm</h3>
                </div>
                <span className="text-[10px] font-black text-gray-400 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100 tracking-widest uppercase">
                  {order.orderItems.length} mặt hàng
                </span>
              </div>

              <div className="space-y-6">
                {order.orderItems.map((item, idx) => (
                  <div key={idx} className="group flex flex-col md:flex-row gap-8 p-6 bg-[#F8FAFC] rounded-[24px] border border-transparent hover:border-gray-200 hover:bg-white transition-all">
                    <div className="w-28 h-28 rounded-[20px] bg-white border border-gray-100 overflow-hidden shrink-0 group-hover:scale-105 transition-transform duration-500">
                      <img 
                        src={item.productImageUrl || item.buildDetails?.baseProductImageUrl || "/images/placeholder.png"} 
                        alt={item.productName || "Sản phẩm"}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="flex-1 space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-base font-black text-[#1A1A2E] leading-tight uppercase tracking-tight">
                            {item.productNameSnapshot || item.productName || item.buildDetails?.buildName || "Sản phẩm gấu"}
                          </h4>
                          <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] mt-2">SKU: {item.sku || "N/A"}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-black text-[#1A1A2E]">{formatPrice(item.unitPrice)}</p>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Số lượng: {item.quantity}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {item.buildId && (
                          <span className="px-3 py-1.5 bg-white text-[#17409A] text-[9px] font-black rounded-lg border border-gray-200 uppercase tracking-widest">Thiết kế riêng</span>
                        )}
                        {item.includesSmartChip && (
                          <span className="px-3 py-1.5 bg-white text-gray-600 text-[9px] font-black rounded-lg border border-gray-200 uppercase tracking-widest">SmartChip</span>
                        )}
                        {item.sizeTag && (
                          <span className="px-3 py-1.5 bg-white text-gray-600 text-[9px] font-black rounded-lg border border-gray-200 uppercase tracking-widest">Size {item.sizeTag}</span>
                        )}
                      </div>

                      {item.buildDetails?.personalizationNote && (
                        <div className="bg-white/50 p-4 rounded-xl border border-gray-100 flex gap-3 italic">
                          <p className="text-[11px] font-bold text-gray-400 leading-relaxed">
                            <span className="text-[#17409A] font-black not-italic mr-2">“</span>
                            {item.buildDetails.personalizationNote}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12 pt-8 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <MdOutlineReceiptLong className="text-lg text-gray-400" />
                    <h4 className="text-[11px] font-black text-[#1A1A2E] uppercase tracking-widest">Ghi chú đơn hàng</h4>
                  </div>
                  <div className="bg-gray-50/50 p-6 rounded-[20px] min-h-[100px] border border-gray-100/50">
                    <p className="text-[11px] font-bold text-gray-400 leading-relaxed italic">
                      {order.notes || "Không có ghi chú bổ sung cho đơn hàng này."}
                    </p>
                  </div>
                </div>

                <div className="bg-[#F8FAFC] rounded-[24px] p-8 space-y-5 border border-gray-100 shadow-sm">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-gray-400 font-black uppercase tracking-[0.2em]">Tạm tính</span>
                    <span className="text-gray-600 font-bold">{formatPrice(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-gray-400 font-black uppercase tracking-[0.2em]">Phí vận chuyển</span>
                    <span className="text-gray-600 font-bold">{formatPrice(order.shippingTotal)}</span>
                  </div>
                  {order.discountTotal > 0 && (
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-emerald-500/60 font-black uppercase tracking-[0.2em]">Giảm giá</span>
                      <span className="text-emerald-500 font-bold">-{formatPrice(order.discountTotal)}</span>
                    </div>
                  )}
                  <div className="h-px bg-gray-100 my-2" />
                  <div className="flex justify-between items-end pt-2">
                    <span className="text-gray-400 font-black text-[11px] uppercase tracking-[0.25em] mb-1">Tổng cộng</span>
                    <span className="text-[#17409A] font-black text-3xl font-mono tracking-tighter">{formatPrice(order.grandTotal)}</span>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar Content */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Customer Info */}
            <section className="detail-card bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center text-[#17409A]">
                  <MdPerson className="text-xl" />
                </div>
                <h3 className="text-lg font-black text-[#1A1A2E] uppercase tracking-wider">Khách hàng</h3>
              </div>

              <div className="flex items-center gap-5 p-5 bg-[#F8FAFC] rounded-[24px] border border-gray-100/50">
                <div className="w-14 h-14 rounded-2xl bg-[#F4F7FF] flex items-center justify-center text-[#17409A] font-black text-xl shadow-sm overflow-hidden border-2 border-white">
                  {orderUser?.avatarUrl && !avatarError ? (
                    <img 
                      src={orderUser.avatarUrl} 
                      alt={address?.fullName || "User"}
                      className="w-full h-full object-cover"
                      onError={() => setAvatarError(true)}
                    />
                  ) : (
                    <span className="animate-in fade-in duration-500">
                      {address?.fullName.charAt(0).toUpperCase() || "U"}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-base font-black text-[#1A1A2E] truncate uppercase tracking-tight">{address?.fullName || "Khách vãng lai"}</p>
                  <p className="text-[9px] font-black text-[#17409A] uppercase tracking-[0.15em] bg-[#F4F7FF] px-3 py-1 rounded-full inline-block mt-2">
                    {order.userId ? "Thành viên" : "Khách mới"}
                  </p>
                </div>
              </div>

              <div className="space-y-4 px-1">
                <div className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-300 group-hover:text-[#17409A] transition-colors border border-gray-50">
                    <MdEmail className="text-lg" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-0.5">Email liên hệ</p>
                    <p className="text-xs font-bold text-gray-500 truncate">{address?.email || "N/A"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-300 group-hover:text-[#17409A] transition-colors border border-gray-50">
                    <MdPhone className="text-lg" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-0.5">Số điện thoại</p>
                    <p className="text-xs font-bold text-gray-500">{address?.phoneNumber || "N/A"}</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Logistics Info */}
            <section className="detail-card bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center text-[#17409A]">
                    <MdLocationOn className="text-xl" />
                  </div>
                  <h3 className="text-lg font-black text-[#1A1A2E] uppercase tracking-wider">Vận chuyển</h3>
                </div>
                <button 
                  onClick={() => copyToClipboard(`${address?.line1}, ${address?.line2}, ${address?.city}, ${address?.state}`)}
                  className="w-10 h-10 rounded-xl hover:bg-gray-50 text-gray-200 hover:text-[#17409A] transition-all flex items-center justify-center"
                >
                  <MdContentCopy className="text-lg" />
                </button>
              </div>

              <div className="p-6 bg-gray-50 rounded-[20px] border border-gray-100/50">
                <p className="text-[12px] font-bold text-gray-500 leading-relaxed">
                  {address ? (
                    <>
                      <span className="font-black text-[#1A1A2E] uppercase tracking-tight">{address.line1}</span><br />
                      {address.line2 && <span className="mt-1 inline-block">{address.line2}</span>}
                      <span className="mt-1 block opacity-70">{address.city}, {address.state}</span>
                    </>
                  ) : "Chưa có địa chỉ giao hàng"}
                </p>
              </div>

              {fulfillment ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.2em] ml-1">Thông tin vận đơn</p>
                    <div className="flex gap-4">
                      <button 
                        onClick={() => {
                          if (fulfillment.trackingNumber) {
                            const url = shippingService.getPrintLabelUrl(fulfillment.trackingNumber);
                            window.open(url, "_blank");
                          }
                        }}
                        className="text-[9px] font-black text-[#17409A] uppercase tracking-widest hover:underline"
                      >
                        In vận đơn
                      </button>
                      <button 
                        onClick={handleTrackDetail}
                        disabled={trackingLoading}
                        className="text-[9px] font-black text-[#17409A] uppercase tracking-widest hover:underline disabled:opacity-50"
                      >
                        {trackingLoading ? "Đang cập nhật..." : "Làm mới tracking"}
                      </button>
                    </div>
                  </div>
                  <div className="p-6 bg-[#F8FAFC] rounded-[24px] border border-gray-100 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-black text-[#17409A] uppercase tracking-widest mb-1">{fulfillment.carrier}</p>
                      <p className="text-lg font-black text-[#17409A] font-mono tracking-tighter">{fulfillment.trackingNumber}</p>
                    </div>
                    <MdQrCode className="text-gray-300 text-3xl" />
                  </div>

                  {trackingData ? (
                    <div className="bg-blue-50/50 rounded-2xl p-5 border border-blue-100/50 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Trạng thái hiện tại</span>
                        <span className="text-[10px] font-black text-[#17409A] uppercase tracking-wider">{trackingData.order?.status_text || "N/A"}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Cập nhật cuối</span>
                        <span className="text-[10px] font-bold text-gray-500">{trackingData.order?.action_time || "N/A"}</span>
                      </div>
                      {trackingData.order?.reason && (
                        <div className="pt-2 border-t border-blue-100/30">
                          <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-1">Ghi chú vận chuyển</p>
                          <p className="text-[11px] font-bold text-amber-700 italic">“{trackingData.order.reason}”</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <button 
                      onClick={handleTrackDetail}
                      disabled={trackingLoading}
                      className="w-full flex items-center justify-center gap-2 py-3 bg-white border border-gray-100 rounded-xl text-[10px] font-black text-gray-400 hover:text-[#17409A] hover:bg-gray-50 transition-all uppercase tracking-widest"
                    >
                      {trackingLoading ? <MdAutorenew className="animate-spin text-sm" /> : <MdLocalShipping className="text-sm" />}
                      Xem chi tiết hành trình
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-center py-4">
                    <p className="text-[11px] font-bold text-gray-300 italic uppercase tracking-widest">Chưa có mã vận đơn</p>
                  </div>
                  {order.status === "READY_FOR_PICKUP" && (
                    <button 
                      onClick={onPushToGhtk}
                      disabled={pushingGhtk}
                      className="w-full flex items-center justify-center gap-3 bg-[#17409A] text-white text-[11px] font-black py-4 rounded-2xl shadow-xl shadow-gray-200 hover:bg-[#0F2D70] transition-all disabled:opacity-50 uppercase tracking-widest"
                    >
                      {pushingGhtk ? <MdAutorenew className="animate-spin text-lg" /> : <MdLocalShipping className="text-lg" />}
                      Đẩy đơn sang GHTK
                    </button>
                  )}
                </div>
              )}
            </section>

            {/* Payment Info */}
            <section className="detail-card bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center text-[#17409A]">
                  <MdPayment className="text-xl" />
                </div>
                <h3 className="text-lg font-black text-[#1A1A2E] uppercase tracking-wider">Thanh toán</h3>
              </div>

              <div className="space-y-4">
                <div className="p-5 bg-gray-50/50 rounded-[20px] border border-gray-100/50 flex items-center justify-between">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Trạng thái</span>
                  <span className={`text-[9px] font-black px-4 py-1.5 rounded-full ${order.isPaid ? "bg-emerald-500 text-white" : "bg-amber-500 text-white"} uppercase tracking-widest`}>
                    {order.isPaid ? "Đã thanh toán" : "Chờ thanh toán"}
                  </span>
                </div>
                
                <div className="p-5 bg-gray-50/50 rounded-[20px] border border-gray-100/50 flex items-center justify-between">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Loại tiền</span>
                  <span className="text-[10px] font-black text-[#1A1A2E] uppercase tracking-[0.15em]">{order.currency || "VND"}</span>
                </div>
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}

export function OrderDetailsSkeleton() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      <div className="bg-white/70 backdrop-blur-md border-b border-white/50 sticky top-0 z-30 px-8 py-6">
        <div className="max-w-[1400px] mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6">
            <Skeleton className="w-12 h-12 rounded-2xl" />
            <div className="space-y-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          <div className="flex gap-4">
            <Skeleton className="h-12 w-32 rounded-2xl" />
            <Skeleton className="h-12 w-48 rounded-2xl" />
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-8 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white rounded-[32px] p-10 border border-gray-100">
              <Skeleton className="h-6 w-40 mb-10" />
              <div className="flex justify-between px-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex flex-col items-center gap-4">
                    <Skeleton className="w-12 h-12 rounded-2xl" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-[32px] p-10 border border-gray-100">
              <div className="flex justify-between mb-10">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-8 w-24 rounded-xl" />
              </div>
              <div className="space-y-6">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="flex gap-8 p-6 bg-[#F8FAFC] rounded-[24px]">
                    <Skeleton className="w-28 h-28 rounded-[20px]" />
                    <div className="flex-1 space-y-4">
                      <div className="flex justify-between">
                        <Skeleton className="h-6 w-1/2" />
                        <Skeleton className="h-6 w-24" />
                      </div>
                      <Skeleton className="h-4 w-1/4" />
                      <div className="flex gap-2">
                        <Skeleton className="h-6 w-20" />
                        <Skeleton className="h-6 w-20" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white rounded-[32px] p-8 border border-gray-100">
              <Skeleton className="h-6 w-32 mb-8" />
              <div className="flex items-center gap-5 p-5 bg-[#F8FAFC] rounded-[24px]">
                <Skeleton className="w-14 h-14 rounded-2xl" />
                <Skeleton className="h-5 w-32" />
              </div>
              <div className="mt-8 space-y-4">
                <div className="flex gap-4">
                  <Skeleton className="w-10 h-10 rounded-xl" />
                  <div className="space-y-2"><Skeleton className="h-3 w-16" /><Skeleton className="h-4 w-32" /></div>
                </div>
                <div className="flex gap-4">
                  <Skeleton className="w-10 h-10 rounded-xl" />
                  <div className="space-y-2"><Skeleton className="h-3 w-16" /><Skeleton className="h-4 w-32" /></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
