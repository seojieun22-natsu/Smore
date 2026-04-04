import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SMORE 매뉴얼",
  description: "스모어 운영 가이드북 — 운영, 상품, 클레임 매뉴얼",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
