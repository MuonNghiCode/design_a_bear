import MyJobsClient from "@/components/craftsman/jobs/MyJobsClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Việc của tôi | Design a Bear",
  description: "Quản lý tiến độ sản xuất gấu bông",
};

export default function MyJobsPage() {
  return <MyJobsClient />;
}
