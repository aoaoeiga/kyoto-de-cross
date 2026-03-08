/**
 * Supabase クライアントの再エクスポート
 * Client Components では @/lib/supabase からインポート
 * Server / API では @/lib/supabase/server から createClient() を使用
 */
export { supabase } from './supabase/client';
