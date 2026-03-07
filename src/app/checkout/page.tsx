import type { Metadata } from "next";
import CheckoutClient from "@/components/checkout/CheckoutClient";

export const metadata: Metadata = {
  title: "Thanh toán — Design a Bear",
  description: "Hoàn tất đơn hàng của bạn",
};

export default function CheckoutPage() {
  return <CheckoutClient />;
}
