import type { Metadata } from "next";
import ConnectClient from "@/components/connect/ConnectClient";
import { DEFAULT_OG_IMAGE, PUBLIC_ROBOTS } from "@/constants/seo";

export const metadata: Metadata = {
  title: "Ket noi va dong hanh cung gia dinh",
  description:
    "Ket noi voi doi ngu Design a Bear de duoc tu van san pham, ho tro ky thuat va dong hanh cung hanh trinh hoc tap cua be.",
  alternates: {
    canonical: "/connect",
  },
  robots: PUBLIC_ROBOTS,
  openGraph: {
    title: "Ket noi va dong hanh cung gia dinh",
    description:
      "Lien he Design a Bear de nhan tu van nhanh va phuong an phu hop cho be.",
    url: "/connect",
    images: [DEFAULT_OG_IMAGE],
  },
};

export default function ConnectPage() {
  return <ConnectClient />;
}
