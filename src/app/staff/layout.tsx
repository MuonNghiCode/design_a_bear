import { type ReactNode } from "react";
import { Metadata } from "next";
import StaffLayout from "@/components/staff/StaffLayout";

export const metadata: Metadata = {
  title: "Staff Portal — Design a Bear",
};

export default function Layout({ children }: { children: ReactNode }) {
  return <StaffLayout>{children}</StaffLayout>;
}
