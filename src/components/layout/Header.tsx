'use client';

import Link from 'next/link';

type HeaderProps = {
  showBack?: boolean;
  backHref?: string;
};

export default function Header({ showBack, backHref = '/' }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 backdrop-blur-sm bg-navy/80">
      {showBack ? (
        <Link href={backHref} className="text-sm text-gold/50 hover:text-gold">
          ← 戻る
        </Link>
      ) : (
        <div />
      )}
      <Link href="/" className="font-serif text-sm text-gold/70">
        Kyoto de Cross
      </Link>
      <div className="w-10" />
    </header>
  );
}
