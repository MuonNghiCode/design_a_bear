import CheckoutClient from "@/components/checkout/CheckoutClient";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Suspense } from "react";

export const metadata = {
  title: "Thanh toán | Design A Bear",
  description: "Hoàn tất đơn hàng và thanh toán gấu bông của bạn.",
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
