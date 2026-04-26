import PayrollClient from "@/components/admin/payroll/PayrollClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bảng lương | Design a Bear Admin",
  description: "Tính toán và quản lý lương hoa hồng cho nhân viên Craftsman và QC.",
};

export default function PayrollPage() {
  return <PayrollClient />;
}
