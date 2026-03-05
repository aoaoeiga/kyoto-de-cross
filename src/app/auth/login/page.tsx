'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import Button from '@/components/ui/Button';
import Header from '@/components/layout/Header';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
      router.push('/dashboard');
    }
  }

  return (
    <div className="flex min-h-screen min-h-dvh flex-col items-center justify-center px-6">
      <Header showBack />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-sm"
      >
        <h1 className="mb-2 text-center font-display text-2xl font-bold text-gold">
          ログイン
        </h1>
        <p className="mb-10 text-center font-sans text-sm text-text-sub">
          Sign in with your email
        </p>

        <form onSubmit={handleLogin} className="space-y-5">
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
            placeholder="パスワード / Password"
            required
            className="w-full rounded-xl border border-white/10 bg-bg-input px-5 py-4 font-sans text-text-main placeholder:text-white/20 transition-colors duration-200 focus:border-gold/50"
          />

          {error && (
            <p className="font-sans text-sm text-error">{error}</p>
          )}

          <Button
            type="submit"
            disabled={loading || !email || !password}
            className="w-full"
            size="lg"
          >
            {loading ? 'ログイン中...' : 'ログイン / Login'}
          </Button>
        </form>

        <div className="gold-line mx-auto mt-8 mb-4" />
        <p className="text-center font-sans text-xs text-text-sub">
          アカウントをお持ちでない方は
          <Link href="/auth/register" className="ml-1 text-gold underline underline-offset-2">
            新規登録
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
