"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { orderService } from "@/services/order.service";
import { addressService } from "@/services/address.service";
import { fulfillmentService } from "@/services/fulfillment.service";
import { userService } from "@/services/user.service";
import { shippingService } from "@/services/shipping.service";
import { useToast } from "@/contexts/ToastContext";
import { useAuth } from "@/contexts/AuthContext";
import OrderDetailsView, { OrderDetailsSkeleton } from "@/components/admin/orders/OrderDetailsView";
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
  const { success, error, warning } = useToast();
  
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
    if (!order || !address) {
      warning("Thiếu thông tin đơn hàng hoặc địa chỉ để đẩy đơn");
      return;
    }

    try {
      setPushingGhtk(true);
      
      // Helper to clean address fields (remove redundant province/city names)
      const cleanField = (val: string) => {
        if (!val) return "";
        return val.split(',')[0].trim();
      };

      // 1. Prepare GHTK request
      const ghtkRequest = {
        // Use a more unique ID for testing to avoid ORDER_ID_EXIST
        orderId: `${order.orderNumber}_${Date.now()}`, 
        customerName: address.fullName,
        customerPhone: address.phoneNumber,
        customerAddress: address.line1,
        customerProvince: cleanField(address.state),
        customerDistrict: cleanField(address.city),
        customerWard: cleanField(address.line2 || ""),
        hamlet: "Khác", // Bypass GHTK error 30302 by providing a default hamlet
        pickMoney: 0,
        value: order.grandTotal,
        transport: "road",
        products: order.orderItems.map(item => ({
          name: item.productName || item.productNameSnapshot || "Sản phẩm",
          weight: item.weightSnapshot || 500,
          quantity: item.quantity,
          productCode: item.sku || ""
        }))
      };

      // 2. Submit to GHTK
      const ghtkRes = await shippingService.submitExpressOrder(ghtkRequest);
      
      if (!ghtkRes.isSuccess || !ghtkRes.value.success) {
        error(ghtkRes.value?.message || "Đẩy đơn sang GHTK thất bại từ phía vận chuyển");
        return;
      }

      const realLabel = ghtkRes.value.order?.label;
      if (!realLabel) {
        error("Không nhận được mã vận đơn từ GHTK");
        return;
      }

      // 3. Save fulfillment record with real label
      const fulfillRes = await fulfillmentService.create({
        orderId: order.orderId,
        carrier: "GHTK",
        trackingNumber: realLabel,
      });

      if (fulfillRes.isSuccess && fulfillRes.value) {
        setFulfillment(fulfillRes.value);
        
        // 4. Update order status to SHIPPING
        try {
          await orderService.updateOrderStatus(order.orderId, { 
            status: "SHIPPING",
            notes: `Tự động chuyển trạng thái sau khi đẩy đơn sang GHTK (Mã: ${realLabel})` 
          });
          setOrder({ ...order, status: "SHIPPING" });
        } catch (statusErr) {
          console.error("Failed to update status after GHTK push:", statusErr);
          warning("Đã đẩy đơn thành công nhưng không thể tự động cập nhật trạng thái đơn hàng");
        }

        success("Đã đẩy đơn sang GHTK thành công với mã: " + realLabel);
      } else {
        warning("GHTK đã nhận đơn nhưng không thể lưu thông tin vận chuyển vào hệ thống");
      }
    } catch (err: any) {
      console.error("GHTK Push Error:", err);
      error(err.message || "Đã xảy ra lỗi khi đẩy đơn sang GHTK");
    } finally {
      setPushingGhtk(false);
    }
  };

  if (loading) {
    return <OrderDetailsSkeleton />;
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
