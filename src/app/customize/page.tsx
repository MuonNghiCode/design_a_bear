import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductCustomize from "@/components/customize/ProductCustomize";

export const metadata: Metadata = {
  title: "Tạo gấu của bé — Design A Bear",
  description:
    "Tự thiết kế người bạn gấu bông độc nhất: chọn ngoại hình, chủ đề, nội dung học và giọng nói. AI gợi ý lộ trình phù hợp theo độ tuổi bé.",
};

export default function CustomizePage() {
  return (
    <>
      <Header />
      <div className="pt-20">
        <ProductCustomize accentColor="#17409A" />
      </div>
      <Footer />
    </>
  );
}
