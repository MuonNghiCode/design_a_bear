import PersonalPayrollClient from "@/components/common/PersonalPayrollClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bảng lương & Thù lao | Staff",
  description: "Bảng lương và thù lao cá nhân dành cho nhân viên.",
};

export default function StaffPayrollPage() {
  return <PersonalPayrollClient roleName="Nhân viên (Staff)" />;
}
