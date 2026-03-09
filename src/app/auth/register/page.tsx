'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import Button from '@/components/ui/Button';
import Header from '@/components/layout/Header';

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) throw signUpError;
      if (!authData.user) throw new Error('Registration failed');

      const { error: insertError } = await supabase
        .from('users')
        .insert({
          auth_id: authData.user.id,
          name,
        });

      if (insertError) throw insertError;

      const redirect = searchParams.get('redirect');
      const profileUrl =
        redirect && redirect.startsWith('/')
          ? `/profile?redirect=${encodeURIComponent(redirect)}`
          : '/profile';
      router.push(profileUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  const redirect = searchParams.get('redirect');
  const backHref =
    redirect && redirect.startsWith('/')
      ? `/auth/login?redirect=${encodeURIComponent(redirect)}`
      : '/auth/login';

  return (
    <div className="flex min-h-screen min-h-dvh flex-col items-center justify-center px-6">
      <Header showBack backHref={backHref} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-sm"
      >
        <h1 className="mb-2 text-center font-display text-2xl font-bold text-gold">
          はじめまして
        </h1>
        <p className="mb-10 text-center font-sans text-sm text-text-sub italic">
          Nice to meet you. Create your account.
        </p>

        <button
          type="button"
          onClick={() =>
            supabase.auth.signInWithOAuth({
              provider: 'google',
              options: { redirectTo: window.location.origin + '/api/auth/callback' },
            })
          }
          className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-bg-card px-5 py-4 font-sans text-text-main transition-colors duration-200 hover:border-gold/30"
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Googleで登録 / Sign up with Google
        </button>

        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-white/10" />
          <span className="font-sans text-xs text-text-sub">or</span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="あなたの名前 / Your name"
            required
            className="w-full rounded-xl border border-white/10 bg-bg-input px-5 py-4 font-sans text-text-main placeholder:text-white/20 transition-colors duration-200 focus:border-gold/50"
          />

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@example.com"
            required
            className="w-full rounded-xl border border-white/10 bg-bg-input px-5 py-4 font-sans text-text-main placeholder:text-white/20 transition-colors duration-200 focus:border-gold/50"
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="パスワード / Password (6文字以上)"
            required
            minLength={6}
            className="w-full rounded-xl border border-white/10 bg-bg-input px-5 py-4 font-sans text-text-main placeholder:text-white/20 transition-colors duration-200 focus:border-gold/50"
          />

          {error && <p className="font-sans text-sm text-error">{error}</p>}

          <Button
            type="submit"
            disabled={loading || !name || !email || !password}
            className="w-full"
            size="lg"
          >
            {loading ? '登録中...' : '登録する / Register'}
          </Button>
        </form>

        <div className="gold-line mx-auto mt-8 mb-4" />
        <p className="text-center font-sans text-xs text-text-sub">
          すでにアカウントをお持ちの方は
          <Link href="/auth/login" className="ml-1 text-gold underline underline-offset-2">
            ログイン
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
