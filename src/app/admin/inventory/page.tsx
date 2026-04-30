import InventoryClient from "@/components/admin/inventory/InventoryClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quản lý Kho hàng | Admin",
  description: "Dashboard quản lý tồn kho, khóa hàng và điều chỉnh số lượng.",
};

export default function InventoryPage() {
  return <InventoryClient />;
}
