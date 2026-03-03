import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Kyoto de Cross',
  description: 'AI-powered cross-cultural dinner experience',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-navy text-white antialiased">
        {children}
      </body>
    </html>
  );
}
