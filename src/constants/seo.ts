import type { Metadata } from "next";

export const SITE_NAME = "Design a Bear";

export const SITE_DESCRIPTION =
  "Design a Bear là thương hiệu gấu bông cá nhân hóa kết hợp giáo dục kỹ năng cho bé, giúp bố mẹ tạo người bạn đồng hành độc đáo cho con.";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "http://localhost:3000";

export const DEFAULT_OG_IMAGE = "/logo.webp";

export const PUBLIC_ROBOTS: Metadata["robots"] = {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
    "max-video-preview": -1,
    "max-image-preview": "large",
    "max-snippet": -1,
  },
};

export const PRIVATE_ROBOTS: Metadata["robots"] = {
  index: false,
  follow: false,
  nocache: true,
  googleBot: {
    index: false,
    follow: false,
    noimageindex: true,
  },
};
