import type { Metadata } from "next";
import StoryClient from "@/components/story/StoryClient";
import { DEFAULT_OG_IMAGE, PUBLIC_ROBOTS } from "@/constants/seo";

export const metadata: Metadata = {
  title: "Cau chuyen thuong hieu",
  description:
    "Kham pha hanh trinh hinh thanh Design a Bear va triet ly ket hop sang tao, cong nghe va ky nang cho tre em.",
  alternates: {
    canonical: "/story",
  },
  robots: PUBLIC_ROBOTS,
  openGraph: {
    title: "Cau chuyen thuong hieu Design a Bear",
    description:
      "Storytelling ve hanh trinh tao nen nhung nguoi ban gau bong mang gia tri giao duc cho be.",
    url: "/story",
    images: [DEFAULT_OG_IMAGE],
  },
};

export default function StoryPage() {
  return <StoryClient />;
}
