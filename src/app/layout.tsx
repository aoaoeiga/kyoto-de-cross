/**
 * ルートレイアウト
 * フォント・メタデータ・グローバルスタイルを設定
 */
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'TSUNAKAN（ツナカン）',
  description: '繋がって感動、繋がって乾杯。Connect. Be moved. Raise a glass.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;600;700&family=Noto+Serif+JP:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>
      <body className="min-h-screen min-h-dvh bg-bg font-sans text-text-main antialiased">
        {children}
      </body>
    </html>
  );
}
