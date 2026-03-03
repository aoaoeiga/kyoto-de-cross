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

      // Create user record
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
    <div className="flex min-h-screen flex-col items-center justify-center px-6">
      <Header showBack backHref="/auth/login" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <h1 className="mb-2 text-center font-serif text-2xl text-gold">
          はじめまして
        </h1>
        <p className="mb-8 text-center text-sm text-white/40">
          Nice to meet you. What should we call you?
        </p>

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="あなたの名前 / Your name"
            required
            className="w-full rounded-lg border border-white/10 bg-navy-light px-4 py-3 text-white/90 placeholder:text-white/20 focus:border-gold/50 focus:outline-none"
          />

          {error && <p className="text-sm text-red-400">{error}</p>}

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
