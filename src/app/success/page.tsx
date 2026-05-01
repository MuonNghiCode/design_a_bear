import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PaymentSuccessClient from "@/components/success/PaymentSuccessClient";
import { Suspense } from "react";
import type { Metadata } from "next";
import { PRIVATE_ROBOTS } from "@/constants/seo";

export const metadata: Metadata = {
  title: "Thanh toán thành công",
  description: "Trang kết quả sau khi thanh toán đơn hàng.",
  robots: PRIVATE_ROBOTS,
  alternates: {
    canonical: "/success",
  },
};

export default function SuccessPage() {
  return (
    <>
      <Header />
      <div
        className="pt-50 pb-16 min-h-screen"
        style={{ backgroundColor: "#F4F7FF" }}
      >
        <Suspense fallback={null}>
          <PaymentSuccessClient />
        </Suspense>
      </div>
      <Footer />
    </>
  );
}
