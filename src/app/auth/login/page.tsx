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
      <div className="flex min-h-screen flex-col items-center justify-center px-6">
        <Header showBack />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="mb-6 text-4xl">✉️</div>
          <h2 className="mb-2 font-serif text-xl text-gold">
            メールを送信しました
          </h2>
          <p className="mb-2 text-sm text-white/60">
            Magic link sent to {email}
          </p>
          <p className="text-xs text-white/30">
            メールのリンクをクリックしてログインしてください。
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6">
      <Header showBack />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <h1 className="mb-2 text-center font-serif text-2xl text-gold">
          ログイン
        </h1>
        <p className="mb-8 text-center text-sm text-white/40">
          Sign in with your email
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              required
              className="w-full rounded-lg border border-white/10 bg-navy-light px-4 py-3 text-white/90 placeholder:text-white/20 focus:border-gold/50 focus:outline-none"
            />
          </div>

          {error && (
            <p className="text-sm text-red-400">{error}</p>
          )}

          <Button
            type="submit"
            disabled={loading || !email}
            className="w-full"
            size="lg"
          >
            {loading ? '送信中...' : 'マジックリンクを送信 / Send Magic Link'}
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-white/20">
          初めての方は自動的にアカウントが作成されます。
          <br />
          New users will be registered automatically.
        </p>
      </motion.div>
    </div>
  );
}
