import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PaymentCancelClient from "@/components/cancel/PaymentCancelClient";
import { Suspense } from "react";
import type { Metadata } from "next";
import { PRIVATE_ROBOTS } from "@/constants/seo";

export const metadata: Metadata = {
  title: "Thanh toán bị hủy",
  description: "Trang thông báo khi người dùng hủy thanh toán đơn hàng.",
  robots: PRIVATE_ROBOTS,
  alternates: {
    canonical: "/cancel",
  },
};

export default function CancelPage() {
  return (
    <>
      <Header />
      <div
        className="pt-50 pb-16 min-h-screen"
        style={{ backgroundColor: "#F4F7FF" }}
      >
        <Suspense fallback={null}>
          <PaymentCancelClient />
        </Suspense>
      </div>
      <Footer />
    </>
  );
}
