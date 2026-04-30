"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { orderService } from "@/services/order.service";
import { addressService } from "@/services/address.service";
import { fulfillmentService } from "@/services/fulfillment.service";
import { userService } from "@/services/user.service";
import { useToast } from "@/contexts/ToastContext";
import { useAuth } from "@/contexts/AuthContext";
import OrderDetailsView from "@/components/admin/orders/OrderDetailsView";
import type { Order, AddressDetail, UserDetail } from "@/types";
import type { FulfillmentResponse } from "@/types/responses";
import { MdAutorenew } from "react-icons/md";

const BACKEND_STATUSES = [
  { value: "PENDING", label: "Chờ duyệt" },
  { value: "PAID", label: "Đã thanh toán" },
  { value: "PROCESSING", label: "Chế tác" },
  { value: "PRINTING", label: "Đang in" },
  { value: "READY_FOR_PICKUP", label: "Kiểm định" },
  { value: "SHIPPING", label: "Đang giao" },
  { value: "COMPLETED", label: "Hoàn thành" },
  { value: "CANCELLED", label: "Đã hủy" },
  { value: "REFUNDED", label: "Đã hoàn tiền" },
];

const STATUS_CFG: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: "Chờ duyệt", color: "#FF8C42", bg: "#FF8C4218" },
  paid: { label: "Đã thanh toán", color: "#1D4ED8", bg: "#1D4ED818" },
  processing: { label: "Chế tác", color: "#7C5CFC", bg: "#7C5CFC18" },
  printing: { label: "Đang in", color: "#06B6D4", bg: "#06B6D418" },
  ready_for_pickup: { label: "Kiểm định", color: "#10B981", bg: "#10B98118" },
  shipping: { label: "Đang giao", color: "#6366F1", bg: "#6366F118" },
  completed: { label: "Hoàn thành", color: "#059669", bg: "#05966918" },
  cancelled: { label: "Đã hủy", color: "#EF4444", bg: "#EF444418" },
  refunded: { label: "Đã hoàn tiền", color: "#6B7280", bg: "#F3F4F6" },
};

export default function OrderDetailsPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const { success, error } = useToast();
  
  const [order, setOrder] = useState<Order | null>(null);
  const [address, setAddress] = useState<AddressDetail | null>(null);
  const [orderUser, setOrderUser] = useState<UserDetail | null>(null);
  const [fulfillment, setFulfillment] = useState<FulfillmentResponse | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [pushingGhtk, setPushingGhtk] = useState(false);

  const fetchData = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const res = await orderService.getOrderById(id as string);
      
      if (res.isSuccess && res.value) {
        setOrder(res.value as unknown as Order);
        
        if (res.value.shippingAddressId) {
          const addrRes = await addressService.getAddressById(res.value.shippingAddressId);
          if (addrRes.isSuccess) setAddress(addrRes.value);
        }

        if (res.value.userId) {
          const userRes = await userService.getUserById(res.value.userId);
          if (userRes.isSuccess) setOrderUser(userRes.value);
        }
        
        const fulfillRes = await fulfillmentService.getByOrderId(id as string);
        if (fulfillRes.isSuccess && fulfillRes.value && fulfillRes.value.length > 0) {
          setFulfillment(fulfillRes.value[0]);
        }
      } else {
        error("Không thể tải thông tin đơn hàng");
      }
    } catch (err) {
      console.error("Error fetching order details:", err);
      error("Đã xảy ra lỗi khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  }, [id, error]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleUpdateStatus = async (newStatus: string) => {
    if (!order) return;
    try {
      setUpdatingStatus(newStatus);
      await orderService.updateOrderStatus(order.orderId, { 
        status: newStatus,
        notes: `Cập nhật trạng thái thủ công thành ${newStatus}` 
      });
      setOrder({ ...order, status: newStatus });
      success(`Cập nhật trạng thái sang ${newStatus} thành công`);
    } catch (err) {
      error("Cập nhật trạng thái thất bại");
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handlePushToGhtk = async () => {
    if (!order) return;
    try {
      setPushingGhtk(true);
      const res = await fulfillmentService.create({
        orderId: order.orderId,
        carrier: "GHTK",
        trackingNumber: `GHTK-${Date.now()}`, // Dummy tracking for now
      });
      if (res.isSuccess && res.value) {
        setFulfillment(res.value);
        success("Đã đẩy đơn sang GHTK thành công");
      }
    } catch (err) {
      error("Đẩy đơn sang GHTK thất bại");
    } finally {
      setPushingGhtk(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="flex flex-col items-center gap-4">
          <MdAutorenew className="text-4xl text-[#17409A] animate-spin" />
          <p className="text-sm font-black text-[#1A1A2E] tracking-widest uppercase">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <p className="text-gray-400 font-bold uppercase tracking-widest">Không tìm thấy đơn hàng</p>
      </div>
    );
  }

  return (
    <OrderDetailsView
      order={order}
      address={address}
      orderUser={orderUser}
      fulfillment={fulfillment}
      onUpdateStatus={handleUpdateStatus}
      updatingStatus={updatingStatus}
      onPushToGhtk={handlePushToGhtk}
      pushingGhtk={pushingGhtk}
      userRole={user?.role}
      backendStatuses={BACKEND_STATUSES}
      statusCfg={STATUS_CFG}
    />
  );
}
