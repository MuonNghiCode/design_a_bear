import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PaymentSuccessClient from "@/components/success/PaymentSuccessClient";

export const metadata = {
  title: "Thanh toán thành công | Design A Bear",
  description: "Kết quả thanh toán đơn hàng Design A Bear",
};

export default function SuccessPage() {
  return (
    <>
      <Header />
      <div
        className="pt-50 pb-16 min-h-screen"
        style={{ backgroundColor: "#F4F7FF" }}
      >
        <PaymentSuccessClient />
      </div>
      <Footer />
    </>
  );
}
