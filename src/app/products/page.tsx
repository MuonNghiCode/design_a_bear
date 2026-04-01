import type { Metadata } from "next";
import ProductsClient from "@/components/products/ProductsClient";
import { DEFAULT_OG_IMAGE, PUBLIC_ROBOTS } from "@/constants/seo";

export const metadata: Metadata = {
  title: "San pham gau bong ca nhan hoa",
  description:
    "Kham pha bo suu tap gau bong, phu kien va san pham ho tro hoc ky nang cho be tai Design a Bear.",
  alternates: {
    canonical: "/products",
  },
  robots: PUBLIC_ROBOTS,
  openGraph: {
    title: "San pham gau bong ca nhan hoa",
    description:
      "Bo suu tap gau bong thong minh va phu kien giao duc cho be tai Design a Bear.",
    url: "/products",
    images: [DEFAULT_OG_IMAGE],
  },
};

interface Props {
  searchParams: Promise<{ category?: string }>;
}

export default async function ProductsPage({ searchParams }: Props) {
  const { category } = await searchParams;
  return <ProductsClient initialCategory={category} />;
}
