import CheckoutClient from "@/components/checkout/CheckoutClient";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Suspense } from "react";
import type { Metadata } from "next";
import { PRIVATE_ROBOTS } from "@/constants/seo";

export const metadata: Metadata = {
  title: "Thanh toán",
  description: "Hoàn tất đơn hàng và thanh toán.",
  robots: PRIVATE_ROBOTS,
  alternates: {
    canonical: "/checkout",
  },
};

export default function CheckoutPage() {
  return (
    <>
      <Header />
      <div className="pt-24 pb-16 bg-[#FAFAFA] min-h-screen">
        <Suspense fallback={null}>
          <CheckoutClient />
        </Suspense>
      </div>
      <Footer />
    </>
  );
}
