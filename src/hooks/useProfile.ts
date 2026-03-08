'use client';

/**
 * プロフィール取得・保存フック
 * ログインユーザーの profiles テーブルを操作
 */
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Profile } from '@/lib/types';

export function useProfile(userId: string | null) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    if (!userId) return;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (!error && data) {
      setProfile(data);
    }
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }
    fetchProfile();
  }, [userId, fetchProfile]);

  async function saveProfile(updates: Partial<Profile>) {
    if (!userId) return;

    const { data: existing } = await supabase
      .from('profiles')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (existing) {
      const { error } = await supabase
        .from('profiles')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('user_id', userId);

      if (error) throw error;
    } else {
      const { error } = await supabase
        .from('profiles')
        .insert({ user_id: userId, ...updates });

      if (error) throw error;
    }

    await fetchProfile();
  }

  return { profile, loading, saveProfile, refetch: fetchProfile };
}
