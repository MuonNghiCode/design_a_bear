import { type Metadata } from "next";
import AccessoriesClient from "@/components/admin/accessories/AccessoriesClient";

export const metadata: Metadata = {
  title: "Phụ kiện — Design a Bear",
};

export default function AccessoriesPage() {
  return <AccessoriesClient />;
}
