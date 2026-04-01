import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductCustomize from "@/components/customize/ProductCustomize";
import { PRIVATE_ROBOTS } from "@/constants/seo";

export const metadata: Metadata = {
  title: "Tao gau cho be",
  description:
    "Trang nay da duoc chuyen huong sang danh sach san pham de toi uu trai nghiem mua sam.",
  alternates: {
    canonical: "/products",
  },
  robots: PRIVATE_ROBOTS,
};

import { redirect } from "next/navigation";

export default function CustomizePage() {
  // Luồng customize cũ đã bị gỡ bỏ và tích hợp vào trang Chi tiết sản phẩm
  redirect("/products");
}
