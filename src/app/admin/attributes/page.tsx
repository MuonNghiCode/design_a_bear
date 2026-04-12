import { Metadata } from "next";
import AttributesClient from "@/components/admin/attributes/AttributesClient";

export const metadata: Metadata = {
  title: "Quản lý Thuộc tính | Admin Design A Bear",
  description: "Quản lý danh mục và nhân vật",
};

export default function AttributesPage() {
  return (
    <div className="min-h-screen bg-[#F4F7FF] mb-12">
      {/* Header section identical to other admin pages */}
      <div className="bg-white px-8 py-6 rounded-b-[40px] shadow-sm mb-8">
        <h1 className="text-3xl font-black text-[#1A1A2E] mb-2">
          Thuộc tính Sản phẩm
        </h1>
        <p className="text-[#6B7280] font-medium text-sm">
          Quản lý phân loại Danh mục và Tính cách
        </p>
      </div>

      <div className="px-8">
        <AttributesClient />
      </div>
    </div>
  );
}
