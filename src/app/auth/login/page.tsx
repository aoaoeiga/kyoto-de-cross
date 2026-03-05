'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import Button from '@/components/ui/Button';
import Header from '@/components/layout/Header';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/api/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
    } else {
      setSent(true);
    }
    setLoading(false);
  }

  if (sent) {
    return (
      <div className="flex min-h-screen min-h-dvh flex-col items-center justify-center px-6">
        <Header showBack />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full border border-gold/30">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gold">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="M22 7l-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
          </div>
          <h2 className="mb-3 font-display text-xl font-bold text-gold">
            メールを送信しました
          </h2>
          <p className="mb-2 font-sans text-sm text-text-main">
            Magic link sent to {email}
          </p>
          <div className="gold-line mx-auto my-4" />
          <p className="font-sans text-xs text-text-sub">
            メールのリンクをクリックしてログインしてください。
          </p>
        </motion.div>
      </div>
    );
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
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              required
              className="w-full rounded-xl border border-white/10 bg-bg-input px-5 py-4 font-sans text-text-main placeholder:text-white/20 transition-colors duration-200 focus:border-gold/50"
            />
          </div>

          {error && (
            <p className="font-sans text-sm text-error">{error}</p>
          )}

          <Button
            type="submit"
            disabled={loading || !email}
            className="w-full"
            size="lg"
          >
            {loading ? '送信中...' : 'マジックリンクを送信'}
          </Button>
        </form>

        <div className="gold-line mx-auto mt-8 mb-4" />
        <p className="text-center font-sans text-xs text-text-sub">
          初めての方は自動的にアカウントが作成されます。
        </p>
        <p className="mt-1 text-center font-sans text-xs text-text-sub/60 italic">
          New users will be registered automatically.
        </p>
      </motion.div>
    </div>
  );
}
