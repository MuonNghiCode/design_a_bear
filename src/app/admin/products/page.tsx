import { type Metadata } from "next";
import ProductsClient from "@/components/admin/products/ProductsClient";

export const metadata: Metadata = {
  title: "Sản phẩm — Design a Bear",
};

export default function ProductsPage() {
  return <ProductsClient />;
}
