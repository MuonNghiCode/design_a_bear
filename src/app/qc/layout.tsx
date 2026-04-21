import { type ReactNode } from "react";
import { Metadata } from "next";
import StaffLayout from "@/components/staff/StaffLayout";
import { PRIVATE_ROBOTS } from "@/constants/seo";

export const metadata: Metadata = {
  title: "QC Portal",
  robots: PRIVATE_ROBOTS,
};

export default function Layout({ children }: { children: ReactNode }) {
  return <StaffLayout>{children}</StaffLayout>;
}
