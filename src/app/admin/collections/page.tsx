import CollectionsTable from "@/components/admin/collections/CollectionsTable";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quản lý Bộ sưu tập | Admin",
};

export default function AdminCollectionsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-[#17409A]" style={{ fontFamily: "'Fredoka', sans-serif" }}>
          Quản lý Bộ sưu tập
        </h1>
        <p className="text-[#6B7280] mt-2">
          Tạo và quản lý các nhóm sản phẩm theo chủ đề để hiển thị cho khách hàng.
        </p>
      </div>

      <CollectionsTable />
    </div>
  );
}
