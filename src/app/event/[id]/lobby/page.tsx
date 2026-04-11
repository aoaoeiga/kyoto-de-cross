'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useEvent } from '@/hooks/useEvent';
import Button from '@/components/ui/Button';
import Header from '@/components/layout/Header';

export default function LobbyPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.id as string;
  const { event, participants, loading, refetch, updateEventStatus } =
    useEvent(eventId);
  const [isHost, setIsHost] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generateError, setGenerateError] = useState('');

  useEffect(() => {
    async function checkHost() {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) return;

      const { data } = await supabase
        .from('users')
        .select('id')
        .eq('auth_id', authUser.id)
        .single();

      if (data) {
        if (event?.host_id === data.id) {
          setIsHost(true);
        }
      }
    }
    if (event) checkHost();
  }, [event]);

  useEffect(() => {
    const interval = setInterval(refetch, 5000);
    return () => clearInterval(interval);
  }, [refetch]);

  async function handleStartEvent() {
    setGenerating(true);
    setGenerateError('');
    try {
      const response = await fetch('/api/generate-cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event_id: eventId }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || 'カードの生成に失敗しました');
      }

      await updateEventStatus('active');
      router.push(`/event/${eventId}/play`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'カードの生成に失敗しました';
      setGenerateError(message);
      setGenerating(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen min-h-dvh items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-gold/20 border-t-gold" />
          <p className="font-sans text-sm text-text-sub">Loading...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen min-h-dvh flex-col px-6 pt-20 pb-8">
      <Header showBack backHref="/event/create" />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="flex-1"
      >
        {/* Event info */}
        <div className="mb-8 text-center">
          <h1 className="mb-1 font-display text-xl font-bold text-gold">
            {event?.title || 'TSUNAKAN（ツナカン）'}
          </h1>
          {event?.location && (
            <p className="font-sans text-sm text-text-sub">{event.location}</p>
          )}
        </div>

        {/* Join code */}
        {event?.qr_code && (
          <div className="mb-8 text-center">
            <p className="mb-2 font-sans text-xs text-text-sub">Join Code</p>
            <p className="font-sans text-2xl font-bold tracking-[0.3em] text-gold">
              {event.qr_code}
            </p>
          </div>
        )}

        {/* Participants */}
        <div className="mb-8">
          <p className="mb-4 text-center font-sans text-sm text-text-sub">
            参加者 / Participants ({participants.length})
          </p>
          <div className="mx-auto max-w-sm space-y-2">
            {participants.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-3 rounded-xl border border-white/5 bg-bg-card px-4 py-3"
              >
                {/* Geometric initial avatar */}
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold font-sans text-sm font-bold text-bg">
                  {(p as { user?: { name?: string } }).user?.name?.[0]?.toUpperCase() || '?'}
                </div>
                <span className="font-sans text-text-main">
                  {(p as { user?: { name?: string } }).user?.name || 'Guest'}
                </span>
              </motion.div>
            ))}

            {participants.length === 0 && (
              <p className="text-center font-sans text-sm text-text-sub/50">
                まだ参加者がいません / No participants yet
              </p>
            )}
          </div>
        </div>

        {/* Host controls */}
        {isHost && (
          <div className="mx-auto max-w-sm">
            <Button
              onClick={handleStartEvent}
              disabled={generating || participants.length === 0}
              className="w-full"
              size="lg"
            >
              {generating
                ? 'カードを生成中... / Generating...'
                : 'カードを生成して開始 / Generate & Start'}
            </Button>
            {participants.length === 0 && (
              <p className="mt-3 text-center font-sans text-xs text-text-sub/50">
                少なくとも1人の参加者が必要です
              </p>
            )}
            {generateError && (
              <div className="mt-4 rounded-xl border border-error/20 bg-error/5 px-4 py-3">
                <p className="font-sans text-sm text-error">
                  {generateError}
                </p>
                <p className="mt-1 font-sans text-xs text-error/60">
                  もう一度お試しください / Please try again
                </p>
              </div>
            )}
          </div>
        )}

        {!isHost && event?.status !== 'active' && (
          <div className="text-center">
            <div className="mx-auto mb-3 h-6 w-6 animate-spin rounded-full border-2 border-gold/20 border-t-gold" />
            <p className="font-sans text-sm text-text-sub">
              ホストの開始を待っています...
            </p>
            <p className="mt-1 font-sans text-xs text-text-sub/60 italic">
              Waiting for host to start...
            </p>
          </div>
        )}

        {/* カード生成済み：非ホストはスマホを置く案内 */}
        {!isHost && event?.status === 'active' && (
          <div className="mx-auto max-w-sm rounded-xl border border-gold/30 bg-gold/5 px-6 py-8 text-center">
            <p className="mb-4 font-display text-lg font-bold text-gold">
              カードが生成されました
            </p>
            <div className="gold-line mx-auto mb-4" />
            <p className="font-sans text-sm leading-relaxed text-text-main">
              ホストの案内に従って、対話を楽しんでください。
            </p>
            <p className="mt-3 font-sans text-sm leading-relaxed text-text-main">
              スマホはテーブルに置いて、目の前のひとと向き合いましょう。
            </p>
            <p className="mt-6 font-sans text-xs text-text-sub italic">
              Cards are ready. Follow the host. Put your phone down.
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
