import type { Metadata } from "next";
import StoryClient from "@/components/story/StoryClient";
import { DEFAULT_OG_IMAGE, PUBLIC_ROBOTS } from "@/constants/seo";

export const metadata: Metadata = {
  title: "Câu chuyện thương hiệu",
  description:
    "Khám phá hành trình hình thành Design a Bear và triết lý kết hợp sáng tạo, công nghệ và kỹ năng cho trẻ em.",
  alternates: {
    canonical: "/story",
  },
  robots: PUBLIC_ROBOTS,
  openGraph: {
    title: "Câu chuyện thương hiệu Design a Bear",
    description:
      "Câu chuyện về hành trình tạo nên những người bạn gấu bông mang giá trị giáo dục cho bé.",
    url: "/story",
    images: [DEFAULT_OG_IMAGE],
  },
};

export default function StoryPage() {
  return <StoryClient />;
}
