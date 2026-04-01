"use client";

import type { ComponentProps } from "react";
import StaffReviewsTable from "@/components/staff/reviews/StaffReviewsTable";

type AdminReviewsTableProps = ComponentProps<typeof StaffReviewsTable>;

export default function AdminReviewsTable(props: AdminReviewsTableProps) {
  return <StaffReviewsTable {...props} />;
}
