'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import QRCode from 'react-qr-code';
import { supabase } from '@/lib/supabase';
import { useCreateEvent } from '@/hooks/useEvent';
import Button from '@/components/ui/Button';
import Header from '@/components/layout/Header';

export default function CreateEventPage() {
  const router = useRouter();
  const { createEvent, loading } = useCreateEvent();
  const [userId, setUserId] = useState<string | null>(null);
  const [location, setLocation] = useState('');
  const [createdEvent, setCreatedEvent] = useState<{
    id: string;
    qr_code: string;
  } | null>(null);

  useEffect(() => {
    async function getUser() {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) {
        router.push('/auth/login');
        return;
      }
      const { data } = await supabase
        .from('users')
        .select('id')
        .eq('auth_id', authUser.id)
        .single();
      if (data) setUserId(data.id);
    }
    getUser();
  }, [router]);

  async function handleCreate() {
    if (!userId) return;
    try {
      const event = await createEvent(userId, undefined, location || undefined);
      setCreatedEvent(event);
    } catch (err) {
      console.error('Failed to create event:', err);
    }
  }

  if (createdEvent) {
    const joinUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/event/join/${createdEvent.qr_code}`;

    return (
      <div className="flex min-h-screen min-h-dvh flex-col items-center justify-center px-6">
        <Header showBack />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h2 className="mb-2 font-display text-xl font-bold text-gold">
            イベントが作成されました
          </h2>
          <p className="mb-8 font-sans text-sm text-text-sub italic">
            Event created!
          </p>

          {/* QR Code */}
          <div className="mx-auto mb-6 inline-block rounded-2xl border border-gold/30 bg-white p-5 shadow-gold-glow">
            <QRCode value={joinUrl} size={200} />
          </div>

          <p className="mb-2 font-sans text-sm text-text-sub">
            参加コード / Join Code
          </p>
          <p className="mb-8 font-sans text-3xl font-bold tracking-[0.3em] text-gold">
            {createdEvent.qr_code}
          </p>

          <div className="flex flex-col gap-3">
            <Button
              onClick={() => router.push(`/event/${createdEvent.id}/lobby`)}
              size="lg"
            >
              ロビーへ / Go to Lobby
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                navigator.clipboard.writeText(joinUrl);
              }}
            >
              リンクをコピー / Copy Link
            </Button>
          </div>
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
          イベントを作成
        </h1>
        <p className="mb-10 text-center font-sans text-sm text-text-sub italic">
          Create a new event
        </p>

        <div className="mb-8">
          <label className="mb-2 block font-sans text-sm text-text-sub">
            場所 / Location (optional)
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="例: 京都市左京区..."
            className="w-full rounded-xl border border-white/10 bg-bg-input px-5 py-4 font-sans text-text-main placeholder:text-white/20 transition-colors duration-200 focus:border-gold/50"
          />
        </div>

        <Button
          onClick={handleCreate}
          disabled={loading || !userId}
          className="w-full"
          size="lg"
        >
          {loading ? '作成中...' : '作成する / Create Event'}
        </Button>
      </motion.div>
    </div>
  );
}
