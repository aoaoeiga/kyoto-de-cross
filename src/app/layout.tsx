/**
 * ルートレイアウト
 * フォント・メタデータ・グローバルスタイルを設定
 */
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Kyoto de Cross',
  description: 'Where souls meet through dialogue',
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
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Inter:wght@300;400;500;600;700&family=Noto+Serif+JP:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600;700;800;900&display=swap"
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
