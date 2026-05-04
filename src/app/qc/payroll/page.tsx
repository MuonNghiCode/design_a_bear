import PersonalPayrollClient from "@/components/common/PersonalPayrollClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hoa hồng & Thù lao | QC",
  description: "Bảng lương và thù lao cá nhân dành cho kiểm định viên QC.",
};

export default function QCPayrollPage() {
  return <PersonalPayrollClient roleName="Kiểm định viên (QC)" />;
}
