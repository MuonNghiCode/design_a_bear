import type { Metadata } from "next";
import ProductsClient from "@/components/products/ProductsClient";
import { DEFAULT_OG_IMAGE, PUBLIC_ROBOTS } from "@/constants/seo";

export const metadata: Metadata = {
  title: "Sản phẩm gấu bông cá nhân hóa",
  description:
    "Khám phá bộ sưu tập gấu bông, phụ kiện và sản phẩm hỗ trợ học kỹ năng cho bé tại Design a Bear.",
  alternates: {
    canonical: "/products",
  },
  robots: PUBLIC_ROBOTS,
  openGraph: {
    title: "Sản phẩm gấu bông cá nhân hóa",
    description:
      "Bộ sưu tập gấu bông thông minh và phụ kiện giáo dục cho bé tại Design a Bear.",
    url: "/products",
    images: [DEFAULT_OG_IMAGE],
  },
};

interface Props {
  searchParams: Promise<{ category?: string; search?: string }>;
}

export default async function ProductsPage({ searchParams }: Props) {
  const { category, search } = await searchParams;
  return <ProductsClient initialCategory={category} initialSearch={search} />;
}
