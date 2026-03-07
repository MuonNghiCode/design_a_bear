import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import Providers from "../components/providers/Providers";

const nunito = Nunito({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "600", "700", "800", "900"],
  variable: "--font-nunito",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Design a Bear",
  description: "Design your own teddy bear",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body
        className={`${nunito.variable} antialiased`}
        style={{ fontFamily: "var(--font-nunito), Nunito, sans-serif" }}
      >
        <Providers>
          <main className="pt-20">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
