import type { Metadata } from "next";
import { PRIVATE_ROBOTS } from "@/constants/seo";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Tạo gấu cho bé",
  description:
    "Trang này đã được chuyển hướng sang danh sách sản phẩm để tối ưu trải nghiệm mua sắm.",
  alternates: {
    canonical: "/products",
  },
  robots: PRIVATE_ROBOTS,
};

export default function CustomizePage() {
  redirect("/products");
}
