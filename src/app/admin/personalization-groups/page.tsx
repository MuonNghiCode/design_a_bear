import { type Metadata } from "next";
import PersonalizationGroupsClient from "@/components/admin/personalization-groups/PersonalizationGroupsClient";

export const metadata: Metadata = {
  title: "Nhóm tùy chỉnh — Design a Bear",
};

export default function PersonalizationGroupsPage() {
  return <PersonalizationGroupsClient />;
}
