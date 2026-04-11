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
    ? 'relative bg-tsunakan-cream/90 border-b border-tsunakan-dark/5'
    : 'relative bg-bg/80 backdrop-blur-md';
  const backClass = isLight
    ? 'relative z-10 font-sans text-base text-tsunakan-dark/60 transition-colors hover:text-tsunakan-orange'
    : 'relative z-10 font-sans text-sm text-text-sub transition-colors hover:text-gold';
  const brandClass = isLight
    ? 'font-display text-sm font-semibold text-tsunakan-dark transition-colors hover:text-tsunakan-orange sm:text-base'
    : 'font-display text-xs font-bold text-gold/70 transition-colors hover:text-gold sm:text-sm';

  return (
    <header className={`flex items-center justify-between px-5 py-4 ${bar}`}>
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
        <div className="w-12 shrink-0" />
      )}
      <Link
        href="/"
        className={`${brandClass} pointer-events-auto absolute left-1/2 top-1/2 max-w-[min(100%,14rem)] -translate-x-1/2 -translate-y-1/2 px-2 text-center leading-snug sm:max-w-[calc(100%-10rem)]`}
      >
        TSUNAKAN（ツナカン）
      </Link>
      <div className="w-12 shrink-0" />
    </header>
  );
}
