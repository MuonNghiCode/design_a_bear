import { Metadata } from "next";
import IssuesTable from "@/components/staff/issues/IssuesTable";

export const metadata: Metadata = {
  title: "Quản lý Báo cáo/Bảo hành | Staff | Design A Bear",
};

export default function StaffIssuesPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-[#1A1A2E] text-2xl font-black">
          Yêu cầu bảo hành & Báo lỗi
        </h1>
        <p className="text-[#9CA3AF] text-sm mt-1">
          Quản lý và cập nhật tiến độ xử lý các lỗi sản phẩm từ khách hàng.
        </p>
      </div>

      <IssuesTable />
    </div>
  );
}
