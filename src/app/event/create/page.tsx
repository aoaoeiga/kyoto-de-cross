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
      <div className="flex min-h-screen flex-col items-center justify-center px-6">
        <Header showBack />

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <h2 className="mb-2 font-serif text-xl text-gold">
            イベントが作成されました
          </h2>
          <p className="mb-8 text-sm text-white/40">Event created!</p>

          {/* QR Code */}
          <div className="mx-auto mb-6 inline-block rounded-2xl border border-gold/30 bg-white p-4">
            <QRCode value={joinUrl} size={200} />
          </div>

          <p className="mb-2 text-sm text-white/60">
            参加コード / Join Code
          </p>
          <p className="mb-8 font-mono text-3xl tracking-widest text-gold">
            {createdEvent.qr_code}
          </p>

          <div className="flex flex-col gap-3">
            <Button
              onClick={() =>
                router.push(`/event/${createdEvent.id}/lobby`)
              }
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
    <div className="flex min-h-screen flex-col items-center justify-center px-6">
      <Header showBack />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <h1 className="mb-2 text-center font-serif text-2xl text-gold">
          イベントを作成
        </h1>
        <p className="mb-8 text-center text-sm text-white/40">
          Create a new event
        </p>

        <div className="mb-6">
          <label className="mb-2 block text-sm text-white/50">
            場所 / Location (optional)
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="例: 京都市左京区..."
            className="w-full rounded-lg border border-white/10 bg-navy-light px-4 py-3 text-white/90 placeholder:text-white/20 focus:border-gold/50 focus:outline-none"
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
