'use client';

/** ランディングページ */
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function LandingPage() {
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Supabase が /?code=... にリダイレクトしてきた場合、コールバックへ転送（ログイン画面の二重表示を防ぐ）
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    if (code) {
      setIsRedirecting(true);
      window.location.replace(`/api/auth/callback?code=${encodeURIComponent(code)}`);
    }
  }, []);

  if (isRedirecting) {
    return (
      <div className="flex min-h-screen min-h-dvh flex-col items-center justify-center bg-white">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-tsunakan-orange/20 border-t-tsunakan-orange" />
        <p className="mt-4 text-center font-sans text-base text-tsunakan-dark">
          ログイン中
          <span className="mx-2 text-tsunakan-dark/35">/</span>
          Signing in
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen min-h-dvh flex-col items-center justify-center bg-white px-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="mb-14 w-full max-w-lg text-center"
      >
        <h1 className="mb-10 font-display text-5xl font-semibold tracking-tight text-tsunakan-dark md:text-6xl lg:text-7xl">
          TSUNAKAN
        </h1>
        <div className="mx-auto mb-10 flex max-w-3xl flex-col items-center justify-center gap-3 font-sans text-base leading-relaxed text-tsunakan-dark sm:flex-row sm:flex-wrap sm:gap-x-6 sm:gap-y-2">
          <p className="text-center sm:text-left">繋がって感動、繋がって乾杯。</p>
          <p className="hidden text-tsunakan-dark/35 sm:inline">|</p>
          <p className="text-center sm:text-left">Connect. Be moved. Raise a glass.</p>
        </div>
        <div className="mx-auto h-px w-16 bg-tsunakan-orange/60" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.5, ease: 'easeOut' }}
        className="flex w-full max-w-xs flex-col gap-4"
      >
        <Link href="/auth/register">
          <Button variant="tsunakan" className="w-full" size="lg">
            <span className="font-sans text-base">
              参加登録
              <span className="mx-2 opacity-80">/</span>
              Register
            </span>
          </Button>
        </Link>
        <Link href="/auth/login">
          <Button variant="tsunakan-outline" className="w-full" size="lg">
            <span className="font-sans text-base">
              ログイン
              <span className="mx-2 opacity-80">/</span>
              Login
            </span>
          </Button>
        </Link>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.45, duration: 0.5 }}
        className="mt-24 font-sans text-base text-tsunakan-dark/45"
      >
        TSUNAKAN（ツナカン）
      </motion.p>
    </div>
  );
}
