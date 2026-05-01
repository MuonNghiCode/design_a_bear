import type { Metadata } from "next";
import ConnectClient from "@/components/connect/ConnectClient";
import { DEFAULT_OG_IMAGE, PUBLIC_ROBOTS } from "@/constants/seo";

export const metadata: Metadata = {
  title: "Kết nối và đồng hành cùng gia đình",
  description:
    "Kết nối với đội ngũ Design a Bear để được tư vấn sản phẩm, hỗ trợ kỹ thuật và đồng hành cùng hành trình học tập của bé.",
  alternates: {
    canonical: "/connect",
  },
  robots: PUBLIC_ROBOTS,
  openGraph: {
    title: "Kết nối và đồng hành cùng gia đình",
    description:
      "Liên hệ Design a Bear để nhận tư vấn nhanh và phương án phù hợp cho bé.",
    url: "/connect",
    images: [DEFAULT_OG_IMAGE],
  },
};

export default function ConnectPage() {
  return <ConnectClient />;
}
