'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useCreateEvent } from '@/hooks/useEvent';
import Button from '@/components/ui/Button';
import Header from '@/components/layout/Header';

export default function JoinEventPage() {
  const router = useRouter();
  const params = useParams();
  const code = params.code as string;
  const { joinEvent } = useCreateEvent();
  const [userId, setUserId] = useState<string | null>(null);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState('');
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    async function getUser() {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) {
        // ログイン後にこの参加画面へ直行するよう redirect を付与
        router.push(`/auth/login?redirect=${encodeURIComponent(`/event/join/${code}`)}`);
        return;
      }
      const { data } = await supabase
        .from('users')
        .select('id')
        .eq('auth_id', authUser.id)
        .single();

      if (data) {
        setUserId(data.id);
      } else {
        router.push('/auth/register');
      }
    }
    getUser();
  }, [router, code]);

  async function handleJoin() {
    if (!userId) return;
    setJoining(true);
    setError('');

    try {
      const event = await joinEvent(code, userId);
      setJoined(true);
      setTimeout(() => {
        router.push(`/event/${event.id}/lobby`);
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to join');
    } finally {
      setJoining(false);
    }
  }

  if (joined) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="mb-4 text-4xl">✓</div>
          <h2 className="font-serif text-xl text-gold">参加しました!</h2>
          <p className="mt-2 text-sm text-white/40">
            Joined! Redirecting to lobby...
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
        className="text-center"
      >
        <h1 className="mb-2 px-2 text-center font-display text-xl leading-snug text-gold sm:text-2xl">
          TSUNAKAN（ツナカン）
        </h1>
        <p className="mb-8 font-sans text-base text-text-sub">
          イベントに参加しますか？
          <span className="mx-2 text-text-sub/50">/</span>
          Join this event?
        </p>

        <div className="mb-8 rounded-lg border border-gold/20 bg-navy-light px-6 py-4">
          <p className="text-xs text-white/40">Join Code</p>
          <p className="font-mono text-2xl tracking-widest text-gold">
            {code}
          </p>
        </div>

        {error && <p className="mb-4 text-sm text-red-400">{error}</p>}

        <Button
          onClick={handleJoin}
          disabled={joining || !userId}
          size="lg"
          className="w-full max-w-xs"
        >
          {joining ? '参加中...' : '参加する / Join'}
        </Button>
      </motion.div>
    </div>
  );
}
