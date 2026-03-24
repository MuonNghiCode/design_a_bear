import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductCustomize from "@/components/customize/ProductCustomize";

export const metadata: Metadata = {
  title: "Tạo gấu của bé — Design A Bear",
  description:
    "Tự thiết kế người bạn gấu bông độc nhất: chọn ngoại hình, chủ đề, nội dung học và giọng nói. AI gợi ý lộ trình phù hợp theo độ tuổi bé.",
};

import { redirect } from "next/navigation";

export default function CustomizePage() {
  // Luồng customize cũ đã bị gỡ bỏ và tích hợp vào trang Chi tiết sản phẩm
  redirect("/products");
}
