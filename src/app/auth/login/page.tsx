'use client';

import { Suspense, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import Button from '@/components/ui/Button';
import Header from '@/components/layout/Header';

const REDIRECT_COOKIE = 'auth_redirect';
const REDIRECT_MAX_AGE = 600; // 10分

function LoginFallback() {
  return (
    <div className="flex min-h-screen min-h-dvh items-center justify-center bg-white">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-tsunakan-orange/20 border-t-tsunakan-orange" />
    </div>
  );
}

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    async function checkExistingSession() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const r = searchParams.get('redirect');
        router.replace(r && r.startsWith('/') ? r : '/dashboard');
      } else {
        setCheckingAuth(false);
      }
    }
    checkExistingSession();
  }, [router, searchParams]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      const r = searchParams.get('redirect');
      router.replace(r && r.startsWith('/') ? r : '/dashboard');
    }
  }

  if (checkingAuth) {
    return (
      <div className="flex min-h-screen min-h-dvh items-center justify-center bg-white">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-tsunakan-orange/20 border-t-tsunakan-orange" />
      </div>
    );
  }

  const redirect = searchParams.get('redirect');
  const backHref = redirect && redirect.startsWith('/') ? redirect : '/';

  const inputClass =
    'w-full rounded-xl border border-tsunakan-dark/10 bg-white px-5 py-4 font-sans text-base text-tsunakan-dark placeholder:text-tsunakan-dark/30 transition-colors duration-200 focus:border-tsunakan-orange focus:ring-1 focus:ring-tsunakan-orange/20';

  return (
    <div className="flex min-h-screen min-h-dvh flex-col bg-white px-6 pb-10 pt-24">
      <Header showBack backHref={backHref} theme="light" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mx-auto w-full max-w-sm"
      >
        <h1 className="mb-10 text-center font-display text-2xl font-semibold text-tsunakan-dark md:text-3xl">
          ログイン
          <span className="mx-2 text-tsunakan-dark/35">/</span>
          Login
        </h1>

        <button
          type="button"
          onClick={() => {
            const r = searchParams.get('redirect');
            if (r && r.startsWith('/')) {
              document.cookie = `${REDIRECT_COOKIE}=${encodeURIComponent(r)}; path=/; max-age=${REDIRECT_MAX_AGE}; SameSite=Lax`;
            }
            supabase.auth.signInWithOAuth({
              provider: 'google',
              options: { redirectTo: window.location.origin + '/api/auth/callback' },
            });
          }}
          className="flex w-full items-center justify-center gap-3 rounded-xl border border-tsunakan-dark/10 bg-tsunakan-cream/50 px-5 py-4 font-sans text-base text-tsunakan-dark transition-colors duration-200 hover:border-tsunakan-orange/40"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          <span>
            Googleでログイン
            <span className="mx-2 text-tsunakan-dark/35">/</span>
            Sign in with Google
          </span>
        </button>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-tsunakan-dark/10" />
          <span className="font-sans text-base text-tsunakan-dark/45">or</span>
          <div className="h-px flex-1 bg-tsunakan-dark/10" />
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="login-email" className="mb-2 block font-sans text-base text-tsunakan-dark">
              メールアドレス
              <span className="mx-2 text-tsunakan-dark/35">/</span>
              Email
            </label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="login-password" className="mb-2 block font-sans text-base text-tsunakan-dark">
              パスワード
              <span className="mx-2 text-tsunakan-dark/35">/</span>
              Password
            </label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              className={inputClass}
            />
          </div>

          {error && <p className="font-sans text-base text-error">{error}</p>}

          <Button
            type="submit"
            disabled={loading || !email || !password}
            variant="tsunakan"
            className="w-full"
            size="lg"
          >
            {loading ? (
              <span className="text-base">
                ログイン中
                <span className="mx-2 opacity-80">/</span>
                Signing in
              </span>
            ) : (
              <span className="text-base">
                ログイン
                <span className="mx-2 opacity-80">/</span>
                Login
              </span>
            )}
          </Button>
        </form>

        <div className="mx-auto mt-10 h-px w-12 bg-tsunakan-orange/40" />
        <p className="mt-6 text-center font-sans text-base leading-relaxed text-tsunakan-dark/55">
          アカウントをお持ちでない方は
          <span className="mx-2 text-tsunakan-dark/35">/</span>
          New here?
          <br />
          <Link
            href={redirect ? `/auth/register?redirect=${encodeURIComponent(redirect)}` : '/auth/register'}
            className="mt-2 inline-block text-tsunakan-orange underline underline-offset-4"
          >
            参加登録
            <span className="mx-2 text-tsunakan-dark/35">/</span>
            Register
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginContent />
    </Suspense>
  );
}
