'use client';

import Link from 'next/link';

type HeaderProps = {
  showBack?: boolean;
  backHref?: string;
};

export default function Header({ showBack, backHref = '/' }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 py-4 bg-bg/80 backdrop-blur-md">
      {showBack ? (
        <Link
          href={backHref}
          className="font-sans text-sm text-text-sub transition-colors hover:text-gold"
        >
          <span className="mr-1 opacity-60">&larr;</span> 戻る
        </Link>
      ) : (
        <div />
      )}
      <Link href="/" className="font-display text-sm font-bold text-gold/70 transition-colors hover:text-gold">
        Kyoto de Cross
      </Link>
      <div className="w-12" />
    </header>
  );
}
