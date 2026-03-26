import type { Metadata } from "next";
import HomeClient from "@/components/home/HomeClient";
import {
  DEFAULT_OG_IMAGE,
  PUBLIC_ROBOTS,
  SITE_DESCRIPTION,
  SITE_NAME,
} from "@/constants/seo";

export const metadata: Metadata = {
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: "/",
  },
  robots: PUBLIC_ROBOTS,
  openGraph: {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: "/",
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },
};

export default function Home() {
  return <HomeClient />;
}
