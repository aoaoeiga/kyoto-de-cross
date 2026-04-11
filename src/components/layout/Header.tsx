'use client';

import Link from 'next/link';

type HeaderProps = {
  showBack?: boolean;
  backHref?: string;
  /** ランディング・認証など明るい背景用 */
  theme?: 'dark' | 'light';
};

export default function Header({ showBack, backHref = '/', theme = 'dark' }: HeaderProps) {
  const isLight = theme === 'light';
  const bar = isLight
    ? 'bg-tsunakan-cream/90 border-b border-tsunakan-dark/5'
    : 'bg-bg/80 backdrop-blur-md';
  const backClass = isLight
    ? 'font-sans text-base text-tsunakan-dark/60 transition-colors hover:text-tsunakan-orange'
    : 'font-sans text-sm text-text-sub transition-colors hover:text-gold';
  const brandClass = isLight
    ? 'font-display text-base font-semibold text-tsunakan-dark transition-colors hover:text-tsunakan-orange'
    : 'font-display text-sm font-bold text-gold/70 transition-colors hover:text-gold';

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 py-4 ${bar}`}>
      {showBack ? (
        <Link href={backHref} className={backClass}>
          <span className="mr-1 opacity-60">&larr;</span>
          <span>
            戻る
            <span className="mx-2 text-current/35">/</span>
            Back
          </span>
        </Link>
      ) : (
        <div />
      )}
      <Link href="/" className={brandClass}>
        TSUNAKAN
      </Link>
      <div className="w-12" />
    </header>
  );
}
