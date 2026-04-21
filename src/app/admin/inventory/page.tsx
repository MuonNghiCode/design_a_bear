import InventoryClient from "@/components/admin/inventory/InventoryClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quản lý Kho hàng | Admin",
  description: "Dashboard quản lý tồn kho, khóa hàng và điều chỉnh số lượng.",
};

export default function InventoryPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-2xl font-black text-[#1A1A2E]">Quản lý Kho hàng</h1>
        <p className="text-sm font-bold text-[#6B7280]">
          Theo dõi tồn thực tế, hàng đang khóa và điều chỉnh số lượng kho tổng hợp.
        </p>
      </div>

      <InventoryClient />
    </div>
  );
}
