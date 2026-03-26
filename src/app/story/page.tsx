import type { Metadata } from "next";
import StoryClient from "@/components/story/StoryClient";

export const metadata: Metadata = {
  title: "Câu chuyện thương hiệu - Design a Bear",
};

export default function StoryPage() {
  return <StoryClient />;
}
