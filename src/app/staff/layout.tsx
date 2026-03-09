import { type ReactNode } from "react";
import StaffLayout from "@/components/staff/StaffLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Staff Portal — Design a Bear",
};

export default function Layout({ children }: { children: ReactNode }) {
  return <StaffLayout>{children}</StaffLayout>;
}
