'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Button from '@/components/ui/Button';
import Header from '@/components/layout/Header';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();

      if (!authUser) {
        setError('Please log in first');
        setLoading(false);
        return;
      }

      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('auth_id', authUser.id)
        .single();

      if (existingUser) {
        router.push('/profile');
        return;
      }

      const { error: insertError } = await supabase
        .from('users')
        .insert({
          auth_id: authUser.id,
          name,
        });

      if (insertError) throw insertError;

      router.push('/profile');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen min-h-dvh flex-col items-center justify-center px-6">
      <Header showBack backHref="/auth/login" />

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
          Nice to meet you. What should we call you?
        </p>

        <form onSubmit={handleRegister} className="space-y-5">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="あなたの名前 / Your name"
            required
            className="w-full rounded-xl border border-white/10 bg-bg-input px-5 py-4 font-sans text-text-main placeholder:text-white/20 transition-colors duration-200 focus:border-gold/50"
          />

          {error && <p className="font-sans text-sm text-error">{error}</p>}

          <Button
            type="submit"
            disabled={loading || !name}
            className="w-full"
            size="lg"
          >
            {loading ? '登録中...' : '次へ / Next'}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
