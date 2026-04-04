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
      <head>
        <link rel="stylesheet" as="style" crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css" />
      </head>
      <body className="antialiased" style={{ fontFamily: 'Pretendard, -apple-system, BlinkMacSystemFont, sans-serif' }}>
        {children}
      </body>
    </html>
  );
}
