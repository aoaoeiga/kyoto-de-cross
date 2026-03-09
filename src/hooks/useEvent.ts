'use client';

/**
 * イベント・参加者取得、イベント作成・参加のフック
 */
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Event, EventParticipant, User, Profile } from '@/lib/types';

export function useEvent(eventId: string) {
  const [event, setEvent] = useState<Event | null>(null);
  const [participants, setParticipants] = useState<
    (EventParticipant & { user: User; profile?: Profile })[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvent = useCallback(async () => {
    setLoading(true);
    try {
      const { data: eventData, error: eventError } = await supabase
        .from('events')
        .select('*')
        .eq('id', eventId)
        .single();

      if (eventError) throw eventError;
      setEvent(eventData);

      // event_participants -> users (user_id) -> profiles (user_id)
      const { data: participantData, error: participantError } = await supabase
        .from('event_participants')
        .select(`
          *,
          user:users(id, name, profiles(one_word, indoor_outdoor, morning_night, current_hobby, favorite_food, dream_country, biggest_worry, future_dream, secret))
        `)
        .eq('event_id', eventId);

      if (participantError) throw participantError;

      type ParticipantRow = EventParticipant & {
        user?: {
          id: string;
          name: string;
          profiles?: Profile[];
        };
      };

      // profiles は配列で返るため、先頭を取得
      const rows = (participantData ?? []) as unknown as ParticipantRow[];
      const normalized = rows.map((p) => {
        const u = p.user;
        const profile = Array.isArray(u?.profiles) ? u.profiles[0] : undefined;
        return {
          ...p,
          user: (u || { id: '', auth_id: '', name: '', created_at: '' }) as User,
          profile,
        };
      });
      setParticipants(normalized);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch event');
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    fetchEvent();
  }, [fetchEvent]);

  async function updateEventStatus(status: Event['status']) {
    const { error } = await supabase
      .from('events')
      .update({ status })
      .eq('id', eventId);

    if (error) throw error;
    setEvent((prev) => (prev ? { ...prev, status } : null));
  }

  return { event, participants, loading, error, refetch: fetchEvent, updateEventStatus };
}

export function useCreateEvent() {
  const [loading, setLoading] = useState(false);

  async function createEvent(hostId: string, title?: string, location?: string) {
    setLoading(true);
    try {
      const qrCode = Math.random().toString(36).substring(2, 8).toUpperCase();

      const { data, error } = await supabase
        .from('events')
        .insert({
          host_id: hostId,
          title: title || 'Kyoto de Cross',
          location,
          qr_code: qrCode,
          status: 'waiting',
        })
        .select()
        .single();

      if (error) throw error;
      return data as Event;
    } finally {
      setLoading(false);
    }
  }

  async function joinEvent(code: string, userId: string) {
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('*')
      .eq('qr_code', code)
      .single();

    if (eventError) throw new Error('Event not found');

    const { error: joinError } = await supabase
      .from('event_participants')
      .insert({
        event_id: event.id,
        user_id: userId,
      });

    if (joinError) throw joinError;
    return event as Event;
  }

  return { createEvent, joinEvent, loading };
}
