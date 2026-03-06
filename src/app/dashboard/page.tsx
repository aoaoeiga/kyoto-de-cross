'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useCreateEvent } from '@/hooks/useEvent';
import Button from '@/components/ui/Button';
import Header from '@/components/layout/Header';

type UserEvent = {
  id: string;
  title: string;
  status: string;
  event_date?: string;
  location?: string;
};

export default function DashboardPage() {
  const router = useRouter();
  const { joinEvent } = useCreateEvent();
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState('');
  const [events, setEvents] = useState<UserEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [joinCode, setJoinCode] = useState('');
  const [joinLoading, setJoinLoading] = useState(false);
  const [joinError, setJoinError] = useState('');

  useEffect(() => {
    async function loadDashboard() {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) {
        router.push('/auth/login');
        return;
      }

      const { data: userData } = await supabase
        .from('users')
        .select('id, name')
        .eq('auth_id', authUser.id)
        .single();

      if (!userData) {
        router.push('/auth/register');
        return;
      }

      setUserName(userData.name);
      setUserId(userData.id);

      // Fetch events the user participated in
      const { data: participations } = await supabase
        .from('event_participants')
        .select('event_id')
        .eq('user_id', userData.id);

      // Fetch events the user hosted
      const { data: hostedEvents } = await supabase
        .from('events')
        .select('id, title, status, event_date, location')
        .eq('host_id', userData.id);

      const allEventIds = new Set<string>();
      const allEvents: UserEvent[] = [];

      if (hostedEvents) {
        for (const ev of hostedEvents) {
          allEventIds.add(ev.id);
          allEvents.push(ev);
        }
      }

      if (participations) {
        const participatedIds = participations
          .map((p) => p.event_id)
          .filter((id) => !allEventIds.has(id));

        if (participatedIds.length > 0) {
          const { data: participatedEvents } = await supabase
            .from('events')
            .select('id, title, status, event_date, location')
            .in('id', participatedIds);

          if (participatedEvents) {
            allEvents.push(...participatedEvents);
          }
        }
      }

      setEvents(allEvents);
      setLoading(false);
    }

    loadDashboard();
  }, [router]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push('/');
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
      <Header />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mx-auto w-full max-w-md flex-1"
      >
        {/* Welcome */}
        <div className="mb-10 text-center">
          <h1 className="mb-2 font-display text-2xl font-bold text-gold">
            ようこそ、{userName}
          </h1>
          <p className="font-sans text-sm text-text-sub italic">
            Welcome back
          </p>
        </div>

        {/* Actions */}
        <div className="mb-10 space-y-3">
          <Link href="/profile">
            <Button variant="secondary" className="w-full" size="lg">
              プロフィールを確認・編集 / View Profile
            </Button>
          </Link>
          <Link href="/event/create">
            <Button className="w-full" size="lg">
              イベントを作成 / Create Event
            </Button>
          </Link>
        </div>

        {/* Join event */}
        <div className="mb-10">
          <h2 className="mb-3 font-display text-lg font-bold text-text-main">
            イベントに参加 / Join Event
          </h2>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (!joinCode.trim() || !userId) return;
              setJoinLoading(true);
              setJoinError('');
              try {
                const event = await joinEvent(joinCode.trim().toUpperCase(), userId);
                router.push(`/event/${event.id}/lobby`);
              } catch (err) {
                setJoinError(err instanceof Error ? err.message : 'イベントが見つかりません');
              } finally {
                setJoinLoading(false);
              }
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              placeholder="イベントコード / Event Code"
              className="flex-1 rounded-xl border border-white/10 bg-bg-input px-4 py-3 font-mono text-sm uppercase tracking-widest text-text-main placeholder:text-white/20 transition-colors duration-200 focus:border-gold/50"
            />
            <Button
              type="submit"
              disabled={joinLoading || !joinCode.trim()}
              size="lg"
            >
              {joinLoading ? '...' : '参加'}
            </Button>
          </form>
          {joinError && (
            <p className="mt-2 font-sans text-sm text-error">{joinError}</p>
          )}
        </div>

        {/* Events list */}
        <div>
          <h2 className="mb-4 font-display text-lg font-bold text-text-main">
            参加したイベント / Your Events
          </h2>

          {events.length === 0 ? (
            <div className="rounded-xl border border-white/5 bg-bg-card px-5 py-8 text-center">
              <p className="font-sans text-sm text-text-sub">
                まだイベントがありません
              </p>
              <p className="mt-1 font-sans text-xs text-text-sub/60 italic">
                No events yet
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {events.map((ev, i) => (
                <motion.div
                  key={ev.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link href={`/event/${ev.id}/lobby`}>
                    <div className="rounded-xl border border-white/5 bg-bg-card px-5 py-4 transition-colors hover:border-gold/20">
                      <div className="flex items-center justify-between">
                        <h3 className="font-sans font-medium text-text-main">
                          {ev.title}
                        </h3>
                        <span className={`rounded-full px-2 py-0.5 font-sans text-xs ${
                          ev.status === 'active'
                            ? 'bg-gold/10 text-gold'
                            : ev.status === 'ended'
                              ? 'bg-white/5 text-text-sub'
                              : 'bg-white/5 text-text-sub'
                        }`}>
                          {ev.status}
                        </span>
                      </div>
                      {(ev.location || ev.event_date) && (
                        <p className="mt-1 font-sans text-xs text-text-sub">
                          {[ev.location, ev.event_date].filter(Boolean).join(' · ')}
                        </p>
                      )}
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Logout */}
        <div className="mt-10 text-center">
          <button
            onClick={handleLogout}
            className="font-sans text-xs text-text-sub/50 underline underline-offset-2 transition-colors hover:text-text-sub"
          >
            ログアウト / Logout
          </button>
        </div>
      </motion.div>
    </div>
  );
}
