import PersonalPayrollClient from "@/components/common/PersonalPayrollClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hoa hồng & Thù lao | Craftsman",
  description: "Hoa hồng thù lao cá nhân dành cho thợ thủ công.",
};

export default function CraftsmanPayrollPage() {
  return <PersonalPayrollClient roleName="Thợ thủ công (Craftsman)" />;
}
