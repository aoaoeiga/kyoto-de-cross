/**
 * Supabase ブラウザクライアント
 * Client Components（'use client'）で使用
 * セッションは Cookie で管理され、認証状態が維持される
 */
import { createBrowserClient } from '@supabase/ssr';

function getSupabaseUrl() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error(
      'Missing Supabase env: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY'
    );
  }
  return { url, key };
}

/** シングルトン: Client Components 用 Supabase クライアント */
let _client: ReturnType<typeof createBrowserClient> | null = null;

export function createClient() {
  if (_client) return _client;
  const { url, key } = getSupabaseUrl();
  _client = createBrowserClient(url, key);
  return _client;
}

/** 既存コード互換: supabase としてインポートして使用 */
export const supabase = createClient();
