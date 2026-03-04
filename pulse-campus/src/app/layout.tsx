import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VITA - キャンパス気分マップ",
  description:
    "大学キャンパスで「今の気分」をワンタップで投稿し、地図上にリアルタイムで可視化するWebアプリ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Zen+Maru+Gothic:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
