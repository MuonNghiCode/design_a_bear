import { Metadata } from "next";
import AttributesClient from "@/components/admin/attributes/AttributesClient";

export const metadata: Metadata = {
  title: "Quản lý Thuộc tính | Admin Design A Bear",
  description: "Quản lý danh mục và nhân vật",
};

export default function AttributesPage() {
  return <AttributesClient />;
}
