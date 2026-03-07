import { type Metadata } from "next";
import OrdersClient from "@/components/admin/orders/OrdersClient";

export const metadata: Metadata = {
  title: "Đơn hàng — Design a Bear",
};

export default function OrdersPage() {
  return <OrdersClient />;
}
